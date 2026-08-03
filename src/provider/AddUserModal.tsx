"use client";

import React from "react";
import Modal from "./Modal";
import useAddUserModal from "@/hooks/useAddUserModal";
import AddUserForm from "./AddUserForm";
import { DialogContent } from "@radix-ui/react-dialog";


const AddUserModal = () => {
  const { isOpen, onOpen, onClose } = useAddUserModal();
  return (
    <Modal
      isOpen={isOpen}
      onChange={() => onClose()}
      title="Ajouter un utilisateur"
      description="Trouvez et mettez à jour vos utilisateurs en quelques clics"
    >
      <AddUserForm />
    </Modal>
  );
};

export default AddUserModal;