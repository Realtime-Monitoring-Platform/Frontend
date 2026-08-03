import { create } from "zustand";

interface AddUserModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  type?: "edit" | "create";
}

const useAddUserModal = create<AddUserModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  type: "create",
}));

export default useAddUserModal;