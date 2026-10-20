import { useMemo, useState } from 'react';
import {
  Activity,
  BookOpen,
  Check,
  Copy,
  Cpu,
  Download,
  KeyRound,
  Network,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  Terminal,
  Wrench,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

/* ── Code block with copy-to-clipboard ─────────────────────────── */

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — ignore silently.
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border/60 bg-[#0b1220]">
      {label && (
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
            {label}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={copy}
            className="h-6 px-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            {copied ? (
              <Check className="mr-1 h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="mr-1 h-3 w-3" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ── Documentation content model ───────────────────────────────── */

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  keywords: string;
  render: () => React.ReactNode;
}

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-3 text-xl font-semibold tracking-tight">{children}</h3>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{children}</p>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">{children}</code>
);

const sections: DocSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: <BookOpen className="h-4 w-4" />,
    keywords: 'overview what is edgepulse platform intro telemetry',
    render: () => (
      <>
        <H2>What is EdgePulse?</H2>
        <P>
          EdgePulse is a real-time monitoring platform for embedded Linux fleets. A lightweight
          Rust agent runs on each device, collects system metrics and logs, and streams them over
          MQTT (TLS) to an event-driven backend. Metrics are stored in a time-series database and
          surfaced in this dashboard for fleet health, alerting, and AI-assisted diagnostics.
        </P>
        <div className="mb-2 grid gap-3 sm:grid-cols-3">
          {[
            { icon: <Cpu className="h-4 w-4" />, title: 'Rust Agent', text: 'Collects CPU, RAM, memory, disk and network metrics every 5s.' },
            { icon: <Network className="h-4 w-4" />, title: 'MQTT over TLS', text: 'Publishes telemetry to the broker on port 8883 with device certs.' },
            { icon: <Activity className="h-4 w-4" />, title: 'Live Dashboard', text: 'Streams metrics, logs, alerts and AI analysis to your team.' },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border/60 bg-card p-4">
              <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {item.icon}
              </span>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'quickstart',
    title: 'Quickstart',
    icon: <Terminal className="h-4 w-4" />,
    keywords: 'quick start steps install first device onboarding provision',
    render: () => (
      <>
        <H2>Quickstart</H2>
        <P>Go from an account to live telemetry in five steps.</P>
        <ol className="mb-2 space-y-3">
          {[
            ['Create your account', 'Sign in and verify your email address.'],
            ['Select an organization', 'Create or choose the tenant that owns the device.'],
            ['Register the device', 'Add its name, Linux model, team, and description to generate a device ID.'],
            ['Install the Rust agent', 'Download, inspect, and run the installer with your provisioning token.'],
            ['Verify telemetry', 'Confirm the device appears Online and metrics are arriving.'],
          ].map(([title, text], i) => (
            <li key={title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    id: 'installation',
    title: 'Installing the Agent',
    icon: <Download className="h-4 w-4" />,
    keywords: 'install agent rust curl bash installer token provision command',
    render: () => (
      <>
        <H2>Installing the Rust Agent</H2>
        <P>
          The installer is run on the target Linux device as root. It clones the agent source,
          builds a release binary with Cargo, installs it to{' '}
          <Code>/usr/local/bin/monitoring-agent</Code>, provisions device identity, and enables a
          systemd service.
        </P>
        <div className="mb-4 space-y-1">
          <p className="text-sm font-medium">1. Install Rust (if not already present)</p>
          <CodeBlock
            label="bash"
            code={'curl --proto \'=https\' --tlsv1.2 -sSf https://sh.rustup.rs | sh\nsource "$HOME/.cargo/env"'}
          />
        </div>
        <div className="mb-4 space-y-1">
          <p className="text-sm font-medium">2. Download, inspect, and run the installer</p>
          <CodeBlock
            label="bash"
            code={'# Download from your approved location\ncurl -fsSL "<AGENT_INSTALLER_URL>" -o install-agent.sh\n\n# Inspect before executing\nless install-agent.sh\n\n# Install and provision with your token\nsudo bash install-agent.sh --token <PROVISIONING_TOKEN>'}
          />
        </div>
        <div className="mb-2 space-y-1">
          <p className="text-sm font-medium">One-liner (pipe to bash)</p>
          <CodeBlock
            label="bash"
            code={'curl -fsSL "<AGENT_INSTALLER_URL>" | sudo bash -s -- --token <PROVISIONING_TOKEN>'}
          />
        </div>
        <Card className="mt-4 border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 text-sm">
            <p className="font-medium text-amber-500">Requirements</p>
            <p className="mt-1 text-muted-foreground">
              Linux with systemd, root access, the Rust toolchain (<Code>cargo</Code>),{' '}
              <Code>git</Code>, and a reachable provisioning endpoint and MQTT broker.
            </p>
          </CardContent>
        </Card>
      </>
    ),
  },
  {
    id: 'configuration',
    title: 'Agent Configuration',
    icon: <Settings2 className="h-4 w-4" />,
    keywords: 'config configuration env agent.env mqtt host port device url monitoring',
    render: () => (
      <>
        <H2>Agent Configuration</H2>
        <P>
          The installer writes a systemd environment file at{' '}
          <Code>/etc/monitoring-agent/agent.env</Code> (mode 0600). You can override the defaults
          with flags or environment variables.
        </P>
        <CodeBlock
          label="/etc/monitoring-agent/agent.env"
          code={'MONITORING_DEVICE_SERVICE_URL=http://<device-service>:9005/api/v1/devices/provision\nMONITORING_MQTT_HOST=<mqtt-broker-host>\nMONITORING_MQTT_PORT=8883'}
        />
        <p className="mb-2 mt-6 text-sm font-medium">Installer flags</p>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Flag</th>
                <th className="px-4 py-2 font-medium">Default</th>
                <th className="px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                ['--token', '(required)', 'Provisioning token for a new device.'],
                ['--device-url', 'provision endpoint', 'Device provisioning endpoint URL.'],
                ['--mqtt-host', 'broker host', 'MQTT broker hostname.'],
                ['--mqtt-port', '8883', 'MQTT broker TLS port.'],
              ].map(([flag, def, desc]) => (
                <tr key={flag}>
                  <td className="px-4 py-2">
                    <Code>{flag}</Code>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{def}</td>
                  <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mb-2 mt-6 text-sm font-medium">Equivalent environment variables</p>
        <CodeBlock
          label="bash"
          code={'MONITORING_AGENT_REPOSITORY=<git repo url>\nMONITORING_DEVICE_SERVICE_URL=<provision url>\nMONITORING_MQTT_HOST=<broker host>\nMONITORING_MQTT_PORT=8883'}
        />
      </>
    ),
  },
  {
    id: 'service',
    title: 'Managing the Service',
    icon: <Server className="h-4 w-4" />,
    keywords: 'systemd service systemctl status logs restart enable run manual',
    render: () => (
      <>
        <H2>Managing the Service</H2>
        <P>
          The installer creates and enables a systemd unit named{' '}
          <Code>monitoring-agent.service</Code> that runs the binary as root.
        </P>
        <CodeBlock
          label="bash"
          code={'# Check service status\nsystemctl status monitoring-agent\n\n# Follow live logs (metrics publish every 5s)\njournalctl -u monitoring-agent -f\n\n# Restart after changing configuration\nsudo systemctl restart monitoring-agent\n\n# Run manually in the foreground to debug\nsudo /usr/local/bin/monitoring-agent'}
        />
      </>
    ),
  },
  {
    id: 'mqtt',
    title: 'MQTT & TLS',
    icon: <ShieldCheck className="h-4 w-4" />,
    keywords: 'mqtt tls ssl broker port 8883 topic certificate identity provisioning security',
    render: () => (
      <>
        <H2>MQTT &amp; TLS</H2>
        <P>
          The agent connects to the broker over TLS (port <Code>8883</Code>) and publishes
          telemetry to the tenant/device topic tree. Identity and certificates are obtained during
          provisioning — the device generates a CSR, sends it to the device service, and receives a
          CA certificate, client certificate, device ID, and tenant ID. The identity is stored in{' '}
          <Code>/root/.monitoring-agent/identity.json</Code>.
        </P>
        <p className="mb-2 text-sm font-medium">Topic layout</p>
        <CodeBlock
          label="topic"
          code={'tenants/<tenantId>/devices/<deviceId>/metrics\ntenants/<tenantId>/devices/<deviceId>/logs\ntenants/<tenantId>/devices/<deviceId>/commands   (inbound)'}
        />
        <Card className="mt-4 border-border/60">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <Code>QoS 1</Code> is used for telemetry. Keep-alive is 30s. Never share private keys
            in chat or source control — install credentials through your organization&apos;s
            secure provisioning process.
          </CardContent>
        </Card>
      </>
    ),
  },
  {
    id: 'metrics',
    title: 'Metrics Reference',
    icon: <Activity className="h-4 w-4" />,
    keywords: 'metrics schema cpu ram memory disk network fields payload json snapshot',
    render: () => (
      <>
        <H2>Metrics Reference</H2>
        <P>
          Each metrics message contains scalar CPU/RAM usage plus a detailed breakdown of memory,
          disks, and network interfaces. The latest snapshot joins all of these on a shared
          timestamp.
        </P>
        <CodeBlock
          label="metrics payload (json)"
          code={`{
  "device_id": "3b1ae99f-...",
  "tenant_id": "247690cf-...",
  "cpu": 46.8,
  "ram": 61.3,
  "memory": { "total_kb": 9738203136, "used_kb": 2941906944, "free_kb": 1937555456, "available_kb": 6796296192 },
  "disks": [{ "mount_point": "/", "file_system": "ext4", "total_bytes": 26238750720, "used_bytes": 23169736704, "used_percent": 88.3 }],
  "network": [{ "interface": "eth0", "received_bytes": 48253455, "transmitted_bytes": 6125993 }]
}`}
        />
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            ['cpu / ram', 'Percentage utilization (f32).'],
            ['memory.*', 'Kibibytes (kB) of RAM and swap.'],
            ['disks[].*_bytes', 'Bytes on each mounted partition.'],
            ['network[].*_bytes', 'Cumulative traffic counters per interface.'],
          ].map(([field, desc]) => (
            <div key={field} className="rounded-lg border border-border/60 p-3">
              <Code>{field}</Code>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'api',
    title: 'REST API Reference',
    icon: <KeyRound className="h-4 w-4" />,
    keywords: 'rest api endpoints http query metrics devices latest get post reference',
    render: () => (
      <>
        <H2>REST API Reference</H2>
        <P>
          The query service exposes read models over HTTP; the device service handles
          provisioning and command execution. Requests are authenticated with a bearer token.
        </P>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Method</th>
                <th className="px-4 py-2 font-medium">Endpoint</th>
                <th className="px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                ['GET', '/query/devices', 'List devices (paginated).'],
                ['GET', '/query/devices/{id}', 'Device overview by ID.'],
                ['GET', '/query/devices/tenant/{tenantId}', 'Devices for a tenant.'],
                ['GET', '/query/metrics/deviceid/{id}?startTime=-24h', 'Metrics history.'],
                ['GET', '/query/metrics/latest/deviceid/{id}', 'Latest metrics snapshot.'],
                ['POST', '/devices', 'Register a new device.'],
                ['PUT', '/devices/{id}', 'Update a device.'],
                ['DELETE', '/devices/{id}', 'Delete a device.'],
                ['GET', '/devices/{id}/commands/history', 'Command execution history.'],
              ].map(([method, endpoint, desc]) => (
                <tr key={endpoint}>
                  <td className="px-4 py-2">
                    <Badge
                      variant="outline"
                      className={
                        method === 'GET'
                          ? 'border-emerald-500/40 text-emerald-500'
                          : method === 'POST'
                            ? 'border-sky-500/40 text-sky-500'
                            : method === 'PUT'
                              ? 'border-amber-500/40 text-amber-500'
                              : 'border-rose-500/40 text-rose-500'
                      }
                    >
                      {method}
                    </Badge>
                  </td>
                  <td className="px-4 py-2">
                    <Code>{endpoint}</Code>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mb-2 mt-6 text-sm font-medium">Example — fetch the latest snapshot</p>
        <CodeBlock
          label="bash"
          code={'curl -H "Authorization: Bearer <TOKEN>" \\\n  "https://<api-host>/query/metrics/latest/deviceid/<DEVICE_ID>?startTime=-24h"'}
        />
      </>
    ),
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: <Wrench className="h-4 w-4" />,
    keywords: 'troubleshooting error debug offline not reporting help common issues fix',
    render: () => (
      <>
        <H2>Troubleshooting</H2>
        <div className="space-y-4">
          {[
            {
              q: 'Device stays Offline after install',
              a: 'Check the agent logs with journalctl -u monitoring-agent -f. Verify the MQTT broker host/port are reachable and the TLS certificates were issued during provisioning.',
            },
            {
              q: 'Installer exits with "Rust/Cargo is required"',
              a: 'Install the Rust toolchain first (see Installing the Agent), then re-run the installer. The installer does not install Rust itself.',
            },
            {
              q: 'Provisioning fails with a network error',
              a: 'Confirm MONITORING_DEVICE_SERVICE_URL points to a running device service and that the provisioning token is valid for your tenant.',
            },
            {
              q: 'No metrics appearing on the dashboard',
              a: 'Confirm the device shows Online, then verify the metrics topic is being published. Metrics are sent every 5 seconds; allow up to 30s for the first snapshot to appear.',
            },
          ].map((item) => (
            <div key={item.q} className="rounded-lg border border-border/60 p-4">
              <p className="text-sm font-medium">{item.q}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
];


const DocumentationPage = () => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('introduction');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter(
      (s) => s.title.toLowerCase().includes(q) || s.keywords.toLowerCase().includes(q)
    );
  }, [query]);

  const activeSection = sections.find((s) => s.id === active) ?? sections[0];

  const jump = (id: string) => {
    setActive(id);
    document
      .getElementById(`doc-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
          <p className="text-sm text-muted-foreground">
            Agent installation, MQTT configuration, API reference, and troubleshooting.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          v1.8.2
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sticky side nav */}
        <div className="lg:sticky lg:top-20 lg:h-fit">
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search docs…"
              className="pl-8"
            />
          </div>
          <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
            {filtered.length === 0 && (
              <p className="px-2 py-1 text-xs text-muted-foreground">No results.</p>
            )}
            {filtered.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => jump(s.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  active === s.id
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {s.icon}
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="min-w-0 space-y-8">
          {filtered.map((s) => (
            <Card key={s.id} id={`doc-${s.id}`} className="scroll-mt-24 border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {s.icon}
                  </span>
                  {s.title}
                </CardTitle>
              </CardHeader>
              <Separator className="mb-4" />
              <CardContent className="pt-0">{s.render()}</CardContent>
            </Card>
          ))}

          {/* Feedback footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 p-4">
            <div>
              <p className="text-sm font-medium">Was this page helpful?</p>
              <p className="text-xs text-muted-foreground">
                Currently viewing: {activeSection.title}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Yes</Button>
              <Button variant="outline" size="sm">Needs work</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;

