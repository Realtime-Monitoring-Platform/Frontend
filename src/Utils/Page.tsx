import { useState, type ReactNode } from "react";

export type IconName =
  | "activity"
  | "alert"
  | "ai"
  | "bell"
  | "check"
  | "chevron"
  | "clipboard"
  | "command"
  | "cpu"
  | "device"
  | "docs"
  | "external"
  | "filter"
  | "grid"
  | "logs"
  | "menu"
  | "moon"
  | "plus"
  | "search"
  | "settings"
  | "shield"
  | "team"
  | "tenant"
  | "users";

export const iconPaths: Record<IconName, ReactNode> = {
  activity: <><path d="M3 12h4l2-7 4 14 2-7h6" /></>,
  alert: <><path d="M12 3 2.8 19h18.4L12 3Z" /><path d="M12 9v4M12 16.5v.5" /></>,
  ai: <><path d="M12 3 9.8 8.3 4 10.5l5.8 2.2L12 18l2.2-5.3 5.8-2.2-5.8-2.2L12 3Z" /><path d="m5 3 .7 1.8L7.5 5.5l-1.8.7L5 8l-.7-1.8-1.8-.7 1.8-.7L5 3Z" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M10 19h4" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  clipboard: <><rect x="6" y="4" width="12" height="16" rx="2" /><path d="M9 4.5V3h6v1.5M9 9h6M9 13h6" /></>,
  command: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m7 10 2 2-2 2M12 14h5" /></>,
  cpu: <><rect x="7" y="7" width="10" height="10" rx="1" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3M10 10h4v4h-4z" /></>,
  device: <><rect x="5" y="2.5" width="14" height="19" rx="2" /><path d="M8 6h8M10 18h4" /></>,
  docs: <><path d="M5 3h10l4 4v14H5z" /><path d="M14 3v5h5M8 12h8M8 16h8" /></>,
  external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v7H4V6h7" /></>,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  logs: <><path d="M4 5h16M4 10h16M4 15h10M4 20h12" /><path d="M7 3v4M16 8v4" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  shield: <><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
  team: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20v-2a5 5 0 0 1 10 0v2M14 15a4 4 0 0 1 7 3v2" /></>,
  tenant: <><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h1M14 10h1M9 14h1M14 14h1M9 18h6" /></>,
  users: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2 20v-2a6 6 0 0 1 12 0v2M15 14.5a5 5 0 0 1 7 4.5v1" /></>,
};

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>;
}

export function Logo({ light = false }: { light?: boolean }) {
  return <div className={`logo ${light ? "logo-light" : ""}`}><span className="logo-mark"><span /></span><strong>EdgePulse</strong></div>;
}

export function Button({ children, variant = "primary", icon, onClick, className = "" }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "dark"; icon?: IconName; onClick?: () => void; className?: string }) {
  return <button className={`btn btn-${variant} ${className}`} onClick={onClick}>{icon && <Icon name={icon} size={16} />}{children}</button>;
}

export function Badge({ className = "", children, tone = "neutral", dot = false }: { className?: string; children: ReactNode; tone?: "success" | "warning" | "danger" | "info" | "neutral" | "purple"; dot?: boolean }) {
  return <span className={`badge badge-${tone} ${className}`}>{dot && <i />}{children}</span>;
}

const navItems: { label: string; icon: IconName }[] = [
  { label: "Overview", icon: "grid" },
  { label: "Devices", icon: "device" },
  { label: "Live Monitoring", icon: "activity" },
  { label: "Metrics", icon: "cpu" },
  { label: "Logs", icon: "logs" },
  { label: "Alerts", icon: "alert" },
  { label: "AI Analysis", icon: "ai" },
  { label: "Commands", icon: "command" },
  { label: "Teams", icon: "team" },
  { label: "Users", icon: "users" },
  { label: "User History", icon: "logs" },
  { label: "Tenants", icon: "tenant" },
];

export function Sidebar({ page, setPage, collapsed, setCollapsed, showLanding }: { page: string; setPage: (page: string) => void; collapsed: boolean; setCollapsed: (value: boolean) => void; showLanding: () => void }) {
  return <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
    <div className="sidebar-brand"><Logo light /><button className="icon-btn dark-icon" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar"><Icon name="menu" /></button></div>
    <div className="workspace"><span className="workspace-avatar">ON</span><span><small>Organization</small><b>Orion Networks</b></span><Icon name="chevron" size={14} /></div>
    <nav>
      <div className="nav-section">MONITOR</div>
      {navItems.slice(0, 8).map((item) => <button key={item.label} className={`nav-item ${page === item.label ? "active" : ""}`} onClick={() => setPage(item.label)}><Icon name={item.icon} /><span>{item.label}</span>{item.label === "Alerts" && <em>5</em>}</button>)}
      <div className="nav-section">MANAGE</div>
      {navItems.slice(8).map((item) => <button key={item.label} className={`nav-item ${page === item.label ? "active" : ""}`} onClick={() => setPage(item.label)}><Icon name={item.icon} /><span>{item.label}</span></button>)}
    </nav>
    <div className="sidebar-bottom">
      <button className="nav-item" onClick={() => setPage("Settings")}><Icon name="settings" /><span>Settings</span></button>
      <button className="nav-item" onClick={() => setPage("Documentation")}><Icon name="docs" /><span>Documentation</span></button>
      <button className="nav-item" onClick={showLanding}><Icon name="external" /><span>Public website</span></button>
      <div className="user-card"><span className="avatar">AK</span><span><b>Alex Kim</b><small>Tenant Admin</small></span><Icon name="chevron" size={14} /></div>
    </div>
  </aside>;
}

export function Topbar({ page, dark, setDark, navigate }: { page: string; dark: boolean; setDark: (value: boolean) => void; navigate: (page: string) => void }) {
  return <header className="topbar">
    <div className="breadcrumbs"><span>Orion Networks</span><Icon name="chevron" size={13} /><b>{page}</b></div>
    <div className="top-actions">
      <div className="global-search"><Icon name="search" size={17} /><span>Search devices, alerts, logs…</span><kbd>⌘ K</kbd></div>
      <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme"><Icon name="moon" /></button>
      <button className="icon-btn notification" aria-label="Notifications" onClick={() => navigate("Notifications")}><Icon name="bell" /><i /></button>
      <button className="avatar avatar-button" onClick={() => navigate("My Profile")}>AK</button>
    </div>
  </header>;
}

export function PageHeading({ title, subtitle, actions }: { title: string; subtitle: string; actions?: ReactNode }) {
  return <div className="page-heading"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="heading-actions">{actions}</div></div>;
}

export function MiniChart({ color = "blue", fill = true, compact = false }: { color?: "blue" | "green" | "orange" | "red"; fill?: boolean; compact?: boolean }) {
  const points = compact ? "0,35 20,30 38,34 60,17 82,22 102,10 120,15" : "0,75 45,67 78,73 118,48 160,58 195,32 237,45 275,25 318,37 355,17 400,28 440,10";
  return <svg className={`mini-chart chart-${color}`} viewBox={compact ? "0 0 120 45" : "0 0 440 90"} preserveAspectRatio="none">
    {fill && <polygon points={`${points} ${compact ? "120,45 0,45" : "440,90 0,90"}`} />}
    <polyline points={points} fill="none" vectorEffect="non-scaling-stroke" />
  </svg>;
}

export function StatCard({ label, value, change, icon, tone, data }: { label: string; value: string; change: string; icon: IconName; tone: string; data: string }) {
  return <div className="stat-card">
    <div className={`stat-icon ${tone}`}><Icon name={icon} /></div>
    <div className="stat-title">{label}<span>⋯</span></div>
    <div className="stat-value">{value}</div>
    <div className="stat-footer"><span className={change.startsWith("+") ? "positive" : change.startsWith("-") ? "negative" : ""}>{change}</span><small>{data}</small></div>
  </div>;
}

