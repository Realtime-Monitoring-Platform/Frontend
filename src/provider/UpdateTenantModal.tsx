import useUpdateTeamsModal from "@/hooks/useUpdateTeamsModal";
import Modal from "./Modal";
import UpdateTeamForm from "./UpdateTeamForm";
import UpdateTenantForm from "./UpdateTenantForm";
import useUpdateTeanntModal from "@/hooks/useUpdateTeanntModal";

const UpdateTenantModal = () => {
    const { isOpen, onOpen, onClose } = useUpdateTeanntModal();
  return (
    <Modal
      title="Mettre à jour un tenant"
      description="Modifiez les informations du tenant et assignez-lui des permissions"
      isOpen={isOpen}
      onChange={onClose}
    >
      <UpdateTenantForm />
    </Modal>
  );
};


export default UpdateTenantModal;