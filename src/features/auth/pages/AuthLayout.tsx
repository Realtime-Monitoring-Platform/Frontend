import { Outlet, Link } from 'react-router-dom';
import { Activity, ShieldCheck } from 'lucide-react';

const AuthLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 lg:grid lg:grid-cols-2">

            {/* LEFT PANEL */}
            <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#0b1220] p-10 text-white lg:flex xl:p-14">

                {/* Background decoration */}
                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

                {/* Brand */}
                <Link to="/auth/login" className="relative z-10 flex w-fit items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                        <Activity className="h-6 w-6 text-cyan-400" />
                    </div>

                    <div>
                        <span className="text-xl font-bold tracking-tight">EdgePulse</span>
                        <p className="text-xs text-slate-400">DEVICE INTELLIGENCE</p>
                    </div>
                </Link>

                {/* Main content */}
                <div className="relative z-10 max-w-xl">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium tracking-wider text-cyan-300">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                        EMBEDDED DEVICE OPERATIONS
                    </div>

                    <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                        Visibility from the Linux kernel to your entire fleet.
                    </h1>

                    <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                        Securely monitor telemetry, investigate logs, and operate
                        embedded devices from one tenant-aware workspace.
                    </p>

                    {/* Decorative dashboard preview */}
                    <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Fleet overview</p>
                                <div className="mt-2 flex items-center gap-3">
                                    <span className="text-3xl font-semibold">132</span>
                                    <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-400">
                                        Devices online
                                    </span>
                                </div>
                            </div>

                            <Activity className="h-6 w-6 text-cyan-400" />
                        </div>

                        <div className="mt-6 flex h-20 items-end gap-2">
                            {[30, 45, 37, 58, 48, 70, 53, 65, 42, 78, 60, 85, 55, 72, 62, 92, 68, 80, 59, 74, 88, 64, 82, 70].map(
                                (height, index) => (
                                    <div
                                        key={index}
                                        className="flex-1 rounded-t-sm bg-cyan-400"
                                        style={{
                                            height: `${height}%`,
                                            opacity: 0.45 + height / 200,
                                        }}
                                    />
                                )
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                Secure MQTT sessions
                            </span>
                            <span>Live telemetry</span>
                        </div>
                    </div>

                    <div className="mt-7 flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-cyan-400" />
                        <span className="text-sm text-slate-300">
                            Secure access to your embedded Linux fleet
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 text-xs text-slate-500">
                    EdgePulse · Embedded Linux Monitoring
                </div>
            </aside>

            {/* RIGHT PANEL: Child route renders here */}
            <main className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-12 xl:px-20">
                <div className="w-full max-w-md">

                    {/* Mobile brand */}
                    <Link
                        to="/auth/login"
                        className="mb-10 flex w-fit items-center gap-3 lg:hidden"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
                            <Activity className="h-5 w-5 text-cyan-400" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">EdgePulse</span>
                    </Link>

                    <Outlet />
                    {children}
                    {/* <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
            {/* <ShieldCheck className="h-4 w-4" />
            Protected access to your device fleet */}

                    {/*</div> */}
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;