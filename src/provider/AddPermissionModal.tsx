"use client";

import React from "react";
import Modal from "./Modal";
import useAddPermissionModal from "@/hooks/useAddPermissionModal";
import AddPermissionForm from "./AddPermissionForm";

const AddPermissionModal = () => {
  const { isOpen, onOpen, onClose } = useAddPermissionModal();
  return (
    <Modal
      title="Ajouter une permission"
      description="Créez une nouvelle permission pour le système"
      isOpen={isOpen}
      onChange={onClose}
    >
      <AddPermissionForm />
    </Modal>
  );
};

export default AddPermissionModal;