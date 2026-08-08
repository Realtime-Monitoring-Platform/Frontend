import { create } from "zustand";

interface useUpdateTeanntModalStore {
  isOpen: boolean;
  id?:string;
  onOpen: () => void;
  onClose: () => void;
  type?: "edit" | "create";
  setId: (id:string) => void;
}

const useUpdateTeanntModal = create<useUpdateTeanntModalStore>((set) => ({
  isOpen: false,
  id: undefined,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setId: (id:string) => set({id}),
  type: "create"
}));

export default useUpdateTeanntModal;