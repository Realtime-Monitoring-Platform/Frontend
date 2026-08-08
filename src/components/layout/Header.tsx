
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  User,
  Settings,
  Key,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '../../hooks/useAuth';
import { useCustomTheme } from '@/styles/ThemeProvider';
import { useQuery } from '@tanstack/react-query';
import { getMyNotifications, getUnredNotificationsCount } from '@/services/notificationAction';

interface HeaderProps {
  onMenuClick: () => void;
}

 const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useCustomTheme();
  const { user, logout } = useAuth();

  const { data: notifs } = useQuery({
    queryFn: getMyNotifications,
    queryKey: ['my-notifications'],
  });

  const { data: unreadNotificationsCount } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: getUnredNotificationsCount,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleApiTokensClick = () => {
    navigate('/api-tokens');
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const hasUnread = unreadNotificationsCount && unreadNotificationsCount > 0;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between border-b bg-card px-4 shadow-sm"
      style={{ width: 'calc(100% - 260px)', marginLeft: '260px' }}
    >
      {/* Mobile Sidebar Trigger Toggle */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      )}

      <div className="flex items-center gap-1 ml-auto">
        {/* Theme Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
              >
                {mode === 'light' ? (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Switch to {mode === 'light' ? 'dark' : 'light'} mode
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* ACCESSIBLE ACCORDION/DROPDOWN NOTIFICATIONS */}
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                    aria-label={`Notifications. ${hasUnread ? `${unreadNotificationsCount} unread` : 'No unread notifications'}`}
                  >
                    <Bell className="h-4 w-4" aria-hidden="true" />
                    {hasUnread && (
                      <span 
                        className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground"
                        aria-hidden="true"
                      >
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenuContent align="end" className="w-80 p-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="font-medium text-sm">Notifications</span>
              <button 
                type="button"
                className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
                onClick={() => console.log('Marking all read')}
              >
                Mark all as read
              </button>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {notifs?.length === 0 ? (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifs?.map((notif: any) => (
                  <div key={notif.id} className="px-2 py-2 hover:bg-muted/50 rounded-sm transition-colors mb-1">
                    <p className="font-medium text-sm text-foreground">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1 text-[10px]">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
            <DropdownMenuSeparator />
            <div 
              role="button"
              tabIndex={0}
              className="px-2 py-1.5 text-center text-sm text-primary font-medium hover:underline cursor-pointer rounded"
              onClick={() => navigate('/notifications')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/notifications')}
            >
              View all notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-1 rounded-full"
              aria-label="User account options"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="font-medium leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-muted-foreground font-normal">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" aria-hidden="true" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleApiTokensClick}>
                <Key className="mr-2 h-4 w-4" aria-hidden="true" />
                API Tokens
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
