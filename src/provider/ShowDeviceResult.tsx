import useShowDeviceResult from "@/hooks/useShowDeviceResult";
import Modal from "./Modal";
import DeviceResultDetails from "./DeviceResultDetails";

const ShowDeviceResult = () => {
    const { isOpen, onOpen, onClose, device } = useShowDeviceResult();
  return (
    <Modal
      title="Device Details"
      description="View the details of the selected device"
      isOpen={isOpen}
      onChange={onClose}
    >
      <DeviceResultDetails device={device!} />
    </Modal>
  );
};


export default ShowDeviceResult;