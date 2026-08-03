import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  Users,
  Router,
  Bell,
  BarChart3,
  Settings,
  Shield,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '@/types';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  roles: UserRole[];
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: '/dashboard',
    roles: ['PLATFORM_ADMIN', 'TENANT_ADMIN', 'EMBEDDED_ENGINEER', 'OPERATOR', 'VIEWER'],
  },
  {
    label: 'Tenants',
    icon: <Building className="h-5 w-5" />,
    path: '/tenants',
    roles: ['PLATFORM_ADMIN'],
  },
  {
    label: 'Users',
    icon: <Users className="h-5 w-5" />,
    path: '/users',
    roles: ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
  },
  {
    label: 'Roles & Permissions',
    icon: <Shield className="h-5 w-5" />,
    path: '/roles',
    roles: ['PLATFORM_ADMIN'],
  },
  {
    label: 'Devices',
    icon: <Router className="h-5 w-5" />,
    path: '/devices',
    roles: ['PLATFORM_ADMIN', 'TENANT_ADMIN', 'EMBEDDED_ENGINEER'],
  },
  {
    label: 'Alerts',
    icon: <Bell className="h-5 w-5" />,
    path: '/alerts',
    roles: ['PLATFORM_ADMIN', 'TENANT_ADMIN', 'EMBEDDED_ENGINEER', 'OPERATOR'],
  },
  {
    label: 'Monitoring',
    icon: <BarChart3 className="h-5 w-5" />,
    path: '/monitoring',
    roles: ['OPERATOR', 'EMBEDDED_ENGINEER', 'TENANT_ADMIN', 'VIEWER'],
  },
  {
    label: 'Reports',
    icon: <BarChart3 className="h-5 w-5" />,
    path: '/reports',
    roles: ['PLATFORM_ADMIN', 'TENANT_ADMIN', 'VIEWER'],
  },
  {
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    path: '/settings',
    roles: ['PLATFORM_ADMIN', 'TENANT_ADMIN'],
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

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleToggle = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const filteredItems = sidebarItems.filter((item) =>
    user?.roles.some((role) => item.roles.includes(role.name as UserRole))
  );

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-primary">IoT Platform</h2>
        {isMobile && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <nav className="flex-1 overflow-y-auto p-2">
        {filteredItems.map((item) => (
          <div key={item.label}>
            <div
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                item.path && location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => item.path && handleNavigate(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.children && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(item.label);
                  }}
                >
                  {expandedItems.includes(item.label) ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>

            {item.children && expandedItems.includes(item.label) && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map((child) => (
                  <div
                    key={child.label}
                    className={`rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                      child.path && location.pathname === child.path
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => child.path && handleNavigate(child.path)}
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <Separator />

      <div className="p-4">
        <p className="text-xs text-muted-foreground">v1.0.0</p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {open && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <div
      className={`flex-shrink-0 border-r bg-card transition-all duration-300 ${
        open ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      {sidebarContent}
    </div>
  );
};
