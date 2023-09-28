import { create } from "zustand";
import { cloudSettings, dancer, formation, item, prop, segment } from "../../../types/types";
import { liveblocks } from "@liveblocks/zustand";
import type { WithLiveblocks } from "@liveblocks/zustand";
import { Status, createClient } from "@liveblocks/client";
interface Store {
   plan: string | null;
   setPlan: (plan: string | null) => void;

   numberOfDances: number;
   setNumberOfDances: (numberOfDances: number) => void;
}

export const useStore = create<Store>((set, get) => ({
   plan: null,
   setPlan: (plan: string | null) => set({ plan }),

   numberOfDances: 0,
   setNumberOfDances: (numberOfDances: number) => set({ numberOfDances }),
}));
