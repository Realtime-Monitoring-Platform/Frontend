
import { Spinner } from "@/components/ui/spinner";
import { lazy, Suspense } from "react";
import ShowDeviceResult from "./ShowDeviceResult";



const AddUserModal = lazy(() => import('./AddUserModal'));
const UpdateUserModal = lazy(() => import('./UpdateUserModal'));
const AddTenantModal = lazy(() => import('./AddTenantModal'));
const AddPermissionModal = lazy(() => import('./AddPermissionModal'));
const UpdateDeviceModal = lazy(() => import('./UpdateDeviceModal'));
const AddDeviceModal = lazy(() => import('./AddDeviceModal'));
const UpdateTenantModal = lazy(() => import('./UpdateTenantModal'));
const UpdateRoleModal = lazy(() => import('./UpdateRoleModal'));
const UpdateTeamModal = lazy(() => import('./UpdateTeamModal'));
const AddRoleModal = lazy(() => import('./AddRoleModal'));
const AddTeamModal = lazy(() => import('./AddTeamModal'));
const ModalProviders = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <AddUserModal />
      <AddRoleModal />
      <AddTeamModal />
      <AddTenantModal />
      <UpdateTenantModal />
      <AddPermissionModal />
      <UpdateDeviceModal />
      <ShowDeviceResult />
      <AddDeviceModal />
      <UpdateUserModal />
      <UpdateRoleModal />
      <UpdateTeamModal />
    </Suspense>
    
  );
};

export default ModalProviders;
