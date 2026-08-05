import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { Spinner } from '@/components/ui/spinner';
import { CookiesProvider } from 'react-cookie';
// Auth Pages
import { LoginPage } from './features/auth/pages';
import { ChangePasswordPage } from './features/auth/pages';
import { ForgotPasswordPage } from './features/auth/pages';
import { ResetPasswordPage } from './features/auth/pages';
import { ActivateAccountPage } from './features/auth/pages';
import { SessionExpiredPage } from './features/auth/pages';
import { UnauthorizedPage } from './features/auth/pages';
import { ForbiddenPage } from './features/auth/pages';

// Dashboard Pages
import { PlatformAdminDashboard } from './features/dashboard/pages';
import { TenantAdminDashboard } from './features/dashboard/pages';
import { EmbeddedEngineerDashboard } from './features/dashboard/pages';
import { OperatorDashboard } from './features/dashboard/pages';
import { ViewerDashboard } from './features/dashboard/pages';

// Feature Pages
import { TenantListPage } from './features/tenants/pages';
import { UserListPage } from './features/users/pages';
import { RoleListPage } from './features/roles/pages';
import { PermissionsPage, AuditLogsPage } from './features/admin/pages';
import { TeamListPage } from './features/teams/pages';
import { DeviceListPage, DeviceDetailsPage } from './features/devices/pages';
import { AlertCenterPage } from './features/alerts/pages';
import { ReportsPage } from './features/reports/pages';
import { MonitoringPage } from './features/monitoring/pages';
import { ProfilePage } from './features/profile/pages';
import { SettingsPage } from './features/settings/pages';
import { AIDashboardPage } from './features/ai/pages';
import ModalProviders from './provider/ModalProviders';
import QueryProvider from './providers/QueryProvider';
import ToastProviders from './providers/ToastProviders';


export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};


const PermissionRoute = ({ children, requiredPermissions }: { children: React.ReactNode; requiredPermissions?: string[] }) => {
  const { hasPermission } = useAuth();

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = requiredPermissions.some(permission => hasPermission(permission));
    if (!hasAccess) {
      return <Navigate to="/auth/forbidden" replace />;
    }
  }

  return <>{children}</>;
};

// Role-based Dashboard Route
const RoleDashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const dashboardMap: Record<string, React.ComponentType> = {
    'PLATFORM_ADMIN': PlatformAdminDashboard,
    'TENANT_ADMIN': TenantAdminDashboard,
    'EMBEDDED_ENGINEER': EmbeddedEngineerDashboard,
    'OPERATOR': OperatorDashboard,
    'VIEWER': ViewerDashboard,
  };

  const roleName = typeof user.role === 'string' ? user.role : user.role?.name || '';
  const DashboardComponent = dashboardMap[roleName] || null;
  return DashboardComponent ? <DashboardComponent /> : <Navigate to="/auth/forbidden" replace />;
};

// App Routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/change-password" element={<ChangePasswordPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/activate" element={<ActivateAccountPage />} />
      <Route path="/auth/session-expired" element={<SessionExpiredPage />} />
      <Route path="/auth/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/auth/forbidden" element={<ForbiddenPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleDashboard />} />
        <Route path="dashboard" element={<RoleDashboard />} />

        {/* Platform Admin Routes */}
        <Route path="tenants" element={
          <PermissionRoute requiredPermissions={['TENANT_READ', 'TENANT_CREATE', 'TENANT_UPDATE', 'TENANT_DELETE']}>
            <TenantListPage />
          </PermissionRoute>
        } />
        <Route path="users" element={
          <PermissionRoute requiredPermissions={['USER_READ', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE']}>
            <UserListPage />
          </PermissionRoute>
        } />
        <Route path="roles" element={
          <PermissionRoute requiredPermissions={['ROLE_READ', 'ROLE_CREATE', 'ROLE_UPDATE', 'ROLE_DELETE']}>
            <RoleListPage />
          </PermissionRoute>
        } />
        <Route path="permissions" element={
          <PermissionRoute requiredPermissions={['PERMISSION_READ', 'PERMISSION_ASSIGN']}>
            <PermissionsPage />
          </PermissionRoute>
        } />
        <Route path="audit-logs" element={
          <PermissionRoute requiredPermissions={['SYSTEM_LOGS_READ']}>
            <AuditLogsPage />
          </PermissionRoute>
        } />

        {/* Tenant Admin Routes */}
        <Route path="teams" element={
          <PermissionRoute requiredPermissions={['TEAM_READ', 'TEAM_CREATE', 'TEAM_UPDATE', 'TEAM_DELETE']}>
            <TeamListPage />
          </PermissionRoute>
        } />
        <Route path="devices" element={
          <PermissionRoute requiredPermissions={['DEVICE_READ', 'DEVICE_CREATE', 'DEVICE_UPDATE', 'DEVICE_DELETE']}>
            <DeviceListPage />
          </PermissionRoute>
        } />
        <Route path="devices/:id" element={
          <PermissionRoute requiredPermissions={['DEVICE_READ']}>
            <DeviceDetailsPage />
          </PermissionRoute>
        } />
        <Route path="alerts" element={
          <PermissionRoute requiredPermissions={['ALERT_READ', 'ALERT_ACKNOWLEDGE', 'ALERT_UPDATE']}>
            <AlertCenterPage />
          </PermissionRoute>
        } />
        <Route path="reports" element={
          <PermissionRoute requiredPermissions={['REPORT_READ', 'REPORT_GENERATE']}>
            <ReportsPage />
          </PermissionRoute>
        } />

        {/* Embedded Engineer Routes */}
        <Route path="my-devices" element={
          <PermissionRoute requiredPermissions={['DEVICE_READ', 'DEVICE_COMMAND']}>
            <DeviceListPage />
          </PermissionRoute>
        } />

        {/* Operator Routes */}
        <Route path="monitoring" element={
          <PermissionRoute requiredPermissions={['MONITORING_READ']}>
            <MonitoringPage />
          </PermissionRoute>
        } />

        {/* Viewer Routes */}
        <Route path="reports" element={
          <PermissionRoute requiredPermissions={['REPORT_READ']}>
            <ReportsPage />
          </PermissionRoute>
        } />

        {/* Shared Routes */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={
          <PermissionRoute requiredPermissions={['SYSTEM_CONFIG_READ', 'SYSTEM_CONFIG_UPDATE']}>
            <SettingsPage />
          </PermissionRoute>
        } />
        <Route path="ai" element={
          <PermissionRoute requiredPermissions={['AI_READ', 'AI_ANALYZE']}>
            <AIDashboardPage />
          </PermissionRoute>
        } />
      </Route>

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <QueryProvider>
      <ToastProviders />
      <CookiesProvider>
        <AuthProvider>
          <Router>
            <ModalProviders />
            <AppRoutes />
          </Router>
        </AuthProvider>
      </CookiesProvider>

    </QueryProvider>
  );
};

export default App;
