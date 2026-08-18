import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";

// ============================================================
// CONFIG — adjust to match your backend
// ============================================================
const API_BASE = "http://localhost:8222/api/v1/devices";
const POLL_INTERVAL_MS = 1000;
const POLL_TIMEOUT_MS = 30000;

// ============================================================
// types
// ============================================================
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
  
  deviceId=""
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
      style={{
        fontFamily:
          "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace",
        background: "#0a0d10",
        color: "#d6e3e0",
        borderRadius: 10,
        border: "1px solid #1c2429",
        boxShadow: "0 20px 60px -20px rgba(0,0,0,0.6)",
        width: "100%",
        maxWidth: 780,
        overflow: "hidden",
      }}
    >
      {/* title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "#0f1418",
          borderBottom: "1px solid #1c2429",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#3a3f45" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#3a3f45" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#3a3f45" }} />
        </div>
        <div style={{ fontSize: 12, color: "#5c6b70", letterSpacing: 0.4 }}>
          device-terminal
        </div>
        {/* <input
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          placeholder="device id"
          spellCheck={false}
          style={{
            background: "#151b1f",
            border: "1px solid #232b30",
            borderRadius: 6,
            color: "#9fb3ae",
            fontSize: 11,
            padding: "4px 8px",
            width: 220,
            fontFamily: "inherit",
            outline: "none",
          }}
        /> */}
      </div>

      {/* scrollback */}
      <div
        ref={scrollRef}
        style={{
          height: 380,
          overflowY: "auto",
          padding: "14px 16px",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {lines.map((line, i) => {
          if (line.type === "system") {
            return (
              <div key={i} style={{ color: "#54636a", marginBottom: 4 }}>
                {line.text}
              </div>
            );
          }
          if (line.type === "prompt") {
            return (
              <div key={i} style={{ marginTop: 10, color: "#7dd3c0" }}>
                <span style={{ color: "#4b5a5f", marginRight: 8 }}>[{line.time}]</span>
                <span style={{ color: "#5eead4" }}>❯</span>{" "}
                <span style={{ color: "#e8f2f0" }}>{line.text}</span>
              </div>
            );
          }
          if (line.type === "pending") {
            return (
              <div key={i} style={{ color: "#facc15", fontSize: 12, marginTop: 2 }}>
                <StatusDot status="PENDING" />
                {line.text}
              </div>
            );
          }
          if (line.type === "output") {
            return (
              <div key={i} style={{ marginTop: 2 }}>
                <div style={{ fontSize: 11, color: "#4b5a5f", marginBottom: 2 }}>
                  <StatusDot status="COMPLETED" />
                  exit {line.exitCode ?? 0}
                </div>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                    color: "#c7d6d2",
                    fontFamily: "inherit",
                  }}
                >
                  {line.text}
                </pre>
              </div>
            );
          }
          if (line.type === "error") {
            return (
              <div key={i} style={{ marginTop: 2 }}>
                {line.exitCode !== undefined && line.exitCode !== null && (
                  <div style={{ fontSize: 11, color: "#4b5a5f", marginBottom: 2 }}>
                    <StatusDot status="FAILED" />
                    exit {line.exitCode}
                  </div>
                )}
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                    color: "#f87171",
                    fontFamily: "inherit",
                  }}
                >
                  {line.text}
                </pre>
              </div>
            );
          }
          return null;
        })}

        {/* live input line */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          <span style={{ color: "#4b5a5f", marginRight: 8 }}>[{timestamp()}]</span>
          <span style={{ color: busy ? "#4b5a5f" : "#5eead4", marginRight: 8 }}>❯</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={busy}
            autoFocus
            spellCheck={false}
            placeholder={busy ? "waiting for result…" : "type a command…"}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e8f2f0",
              fontFamily: "inherit",
              fontSize: 13,
              caretColor: "#5eead4",
            }}
          />
        </div>
      </div>
    </div>
  );
}