import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { Spinner } from '@/components/ui/spinner';
import { CookiesProvider } from 'react-cookie';
// Auth Pages
import { LoginPage } from './features/auth/pages';
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

// Protected Route Component  
export const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

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

  // if (allowedRoles && user && !allowedRoles.some(role => user.roles.some(r => r.name === role))) {
  //   return <Navigate to="/auth/forbidden" replace />;
  // }

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

  const DashboardComponent = dashboardMap[user.role.name || ''] || null;
  return DashboardComponent ? <DashboardComponent /> : <Navigate to="/auth/forbidden" replace />;
};

// App Routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
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
          //<ProtectedRoute>
          <Layout />
          //</ProtectedRoute>
        }
      >
        <Route index element={<RoleDashboard />} />
        <Route path="dashboard" element={<RoleDashboard />} />

        {/* Platform Admin Routes */}
        <Route path="tenants" element={<TenantListPage />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="roles" element={<RoleListPage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />

        {/* Tenant Admin Routes */}
        <Route path="teams" element={<TeamListPage />} />
        <Route path="devices" element={<DeviceListPage />} />
        <Route path="devices/:id" element={<DeviceDetailsPage />} />
        <Route path="alerts" element={<AlertCenterPage />} />
        <Route path="reports" element={<ReportsPage />} />

        {/* Embedded Engineer Routes */}
        <Route path="my-devices" element={<DeviceListPage />} />

        {/* Operator Routes */}
        <Route path="monitoring" element={<MonitoringPage />} />

        {/* Viewer Routes */}
        <Route path="reports" element={<ReportsPage />} />

        {/* Shared Routes */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="ai" element={<AIDashboardPage />} />
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