export const devices = [
  { name: "Edge Gateway 07", id: "dev_egw_07a4", model: "NXP i.MX 8M Plus", team: "Platform Ops", status: "Online", cpu: 42, memory: 68, seen: "Just now" },
  { name: "Assembly Controller 12", id: "dev_ac_12f9", model: "Raspberry Pi CM4", team: "Factory West", status: "Warning", cpu: 87, memory: 74, seen: "18 sec ago" },
  { name: "Cold Storage Sensor 03", id: "dev_css_03b2", model: "BeagleBone AI-64", team: "Facilities", status: "Online", cpu: 18, memory: 45, seen: "34 sec ago" },
  { name: "Vision Node 04", id: "dev_vsn_04d1", model: "NVIDIA Jetson Orin", team: "Machine Vision", status: "Offline", cpu: 0, memory: 0, seen: "14 min ago" },
  { name: "Quality Station 02", id: "dev_qs_02e8", model: "Intel Atom x6425E", team: "Factory West", status: "Online", cpu: 51, memory: 62, seen: "1 min ago" },
];

export function Dashboard({ navigate }: { navigate: (page: string) => void }) {
  return <>
    <PageHeading title="Fleet overview" subtitle="Monitor device health, telemetry, and incidents across your organization." actions={<><Badge tone="neutral" dot>Demo data</Badge><Button variant="secondary" icon="docs">Export report</Button><Button icon="plus" onClick={() => navigate("Add Device")}>Add device</Button></>} />
    <div className="stats-grid">
      <StatCard label="Total devices" value="148" change="+6.2%" icon="device" tone="blue" data="vs. last 7 days" />
      <StatCard label="Online devices" value="132" change="+3.1%" icon="activity" tone="green" data="89.2% of fleet" />
      <StatCard label="Offline devices" value="11" change="+2 today" icon="alert" tone="orange" data="7 require review" />
      <StatCard label="Active alerts" value="23" change="-12.5%" icon="bell" tone="red" data="5 critical" />
      <StatCard label="AI investigations" value="8" change="3 new" icon="ai" tone="purple" data="last 24 hours" />
    </div>
    <div className="dashboard-grid">
      <section className="card connectivity-card">
        <div className="card-header"><div><h2>Device connectivity</h2><p>Online devices over the last 24 hours</p></div><select defaultValue="24"><option value="24">Last 24 hours</option><option value="7">Last 7 days</option></select></div>
        <div className="chart-legend"><span><i className="blue-dot" />Online devices <b>132</b></span><span><i className="slate-dot" />Expected <b>140</b></span></div>
        <div className="chart-area">
          <div className="y-axis"><span>150</span><span>100</span><span>50</span><span>0</span></div>
          <div className="large-chart"><i className="expected-line" /><MiniChart /><div className="x-axis"><span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>Now</span></div></div>
        </div>
      </section>
      <section className="card alerts-card">
        <div className="card-header"><div><h2>Recent alerts</h2><p>Incidents requiring attention</p></div><button className="text-btn" onClick={() => navigate("Alerts")}>View all <Icon name="chevron" size={14} /></button></div>
        <div className="alert-list">
          <AlertRow severity="Critical" title="CPU temperature threshold exceeded" device="Assembly Controller 12" time="2 min ago" />
          <AlertRow severity="High" title="Device stopped reporting" device="Vision Node 04" time="14 min ago" />
          <AlertRow severity="Warning" title="Memory utilization above 80%" device="Gateway North 02" time="32 min ago" />
          <AlertRow severity="Info" title="Agent update available" device="12 devices" time="1 hr ago" />
        </div>
      </section>
      <section className="card utilization-card">
        <div className="card-header"><div><h2>Fleet utilization</h2><p>Average resource use</p></div><button className="icon-btn"><span>⋯</span></button></div>
        <div className="util-chart">
          <div className="util-label"><span><i className="blue-dot" />CPU</span><b>46.8%</b></div><MiniChart compact />
          <div className="util-label"><span><i className="green-dot" />Memory</span><b>61.3%</b></div><MiniChart compact color="green" />
          <div className="util-label"><span><i className="orange-dot" />Disk</span><b>54.1%</b></div><MiniChart compact color="orange" />
        </div>
      </section>
      <section className="card ai-card">
        <div className="card-header"><div><h2>AI incident analysis</h2><p>Latest diagnostic hypotheses</p></div><button className="text-btn" onClick={() => navigate("AI Analysis")}>Open workspace <Icon name="chevron" size={14} /></button></div>
        <div className="analysis-item"><span className="analysis-icon"><Icon name="ai" /></span><div><span><Badge tone="danger">High</Badge><small>12 min ago</small></span><h3>Thermal throttling likely causing process instability</h3><p>Evidence across 3 telemetry signals and 14 log entries.</p></div></div>
        <div className="analysis-item"><span className="analysis-icon"><Icon name="ai" /></span><div><span><Badge tone="warning">Medium</Badge><small>48 min ago</small></span><h3>MQTT reconnect loop after certificate rotation</h3><p>Hypothesis — review the suggested certificate checks.</p></div></div>
      </section>
    </div>
    <section className="card attention-card">
      <div className="card-header"><div><h2>Devices requiring attention</h2><p>Sorted by operational risk</p></div><button className="text-btn" onClick={() => navigate("Devices")}>View device inventory <Icon name="chevron" size={14} /></button></div>
      <DeviceTable rows={devices.slice(1, 4)} compact />
    </section>
  </>;
}

export function AlertRow({ severity, title, device, time }: { severity: string; title: string; device: string; time: string }) {
  const tone = severity === "Critical" ? "danger" : severity === "High" || severity === "Warning" ? "warning" : "info";
  return <div className="alert-row"><span className={`alert-indicator ${tone}`}><Icon name="alert" size={16} /></span><div><h3>{title}</h3><p>{device} · {time}</p></div><Badge tone={tone as "danger" | "warning" | "info"}>{severity}</Badge></div>;
}

export function Usage({ value }: { value: number }) {
  return <div className="usage"><span><i style={{ width: `${value}%` }} className={value > 80 ? "danger-fill" : ""} /></span><b>{value || "—"}{value ? "%" : ""}</b></div>;
}

export function DeviceTable({ rows = devices, compact = false, onOpen }: { rows?: typeof devices; compact?: boolean; onOpen?: () => void }) {
  return <div className="table-wrap"><table className="data-table">
    <thead><tr><th>Device</th><th>Status</th><th>Model</th><th>Team</th><th>CPU</th><th>Memory</th><th>Last seen</th><th /></tr></thead>
    <tbody>{rows.map((device) => <tr key={device.id}><td><button className="device-name device-link" onClick={onOpen}><span><Icon name="device" size={16} /></span><div><b>{device.name}</b><code>{device.id}</code></div></button></td><td><Badge dot tone={device.status === "Online" ? "success" : device.status === "Offline" ? "neutral" : "warning"}>{device.status}</Badge></td><td>{device.model}</td><td>{device.team}</td><td><Usage value={device.cpu} /></td><td><Usage value={device.memory} /></td><td>{device.seen}</td><td><button className="icon-btn" onClick={onOpen}><span>⋯</span></button></td></tr>)}</tbody>
  </table>{!compact && <div className="table-footer"><span>Showing 1–5 of 148 devices</span><div><Button variant="secondary">Previous</Button><Button variant="secondary">Next</Button></div></div>}</div>;
}

export function Devices({ addDevice, openDevice }: { addDevice: () => void; openDevice: () => void }) {
  return <>
    <PageHeading title="Devices" subtitle="Manage and monitor embedded Linux devices across your fleet." actions={<><Button variant="secondary" icon="external">Export</Button><Button icon="plus" onClick={addDevice}>Add device</Button></>} />
    <div className="filter-card">
      <div className="search-field"><Icon name="search" /><input placeholder="Search by device name, ID, model, or IP…" /></div>
      <select><option>All statuses</option><option>Online</option><option>Offline</option></select>
      <select><option>All teams</option><option>Platform Ops</option><option>Factory West</option></select>
      <Button variant="secondary" icon="filter">More filters</Button>
    </div>
    <div className="inventory-summary"><span><b>148</b> All devices</span><span className="online"><b>132</b> Online</span><span className="warning-text"><b>5</b> Warning</span><span><b>11</b> Offline</span></div>
    <section className="card inventory-card"><DeviceTable onOpen={openDevice} /></section>
  </>;
}

