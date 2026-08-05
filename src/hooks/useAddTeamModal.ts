import { create } from "zustand";

interface AddTeamModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  type?: "edit" | "create";
}

const useAddTeamModal = create<AddTeamModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  type: "create",
}));

export default useAddTeamModal;