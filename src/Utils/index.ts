export function formatTime(millis: number): string {
    return new Date(millis).toTimeString().slice(0, 8);
}

export function levelColor(level: string): string {
    switch (level) {
        case "ERROR":
            return "#f87171";
        case "WARN":
            return "#facc15";
        case "INFO":
            return "#5eead4";
        default:
            return "#9fb3ae";
    }
}