export function DeviceDetails({ navigate }: { navigate: (page: string) => void }) {
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Metrics", "Logs", "Alerts", "AI Analysis", "Commands", "Configuration"];
  return <>
    <div className="device-detail-head">
      <button className="back-link" onClick={() => navigate("Devices")}>‹ Back to devices</button>
      <div className="device-title-row"><div className="device-hero-icon"><Icon name="device" size={22} /></div><div><div className="title-with-status"><h1>Assembly Controller 12</h1><Badge tone="warning" dot>Warning</Badge><Badge tone="neutral">Demo data</Badge></div><p><code>dev_ac_12f9</code> · NXP i.MX 8M Plus · Factory West</p></div><div className="device-actions"><Button variant="secondary" icon="settings">Edit device</Button><Button icon="command" onClick={() => navigate("Commands")}>Run command</Button></div></div>
      <div className="detail-tabs">{tabs.map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
    </div>
    {tab === "Overview" || tab === "Metrics" ? <div className="detail-content">
      <div className="detail-stats"><StatCard label="CPU utilization" value="87%" change="+18.2%" icon="cpu" tone="red" data="5 min average" /><StatCard label="Memory usage" value="74%" change="+3.4%" icon="activity" tone="orange" data="2.9 of 4 GB" /><StatCard label="Temperature" value="89.4°C" change="+8.1°C" icon="alert" tone="red" data="critical threshold" /><StatCard label="Disk usage" value="52%" change="+1.2%" icon="device" tone="blue" data="31.2 of 60 GB" /></div>
      <div className="device-overview-grid">
        <section className="card detail-chart"><div className="card-header"><div><h2>System utilization</h2><p>Historical telemetry · last 6 hours</p></div><select><option>Last 6 hours</option><option>Last 24 hours</option></select></div><div className="chart-legend"><span><i className="blue-dot" />CPU</span><span><i className="green-dot" />Memory</span></div><div className="detail-chart-canvas"><MiniChart /><MiniChart color="green" fill={false} /></div></section>
        <section className="card system-info"><div className="card-header"><div><h2>System information</h2><p>Last synchronized just now</p></div></div>{[["Operating system","Yocto Linux 4.0"],["Kernel","6.1.55-rt16"],["Architecture","aarch64"],["Agent version","v1.8.2"],["IP address","10.24.8.112"],["MQTT session","TLS 1.3"]].map(([k,v]) => <div key={k}><span>{k}</span><code>{v}</code></div>)}</section>
        <section className="card recent-events"><div className="card-header"><div><h2>Recent device events</h2><p>Telemetry, alerts, and agent activity</p></div><button className="text-btn" onClick={() => setTab("Logs")}>View logs <Icon name="chevron" size={13} /></button></div><AlertRow severity="Critical" title="CPU temperature threshold exceeded" device="89.4°C observed for 4 minutes" time="2 min ago" /><AlertRow severity="Warning" title="CPU frequency throttled" device="Clock reduced to 1.2 GHz" time="4 min ago" /><AlertRow severity="Info" title="Configuration synchronized" device="Agent revision 1842 applied" time="28 min ago" /></section>
        <section className="card disk-panel"><div className="card-header"><div><h2>Disk usage</h2><p>Mounted file systems reported by the device</p></div><Badge tone="warning">High usage</Badge></div><div className="resource-table-head"><span>Mount point</span><span>File system</span><span>Usage</span><span>Used / Total</span></div><div className="disk-row"><code>/</code><code>ext4</code><div className="disk-usage"><div><i /></div><b>85.7%</b></div><strong>20.9 GB / 24.4 GB</strong></div></section>
        <section className="card network-panel"><div className="card-header"><div><h2>Network</h2><p>Traffic totals by available interface</p></div><Badge tone="success" dot>Reporting</Badge></div><div className="network-interfaces">{[["docker0","0 B","0 B"],["enp0s3","49.4 MB","7.2 MB"],["enp0s8","347 KB","823 KB"],["lo","2.1 MB","2.1 MB"]].map(([name,down,up]) => <div key={name}><span className="interface-icon"><Icon name="activity" size={15} /></span><code>{name}</code><p><span>↓</span><b>{down}</b></p><p><span>↑</span><b>{up}</b></p></div>)}</div></section>
        <section className="card memory-panel"><div className="card-header"><div><h2>Memory</h2><p>Physical and swap capacity</p></div><Badge tone="info">31% used</Badge></div><div className="memory-overview"><div className="memory-ring"><span><b>2.8 TB</b><small>of 9.1 TB used</small></span></div><div className="memory-values">{[["Total","9.1 TB"],["Used","2.8 TB"],["Available","6.2 TB"],["Free","1.1 TB"],["Swap","0 B / 0 B"]].map(([name,value]) => <div key={name}><span>{name}</span><b>{value}</b></div>)}</div></div></section>
      </div>
    </div> : tab === "Logs" ? <Logs embedded /> : tab === "AI Analysis" ? <Analysis /> : tab === "Commands" ? <Commands /> : <section className="card tab-state"><span><Icon name={tab === "Configuration" ? "settings" : "alert"} size={24} /></span><h2>{tab}</h2><p>Device-specific {tab.toLowerCase()} for <code>dev_ac_12f9</code>.</p><Button variant="secondary">Configure view</Button></section>}
  </>;
}

export function Monitoring() {
  const metrics = [
    ["CPU utilization", "46.8%", "Across 8 cores", "blue"],
    ["Memory usage", "2.5 GB", "61.3% of 4 GB", "green"],
    ["Disk utilization", "31.2 GB", "52% of 60 GB", "orange"],
    ["Temperature", "67.2°C", "Threshold 85°C", "red"],
  ];
  return <>
    <PageHeading title="Live monitoring" subtitle="Current values and historical telemetry for connected devices." actions={<><Badge tone="success" dot>Auto-refresh · 10s</Badge><Button variant="secondary">Pause refresh</Button></>} />
    <div className="monitor-toolbar"><label>Device<select><option>Edge Gateway 07 · dev_egw_07a4</option><option>Assembly Controller 12 · dev_ac_12f9</option></select></label><label>Time range<select><option>Last 6 hours</option><option>Last 24 hours</option><option>Last 7 days</option></select></label><span>Last updated <b>just now</b></span></div>
    <div className="current-values">{metrics.map(([name,value,detail,color]) => <div className="current-card" key={name}><span className={`metric-accent ${color}`} /><small>CURRENT</small><h2>{value}</h2><b>{name}</b><p>{detail}</p><MiniChart compact color={color === "red" ? "red" : color as "blue" | "green" | "orange"} /></div>)}</div>
    <div className="metric-charts"><section className="card"><div className="card-header"><div><h2>CPU and memory utilization</h2><p>Historical trend · sampled every 30 seconds</p></div><Badge tone="neutral">Historical</Badge></div><div className="dual-chart"><MiniChart /><MiniChart color="green" fill={false} /></div></section><section className="card"><div className="card-header"><div><h2>Network throughput</h2><p>When reported by the device</p></div><Badge tone="info">eth0</Badge></div><div className="network-stats"><div><span>Download</span><b>4.2 MB/s</b></div><div><span>Upload</span><b>1.8 MB/s</b></div></div><div className="network-chart"><MiniChart color="green" /></div></section></div>
  </>;
}

export function Management({ page }: { page: string }) {
  const rows = page === "Teams"
    ? [["Platform Ops","12 members","48 devices","Alex Kim","Active"],["Factory West","8 members","37 devices","Maya Chen","Active"],["Machine Vision","5 members","14 devices","Noah Wilson","Active"],["Facilities","6 members","22 devices","Priya Shah","Active"]]
    : page === "Users"
      ? [["Alex Kim","alex.kim@example.test","Tenant Administrator","Platform Ops","Active"],["Maya Chen","maya.chen@example.test","Team Administrator","Factory West","Active"],["Noah Wilson","noah.wilson@example.test","Standard User","Machine Vision","Active"],["Priya Shah","priya.shah@example.test","Read-only Viewer","Facilities","Invited"]]
      : [["Orion Networks","tenant_orion_01","148 devices","Enterprise","Active"],["Atlas Manufacturing","tenant_atlas_02","82 devices","Standard","Active"],["Northstar Labs","tenant_north_03","31 devices","Standard","Active"]];
  return <>
    <PageHeading title={page} subtitle={page === "Tenants" ? "Global administration for isolated customer organizations." : `Manage ${page.toLowerCase()}, access, and device ownership.`} actions={<><Badge tone="neutral"><Icon name="shield" size={13} /> {page === "Tenants" ? "Global Administrator" : "Tenant Administrator"}</Badge><Button icon="plus">Add {page.slice(0,-1).toLowerCase()}</Button></>} />
    <div className="permission-note"><Icon name="shield" /><div><b>Role-aware administration</b><p>Actions and data shown here are limited by the current administrator’s tenant and team permissions.</p></div><button>Review permissions</button></div>
    <div className="filter-card"><div className="search-field"><Icon name="search" /><input placeholder={`Search ${page.toLowerCase()}…`} /></div><select><option>All statuses</option></select><Button variant="secondary" icon="filter">Filters</Button></div>
    <section className="card management-table"><table className="data-table"><thead><tr>{(page === "Teams" ? ["Team","Members","Assigned devices","Team administrator","Status"] : page === "Users" ? ["User","Email","Role","Team membership","Status"] : ["Tenant","Tenant ID","Fleet size","Plan","Status"]).map(x => <th key={x}>{x}</th>)}<th /></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell,i) => <td key={cell}>{i === 0 ? <b className="primary-cell">{cell}</b> : i === row.length - 1 ? <Badge tone={cell === "Invited" ? "warning" : "success"} dot>{cell}</Badge> : i === 1 && page !== "Teams" ? <code>{cell}</code> : cell}</td>)}<td><button className="icon-btn"><span>⋯</span></button></td></tr>)}</tbody></table></section>
  </>;
}

