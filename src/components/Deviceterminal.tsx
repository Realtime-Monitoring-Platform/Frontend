import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
const API_BASE = "/api/v1/devices";

const POLL_INTERVAL_MS = 1000;
const POLL_TIMEOUT_MS = 30000;


type CommandStatus = "PENDING" | "SENT" | "COMPLETED" | "SUCCESS" | "FAILED";

 interface DeviceCommand {
   id: string;
   deviceId: string;
   tenantId: string;
   userId: string;
   command: string;
   status: CommandStatus;
   stdout: string | null;
   exitCode: number | null;
   createdAt: string;
   updatedAt: string;
 }

type LineType = "system" | "prompt" | "pending" | "output" | "error";

interface TerminalLine {
  type: LineType;
  text: string;
  time?: string;
  status?: CommandStatus;
  exitCode?: number | null;
  id?: string;
}

interface DeviceTerminalProps {
  deviceId?: string;
  authHeaders?: Record<string, string>;
}

function timestamp(): string {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

function StatusDot({ status }: { status: CommandStatus }) {
  const color =
    status === "COMPLETED" || status === "SUCCESS"
      ? "#5eead4"
      : status === "FAILED"
        ? "#f87171"
        : status === "SENT" || status === "PENDING"
          ? "#facc15"
          : "#6b7280";
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        marginRight: 6,
        boxShadow: `0 0 6px ${color}`,
      }}
    />
  );
}

