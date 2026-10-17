
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  User,
  Settings,
  Key,
  LogOut,
  Moon,
  Sun,
  Search,
  ChevronRight,
  Command,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAuth } from '../../hooks/useAuth';
import { useCustomTheme } from '@/styles/ThemeProvider';
import { useQuery } from '@tanstack/react-query';
import {
  getMyNotifications,
  getUnredNotificationsCount,
} from '@/services/notificationAction';

interface HeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/devices': 'Devices',
  '/monitoring': 'Live Monitoring',
  '/metrics': 'Metrics',
  '/logs': 'Logs',
  '/alerts': 'Alerts',
  '/ai-analysis': 'AI Analysis',
  '/commands': 'Commands',
  '/teams': 'Teams',
  '/users': 'Users',
  '/user-history': 'User History',
  '/tenants': 'Tenants',
  '/roles': 'Roles & Permissions',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/profile': 'My Profile',
  '/api-tokens': 'API Tokens',
  '/notifications': 'Notifications',
  '/documentation': 'Documentation',
};

const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useCustomTheme();
  const { user, logout } = useAuth();
  const searchRef = useRef<HTMLInputElement>(null);

  const currentPage =
    pageTitles[location.pathname] ??
    Object.entries(pageTitles).find(
      ([path]) =>
        path !== '/' && location.pathname.startsWith(`${path}/`)
    )?.[1] ??
    'Overview';

  const { data: notifs } = useQuery({
    queryKey: ['my-notifications'],
    queryFn: getMyNotifications,
  });

  const { data: unreadNotificationsCount } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: getUnredNotificationsCount,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const hasUnread = (unreadNotificationsCount ?? 0) > 0;

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Ctrl+K / Cmd+K focuses the global search.
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === 'Escape') {
        searchRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const getInitials = () => {
    const first = user?.firstName?.charAt(0) ?? '';
    const last = user?.lastName?.charAt(0) ?? '';
    return `${first}${last}`.toUpperCase() || 'US';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6">
      {/* Left: mobile menu and breadcrumbs */}
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="hidden truncate text-muted-foreground sm:inline">
            Orion Networks
          </span>

          <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/60 sm:block" />

          <span className="truncate font-semibold text-foreground">
            {currentPage}
          </span>
        </div>
      </div>

      {/* Right: search and actions */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* Global search */}
        <div className="relative hidden w-52 lg:block xl:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            ref={searchRef}
            type="search"
            placeholder="Search devices, alerts, logs..."
            aria-label="Search devices, alerts, and logs"
            className="h-9 border-border/70 bg-muted/40 pl-9 pr-16 text-xs shadow-none transition-colors placeholder:text-muted-foreground/80 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-cyan-500/50"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                const query = event.currentTarget.value.trim();

                if (query) {
                  navigate(`/devices?search=${encodeURIComponent(query)}`);
                }
              }
            }}
          />

          <kbd className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-background px-1.5 py-1 text-[10px] text-muted-foreground">
            <Command className="h-2.5 w-2.5" />
            K
          </kbd>
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={toggleTheme}
          aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
        >
          {mode === 'light' ? (
            <Moon className="h-[18px] w-[18px]" />
          ) : (
            <Sun className="h-[18px] w-[18px]" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
              aria-label={`Notifications${
                hasUnread ? `, ${unreadNotificationsCount} unread` : ''
              }`}
            >
              <Bell className="h-[18px] w-[18px]" />

              {hasUnread && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-background">
                  {(unreadNotificationsCount ?? 0) > 99
                    ? '99+'
                    : unreadNotificationsCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 p-2 sm:w-96">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-sm font-semibold">Notifications</span>

              <span className="text-xs text-muted-foreground">
                {unreadNotificationsCount ?? 0} unread
              </span>
            </div>

            <DropdownMenuSeparator />

            <div className="max-h-80 overflow-y-auto">
              {!notifs?.length ? (
                <div className="px-2 py-8 text-center">
                  <Bell className="mx-auto mb-2 h-7 w-7 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifs.map((notif: any) => (
                  <button
                    key={notif.id}
                    type="button"
                    onClick={() => navigate('/notifications')}
                    className="mb-1 w-full rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted/60"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {notif.title}
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {notif.message}
                    </p>

                    <p className="mt-2 text-[10px] text-muted-foreground/70">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </button>
                ))
              )}
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => navigate('/notifications')}
              className="justify-center text-sm font-medium text-primary"
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="ml-1 h-9 gap-2 rounded-full px-1.5 sm:px-2"
              aria-label="User account options"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="border border-cyan-500/20 bg-cyan-500/10 text-xs font-bold text-cyan-600 dark:text-cyan-300">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              <span className="hidden max-w-28 truncate text-xs font-medium sm:block">
                {user?.firstName || user?.username || 'User'}
              </span>

              <ChevronRight className="hidden h-3.5 w-3.5 rotate-90 text-muted-foreground sm:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1 py-1">
                <span className="truncate text-sm font-semibold">
                  {[user?.firstName, user?.lastName]
                    .filter(Boolean)
                    .join(' ') || user?.username || 'User'}
                </span>

                <span className="truncate text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate('/api-tokens')}>
                <Key className="mr-2 h-4 w-4" />
                API Tokens
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
