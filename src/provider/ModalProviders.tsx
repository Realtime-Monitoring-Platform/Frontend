
import React from "react";
import AddUserModal from "./AddUserModal";
import AddRoleModal from "./AddRoleModal";
import AddTeamModal from "./AddTeamModal";
import AddTenantModal from "./AddTenantModal";
import AddPermissionModal from "./AddPermissionModal";
import AddDeviceModal from "./AddDeviceModal";
import UpdateUserModal from "./UpdateUserModal";
import UpdateRoleModal from "./UpdateRoleModal";
import UpdateTeamModal from "./UpdateTeamModal";
import UpdateTenantModal from "./UpdateTenantModal";
import UpdateDeviceModal from "./UpdateDeviceModal";

const ModalProviders = () => {
  return (
    <>
      <AddUserModal />
      <AddRoleModal />
      <AddTeamModal />
      <AddTenantModal />
      <UpdateTenantModal/>
      <AddPermissionModal />
      <UpdateDeviceModal/>
      <AddDeviceModal />
      <UpdateUserModal/>
      <UpdateRoleModal/>
      <UpdateTeamModal/>
    </>
  );
};

export default ModalProviders;
