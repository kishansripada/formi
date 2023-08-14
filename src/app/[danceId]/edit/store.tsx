import { create } from "zustand";
import { cloudSettings, dancer, formation, item, prop, segment } from "../../../types/types";
import { liveblocks } from "@liveblocks/zustand";
import type { WithLiveblocks } from "@liveblocks/zustand";
import { Status, createClient } from "@liveblocks/client";
interface Store {
   selectedFormation: number | null;
   setSelectedFormation: (index: number) => void;

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

   selectedDancers: string[];
   setSelectedDancers: (selectedDancers: string[]) => void;

   soundCloudTrackId: string | null;
   setSoundCloudTrackId: (soundCloudTrackId: string | null) => void;
   pauseHistory: () => void;
   resumeHistory: () => void;
   get: () => Store; // For direct state retrieval
}

const PUBLIC_KEY = "pk_dev_Tj6498ayxCG_YGzc7BawbV50IZp-ouOzm1JHemImjmSG2n6T_GMU9OEOQnCH7lB0";
const client = createClient({
   publicApiKey: PUBLIC_KEY,
});

type Presence = {
   selectedFormation: number | null;
   nameOrEmail: string;
   selectedDancers: string[];
};

export const useStore = create<WithLiveblocks<Store, Presence>>(
   liveblocks(
      (set, get) => ({
         selectedFormation: 0,
         // segments
         setSelectedFormation: (index: number | null) => {
            const room = get().liveblocks.room!;
            room.history.pause();
            room.updatePresence({ selectedFormation: index }, { addToHistory: true });
            // set({ isDragging: true });
         },

         segments: [],
         setSegments: (segments: segment[]) => set({ segments }),
         updateSegmentProperty: (id: string, propertyKey: keyof segment, value: any) => {
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
         setDancers: (dancers) => set({ dancers }),

         formations: [],
         setFormations: (formations: formation[]) => set({ formations }),

         props: [],
         setProps: (props: prop[]) => set({ props }),

         items: [],
         setItems: (items: item[]) => set({ items }),

         cloudSettings: {
            stageDimensions: { width: 40, height: 32 },
            horizontalFineDivisions: 4,
            verticalFineDivisions: 4,
            gridSubdivisions: 8,
            horizontalGridSubdivisions: 4,
         },
         setCloudSettings: (cloudSettings: cloudSettings) => set({ cloudSettings }),

         soundCloudTrackId: null,
         setSoundCloudTrackId: (soundCloudTrackId: string | null) => set({ soundCloudTrackId }),

         viewOnly: true,
         setViewOnly: (viewOnly: boolean) => set({ viewOnly }),

         selectedDancers: [],
         setSelectedDancers: (selectedDancers: string[]) => set({ selectedDancers }),

         danceName: "",
         setDanceName: (danceName: string) => set({ danceName }),

         nameOrEmail: "",
         setNameOrEmail: (nameOrEmail: string) => set({ nameOrEmail }),

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
         presenceMapping: { selectedFormation: true, nameOrEmail: true, selectedDancers: true },
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
