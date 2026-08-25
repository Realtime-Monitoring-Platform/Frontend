
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
import { RoleEnum } from './types';


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


const TenantListPage = lazy(
  () => import('./features/tenants/pages/TenantListPage')
);

const TenantDetailsPage = lazy(
  () => import('./features/tenants/pages/TenantDetailsPage')
);

const UserListPage = lazy(
  () => import('./features/users/pages/UserListPage')
);


const RoleListPage = lazy(
  () => import('./features/roles/pages/RoleListPage')
);


const PermissionsPage = lazy(
  () => import('./features/admin/pages/PermissionsPage')
);

const AuditLogsPage = lazy(
  () => import('./features/admin/pages/AuditLogsPage')
);


const TeamListPage = lazy(
  () => import('./features/teams/pages/TeamListPage')
);

const DeviceListPage = lazy(
  () => import('./features/devices/pages/DeviceListPage')
);

const DeviceDetailsPage = lazy(
  () => import('./features/devices/pages/DeviceDetailsPage')
);


const AlertCenterPage = lazy(
  () => import('./features/alerts/pages/AlertCenterPage')
);

const ReportsPage = lazy(
  () => import('./features/reports/pages/ReportsPage')
);


const MonitoringPage = lazy(
  () => import('./features/monitoring/pages/MonitoringPage')
);


const ProfilePage = lazy(
  () => import('./features/profile/pages/ProfilePage')
);


const SettingsPage = lazy(
  () => import('./features/settings/pages/SettingsPage')
);


const AIDashboardPage = lazy(
  () => import('./features/ai/pages/AIDashboardPage')
);


const NotificationsPage = lazy(
  () => import('./features/notifications/pages/NotificationsPage')
);



const PageLoader = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner />
    </div>
  );
};



export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isLoading } = useAuth();


  if (isLoading) {
    return <PageLoader />;
  }


  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};



const PermissionRoute = ({
  children,
  requiredPermissions,
}: {
  children: React.ReactNode;
  requiredPermissions?: string[];
}) => {
  const { hasPermission } = useAuth();


  if (!requiredPermissions || requiredPermissions.length === 0) {
    return <>{children}</>;
  }


  const hasAccess = requiredPermissions.some((permission) =>
    hasPermission(permission)
  );

  if (!hasAccess) {
    return <Navigate to="/auth/forbidden" replace />;
  }

  return <>{children}</>;
};



// const RoleDashboard = () => {
//   const { user } = useAuth();
//   console.log('RoleDashboard user:', user);
//   console.log('RoleDashboard role:', user?.role);
//   if (!user) {
//     return null;
//   }
//   const dashboardMap: Record<
//     RoleEnum,
//     React.LazyExoticComponent<React.ComponentType>
//   > = {
//     [RoleEnum.PLATFORM_ADMIN]: PlatformAdminDashboard,
//     [RoleEnum.TENANT_ADMIN]: TenantAdminDashboard,
//     [RoleEnum.EMBEDDED_ENGINEER]: EmbeddedEngineerDashboard,
//     [RoleEnum.OPERATOR]: OperatorDashboard,
//     [RoleEnum.VIEWER]: ViewerDashboard,
//   };

//   const role = user.role as RoleEnum;

//   const DashboardComponent = dashboardMap[role];

//   if (!DashboardComponent) {
//     return <Navigate to="/auth/forbidden" replace />;
//   }

//   return <DashboardComponent />;
// };

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>


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


        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >


          <Route
            index
            element={<ViewerDashboard />}
          />

          <Route
            path="dashboard"
            element={<ViewerDashboard />}
          />


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
            path="tenants/:id"
            element={
              <PermissionRoute
                requiredPermissions={[
                  'TENANT_READ',
                  'TENANT_UPDATE',
                ]}
              >
                <TenantDetailsPage />
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


        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </Suspense>
  );
};


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

