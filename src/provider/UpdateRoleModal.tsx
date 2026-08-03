"use client";

import React from "react";
import Modal from "./Modal";
import useAddRoleModal from "@/hooks/useAddRoleModal";
import AddRoleForm from "./AddRoleForm";
import useUpdateRoleForm from "@/hooks/useUpdateRoleModal";
import UpdateRoleForm from "./UpdateRoleForm";

const UpdateRoleModal = () => {
  const { isOpen, onOpen, onClose } = useUpdateRoleForm();
  return (
    <Modal
      title="Mettre à jour un rôle"
      description="Modifiez les informations du rôle et assignez-lui des permissions"
      isOpen={isOpen}
      onChange={onClose}
    >
      <UpdateRoleForm />
    </Modal>
  );
};

export default UpdateRoleModal;  