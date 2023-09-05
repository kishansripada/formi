import { create } from "zustand";
import { cloudSettings, dancer, formation, item, prop, segment } from "../../../types/types";
import { liveblocks } from "@liveblocks/zustand";
import type { WithLiveblocks } from "@liveblocks/zustand";
import { Status, createClient } from "@liveblocks/client";
interface Store {
   isMobileView: boolean;
   setIsMobileView: (isMobileView: boolean) => void;

   selectedFormation: number | null;
   setSelectedFormation: (index: number | null) => void;

   // segment
   segments: segment[];
   setSegments: (segments: segment[]) => void;
   updateSegmentProperty: (id: string, propertyKey: keyof segment, value: any) => void;

   // dancer
   dancers: dancer[];
   setDancers: (dancers: dancer[]) => void;

   // formation
   formations: formation[];
   setFormations: (formations: formation[]) => void;
   //    updateDancerProperty: (id: string, propertyKey: keyof dancer, value: any) => void;

   selectedFormations: string[];
   setSelectedFormations: (selectedFormations: string[]) => void;

   props: prop[];
   setProps: (props: prop[]) => void;

   items: item[];
   setItems: (items: item[]) => void;

   cloudSettings: cloudSettings;
   setCloudSettings: (cloudSettings: cloudSettings) => void;

   viewOnly: boolean;
   setViewOnly: (viewOnly: boolean) => void;

   danceName: string;
   setDanceName: (danceName: string) => void;

   nameOrEmail: string;
   setNameOrEmail: (nameOrEmail: string) => void;

   commandHeld: boolean;
   setCommandHeld: (commandHeld: boolean) => void;

   selectedDancers: string[];
   setSelectedDancers: (selectedDancers: string[]) => void;

   getFirstSelectedFormation: () => formation | undefined;
   getPreviousFormation: () => formation | undefined;

   incrementSelectedFormation: () => void;
   decrementSelectedFormation: () => void;
   getSelectedFormationIndex: () => number | null;

   position: number;
   setPosition: (position: number) => void;

   soundCloudTrackId: string | null;
   setSoundCloudTrackId: (soundCloudTrackId: string | null) => void;
   pauseHistory: () => void;
   resumeHistory: () => void;
   get: () => Store; // For direct state retrieval
}

const PUBLIC_KEY = "pk_prod_3E8sI-8PR2FYB3__NcQ9YdEwhDyOKWvtC317Wo-fRSOQBCJBD4cmubrnKN8NE4bI";
const client = createClient({
   // publicApiKey: PUBLIC_KEY,
   authEndpoint: "/api/liveblocks-auth",
});

type Presence = {
   selectedFormations: string[];
   nameOrEmail: string;
   selectedDancers: string[];
   position: number;
};

