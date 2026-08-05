"use client";

import React from "react";
import Modal from "./Modal";
import useAddRoleModal from "@/hooks/useAddRoleModal";
import AddRoleForm from "./AddRoleForm";

const AddRoleModal = () => {
  const { isOpen, onOpen, onClose } = useAddRoleModal();
  return (
    <Modal
      title="Ajouter un rôle"
      description="Créez un nouveau rôle et assignez-lui des permissions"
      isOpen={isOpen}
      onChange={onClose}
    >
      <AddRoleForm />
    </Modal>
  );
};

export default AddRoleModal;  