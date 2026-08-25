import { DeviceResponse } from "@/types";
import { create } from "zustand";

interface ShowDeviceResult {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  //setDevice: (device: DeviceResponse) => void;
    setDevice:(device:DeviceResponse)=> void;
  device:DeviceResponse | undefined;
}

const useShowDeviceResult = create<ShowDeviceResult>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  device: undefined,
  setDevice: (device:DeviceResponse) => set({device})
}));

export default useShowDeviceResult;