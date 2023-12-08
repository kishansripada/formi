import { create } from "zustand";

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
