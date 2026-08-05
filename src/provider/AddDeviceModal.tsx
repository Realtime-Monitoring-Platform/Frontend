"use client";

import React from "react";
import Modal from "./Modal";
import useAddDeviceModal from "@/hooks/useAddDeviceModal";
import AddDeviceForm from "./AddDeviceForm";

const AddDeviceModal = () => {
  const { isOpen, onOpen, onClose } = useAddDeviceModal();
  return (
    <Modal
      title="Ajouter un appareil"
      description="Enregistrez un nouvel appareil dans le système"
      isOpen={isOpen}
      onChange={onClose}
    >
      <AddDeviceForm />
    </Modal>
  );
};

export default AddDeviceModal;