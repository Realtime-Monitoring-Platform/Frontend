import { create } from "zustand";
import type { User } from "@/types";

interface UpdateUserModalStore {
  isOpen: boolean;
  onOpen: () => void;
  setId: (id:string) => void;
  onClose: () => void;
  user: User | null;
  id: string | null;
}

const useUpdateUserModal = create<UpdateUserModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  user: null,
    id: null,
    setId: (id) => set({ id }),
}));

export default useUpdateUserModal;