const logRows = [
  ["10:42:31.482", "ERROR", "dev_ac_12f9", "thermal", "CPU temperature exceeded critical threshold: 89.4°C"],
  ["10:42:30.901", "WARN", "dev_ac_12f9", "kernel", "Thermal zone 0: trip point 2 crossed"],
  ["10:42:28.214", "INFO", "dev_egw_07a4", "mqtt", "Telemetry batch published successfully (42 metrics)"],
  ["10:42:26.773", "DEBUG", "dev_css_03b2", "collector", "Filesystem collection completed in 18ms"],
  ["10:42:24.128", "WARN", "dev_gwn_02c7", "memory", "Memory utilization at 82.1%, threshold is 80%"],
  ["10:42:20.619", "INFO", "dev_qs_02e8", "agent", "Configuration sync completed, revision 1842"],
  ["10:42:18.055", "ERROR", "dev_vsn_04d1", "mqtt", "Broker connection lost: connection reset by peer"],
  ["10:42:16.442", "INFO", "dev_ac_12f9", "systemd", "edgepulse-agent health check passed"],
];

export function Logs({ embedded = false }: { embedded?: boolean }) {
  const [live, setLive] = useState(true);
  return <>
    {!embedded && <PageHeading title="Logs explorer" subtitle="Search and stream structured logs from every connected device." actions={<><Button variant="secondary" icon="external">Export</Button><Button variant={live ? "primary" : "secondary"} icon={live ? "activity" : "logs"} onClick={() => setLive(!live)}>{live ? "Live stream on" : "Resume stream"}</Button></>} />}
    <div className="filter-card log-filters">
      <div className="search-field"><Icon name="search" /><input placeholder="Search logs with keywords or fields…" /></div>
      <select><option>All devices</option></select><select><option>All severities</option></select><select><option>Last 30 minutes</option></select>
    </div>
    <div className="log-status"><div><span className={live ? "pulse-dot" : ""} />{live ? "Streaming live logs" : "Stream paused"}<small> 248 events/min</small></div><div><span className="log-count">8,492 events</span><button className="text-btn">Clear</button></div></div>
    <section className="log-panel">
      <div className="log-head"><span>Timestamp</span><span>Level</span><span>Device ID</span><span>Source</span><span>Message</span></div>
      {logRows.map((log, index) => <div className="log-line" key={index}><time>{log[0]}</time><b className={`level-${log[1].toLowerCase()}`}>{log[1]}</b><code>{log[2]}</code><span>{log[3]}</span><p>{log[4]}</p><button aria-label="Copy log"><Icon name="clipboard" size={14} /></button></div>)}
      <div className="log-tail"><span className="pulse-dot" />Waiting for new events…</div>
    </section>
  </>;
}

export function Analysis() {
  return <>
    <PageHeading title="AI incident analysis" subtitle="Investigate incidents with evidence-backed diagnostic suggestions." actions={<><Badge tone="purple"><Icon name="ai" size={13} /> AI-generated suggestions</Badge><Button icon="plus">New analysis</Button></>} />
    <div className="analysis-layout">
      <aside className="card incident-list"><div className="incident-search"><Icon name="search" /><span>Search analyses…</span></div>{["Thermal throttling and process instability", "MQTT reconnect loop after certificate rotation", "Memory pressure on north gateway", "Intermittent disk I/O latency"].map((item, i) => <button className={i === 0 ? "selected" : ""} key={item}><span><Badge tone={i === 0 ? "danger" : i === 1 ? "warning" : "neutral"}>{i === 0 ? "High" : i === 1 ? "Medium" : "Low"}</Badge><small>{i * 18 + 12} min ago</small></span><b>{item}</b><code>{devices[i]?.id || "dev_dsk_11a2"}</code></button>)}</aside>
      <section className="card analysis-detail">
        <div className="analysis-title"><div><Badge tone="danger">High severity</Badge><h2>Thermal throttling likely causing process instability</h2><p>Assembly Controller 12 · <code>dev_ac_12f9</code> · Analyzed 12 min ago</p></div><Button variant="secondary">Share analysis</Button></div>
        <div className="ai-disclaimer"><Icon name="ai" /><div><b>AI-generated hypothesis</b><p>This analysis identifies a possible cause based on available telemetry and logs. Validate the evidence before taking action.</p></div></div>
        <div className="analysis-section"><h3>Incident summary</h3><p>The device experienced repeated process restarts while CPU temperature remained above 87°C for approximately 11 minutes. CPU frequency dropped concurrently, consistent with thermal throttling behavior.</p></div>
        <div className="evidence-grid"><div><h3>Detected symptoms</h3><ul><li><Icon name="check" />CPU temperature peaked at <b>89.4°C</b></li><li><Icon name="check" />Clock frequency reduced by <b>42%</b></li><li><Icon name="check" />Service restarted <b>3 times</b></li></ul></div><div><h3>Evidence confidence</h3><div className="confidence"><span><i /></span><b>86%</b></div><p>Based on 3 telemetry signals and 14 correlated log entries.</p></div></div>
        <div className="analysis-section"><h3>Recommended troubleshooting steps</h3><ol><li><span>1</span><div><b>Inspect cooling and airflow</b><p>Check fan operation, heatsink contact, and enclosure ventilation.</p></div></li><li><span>2</span><div><b>Review the thermal policy</b><p>Confirm trip points match the device model specification.</p></div></li><li><span>3</span><div><b>Run an approved diagnostics command</b><p>Collect thermal zone and CPU frequency data from the device.</p></div></li></ol></div>
      </section>
    </div>
  </>;
}

