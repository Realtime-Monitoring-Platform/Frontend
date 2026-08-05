import useUpdateTeamsModal from "@/hooks/useUpdateTeamsModal";
import Modal from "./Modal";
import UpdateTeamForm from "./UpdateTeamForm";

const UpdateTeamModal = () => {
    const { isOpen, onOpen, onClose } = useUpdateTeamsModal();
  return (
    <Modal
      title="Mettre à jour un équipe"
      description="Modifiez les informations de l'équipe et assignez-lui des permissions"
      isOpen={isOpen}
      onChange={onClose}
    >
      <UpdateTeamForm />
    </Modal>
  );
};


export default UpdateTeamModal;