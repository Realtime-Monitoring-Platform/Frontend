import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  Key,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useCustomTheme();
  const { user, logout } = useAuth();

  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/auth/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    handleMenuClose();
  };

  const handleApiTokensClick = () => {
    navigate('/api-tokens');
    handleMenuClose();
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between border-b bg-card px-4 shadow-sm"
      style={{ width: 'calc(100% - 260px)', marginLeft: '260px' }}
    >
      {/* Menu toggle for mobile */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Search Bar */}
      {/* <div
        className="flex flex-1 items-center rounded-md border border-input bg-background px-3 py-1.5 cursor-pointer"
        onClick={() => navigate('/search')}
      >
        <Search className="h-4 w-4 text-muted-foreground mr-2" />
        <Input
          placeholder="Search (Ctrl+K)"
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          readOnly
        />
      </div> */}

      <div className="flex items-center gap-1 ml-auto">
        {/* Theme Toggle */}
       <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {mode === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Switch to {mode === 'light' ? 'dark' : 'light'} mode
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> 

        {/* Notifications */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleNotificationMenuOpen}>
                <Badge variant="secondary" className="relative h-4 w-4 rounded-full">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                    3
                  </span>
                </Badge>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-1">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
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
                <p className="text-sm text-muted-foreground">
                  {user?.email}
                </p>
                {/* <p className="text-xs text-muted-foreground">
                  {user?.roles[0]?.name.replace('ROLE_', '')}
                </p> */}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleApiTokensClick}>
                <Key className="mr-2 h-4 w-4" />
                API Tokens
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Notifications Menu (inline) */}
      {notificationAnchor && (
        <div className="fixed inset-0 z-50" onClick={handleMenuClose}>
          <div
            className="absolute right-14 top-14 w-80 rounded-md border bg-popover p-2 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="font-medium">Notifications</span>
              <span className="text-xs text-primary cursor-pointer">Mark all as read</span>
            </div>
            <div className="my-1 h-px bg-border" />
            <div className="px-2 py-1.5">
              <p className="font-medium text-sm">Critical Alert: Device XYZ</p>
              <p className="text-xs text-muted-foreground">CPU temperature exceeds 90°C</p>
              <p className="text-xs text-muted-foreground">2 minutes ago</p>
            </div>
            <div className="px-2 py-1.5">
              <p className="font-medium text-sm">Command Completed</p>
              <p className="text-xs text-muted-foreground">Restart service on Device ABC</p>
              <p className="text-xs text-muted-foreground">15 minutes ago</p>
            </div>
            <div className="px-2 py-1.5">
              <p className="font-medium text-sm">Device Offline</p>
              <p className="text-xs text-muted-foreground">Sensor Array A1 is offline</p>
              <p className="text-xs text-muted-foreground">1 hour ago</p>
            </div>
            <div className="my-1 h-px bg-border" />
            <div className="px-2 py-1.5 text-center text-sm text-primary cursor-pointer">
              View all notifications
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