export const useStore = create<WithLiveblocks<Store, Presence>>(
   liveblocks(
      (set, get) => ({
         isMobileView: false,
         setIsMobileView: (isMobileView: boolean) => set({ isMobileView }),

         selectedFormation: 0,

         selectedDancers: [],
         setSelectedDancers: (selectedDancers: string[]) => set({ selectedDancers }),

         selectedFormations: [],
         setSelectedFormations: (selectedFormations: string[]) => set({ selectedFormations }),

         segments: [],
         setSegments: (segments: segment[]) => {
            // if (get().viewOnly) return;
            set({ segments });
         },
         updateSegmentProperty: (id: string, propertyKey: keyof segment, value: any) => {
            // if (get().viewOnly) return;
            const updatedSegments = get().segments.map((seg) => {
               if (seg.id === id) {
                  return { ...seg, [propertyKey]: value };
               }
               return seg;
            });
            set({ segments: updatedSegments });
         },

         //dancers
         dancers: [],

         setDancers: (dancers) => {
            // if (get().viewOnly) return;
            set({ dancers });
         },

         formations: [],
         setFormations: (formations: formation[]) => {
            // if (get().viewOnly) return;
            set({ formations });
         },

         props: [],
         setProps: (props: prop[]) => {
            // if (get().viewOnly) return;
            set({ props });
         },

         items: [],
         setItems: (items: item[]) => {
            // if (get().viewOnly) return;
            set({ items });
         },

         cloudSettings: {
            stageDimensions: { width: 40, height: 32 },
            horizontalFineDivisions: 4,
            verticalFineDivisions: 4,
            gridSubdivisions: 8,
            horizontalGridSubdivisions: 4,
         },
         setCloudSettings: (cloudSettings: cloudSettings) => {
            // if (get().viewOnly) return;
            set({ cloudSettings });
         },

         soundCloudTrackId: null,
         setSoundCloudTrackId: (soundCloudTrackId: string | null) => {
            // if (get().viewOnly) return;
            set({ soundCloudTrackId });
         },

         viewOnly: false,
         setViewOnly: (viewOnly: boolean) => set({ viewOnly }),

         getFirstSelectedFormation: (formations?: formation[]) => {
            formations = formations || get().formations;
            if (get().selectedFormations.length === 1) {
               return formations.find((formation) => formation.id === get().selectedFormations[0]);
            } else {
               return formations[Math.min(...get().selectedFormations.map((id: string) => formations.findIndex((formation) => formation.id === id)))];
            }
         },

         getPreviousFormation: () => {
            const selectedFormation = get().selectedFormations[0];
            const index = get().formations.findIndex((formation) => formation.id === selectedFormation);
            return get().formations[index - 1];
         },

         incrementSelectedFormation: () => {
            const selectedFormationId =
               get().formations[
                  Math.min(...get().selectedFormations.map((id: string) => get().formations.findIndex((formation) => formation.id === id)))
               ]?.id;
            if (!selectedFormationId) return;
            const index = get().formations.findIndex((formation) => formation.id === selectedFormationId);
            const formationToSelect = get().formations[index + 1]?.id;
            if (!formationToSelect) return;
            set({ selectedFormations: [formationToSelect] });
         },

         decrementSelectedFormation: () => {
            const selectedFormationId =
               get().formations[
                  Math.min(...get().selectedFormations.map((id: string) => get().formations.findIndex((formation) => formation.id === id)))
               ]?.id;
            if (!selectedFormationId) return;
            const index = get().formations.findIndex((formation) => formation.id === selectedFormationId);
            const formationToSelect = get().formations[index - 1]?.id;
            if (!formationToSelect) return;
            set({ selectedFormations: [formationToSelect] });
         },

         getSelectedFormationIndex: () => {
            const selectedFormationId =
               get().formations[
                  Math.min(...get().selectedFormations.map((id: string) => get().formations.findIndex((formation) => formation.id === id)))
               ]?.id;
            if (!selectedFormationId) return null;
            return get().formations.findIndex((formation) => formation.id === selectedFormationId);
         },

         danceName: "",
         setDanceName: (danceName: string) => {
            // if (get().viewOnly) return;
            set({ danceName });
         },

         commandHeld: false,
         setCommandHeld: (commandHeld: boolean) => set({ commandHeld }),

         nameOrEmail: "",
         setNameOrEmail: (nameOrEmail: string) => set({ nameOrEmail }),

         position: 0,
         setPosition: (position: number) => set({ position }),

         pauseHistory: () => {
            const room = get().liveblocks.room!;
            room.history.pause();
         },
         resumeHistory: () => {
            const room = get().liveblocks.room!;
            room.history.resume();
         },
         get,
      }),
      {
         client,
         presenceMapping: {
            selectedFormations: true,
            nameOrEmail: true,
            selectedDancers: true,
            position: true,
         },
         storageMapping: {
            formations: true,
            segments: true,
            dancers: true,
            danceName: true,
            props: true,
            items: true,
            cloudSettings: true,
            soundCloudTrackId: true,
         },
      }
   )
);