export function Commands() {
  const [sent, setSent] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(true);
  return <>
    <PageHeading title="Remote commands" subtitle="Run approved, auditable operations on authorized devices." actions={<Badge tone="success"><Icon name="shield" size={13} /> RBAC enforced</Badge>} />
    <div className="command-layout">
      <section className="card command-form"><div className="card-header"><div><h2>Execute command</h2><p>Arbitrary shell access is disabled</p></div></div>
        <label>Target device<select><option>Assembly Controller 12 — dev_ac_12f9</option><option>Edge Gateway 07 — dev_egw_07a4</option></select></label>
        <label>Approved command<select><option>Collect system diagnostics</option><option>Restart monitoring agent</option><option>Refresh agent configuration</option><option>Rotate device certificate</option></select></label>
        <div className="command-info"><Icon name="shield" /><div><b>Collect system diagnostics</b><p>Collects system health, thermal, memory, and agent status. This command does not modify device state.</p></div></div>
        <label>Reason for execution<textarea placeholder="Describe why this command is required for the audit log…" /></label>
        <div className="command-actions"><Button variant="secondary">Cancel</Button><Button icon="command" onClick={() => setSent(true)}>Review and execute</Button></div>
      </section>
      <section className="card command-history"><div className="card-header"><div><h2>Recent executions</h2><p>Latest authorized device operations</p></div></div>
        {sent && <div className="command-row new"><span className="status-spinner" /><div><b>Collect system diagnostics</b><code>Assembly Controller 12</code></div><Badge tone="info">Running</Badge></div>}
        {[["Refresh agent configuration", "Edge Gateway 07", "Completed"], ["Restart monitoring agent", "Cold Storage Sensor 03", "Completed"], ["Rotate device certificate", "Vision Node 04", "Failed"]].map((row) => <div className="command-row" key={row[0]}><span className={row[2] === "Failed" ? "status-failed" : "status-done"}><Icon name={row[2] === "Failed" ? "alert" : "check"} size={15} /></span><div><b>{row[0]}</b><code>{row[1]}</code></div><Badge tone={row[2] === "Failed" ? "danger" : "success"}>{row[2]}</Badge></div>)}
      </section>
    </div>
    <section className="command-terminal">
      <div className="terminal-toolbar"><div><span /><span /><span /><b>Command output · dev_ac_12f9</b></div><button onClick={() => setTerminalOpen(!terminalOpen)}>{terminalOpen ? "Collapse" : "Expand"}</button></div>
      {terminalOpen && <div className="terminal-output"><p><i>10:48:04</i> <b>$ edgepulse approved-command collect-diagnostics</b></p><p><i>10:48:04</i> Authorization verified: <em>tenant-admin / command.execute</em></p><p><i>10:48:05</i> Connected to device over secure MQTT command channel</p><p><i>10:48:06</i> CPU: 87% · Memory: 74% · Temperature: <strong>89.4°C</strong></p><p><i>10:48:06</i> Agent service: active (running) · v1.8.2</p><p className="terminal-done"><i>10:48:07</i> Command completed successfully · exit status 0</p></div>}
    </section>
    <section className="card full-command-history"><div className="card-header"><div><h2>Command history</h2><p>Auditable execution history across authorized devices</p></div><div className="heading-actions"><select><option>All statuses</option><option>Completed</option><option>Failed</option></select><Button variant="secondary" icon="external">Export audit log</Button></div></div>
      <table className="data-table"><thead><tr><th>Command</th><th>Target device</th><th>Requested by</th><th>Started</th><th>Duration</th><th>Status</th><th /></tr></thead><tbody>{[
        ["Collect system diagnostics","Assembly Controller 12","Alex Kim","Just now","3.1s","Completed"],["Refresh agent configuration","Edge Gateway 07","Maya Chen","18 min ago","1.8s","Completed"],["Restart monitoring agent","Cold Storage Sensor 03","Alex Kim","1 hr ago","8.4s","Completed"],["Rotate device certificate","Vision Node 04","Noah Wilson","3 hrs ago","12.0s","Failed"],["Collect system diagnostics","Quality Station 02","Priya Shah","Yesterday","2.7s","Completed"]
      ].map(row => <tr key={row[0] + row[1]}>{row.slice(0,5).map((cell,i) => <td key={cell}>{i === 0 ? <b className="primary-cell">{cell}</b> : cell}</td>)}<td><Badge tone={row[5] === "Failed" ? "danger" : "success"}>{row[5]}</Badge></td><td><button className="icon-btn">⋯</button></td></tr>)}</tbody></table>
    </section>
  </>;
}

export function InstallWizard({ done }: { done: () => void }) {
  const [step, setStep] = useState(4);
  const [copied, setCopied] = useState("");
  const steps = ["Device details", "Provisioning", "Install agent", "Verify connection"];
  const copy = (name: string) => { setCopied(name); setTimeout(() => setCopied(""), 1200); };
  return <div className="wizard-page">
    <PageHeading title="Connect a Linux device" subtitle="Register your device and securely install the EdgePulse Rust Agent." actions={<Button variant="ghost" onClick={done}>Exit setup</Button>} />
    <div className="stepper">{steps.map((label, i) => <div className={`${step >= i + 1 ? "complete" : ""} ${step === i + 1 ? "current" : ""}`} key={label}><span>{step > i + 1 ? <Icon name="check" size={14} /> : i + 1}</span><div><small>STEP {i + 1}</small><b>{label}</b></div></div>)}</div>
    <section className="wizard-card">
      {step < 4 ? <><div className="wizard-head"><Badge tone="info">Step {step} of 4</Badge><h2>{step === 1 ? "Tell us about this device" : step === 2 ? "Provision device identity" : "Install the Rust Agent"}</h2><p>{step === 1 ? "This information helps your team identify and organize the device." : step === 2 ? "Review the unique identity generated for this device." : "Use your approved deployment process. The examples below contain placeholders."}</p></div>
        {step === 1 && <div className="form-grid"><label>Device name<input defaultValue="Assembly Controller 14" /></label><label>Linux device model<input placeholder="e.g. NXP i.MX 8M Plus" /></label><label>Target team<select><option>Factory West</option><option>Platform Ops</option></select></label><label>Optional description<input placeholder="Purpose or deployment location" /></label></div>}
        {step === 2 && <div className="provision-card"><div><span>Device ID</span><code>dev_ac_14c8e7</code></div><div><span>Tenant ID</span><code>tenant_orion_01</code></div><div className="secure-note"><Icon name="shield" /><p><b>Secure device identity</b><br />Provisioning credentials are scoped to this device and are only displayed once.</p></div></div>}
        {step === 3 && <div className="install-content">
          <div className="notice"><Icon name="alert" /><p><b>Example commands only</b><br />The actual installer URL and configuration keys must match your deployed Rust Agent implementation.</p></div>
          <CodePanel title="1. Download and inspect the installer" copied={copied === "install"} onCopy={() => copy("install")} code={'# Example only: replace with your actual installation URL\ncurl -fsSL "<AGENT_INSTALLER_URL>" -o install-agent.sh\n\n# Inspect the installer before executing it\nless install-agent.sh\n\n# Install using your approved deployment instructions\nsudo bash install-agent.sh'} />
          <CodePanel title="2. Example configuration" copied={copied === "config"} onCopy={() => copy("config")} code={'# Example configuration — adapt to the actual agent format\nMQTT_BROKER_HOST="<MQTT_BROKER_HOST>"\nMQTT_BROKER_PORT="8883"\nDEVICE_ID="<DEVICE_ID>"\nTENANT_ID="<TENANT_ID>"'} />
          <div className="tls-callout"><Icon name="shield" /><div><b>TLS certificate setup</b><p>Install the tenant CA certificate and device credentials using your organization’s secure provisioning process. Never share private keys in chat or source control.</p></div><button className="text-btn">Read TLS guide <Icon name="external" size={13} /></button></div>
        </div>}
        <div className="wizard-actions"><Button variant="secondary" onClick={() => step > 1 && setStep(step - 1)}>Back</Button><Button onClick={() => setStep(step + 1)}>Continue <Icon name="chevron" size={15} /></Button></div>
      </> : <div className="verify-state">
        <span className="success-ring"><Icon name="check" size={28} /></span><Badge tone="success">Connection verified</Badge><h2>Assembly Controller 14 is online</h2><p>The device established a secure MQTT connection and is reporting telemetry.</p>
        <div className="checklist"><div><Icon name="check" /><span><b>Device registered</b><small>dev_ac_14c8e7</small></span></div><div><Icon name="check" /><span><b>MQTT connection established</b><small>TLS session active</small></span></div><div><Icon name="check" /><span><b>Agent reporting metrics</b><small>Last report: just now</small></span></div><div><Icon name="check" /><span><b>Visible in dashboard</b><small>Factory West team</small></span></div></div>
        <Button onClick={done}>View device dashboard</Button><button className="text-btn">Troubleshoot connection</button>
      </div>}
    </section>
    <div className="help-links"><span>Having trouble?</span>{["MQTT failures", "TLS errors", "Invalid credentials", "Restart loops", "Missing metrics", "Broker configuration"].map((x) => <button key={x}>{x}</button>)}</div>
  </div>;
}

