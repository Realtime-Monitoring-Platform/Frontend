"use client";

import React from "react";
import Modal from "./Modal";
import useAddUserModal from "@/hooks/useAddUserModal";
import AddUserForm from "./AddUserForm";
import { DialogContent } from "@radix-ui/react-dialog";
import useUpdateUserModal from "@/hooks/useUpdateUserModal";
import UpdateUserForm from "./UpdateUserForm";


const UpdateUserModal = () => {
  const { isOpen, onOpen, onClose } = useUpdateUserModal();
  return (
    <Modal
      isOpen={isOpen}
      onChange={() => onClose()}
      title="Mettre à jour un utilisateur"
      description="Trouvez et mettez à jour vos utilisateurs en quelques clics"
    >
      <UpdateUserForm />
    </Modal>
  );
};

export default UpdateUserModal;