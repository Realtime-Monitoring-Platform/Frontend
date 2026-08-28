import useUpdateTeamsModal from "@/hooks/useUpdateTeamsModal";
import Modal from "./Modal";

import useUpdateProfileModal from "@/hooks/useUpdateProfileModal";
import UpdateProfileForm from "./UpdateProfileForm";

const UpdateProfileModal = () => {
    const { isOpen, onOpen, onClose } = useUpdateProfileModal();
  return (
    <Modal
      title="Mettre à jour le profil"
      description="Modifiez les informations de votre profil"
      isOpen={isOpen}
      onChange={onClose}
    >
      <UpdateProfileForm />
    </Modal>
  );
};


export default UpdateProfileModal;