export function CodePanel({ title, code, copied, onCopy }: { title: string; code: string; copied: boolean; onCopy: () => void }) {
  return <div className="code-panel"><div><span>{title}</span><button onClick={onCopy}><Icon name={copied ? "check" : "clipboard"} size={15} />{copied ? "Copied" : "Copy"}</button></div><pre>{code}</pre></div>;
}

export function Notifications() {
  const [filter, setFilter] = useState("All");
  const items = [
    ["Critical","CPU temperature threshold exceeded","Assembly Controller 12 reached 89.4°C.","2 min ago","Unread"],
    ["Warning","Device stopped reporting","Vision Node 04 has not reported telemetry for 14 minutes.","14 min ago","Unread"],
    ["Info","AI analysis completed","A diagnostic hypothesis is ready for MQTT reconnect failures.","32 min ago","Read"],
    ["Success","Command completed","Diagnostics collection finished on Edge Gateway 07.","1 hr ago","Read"],
    ["Warning","Memory utilization above threshold","Gateway North 02 has remained above 80% for 10 minutes.","2 hrs ago","Read"],
  ];
  return <>
    <PageHeading title="Notifications" subtitle="Operational updates, incidents, analyses, and command results." actions={<><Button variant="secondary">Mark all as read</Button><Button variant="secondary" icon="settings">Preferences</Button></>} />
    <div className="notification-layout"><aside className="card notification-filters">{["All","Unread","Critical","Device events","Commands","AI analysis"].map(x => <button className={filter === x ? "active" : ""} onClick={() => setFilter(x)} key={x}>{x}{x === "Unread" && <em>2</em>}</button>)}</aside>
      <section className="card notification-list"><div className="notification-list-head"><div><h2>Recent notifications</h2><p>Showing {filter.toLowerCase()} activity</p></div><select><option>Last 7 days</option><option>Last 30 days</option></select></div>{items.map((item,i) => <div className={`notification-item ${item[4] === "Unread" ? "unread" : ""}`} key={item[1]}><span className={`notice-icon notice-${item[0].toLowerCase()}`}><Icon name={item[0] === "Success" ? "check" : item[0] === "Info" ? "ai" : "alert"} /></span><div><span><b>{item[1]}</b><time>{item[3]}</time></span><p>{item[2]}</p><small>{item[0]} · Orion Networks</small></div><button className="icon-btn">⋯</button></div>)}</section>
    </div>
  </>;
}

export function Profile() {
  const [saved, setSaved] = useState(false);
  return <>
    <PageHeading title="My profile" subtitle="Manage your identity, preferences, and account security." actions={saved ? <Badge tone="success"><Icon name="check" size={13} /> Changes saved</Badge> : undefined} />
    <div className="profile-layout"><aside className="card profile-nav"><div className="profile-summary"><span className="profile-avatar">AK</span><b>Alex Kim</b><small>Tenant Administrator</small></div>{["Personal information","Security","Notifications","Appearance","Active sessions"].map((x,i) => <button className={i === 0 ? "active" : ""} key={x}><Icon name={i === 1 ? "shield" : i === 2 ? "bell" : i === 3 ? "moon" : "users"} />{x}</button>)}</aside>
      <section className="card profile-form"><div className="profile-section-head"><h2>Personal information</h2><p>Update the details shown to members of your organization.</p></div><div className="profile-photo"><span className="profile-avatar">AK</span><div><b>Profile photo</b><p>PNG or JPG. Maximum size 2 MB.</p><Button variant="secondary">Upload photo</Button></div></div><div className="form-grid profile-fields"><label>First name<input defaultValue="Alex" /></label><label>Last name<input defaultValue="Kim" /></label><label>Email address<input defaultValue="alex.kim@example.test" /></label><label>Job title<input defaultValue="Senior Platform Engineer" /></label><label>Time zone<select defaultValue="utc"><option value="utc">UTC−08:00 · Pacific Time</option></select></label><label>Language<select><option>English</option></select></label></div><div className="profile-org"><span>Current organization</span><div><span className="workspace-avatar">ON</span><p><b>Orion Networks</b><small>Tenant Administrator · 3 teams</small></p><Badge tone="success">Active</Badge></div></div><div className="profile-actions"><Button variant="secondary">Cancel</Button><Button onClick={() => setSaved(true)}>Save changes</Button></div></section>
    </div>
  </>;
}

export function UserHistory() {
  const events = [
    ["Alex Kim","command.executed","Collect diagnostics on dev_ac_12f9","10.24.1.18","Just now","success"],
    ["Maya Chen","alert.acknowledged","CPU temperature threshold exceeded","10.24.1.42","12 min ago","success"],
    ["Noah Wilson","device.updated","Changed team assignment for Vision Node 04","10.24.2.11","34 min ago","success"],
    ["Priya Shah","login.failed","Invalid password attempt","198.51.100.24","1 hr ago","failed"],
    ["Alex Kim","user.role.changed","Changed Maya Chen to Team Administrator","10.24.1.18","3 hrs ago","success"],
    ["System","session.expired","Session expired for read-only viewer","—","Yesterday","neutral"],
  ];
  return <>
    <PageHeading title="User history" subtitle="Audit user access, permission changes, and operational actions." actions={<><Badge tone="neutral"><Icon name="shield" size={13} /> Tenant Administrator</Badge><Button variant="secondary" icon="external">Export history</Button></>} />
    <div className="filter-card"><div className="search-field"><Icon name="search" /><input placeholder="Search users, actions, resources, or IP addresses…" /></div><select><option>All users</option></select><select><option>All actions</option></select><select><option>Last 30 days</option></select></div>
    <section className="card audit-timeline"><div className="audit-head"><span>User</span><span>Action</span><span>Target or resource</span><span>IP address</span><span>Time</span><span>Result</span></div>{events.map((row,i) => <div className="audit-row" key={row[1] + i}><div><span className="mini-avatar">{row[0].split(" ").map(x=>x[0]).join("").slice(0,2)}</span><b>{row[0]}</b></div><code>{row[1]}</code><p>{row[2]}</p><code>{row[3]}</code><time>{row[4]}</time><Badge tone={row[5] === "failed" ? "danger" : row[5] === "success" ? "success" : "neutral"}>{row[5]}</Badge></div>)}</section>
  </>;
}

export function GenericPage({ page }: { page: string }) {
  const descriptions: Record<string, string> = {
    "Live Monitoring": "Monitor current telemetry and historical trends across connected devices.",
    Metrics: "Explore CPU, memory, disk, network, and temperature telemetry.",
    Alerts: "Review, acknowledge, and resolve fleet incidents and notification history.",
    Teams: "Manage device assignments, members, and team administrators.",
    Users: "Control roles, permissions, and organization access.",
    Tenants: "Manage isolated organizations and global administration.",
    Settings: "Configure your profile, organization, security, and access policies.",
    Documentation: "Agent installation, MQTT configuration, APIs, and troubleshooting.",
  };
  return <><PageHeading title={page} subtitle={descriptions[page] || "Manage your EdgePulse environment."} actions={<Button icon="plus">{page === "Alerts" ? "Create alert rule" : "New item"}</Button>} /><div className="generic-grid">
    <section className="card generic-main"><div className="card-header"><div><h2>{page === "Alerts" ? "Active alerts" : `${page} overview`}</h2><p>Operational data for Orion Networks</p></div><Button variant="secondary" icon="filter">Filter</Button></div>
      {page === "Alerts" ? <div className="alert-list"><AlertRow severity="Critical" title="CPU temperature threshold exceeded" device="Assembly Controller 12" time="2 min ago" /><AlertRow severity="High" title="Device stopped reporting" device="Vision Node 04" time="14 min ago" /><AlertRow severity="Warning" title="Memory utilization above 80%" device="Gateway North 02" time="32 min ago" /></div> : <div className="placeholder-chart"><MiniChart /><div><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>Now</span></div></div>}
    </section><section className="card generic-side"><h2>Platform status</h2><div className="health-row"><span><i />MQTT broker</span><b>Healthy</b></div><div className="health-row"><span><i />Event pipeline</span><b>Healthy</b></div><div className="health-row"><span><i />Metrics storage</span><b>Healthy</b></div></section>
  </div></>;
}

