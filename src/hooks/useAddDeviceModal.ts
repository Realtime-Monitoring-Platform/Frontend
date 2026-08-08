import { create } from "zustand";

interface AddDeviceModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  type?: "edit" | "create";
}

const useAddDeviceModal = create<AddDeviceModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  type: undefined,
}));

export default useAddDeviceModal;