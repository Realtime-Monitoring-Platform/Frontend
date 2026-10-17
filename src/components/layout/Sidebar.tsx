
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  ExternalLink,
  FileText,
  Gauge,
  Grid2X2,
  History,
  Logs,
  Menu,
  Router,
  Settings,
  Shield,
  Terminal,
  Users,
  UsersRound,
  X,
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '@/types';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  permission?: string;
  roles?: UserRole[];
  badge?: string;
}

const monitorItems: SidebarItem[] = [
  {
    label: 'Overview',
    icon: <Grid2X2 />,
    path: '/dashboard',
    permission: 'SYSTEM_CONFIG_UPDATE',
  },
  {
    label: 'Devices',
    icon: <Router />,
    path: '/devices',
    permission: 'DEVICE_READ',
  },
  {
    label: 'Live Monitoring',
    icon: <Activity />,
    path: '/monitoring',
    permission: 'MONITORING_READ',
  },
  {
    label: 'Metrics',
    icon: <Cpu />,
    path: '/metrics',
    permission: 'MONITORING_READ',
  },
  {
    label: 'Logs',
    icon: <Logs />,
    path: '/logs',
    permission: 'LOG_READ',
  },
  {
    label: 'Alerts',
    icon: <AlertTriangle />,
    path: '/alerts',
    permission: 'ALERT_READ',
    badge: '5',
  },
  {
    label: 'AI Analysis',
    icon: <Bot />,
    path: '/ai-analysis',
    permission: 'AI_ANALYSIS_READ',
  },
  {
    label: 'Commands',
    icon: <Terminal />,
    path: '/commands',
    permission: 'COMMAND_READ',
  },
];

const manageItems: SidebarItem[] = [
  {
    label: 'Teams',
    icon: <UsersRound />,
    path: '/teams',
    permission: 'TEAM_READ',
  },
  {
    label: 'Users',
    icon: <Users />,
    path: '/users',
    permission: 'USER_READ',
  },
  {
    label: 'User History',
    icon: <History />,
    path: '/user-history',
    permission: 'USER_HISTORY_READ',
  },
  {
    label: 'Tenants',
    icon: <Building2 />,
    path: '/tenants',
    permission: 'TENANT_READ',
  },
  {
    label: 'Roles & Permissions',
    icon: <Shield />,
    path: '/roles',
    permission: 'ROLE_READ',
  },
  {
    label: 'Reports',
    icon: <BarChart3 />,
    path: '/reports',
    permission: 'REPORT_READ',
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [collapsed, setCollapsed] = useState(false);

  const hasPermission = (item: SidebarItem) => {
    if (!item.permission) return true;

    // Keep your current permission-based access control.
    return user?.permissions?.includes(item.permission) ?? false;
  };

  const visibleMonitorItems = monitorItems.filter(hasPermission);
  const visibleManageItems = manageItems.filter(hasPermission);

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(`${path}/`);

  const handleNavigate = (path: string) => {
    navigate(path);

    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const renderItems = (items: SidebarItem[]) =>
    items.map((item) => {
      const active = isActive(item.path);

      return (
        <button
          key={item.label}
          type="button"
          title={collapsed ? item.label : undefined}
          onClick={() => handleNavigate(item.path)}
          className={`group relative flex w-full items-center gap-3
            rounded-lg px-3 py-2.5 text-left text-sm
            transition-all duration-200
            ${
              active
                ? 'bg-cyan-400/10 text-cyan-300'
                : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
            }
            ${collapsed ? 'justify-center px-2' : ''}`}
        >
          {active && (
            <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-cyan-400" />
          )}

          <span
            className={`shrink-0 [&>svg]:h-[19px] [&>svg]:w-[19px]
              ${active ? 'text-cyan-300' : 'text-slate-400 group-hover:text-white'}`}
          >
            {item.icon}
          </span>

          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate font-medium">
                {item.label}
              </span>

              {item.badge && (
                <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-xs font-semibold text-rose-400">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </button>
      );
    });

  const sidebarContent = (
    <div className="flex h-full min-h-0 flex-col bg-[#0b1220] text-slate-300">
      {/* Brand */}
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.07] px-4">
        {!collapsed && (
          <button
            type="button"
            onClick={() => handleNavigate('/dashboard')}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
              <Activity className="h-5 w-5" />
            </span>

            <span>
              <span className="block text-sm font-bold tracking-wide text-white">
                Orion Networks
              </span>
              <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Device Intelligence
              </span>
            </span>
          </button>
        )}

        {collapsed && (
          <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
            <Activity className="h-5 w-5" />
          </span>
        )}

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.08] hover:text-white md:block"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.08] hover:text-white md:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Organization */}
      <div className="shrink-0 px-3 py-4">
        <button
          type="button"
          title={collapsed ? 'Organization' : undefined}
          className={`flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3 text-left transition hover:bg-white/[0.07] ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-xs font-bold text-indigo-300">
            ON
          </span>

          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                  Organization
                </span>
                <span className="mt-1 block truncate text-sm font-semibold text-white">
                  Orion Networks
                </span>
              </span>

              <ChevronDown className="h-4 w-4 text-slate-500" />
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        <section>
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Monitor
            </p>
          )}

          <div className="space-y-1">
            {renderItems(visibleMonitorItems)}
          </div>
        </section>

        <section>
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Manage
            </p>
          )}

          <div className="space-y-1">
            {renderItems(visibleManageItems)}
          </div>
        </section>
      </nav>

      {/* Bottom actions */}
      <div className="shrink-0 space-y-1 border-t border-white/[0.07] p-3">
        <button
          type="button"
          title={collapsed ? 'Settings' : undefined}
          onClick={() => handleNavigate('/settings')}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <Settings className="h-[19px] w-[19px] shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>

        <button
          type="button"
          title={collapsed ? 'Documentation' : undefined}
          onClick={() => handleNavigate('/documentation')}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <BookOpen className="h-[19px] w-[19px] shrink-0" />
          {!collapsed && <span>Documentation</span>}
        </button>

        {!collapsed && (
          <div className="my-3 border-t border-white/[0.07]" />
        )}

        <div
          className={`flex items-center gap-3 rounded-xl p-2 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 text-xs font-bold text-cyan-300">
            {user?.username?.slice(0, 2).toUpperCase() || 'US'}
          </span>

          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-white">
                  {user?.username || 'User'}
                </span>
                {/* <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {user?.roles?.[0]?.name || 'Platform User'}
                </span> */}
              </span>

              <button
                type="button"
                title="Collapse sidebar"
                onClick={() => setCollapsed(true)}
                className="rounded-md p-1 text-slate-500 hover:bg-white/[0.08] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 overflow-hidden shadow-2xl transition-transform duration-300 md:sticky md:top-0 md:z-20 md:h-screen md:shrink-0 md:translate-x-0 md:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${
          collapsed ? 'md:w-[76px]' : 'md:w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
