import { create } from "zustand";

interface useUpdateDeviceModalStore {
  isOpen: boolean;
  id?:string;
  onOpen: () => void;
  onClose: () => void;
  type?: "edit" | "create";
  setId: (id:string) => void;
}

const useUpdateDeviceModal = create<useUpdateDeviceModalStore>((set) => ({
  isOpen: false,
  id: undefined,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setId: (id:string) => set({id}),
  type: "create"
}));

export default useUpdateDeviceModal;