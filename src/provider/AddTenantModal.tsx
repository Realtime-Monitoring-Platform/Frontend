"use client";

import React from "react";
import Modal from "./Modal";
import useAddTenantModal from "@/hooks/useAddTenantModal";
import AddTenantForm from "./AddTenantForm";

const AddTenantModal = () => {
  const { isOpen, onOpen, onClose } = useAddTenantModal();
  return (
    <Modal
      title="Ajouter un tenant"
      description="Créez un nouveau tenant pour votre organisation"
      isOpen={isOpen}
      onChange={onClose}
    >
      <AddTenantForm />
    </Modal>
  );
};

export default AddTenantModal;