export default function DeviceTerminal({

  deviceId = ""
}: DeviceTerminalProps) {
  const token = localStorage.getItem("access_token");

  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "system", text: "device-terminal ready. type a command and press enter." },
  ]);
  const [busy, setBusy] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const appendLine = useCallback((line: TerminalLine) => {
    setLines((prev) => [...prev, line]);
  }, []);

  const pollCommand = useCallback(
    async (commandId: string) => {
      const start = Date.now();

      while (Date.now() - start < POLL_TIMEOUT_MS) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

        let res: Response;
        try {
          //http://localhost:8222/api/v1/devices/3b1ae99f-dcab-4f31-9008-1af83dbcffe0/commands
          res = await fetch(`${API_BASE}/commands/${commandId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } catch (err) {
          appendLine({
            type: "error",
            text: `network error while polling: ${(err as Error).message}`,
          });
          return;
        }

        if (!res.ok) {
          appendLine({
            type: "error",
            text: `poll failed: HTTP ${res.status}`,
          });
          return;
        }

        const cmd: DeviceCommand = await res.json();

        if (cmd.status === "COMPLETED" || cmd.status === "SUCCESS") {
          appendLine({
            type: "output",
            text: cmd.stdout || "(no output)",
            status: cmd.status,
            exitCode: cmd.exitCode,
          });
          return;
        }

        if (cmd.status === "FAILED") {
          appendLine({
            type: "error",
            text: cmd.stdout || "command failed",
            status: cmd.status,
            exitCode: cmd.exitCode,
          });
          return;
        }
        // else still PENDING / SENT -> keep polling
      }

      appendLine({
        type: "error",
        text: `timed out waiting for result after ${POLL_TIMEOUT_MS / 1000}s`,
      });
    },
    [appendLine]
  );

  const runCommand = useCallback(
    async (commandText: string) => {
      if (!commandText.trim()) return;

      if (!deviceId.trim()) {
        appendLine({ type: "error", text: "set a device id first (top field)." });
        return;
      }

      appendLine({ type: "prompt", text: commandText, time: timestamp() });
      setHistory((prev) => [...prev, commandText]);
      setHistoryIndex(null);
      setBusy(true);
      try {
        const token = localStorage.getItem("access_token");
        //http://localhost:8222/api/v1/devices/3b1ae99f-dcab-4f31-9008-1af83dbcffe0/commands
        const res = await fetch(`${API_BASE}/${deviceId}/commands`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ command: commandText }),
        });

        if (!res.ok) {
          const body = await res.text();
          appendLine({ type: "error", text: `HTTP ${res.status}: ${body}` });
          setBusy(false);
          return;
        }

        const created: DeviceCommand = await res.json();

        if (created.status === "FAILED") {
          appendLine({ type: "error", text: "command failed to send (MQTT publish error)." });
          setBusy(false);
          return;
        }

        appendLine({ type: "pending", text: "sent — waiting for device…", id: created.id });
        await pollCommand(created.id);
      } catch (err) {
        appendLine({ type: "error", text: `request failed: ${(err as Error).message}` });
      } finally {
        setBusy(false);
      }
    },
    [deviceId, appendLine, pollCommand]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !busy) {
      const cmd = input;
      setInput("");
      runCommand(cmd);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex =
        historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className=" w-full max-w-[780px] overflow-hidden rounded-[10px] border border-[#1c2429] bg-[#0a0d10] text-[#d6e3e0] font-mono shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
    >
      {/* title bar */}
      <div
        className=" flex items-center justify-between border-b border-[#1c2429] bg-[#0f1418] px-[14px] py-[10px]
    "
      >
        <div className="flex gap-[6px]">
          <div className="h-[11px] w-[11px] rounded-full bg-[#3a3f45]" />
          <div className="h-[11px] w-[11px] rounded-full bg-[#3a3f45]" />
          <div className="h-[11px] w-[11px] rounded-full bg-[#3a3f45]" />
        </div>

        <div className="text-[12px] tracking-[0.4px] text-[#5c6b70]">
          device-terminal
        </div>
      </div>

      {/* scrollback */}
      <div
        ref={scrollRef}
        className=" h-[380px] overflow-y-auto px-4 py-[14px] text-[13px] leading-[1.6]
    "
      >
        {lines.map((line, i) => {
          if (line.type === "system") {
            return (
              <div
                key={i}
                className="mb-1 text-[#54636a]"
              >
                {line.text}
              </div>
            );
          }

          if (line.type === "prompt") {
            return (
              <div
                key={i}
                className="mt-[10px] text-[#7dd3c0]"
              >
                <span className="mr-2 text-[#4b5a5f]">
                  [{line.time}]
                </span>

                <span className="text-[#5eead4]">
                  ❯
                </span>{" "}

                <span className="text-[#e8f2f0]">
                  {line.text}
                </span>
              </div>
            );
          }

          if (line.type === "pending") {
            return (
              <div
                key={i}
                className="mt-[2px] text-[12px] text-yellow-400"
              >
                <StatusDot status="PENDING" />
                {line.text}
              </div>
            );
          }

          if (line.type === "output") {
            return (
              <div key={i} className="mt-[2px]">
                <div className="mb-[2px] text-[11px] text-[#4b5a5f]">
                  <StatusDot status="COMPLETED" />
                  exit {line.exitCode ?? 0}
                </div>

                <pre
                  className="m-0whitespace-pre-wrapbreak-wordsfont-inherittext-[#c7d6d2]
              "
                >
                  {line.text}
                </pre>
              </div>
            );
          }

          if (line.type === "error") {
            return (
              <div key={i} className="mt-[2px]">
                {line.exitCode !== undefined &&
                  line.exitCode !== null && (
                    <div className="mb-[2px] text-[11px] text-[#4b5a5f]">
                      <StatusDot status="FAILED" />
                      exit {line.exitCode}
                    </div>
                  )}

                <pre
                  className=" m-0 whitespace-pre-wrap break-words font-inherit text-red-400
              "
                >
                  {line.text}
                </pre>
              </div>
            );
          }

          return null;
        })}

        {/* live input line */}
        <div className="mt-[10px] flex items-center">
          <span className="mr-2 shrink-0 text-[#4b5a5f]">
            [{timestamp()}]
          </span>

          <span
            className={`mr-2 ${busy ? "text-[#4b5a5f]" : "text-[#5eead4]"}`}
          >
            ❯
          </span>

          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} disabled={busy} autoFocus spellCheck={false} placeholder={busy ? "waiting for result…" : "type a command…"} className=" min-w-0 flex-1 border-none bg-transparent font-inherit text-[13px] text-[#e8f2f0] outline-none caret-[#5eead4] placeholder:text-[#4b5a5f] disabled:cursor-not-allowed
        "
          />
        </div>
      </div>
    </div>
  );
}