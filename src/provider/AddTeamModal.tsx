"use client";

import React from "react";
import Modal from "./Modal";
import useAddTeamModal from "@/hooks/useAddTeamModal";
import AddTeamForm from "./AddTeamForm";

const AddTeamModal = () => {
  const { isOpen, onOpen, onClose } = useAddTeamModal();
  return (
    <Modal
      title="Ajouter une équipe"
      description="Créez une nouvelle équipe et assignez un responsable"
      isOpen={isOpen}
      onChange={onClose}
    >
      <AddTeamForm />
    </Modal>
  );
};

export default AddTeamModal;