export function Auth({ enterApp, back }: { enterApp: () => void; back: () => void }) {
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

export function Landing({ enterApp, signIn }: { enterApp: () => void; signIn: () => void }) {
  return <div className="landing">
    <header className="marketing-nav"><Logo /><nav><button>Features</button><button>How it works</button><button>Documentation</button><button>Architecture</button><button>Security</button></nav><div><Button variant="ghost" onClick={signIn}>Sign in</Button><Button onClick={signIn}>Get started</Button></div></header>
    <main>
      <section className="hero"><div className="hero-copy"><Badge tone="info"><span className="pulse-dot" /> Built for embedded Linux fleets</Badge><h1>Monitor every embedded Linux device. <span>In real time.</span></h1><p>EdgePulse gives engineering teams real-time visibility into embedded Linux fleets. Collect system metrics, stream logs, detect incidents, and investigate problems from one secure monitoring platform.</p><div className="hero-actions"><Button onClick={enterApp}>Get started <Icon name="chevron" size={16} /></Button><Button variant="secondary" onClick={enterApp}>Explore the platform</Button></div><div className="status-line"><span><Icon name="activity" />Real-time telemetry</span><span><Icon name="shield" />Secure MQTT</span><span><Icon name="ai" />AI-assisted diagnostics</span></div><div className="hero-people"><div><img src="https://images.unsplash.com/photo-1581087724844-037b13e16b0b?crop=faces&fit=crop&fm=jpg&q=85&w=120&h=120" alt="Engineer working at a computer" /><img src="https://images.unsplash.com/photo-1580982324076-d95230549339?crop=faces&fit=crop&fm=jpg&q=85&w=120&h=120" alt="Embedded systems engineer" /><img src="https://images.unsplash.com/photo-1581090124321-d19ad6d7cd5a?crop=faces&fit=crop&fm=jpg&q=85&w=120&h=120" alt="Engineer explaining a technical system" /><img src="https://images.unsplash.com/photo-1629904888132-038af9df34ab?crop=faces&fit=crop&fm=jpg&q=85&w=120&h=120" alt="Software engineer monitoring systems" /></div><p><b>Designed around real engineering workflows</b><span>For firmware, platform, and operations teams</span></p></div></div>
        <div className="hero-dashboard"><div className="mock-top"><Logo /><span>Fleet overview</span><div /></div><div className="mock-body"><div className="mock-side">{["grid", "device", "activity", "logs", "alert"].map((x) => <span key={x}><Icon name={x as IconName} size={15} /></span>)}</div><div className="mock-content"><div className="mock-stats"><div><small>Online devices</small><b>132</b><Badge tone="success">89.2%</Badge></div><div><small>Active alerts</small><b>23</b><Badge tone="danger">5 critical</Badge></div><div><small>Avg. CPU</small><b>46.8%</b><Badge tone="info">Normal</Badge></div></div><div className="mock-grid"><div className="mock-chart"><span>Fleet connectivity</span><MiniChart /></div><div className="mock-health"><span>Device health</span><div className="donut"><b>148<small>devices</small></b></div></div></div><div className="mock-table">{devices.slice(0, 3).map((d) => <div key={d.id}><span><i className={d.status === "Online" ? "green-dot" : "orange-dot"} />{d.name}</span><code>{d.id}</code><Badge tone={d.status === "Online" ? "success" : "warning"}>{d.status}</Badge></div>)}</div></div></div></div>
      </section>
      <section className="trust-strip"><span>RUST AGENT</span><i /><span>MQTT OVER TLS</span><i /><span>EVENT-DRIVEN BACKEND</span><i /><span>TIME-SERIES TELEMETRY</span></section>
      <section className="marketing-section overview"><div className="section-heading"><Badge tone="info">PLATFORM OVERVIEW</Badge><h2>Everything your team needs to operate devices with confidence</h2><p>From the edge to the dashboard, EdgePulse turns device telemetry into clear operational context.</p></div><div className="feature-three">
        <Feature icon="device" title="Fleet visibility" text="Monitor connected Linux devices, ownership, health, and status from one operational view." />
        <Feature icon="activity" title="Real-time telemetry" text="Track CPU, memory, disk, temperature, and connectivity with current and historical context." />
        <Feature icon="ai" title="Intelligent diagnostics" text="Investigate incidents using AI-generated hypotheses grounded in metrics and log evidence." />
      </div></section>
      <section className="architecture"><div className="section-heading"><Badge tone="info">HOW IT WORKS</Badge><h2>A secure path from device to insight</h2><p>Telemetry follows a dedicated data path while Kafka distributes events to downstream processing services.</p></div><div className="architecture-flow">{[["device","Embedded device","Linux"],["cpu","Rust Agent","Collection"],["shield","MQTT + TLS","Transport"],["tenant","Backend","Processing"],["activity","Storage","Time-series"],["grid","Dashboard","React"]].map((item, i) => <div className="arch-item" key={item[1]}><span><Icon name={item[0] as IconName} /></span><b>{item[1]}</b><small>{item[2]}</small>{i < 5 && <i><Icon name="chevron" /></i>}</div>)}</div><div className="processing-note"><b>Event processing</b><span>Kafka</span><span>InfluxDB metrics</span><span>Elasticsearch logs</span><span>FastAPI analysis</span><span>PostgreSQL</span></div></section>
      <section className="people-section"><div className="people-collage"><figure className="people-main"><img src="https://images.unsplash.com/photo-1629904853716-f0bc54eea481?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200" alt="Engineering team collaborating at computer workstations" /><figcaption>Photo by Compagnons on Unsplash</figcaption></figure><figure className="people-small"><img src="https://images.unsplash.com/photo-1581087724694-14c17b0c17fc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=800" alt="Engineers reviewing technical work together" /><figcaption>Photo by ThisisEngineering on Unsplash</figcaption></figure><figure className="people-tiny"><img src="https://images.unsplash.com/photo-1579389083395-4507e98b5e67?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=600" alt="Engineering colleagues collaborating with laptops" /><figcaption>Photo by Priscilla Du Preez on Unsplash</figcaption></figure><div className="people-stat"><span className="pulse-dot" /><b>Shared operational context</b><p>Telemetry, logs, alerts, and actions in one workspace.</p></div></div><div className="people-copy"><Badge tone="info">BUILT FOR OPERATORS</Badge><h2>Give every engineer the context to act with confidence</h2><p>EdgePulse brings firmware engineers, platform teams, and fleet administrators into the same incident workflow—without removing the technical detail they need.</p><div className="role-list"><div><span>FE</span><p><b>Firmware engineers</b><small>Inspect device telemetry and agent behavior.</small></p></div><div><span>OP</span><p><b>Platform operators</b><small>Investigate alerts, logs, and fleet-wide trends.</small></p></div><div><span>AD</span><p><b>Administrators</b><small>Control access, teams, provisioning, and commands.</small></p></div></div><Button onClick={signIn}>Bring your team to EdgePulse <Icon name="chevron" size={15} /></Button></div></section>
      <section className="install-guide-section"><div className="section-heading"><Badge tone="info">HOW TO INSTALL</Badge><h2>From account to live telemetry in eight clear steps</h2><p>The guided setup keeps deployment-specific values explicit and never presents placeholder commands as production-ready instructions.</p></div><div className="install-guide-layout"><div className="install-steps">{[
        ["01","Create your account","Sign in and verify your email address."],["02","Select an organization","Create or choose the tenant that owns the device."],["03","Register the device","Add its name, Linux model, team, and description."],["04","Provision identity","Copy the generated device and tenant identifiers."],["05","Install the Rust Agent","Download and inspect your approved installer."],["06","Configure TLS","Install device credentials through your secure process."],["07","Start the service","Use commands supported by your actual installer."],["08","Verify telemetry","Confirm MQTT, metrics, and dashboard visibility."]
      ].map((x,i) => <div className={i === 4 ? "active" : ""} key={x[0]}><span>{x[0]}</span><p><b>{x[1]}</b><small>{x[2]}</small></p></div>)}</div><div className="install-terminal"><div className="terminal-top"><span /><span /><span /><b>EdgePulse agent setup · example only</b></div><div className="install-warning"><Icon name="alert" /><p><b>Replace every placeholder</b><br />Commands and service names must match your deployed Rust Agent implementation.</p></div><pre><em># Download from your approved location</em>{"\n"}curl -fsSL <strong>"&lt;AGENT_INSTALLER_URL&gt;"</strong> \{"\n"}  -o install-agent.sh{"\n\n"}<em># Inspect before execution</em>{"\n"}less install-agent.sh{"\n\n"}<em># Install with approved instructions</em>{"\n"}sudo bash install-agent.sh{"\n\n"}<em># Example configuration values</em>{"\n"}MQTT_BROKER_HOST=<strong>"&lt;MQTT_BROKER_HOST&gt;"</strong>{"\n"}DEVICE_ID=<strong>"&lt;DEVICE_ID&gt;"</strong>{"\n"}TENANT_ID=<strong>"&lt;TENANT_ID&gt;"</strong></pre><div className="install-terminal-footer"><span><Icon name="shield" />MQTT over TLS</span><Button onClick={enterApp}>Open guided installer</Button></div></div></div></section>
      <section className="connect-section"><div className="connect-copy"><Badge tone="info">DEVICE ONBOARDING</Badge><h2>Connect your first Linux device</h2><p>A guided provisioning workflow takes you from device identity to verified telemetry without hiding critical security details.</p><ol><li><span>1</span><div><b>Register your device</b><p>Name it, choose the model, and assign a team.</p></div></li><li><span>2</span><div><b>Provision secure identity</b><p>Generate scoped credentials and configure TLS.</p></div></li><li><span>3</span><div><b>Install the Rust Agent</b><p>Use transparent commands with explicit placeholders.</p></div></li><li><span>4</span><div><b>Verify live telemetry</b><p>Confirm MQTT connectivity and incoming metrics.</p></div></li></ol><Button onClick={enterApp}>Open installation wizard <Icon name="chevron" size={15} /></Button></div><div className="landing-code"><div className="terminal-top"><span /><span /><span /><b>install-agent.sh</b></div><pre><em># Example only</em>{"\n"}curl -fsSL <strong>"&lt;AGENT_INSTALLER_URL&gt;"</strong> \{"\n"}  -o install-agent.sh{"\n\n"}less install-agent.sh{"\n"}sudo bash install-agent.sh{"\n\n"}<em># Secure configuration</em>{"\n"}MQTT_BROKER_PORT=<strong>"8883"</strong>{"\n"}DEVICE_ID=<strong>"&lt;DEVICE_ID&gt;"</strong></pre><div className="terminal-success"><Icon name="check" />Device connected and reporting metrics</div></div></section>
      <section className="feature-section"><div className="section-heading"><Badge tone="info">COMPLETE OPERATIONS TOOLKIT</Badge><h2>Built for every stage of fleet operations</h2><p>Purpose-built workflows connect telemetry, investigation, administration, and secure device actions.</p></div><div className="feature-grid">{[
        ["device","Device fleet management","Organize ownership, models, health, and connectivity."],["cpu","System monitoring","Track CPU, RAM, disk, temperature, and network data."],["activity","Historical metrics","Compare trends across devices and time ranges."],["logs","Live log streaming","Search structured logs and follow live device events."],["alert","Alerts and notifications","Route severity-based incidents to the right operators."],["ai","AI incident analysis","Correlate evidence into clearly labeled hypotheses."],["command","Remote commands","Run approved, auditable operations with confirmation."],["tenant","Multi-tenant management","Keep organizations and data access isolated."],["team","Teams and permissions","Assign role-aware access to people and devices."],["shield","Secure provisioning","Establish scoped device identity over TLS."],["check","Connectivity health","Find stale sessions and devices requiring attention."],["search","Historical investigation","Filter telemetry, alerts, and logs across the fleet."]
      ].map(([icon,title,text]) => <Feature key={title} icon={icon as IconName} title={title} text={text} />)}</div></section>
      <section className="technology-section"><div className="section-heading"><Badge tone="purple">TECHNICAL ARCHITECTURE</Badge><h2>An event-driven platform from edge to operations</h2><p>Each layer has a clear responsibility, from collection and transport to storage, analysis, and presentation.</p></div><div className="tech-stack">
        <div><strong>EDGE</strong><span><b>Rust Agent</b><small>Linux collection and commands</small></span><span><b>Protocol Buffers</b><small>Telemetry contracts</small></span></div>
        <i><Icon name="chevron" /></i><div><strong>TRANSPORT</strong><span><b>MQTT over TLS</b><small>Secure device messaging</small></span><span><b>Spring Cloud Gateway</b><small>API entry point</small></span></div>
        <i><Icon name="chevron" /></i><div><strong>EVENTS + SERVICES</strong><span><b>Spring Boot · Eureka · Config</b><small>Microservices and discovery</small></span><span><b>Kafka · CQRS</b><small>Event streaming and read models</small></span></div>
        <i><Icon name="chevron" /></i><div><strong>DATA + AI</strong><span><b>InfluxDB · Elasticsearch</b><small>Metrics and logs</small></span><span><b>PostgreSQL · Redis · FastAPI</b><small>Data, cache, and AI analysis</small></span></div>
        <i><Icon name="chevron" /></i><div><strong>DELIVERY</strong><span><b>React · TypeScript</b><small>Operations interface</small></span><span><b>Docker · Kubernetes · Helm</b><small>Argo CD · Terraform · Ansible</small></span></div>
      </div></section>
      <section className="security-section"><div><Badge tone="success"><Icon name="shield" size={13} /> SECURITY BY DESIGN</Badge><h2>Secure from provisioning to command execution</h2></div><div className="security-grid">{["MQTT over TLS","Scoped device identity","Role-based access control","Tenant isolation","Centralized secrets","Controlled commands"].map((x) => <span key={x}><Icon name="check" />{x}</span>)}</div></section>
    </main>
    <footer><div><Logo light /><p>Real-time monitoring for embedded Linux fleets.</p></div><div><b>Product</b><button>Features</button><button>Installation</button><button>Security</button></div><div><b>Resources</b><button>Documentation</button><button>Architecture</button><button>GitHub repository</button></div><div><b>Account</b><button onClick={signIn}>Sign in</button><button onClick={signIn}>Get started</button></div><small>© 2025 EdgePulse. Product demonstration.</small></footer>
  </div>;
}

export function Feature({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return <div className="feature-card"><span><Icon name={icon} /></span><h3>{title}</h3><p>{text}</p><button className="text-btn">Learn more <Icon name="chevron" size={13} /></button></div>;
}

export default  function App() {
  const [publicSite, setPublicSite] = useState(true);
  const [auth, setAuth] = useState(false);
  const [page, setPage] = useState("Overview");
  const [dark, setDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const enterApp = () => { setAuth(false); setPublicSite(false); setPage("Overview"); };
  if (auth) return <Auth enterApp={enterApp} back={() => { setAuth(false); setPublicSite(true); }} />;
  if (publicSite) return <Landing enterApp={() => { setPublicSite(false); setPage("Add Device"); }} signIn={() => setAuth(true)} />;
  const content = page === "Overview" ? <Dashboard navigate={setPage} /> : page === "Devices" ? <Devices addDevice={() => setPage("Add Device")} openDevice={() => setPage("Device Details")} /> : page === "Device Details" ? <DeviceDetails navigate={setPage} /> : page === "Live Monitoring" || page === "Metrics" ? <Monitoring /> : page === "Logs" ? <Logs /> : page === "AI Analysis" ? <Analysis /> : page === "Commands" ? <Commands /> : page === "Notifications" ? <Notifications /> : page === "My Profile" ? <Profile /> : page === "User History" ? <UserHistory /> : page === "Teams" || page === "Users" || page === "Tenants" ? <Management page={page} /> : page === "Add Device" ? <InstallWizard done={() => setPage("Devices")} /> : <GenericPage page={page} />;
  return <div className={`app-shell ${dark ? "dark-mode" : ""}`}><Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} showLanding={() => setPublicSite(true)} /><div className="app-main"><Topbar page={page} dark={dark} setDark={setDark} navigate={setPage} /><main className="page-content">{content}</main></div></div>;
}
