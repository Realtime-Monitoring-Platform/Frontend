import { create } from "zustand";

interface UpdateRoleModalStore {
  isOpen: boolean;
  id?:string;
  onOpen: () => void;
  onClose: () => void;
  type?: "edit" | "create";
  setId: (id:string) => void;
}

const useUpdateRoleModal = create<UpdateRoleModalStore>((set) => ({
  isOpen: false,
  id: undefined,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setId: (id:string) => set({id}),
  type: "create"
}));

export default useUpdateRoleModal;