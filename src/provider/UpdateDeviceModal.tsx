import useUpdateTeamsModal from "@/hooks/useUpdateTeamsModal";
import Modal from "./Modal";
import UpdateTeamForm from "./UpdateTeamForm";
import useUpdateDeviceModal from "@/hooks/useUpdateDeviceModal";
import UpdateDeviceForm from "./UpdateDeviceForm";

const UpdateDeviceModal = () => {
    const { isOpen, onOpen, onClose } = useUpdateDeviceModal();
  return (
    <Modal
      title="Mettre à jour un appareil"
      description="Modifiez les informations de l'appareil et assignez-lui des permissions"
      isOpen={isOpen}
      onChange={onClose}
    >
      <UpdateDeviceForm />
    </Modal>
  );
};


export default UpdateDeviceModal;