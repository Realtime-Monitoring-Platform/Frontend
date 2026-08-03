import { create } from "zustand";

interface AddPermissionModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  type?: "edit" | "create";
}

const useAddPermissionModal = create<AddPermissionModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  type: "create",
}));

export default useAddPermissionModal;