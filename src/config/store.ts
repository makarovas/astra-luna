import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_NETWORK } from "./networks";

interface ShuttlePortState {
  currentNetworkId: string;
  switchNetwork: (network: string) => void;
}

export const useShuttlePortStore = create<ShuttlePortState>()(
  persist(
    (set) => ({
      currentNetworkId: DEFAULT_NETWORK.chainId,
      switchNetwork: (network: string) => set({ currentNetworkId: network }),
    }),
    {
      name: "shuttle-port",
    },
  ),
);
