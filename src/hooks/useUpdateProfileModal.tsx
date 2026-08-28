import { create } from "zustand";

interface UpdateProfileModal {
  isOpen: boolean;
  id?:string;
  onOpen: () => void;
  onClose: () => void;
 
}

const useUpdateProfileModal = create<UpdateProfileModal>((set) => ({
  isOpen: false,
  id: undefined,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  
}));

export default useUpdateProfileModal;