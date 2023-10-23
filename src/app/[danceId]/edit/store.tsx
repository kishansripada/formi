import { create } from "zustand";
import { cloudSettings, dancer, dancerPosition, formation, item, prop, segment } from "../../../types/types";
import { liveblocks } from "@liveblocks/zustand";
import type { WithLiveblocks } from "@liveblocks/zustand";
import { Status, createClient } from "@liveblocks/client";
import { v4 as uuidv4 } from "uuid";
interface Store {
   copiedPositions: dancerPosition[];
   setCopiedPositions: (copiedPositions: dancerPosition[]) => void;

   copySelectedPositions: () => void;
   pasteCopiedPositions: () => void;
   splitSelectedFormations: () => void;

   isMobileView: boolean;
   setIsMobileView: (isMobileView: boolean) => void;

   selectedFormation: number | null;
   setSelectedFormation: (index: number | null) => void;

   // segment
   segments: segment[];
   setSegments: (segments: segment[]) => void;
   updateSegmentProperty: (id: string, propertyKey: keyof segment, value: any) => void;

   imageBlobs: any;
   setImageBlobs: (imageBlobs: any) => void;

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

   deleteSelectedFormations: () => void;
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
         copiedPositions: [],
         setCopiedPositions: (copiedPositions: dancerPosition[]) => set({ copiedPositions }),

         copySelectedPositions: () => {
            const { selectedDancers, getFirstSelectedFormation, selectedFormations } = get();

            if (!selectedFormations.length) return;
            set({
               copiedPositions:
                  getFirstSelectedFormation()?.positions?.filter((dancerPosition) =>
                     selectedDancers.length ? selectedDancers.includes(dancerPosition.id) : true
                  ) || [],
            });
         },
         pasteCopiedPositions: () => {
            const { selectedFormations, copiedPositions, formations } = get();
            if (!selectedFormations.length) return;
            if (!copiedPositions) return;
            set({
               formations: formations.map((formation, i) => {
                  if (selectedFormations.includes(formation.id)) {
                     return {
                        ...formation,
                        positions: [
                           ...formation.positions.filter((dancerPosition) => {
                              return !copiedPositions.map((dancerPositionCopy: dancerPosition) => dancerPositionCopy.id).includes(dancerPosition.id);
                           }),
                           ...copiedPositions,
                        ],
                     };
                  }
                  return formation;
               }),
            });
         },
         splitSelectedFormations: () => {
            const { selectedFormations, pauseHistory, resumeHistory } = get();
            if (!selectedFormations.length) return;
            pauseHistory();
            selectedFormations.forEach((selectedFormationId) => {
               const selectedFormation = get().formations.findIndex((formation) => formation.id === selectedFormationId);
               const lastIsSelected = selectedFormation === get().formations.length - 1;
               let oldTotalDuration =
                  get().formations[selectedFormation].durationSeconds + get().formations[selectedFormation].transition.durationSeconds;

               if (selectedFormation === 0) {
                  let oldTotalDuration = get().formations[selectedFormation].durationSeconds;
                  set({
                     formations: [
                        {
                           ...get().formations[selectedFormation],
                           durationSeconds: 0,
                           durationSeconds: oldTotalDuration / (lastIsSelected ? 1 : 2),
                           transition: {
                              durationSeconds: 0,
                           },
                        },
                        {
                           ...get().formations[selectedFormation],
                           id: uuidv4(),
                           name: get().formations[selectedFormation].name + " copy",
                           durationSeconds: 0,
                           transition: {
                              durationSeconds: oldTotalDuration / (lastIsSelected ? 1 : 2),
                           },
                        },
                        ...get().formations.slice(selectedFormation + 1),
                     ],
                  });
                  return;
               }

               set({
                  formations: [
                     ...get().formations.slice(0, selectedFormation),
                     {
                        ...get().formations[selectedFormation],
                        durationSeconds: 0,
                        transition: {
                           durationSeconds: oldTotalDuration / (lastIsSelected ? 1 : 2),
                        },
                     },
                     {
                        ...get().formations[selectedFormation],
                        id: uuidv4(),
                        name: get().formations[selectedFormation].name + " copy",
                        durationSeconds: 0,
                        transition: {
                           durationSeconds: oldTotalDuration / (lastIsSelected ? 1 : 2),
                        },
                     },
                     ...get().formations.slice(selectedFormation + 1),
                  ],
               });
            });
            resumeHistory();
         },

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

         imageBlobs: {},
         setImageBlobs: (imageBlobs: any) => {
            // if (get().viewOnly) return;
            set({ imageBlobs });
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

         danceName: "initialName",
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

         deleteSelectedFormations: () => {
            const { pauseHistory, selectedFormations, resumeHistory, formations } = get();
            if (!selectedFormations.length || formations.length === 1) return;
            pauseHistory();

            selectedFormations.forEach((selectedFormationId) => {
               if (selectedFormationId === formations[0].id) {
                  set({
                     formations: get().formations.map((formation, index) => {
                        if (index === 1) {
                           return {
                              ...formation,
                              durationSeconds: formation.transition.durationSeconds + formation.durationSeconds + formations[0].durationSeconds,
                           };
                        }
                        return formation;
                     }),
                  });
               } else if (selectedFormationId !== get().formations[get().formations.length - 1].id) {
                  // console.log("trigger");
                  set({
                     formations: get().formations.map((formation, index) => {
                        if (index === formations.findIndex((formation) => formation.id === selectedFormationId) - 1) {
                           return {
                              ...formation,
                              durationSeconds:
                                 formation.durationSeconds +
                                 get().formations.find((formation) => formation.id === selectedFormationId)?.transition.durationSeconds +
                                 get().formations.find((formation) => formation.id === selectedFormationId).durationSeconds,
                           };
                        }
                        return formation;
                     }),
                  });
               }
            });

            set({ selectedFormations: [] });
            // remove the formation
            set({
               formations: get().formations.filter((formation) => {
                  return !selectedFormations.includes(formation.id);
               }),
            });
            resumeHistory();
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
