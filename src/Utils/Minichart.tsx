export function MiniChart({ color = "blue", fill = true, compact = false }: { color?: "blue" | "green" | "orange" | "red"; fill?: boolean; compact?: boolean }) {
  const points = compact ? "0,35 20,30 38,34 60,17 82,22 102,10 120,15" : "0,75 45,67 78,73 118,48 160,58 195,32 237,45 275,25 318,37 355,17 400,28 440,10";
  return <svg className={`mini-chart chart-${color}`} viewBox={compact ? "0 0 120 45" : "0 0 440 90"} preserveAspectRatio="none">
    {fill && <polygon points={`${points} ${compact ? "120,45 0,45" : "440,90 0,90"}`} />}
    <polyline points={points} fill="none" vectorEffect="non-scaling-stroke" />
  </svg>;
}