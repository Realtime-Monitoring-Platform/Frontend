import { DeviceLogEvent } from "@/types";
import { formatTime, levelColor } from "@/Utils";
import { useEffect, useRef, useState } from "react";

interface DeviceLogsProps {
    deviceId: string;
}

const MAX_LINES = 1000; 

const DeviceLogs = ({ deviceId }: DeviceLogsProps) => {
    const [lines, setLines] = useState<DeviceLogEvent[]>([]);
    const [autoScroll, setAutoScroll] = useState(true);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
        setAutoScroll(atBottom);
    };

    useEffect(() => {
        if (!deviceId) return;
        const controller = new AbortController();
        const token = localStorage.getItem("access_token");
        const connectSSE = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8222/api/v1/devices/${deviceId}/logs/stream`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "text/event-stream",
                        },
                        signal: controller.signal,
                    }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                if (!response.body) {
                    throw new Error("ReadableStream not supported on response");
                }
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n\n");
                    buffer = lines.pop() || "";
                    for (const chunk of lines) {
                        if (!chunk.trim()) continue;

                        let eventName = "message";
                        let data = "";

                        for (const line of chunk.split("\n")) {
                            if (line.startsWith("event:")) {
                                eventName = line.replace("event:", "").trim();
                            } else if (line.startsWith("data:")) {
                                data += line.replace("data:", "").trim();
                            }
                        }

                        if (eventName === "device-log") {

                            try {
                                const log: DeviceLogEvent = JSON.parse(data);

                                setLines((prev) => {
                                    const next = [...prev, log];
                                    return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
                                });
                            } catch (err) {
                                console.error("Failed to parse log event:", err);
                            }
                        } else if (eventName === "connected") {
                            console.log("Connected:", data);
                        }
                    }
                }
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.error("SSE connection error", error);
                }
            }
        };

        connectSSE();

        return () => {
            controller.abort();
        };
    }, [deviceId]);

    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines, autoScroll]);
    return (
        <div
            className="w-full overflow-hidden rounded-[10px] border border-[#1c2429] bg-[#0a0d10] text-[#d6e3e0] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] font-mono"
        >

            <div className="flex items-center justify-between border-b border-[#1c2429] bg-[#0f1418] px-[14px] py-[10px]    "
            >
                <div className="flex gap-[6px]">
                    <div className="h-[11px] w-[11px] rounded-full bg-[#3a3f45]" />
                    <div className="h-[11px] w-[11px] rounded-full bg-[#3a3f45]" />
                    <div className="h-[11px] w-[11px] rounded-full bg-[#3a3f45]" />
                </div>

                <div className="text-[12px] tracking-[0.4px] text-[#5c6b70]">
                    device-logs — {deviceId.slice(0, 8)}…
                </div>

                <div
                    className="flex items-center gap-[6px] text-[11px]"
                // style={{ color: statusColor }}
                >
                </div>
            </div>

            {/* scrollback */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-[420px] overflow-y-auto px-4 py-[14px] text-[12.5px] leading-[1.7]"
            >
                {lines.length === 0 && (
                    <div className="text-[#54636a]">
                        waiting for logs…
                    </div>
                )}

                {lines.map((log, i) => (
                    <div
                        key={i}
                        className="flex gap-2 whitespace-pre-wrap break-words">
                        <span className="shrink-0 text-[#4b5a5f]">
                            [{formatTime(log.timestamp)}]
                        </span>

                        <span className="min-w-[44px] shrink-0 font-semibold"
                            style={{ color: levelColor(log.level) }}
                        >
                            {log.level}
                        </span>

                        <span className="text-[#c7d6d2]">
                            {log.message}
                        </span>
                    </div>
                ))}
            </div>

            {!autoScroll && (
                <div
                    onClick={() => {
                        setAutoScroll(true);

                        if (scrollRef.current) {
                            scrollRef.current.scrollTop =
                                scrollRef.current.scrollHeight;
                        }
                    }}
                    className="cursor-pointer border-t border-[#1c2429] bg-[#0f1418] px-[6px] py-[6px] text-center text-[11px] text-teal-300"
                >
                    ↓ new logs — click to resume auto-scroll
                </div>
            )}
        </div>)
};

export default DeviceLogs

