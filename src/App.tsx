
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { AuthProvider, useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { Spinner } from '@/components/ui/spinner';
import { CookiesProvider } from 'react-cookie';

import ModalProviders from './provider/ModalProviders';
import QueryProvider from './providers/QueryProvider';
import ToastProviders from './providers/ToastProviders';

/**
 * ============================================================
 * Lazy-loaded pages
 * ============================================================
 *
 * Each page is loaded only when the corresponding route
 * is accessed.
 *
 * Recommended: each page should use `export default`.
 * Example:
 *
 * export default function TenantListPage() {
 *   return (...);
 * }
 */

/* ============================================================
 * Auth Pages
 * ============================================================ */

const LoginPage = lazy(
  () => import('./features/auth/pages/LoginPage')
);

const ChangePasswordPage = lazy(
  () => import('./features/auth/pages/ChangePasswordPage')
);

const ForgotPasswordPage = lazy(
  () => import('./features/auth/pages/ForgotPasswordPage')
);

const ResetPasswordPage = lazy(
  () => import('./features/auth/pages/ResetPasswordPage')
);

const ActivateAccountPage = lazy(
  () => import('./features/auth/pages/ActivateAccountPage')
);

const SessionExpiredPage = lazy(
  () => import('./features/auth/pages/SessionExpiredPage')
);

const UnauthorizedPage = lazy(
  () => import('./features/auth/pages/UnauthorizedPage')
);

const ForbiddenPage = lazy(
  () => import('./features/auth/pages/ForbiddenPage')
);

/* ============================================================
 * Dashboard Pages
 * ============================================================ */

const PlatformAdminDashboard = lazy(
  () => import('./features/dashboard/pages/PlatformAdminDashboard')
);

const TenantAdminDashboard = lazy(
  () => import('./features/dashboard/pages/TenantAdminDashboard')
);

const EmbeddedEngineerDashboard = lazy(
  () => import('./features/dashboard/pages/EmbeddedEngineerDashboard')
);

const OperatorDashboard = lazy(
  () => import('./features/dashboard/pages/OperatorDashboard')
);

const ViewerDashboard = lazy(
  () => import('./features/dashboard/pages/ViewerDashboard')
);

/* ============================================================
 * Tenant Pages
 * ============================================================ */

const TenantListPage = lazy(
  () => import('./features/tenants/pages/TenantListPage')
);

/* ============================================================
 * User Pages
 * ============================================================ */

const UserListPage = lazy(
  () => import('./features/users/pages/UserListPage')
);

/* ============================================================
 * Role Pages
 * ============================================================ */

const RoleListPage = lazy(
  () => import('./features/roles/pages/RoleListPage')
);

/* ============================================================
 * Admin Pages
 * ============================================================ */

const PermissionsPage = lazy(
  () => import('./features/admin/pages/PermissionsPage')
);

const AuditLogsPage = lazy(
  () => import('./features/admin/pages/AuditLogsPage')
);

/* ============================================================
 * Team Pages
 * ============================================================ */

const TeamListPage = lazy(
  () => import('./features/teams/pages/TeamListPage')
);

/* ============================================================
 * Device Pages
 * ============================================================ */

const DeviceListPage = lazy(
  () => import('./features/devices/pages/DeviceListPage')
);

const DeviceDetailsPage = lazy(
  () => import('./features/devices/pages/DeviceDetailsPage')
);

/* ============================================================
 * Alert Pages
 * ============================================================ */

const AlertCenterPage = lazy(
  () => import('./features/alerts/pages/AlertCenterPage')
);

/* ============================================================
 * Report Pages
 * ============================================================ */

const ReportsPage = lazy(
  () => import('./features/reports/pages/ReportsPage')
);

/* ============================================================
 * Monitoring Pages
 * ============================================================ */

const MonitoringPage = lazy(
  () => import('./features/monitoring/pages/MonitoringPage')
);

/* ============================================================
 * Profile Pages
 * ============================================================ */

const ProfilePage = lazy(
  () => import('./features/profile/pages/ProfilePage')
);

/* ============================================================
 * Settings Pages
 * ============================================================ */

const SettingsPage = lazy(
  () => import('./features/settings/pages/SettingsPage')
);

/* ============================================================
 * AI Pages
 * ============================================================ */

const AIDashboardPage = lazy(
  () => import('./features/ai/pages/AIDashboardPage')
);

/* ============================================================
 * Notifications
 * ============================================================ */

const NotificationsPage = lazy(
  () => import('./features/notifications/pages/NotificationsPage')
);

/**
 * ============================================================
 * Page Loader
 * ============================================================
 */

const PageLoader = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner />
    </div>
  );
};

/**
 * ============================================================
 * Protected Route
 * ============================================================
 */

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  /**
   * Authentication state is still being determined.
   */
  if (isLoading) {
    return <PageLoader />;
  }

  /**
   * User is not authenticated.
   */
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

/**
 * ============================================================
 * Permission Route
 * ============================================================
 */

const PermissionRoute = ({
  children,
  requiredPermissions,
}: {
  children: React.ReactNode;
  requiredPermissions?: string[];
}) => {
  const { hasPermission } = useAuth();

  /**
   * No permissions required.
   */
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  /**
   * User needs at least one of the required permissions.
   */
  const hasAccess = requiredPermissions.some((permission) =>
    hasPermission(permission)
  );

  if (!hasAccess) {
    return <Navigate to="/auth/forbidden" replace />;
  }

  return <>{children}</>;
};

/**
 * ============================================================
 * Role Dashboard
 * ============================================================
 */

const RoleDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const dashboardMap: Record<
    string,
    React.LazyExoticComponent<React.ComponentType>
  > = {
    PLATFORM_ADMIN: PlatformAdminDashboard,
    TENANT_ADMIN: TenantAdminDashboard,
    EMBEDDED_ENGINEER: EmbeddedEngineerDashboard,
    OPERATOR: OperatorDashboard,
    VIEWER: ViewerDashboard,
  };

  const roleName =
    typeof user.role === 'string'
      ? user.role
      : user.role?.name || '';

  const DashboardComponent = dashboardMap[roleName];

  /**
   * Unknown or unsupported role.
   */
  if (!DashboardComponent) {
    return <Navigate to="/auth/forbidden" replace />;
  }

  return <DashboardComponent />;
};

/**
 * ============================================================
 * Application Routes
 * ============================================================
 */

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ====================================================
            Authentication Routes
        ==================================================== */}

        <Route
          path="/auth/login"
          element={<LoginPage />}
        />

        <Route
          path="/auth/change-password"
          element={<ChangePasswordPage />}
        />

        <Route
          path="/auth/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/auth/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route
          path="/auth/activate"
          element={<ActivateAccountPage />}
        />

        <Route
          path="/auth/session-expired"
          element={<SessionExpiredPage />}
        />

        <Route
          path="/auth/unauthorized"
          element={<UnauthorizedPage />}
        />

        <Route
          path="/auth/forbidden"
          element={<ForbiddenPage />}
        />

        {/* ====================================================
            Protected Application
        ==================================================== */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          {/* ==================================================
              Dashboard
          ================================================== */}

          <Route
            index
            element={<RoleDashboard />}
          />

          <Route
            path="dashboard"
            element={<RoleDashboard />}
          />

          {/* ==================================================
              Platform Admin
          ================================================== */}

          <Route
            path="tenants"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'TENANT_READ',
                  'TENANT_CREATE',
                  'TENANT_UPDATE',
                  'TENANT_DELETE',
                ]}
              >
                <TenantListPage />
              </PermissionRoute>
            }
          />

          <Route
            path="users"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'USER_READ',
                  'USER_CREATE',
                  'USER_UPDATE',
                  'USER_DELETE',
                ]}
              >
                <UserListPage />
              </PermissionRoute>
            }
          />

          <Route
            path="roles"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'ROLE_READ',
                  'ROLE_CREATE',
                  'ROLE_UPDATE',
                  'ROLE_DELETE',
                ]}
              >
                <RoleListPage />
              </PermissionRoute>
            }
          />

          <Route
            path="permissions"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'PERMISSION_READ',
                  'PERMISSION_ASSIGN',
                ]}
              >
                <PermissionsPage />
              </PermissionRoute>
            }
          />

          <Route
            path="audit-logs"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'SYSTEM_LOGS_READ',
                ]}
              >
                <AuditLogsPage />
              </PermissionRoute>
            }
          />

          {/* ==================================================
              Tenant Admin
          ================================================== */}

          <Route
            path="teams"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'TEAM_READ',
                  'TEAM_CREATE',
                  'TEAM_UPDATE',
                  'TEAM_DELETE',
                ]}
              >
                <TeamListPage />
              </PermissionRoute>
            }
          />

          <Route
            path="devices"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'DEVICE_READ',
                  'DEVICE_CREATE',
                  'DEVICE_UPDATE',
                  'DEVICE_DELETE',
                ]}
              >
                <DeviceListPage />
              </PermissionRoute>
            }
          />

          <Route
            path="devices/:id"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'DEVICE_READ',
                ]}
              >
                <DeviceDetailsPage />
              </PermissionRoute>
            }
          />

          <Route
            path="notifications"
            element={<NotificationsPage />}
          />

          <Route
            path="alerts"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'ALERT_READ',
                  'ALERT_ACKNOWLEDGE',
                  'ALERT_UPDATE',
                ]}
              >
                <AlertCenterPage />
              </PermissionRoute>
            }
          />

          <Route
            path="reports"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'REPORT_READ',
                ]}
              >
                <ReportsPage />
              </PermissionRoute>
            }
          />

          {/* ==================================================
              Embedded Engineer
          ================================================== */}

          <Route
            path="my-devices"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'DEVICE_READ',
                  'DEVICE_COMMAND',
                ]}
              >
                <DeviceListPage />
              </PermissionRoute>
            }
          />

          {/* ==================================================
              Operator
          ================================================== */}

          <Route
            path="monitoring"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'DEVICE_READ',
                ]}
              >
                <MonitoringPage />
              </PermissionRoute>
            }
          />

          {/* ==================================================
              Shared
          ================================================== */}

          <Route
            path="profile"
            element={<ProfilePage />}
          />

          <Route
            path="settings"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'SYSTEM_CONFIG_READ',
                  'SYSTEM_CONFIG_UPDATE',
                ]}
              >
                <SettingsPage />
              </PermissionRoute>
            }
          />

          <Route
            path="ai"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'AI_READ',
                  'AI_ANALYZE',
                ]}
              >
                <AIDashboardPage />
              </PermissionRoute>
            }
          />

        </Route>

        {/* ====================================================
            Catch All
        ==================================================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </Suspense>
  );
};

/**
 * ============================================================
 * Main Application
 * ============================================================
 */

const App = () => {
  return (
    <Router>
      <CookiesProvider>
        <AuthProvider>
          <QueryProvider>
            <ToastProviders />
            <ModalProviders />
            <AppRoutes />
          </QueryProvider>
        </AuthProvider>
      </CookiesProvider>
    </Router>
  );
};

export default App;

