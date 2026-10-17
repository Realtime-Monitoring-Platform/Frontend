import { Badge } from "@/Utils/Badge";
import { Button } from "@/Utils/Button";
import { Icon } from "@/Utils/Icon";
import { Logo } from "@/Utils/Logo";
import { MiniChart } from "@/Utils/Minichart";
import { useState } from "react";

const Auth=({ enterApp, back }: { enterApp: () => void; back: () => void })=> {
  const [mode, setMode] = useState<"signin" | "create" | "forgot" | "verify">("signin");
  const titles = { signin: "Welcome back", create: "Create your account", forgot: "Reset your password", verify: "Verify your email" };
  return <div className="auth-page">
    <aside className="auth-visual"><button onClick={back}><Logo light /></button><div className="auth-message"><Badge tone="info">EDGE DEVICE OPERATIONS</Badge><h1>Visibility from the Linux kernel to your entire fleet.</h1><p>Securely monitor telemetry, investigate logs, and operate embedded devices from one tenant-aware workspace.</p><div className="auth-preview"><div><span className="pulse-dot" /><b>132 devices online</b><small>Secure MQTT sessions active</small></div><MiniChart /></div></div><small>EdgePulse · Product demonstration</small></aside>
    <main className="auth-form-wrap"><div className="auth-form"><Logo /><div className="auth-heading"><h1>{titles[mode]}</h1><p>{mode === "signin" ? "Sign in to access your EdgePulse organization." : mode === "create" ? "Start monitoring your embedded Linux fleet." : mode === "forgot" ? "We’ll send a secure reset link to your email." : "Check your inbox to finish creating your account."}</p></div>
      {mode === "verify" ? <div className="verification-state"><span><Icon name="docs" size={24} /></span><h2>Verification email sent</h2><p>We sent a link to <b>alex@example.test</b>. The link will connect you to your invited organization after verification.</p><Button onClick={() => setMode("signin")}>Return to sign in</Button><button className="text-btn">Resend email</button></div> : <>
        {mode === "create" && <label>Full name<input placeholder="Alex Kim" /></label>}
        <label>Work email<input type="email" placeholder="name@company.com" /></label>
        {mode !== "forgot" && <label>Password<input type="password" placeholder="••••••••••••" /></label>}
        {mode === "signin" && <div className="form-options"><label><input type="checkbox" /> Remember me</label><button onClick={() => setMode("forgot")}>Forgot password?</button></div>}
        {mode === "create" && <div className="tenant-ready"><Icon name="tenant" /><p><b>Tenant-aware access</b><br />You can create an organization or join one through an invitation after verification.</p></div>}
        <Button className="auth-submit" onClick={() => mode === "create" || mode === "forgot" ? setMode("verify") : enterApp()}>{mode === "signin" ? "Sign in" : mode === "create" ? "Create account" : "Send reset link"}</Button>
      </>}
      <div className="auth-switch">{mode === "signin" ? <>New to EdgePulse? <button onClick={() => setMode("create")}>Create an account</button></> : mode !== "verify" ? <>Already have an account? <button onClick={() => setMode("signin")}>Sign in</button></> : null}</div>
    </div></main>
  </div>;
}

export default Auth;