import { create } from "zustand";

interface AddTenantModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  type?: "edit" | "create";
}

const useAddTenantModal = create<AddTenantModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  type: "create",
}));

export default useAddTenantModal;