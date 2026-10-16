export function Logo({ light = false }: { light?: boolean }) {
  return <div className={`logo ${light ? "logo-light" : ""}`}><span className="logo-mark"><span /></span><strong>EdgePulse</strong></div>;
}