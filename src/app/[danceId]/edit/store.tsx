import { create } from "zustand";
import { cloudSettings, dancer, dancerPosition, formation, item, prop, segment } from "../../../types/types";
import { liveblocks } from "@liveblocks/zustand";
import type { WithLiveblocks } from "@liveblocks/zustand";
import { Status, createClient } from "@liveblocks/client";
import { v4 as uuidv4 } from "uuid";
interface Store {
   copiedPositions: { from: string | null; positions: dancerPosition[] };
   setCopiedPositions: (copiedPositions: { from: string | null; positions: dancerPosition[] }) => void;

   copySelectedPositions: () => void;
   pasteCopiedPositions: () => void;

   isMobileView: boolean;
   setIsMobileView: (isMobileView: boolean) => void;

   selectedFormation: number | null;
   setSelectedFormation: (index: number | null) => void;

   // segment
   segments: segment[];
   setSegments: (segments: segment[]) => void;
   updateSegmentProperty: (id: string, propertyKey: keyof segment, value: any) => void;
   newSegment: () => void;

   imageBlobs: any;
   setImageBlobs: (imageBlobs: any) => void;

   // dancer
   dancers: dancer[];
   setDancers: (dancers: dancer[]) => void;

   // formation
   formations: formation[];
   setFormations: (formations: formation[]) => void;
   newGroupOnSelectedFormation: () => string;
   setSelectedPositionProperty: (propertyKey: keyof dancerPosition, value: any) => void;
   getSelectedPositionsProperty: (propertyKey: keyof dancerPosition) => string;
   deleteSelectedFormations: () => void;
   splitSelectedFormations: () => void;
   deleteGroup: (groupId: string) => void;

   selectedFormations: string[];
   setSelectedFormations: (selectedFormations: string[]) => void;
   incrementSelectedFormation: () => void;
   decrementSelectedFormation: () => void;
   getSelectedFormationIndex: () => number | null;
   getFirstSelectedFormation: () => formation | undefined;
   getPreviousFormation: () => formation | undefined;

   props: prop[];
   setProps: (props: prop[]) => void;

   hoveringDancerIds: string[];
   setHoveringDancerIds: (hoveringDancerIds: string[]) => void;

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

   shiftHeld: boolean;
   setShiftHeld: (shiftHeld: boolean) => void;

   selectedDancers: string[];
   setSelectedDancers: (selectedDancers: string[]) => void;

   position: number;
   setPosition: (position: number) => void;

   soundCloudTrackId: string | null;
   setSoundCloudTrackId: (soundCloudTrackId: string | null) => void;

   pauseHistory: () => void;
   resumeHistory: () => void;

   player: any;
   setPlayer: (player: any) => void;

   newFormationFromLast: () => void;

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
         hoveringDancerIds: [],
         setHoveringDancerIds: (hoveringDancerIds: string[]) => set({ hoveringDancerIds }),

         copiedPositions: { from: null, positions: [] },
         setCopiedPositions: (copiedPositions: { from: string | null; positions: dancerPosition[] }) => set({ copiedPositions }),

         copySelectedPositions: () => {
            const { selectedDancers, getFirstSelectedFormation, selectedFormations } = get();

            if (!selectedFormations.length) return;

            set({
               copiedPositions: {
                  from: getFirstSelectedFormation()?.id,
                  positions:
                     getFirstSelectedFormation()?.positions?.filter((dancerPosition) =>
                        selectedDancers.length ? selectedDancers.includes(dancerPosition.id) : true
                     ) || [],
               },
            });
         },
         pasteCopiedPositions: () => {
            const { selectedFormations, copiedPositions, formations, getFirstSelectedFormation } = get();

            if (!selectedFormations.length) return;

            if (!copiedPositions.positions || !copiedPositions.from) return;
            const originFormation = formations.find((formation) => formation.id === copiedPositions.from);
            const targetFormation = getFirstSelectedFormation();

            const originGroupIds = [
               ...new Set(
                  (copiedPositions.positions || [])
                     .map((copiedPosition) => copiedPosition.groupId)
                     .filter((groupId) => groupId !== null && groupId !== undefined)
               ),
            ];

            const groupsToTransfer = originGroupIds
               .filter((groupId) => !(targetFormation?.groups || []).map((group) => group.id).includes(groupId))
               .map((groupId) => (originFormation?.groups || [])?.find((group) => group.id === groupId))
               .filter((group) => group);

            set({
               formations: formations.map((formation) => {
                  if (selectedFormations.includes(formation.id)) {
                     return {
                        ...formation,
                        positions: [
                           ...formation.positions.filter((dancerPosition) => {
                              return !copiedPositions.positions
                                 .map((dancerPositionCopy: dancerPosition) => dancerPositionCopy.id)
                                 .includes(dancerPosition.id);
                           }),
                           ...copiedPositions.positions,
                        ],
                        groups: [...(formation.groups || []), ...(groupsToTransfer || [])],
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
               const selectedFormationIndex = get().formations.findIndex((formation) => formation.id === selectedFormationId);
               const formationAtIndex = get().formations[selectedFormationIndex];
               if (formationAtIndex === undefined) return;
               const isLastFormationSelected = selectedFormationIndex === get().formations.length - 1;

               let oldTotalDuration = formationAtIndex.durationSeconds + formationAtIndex.transition.durationSeconds;

               if (selectedFormationIndex === 0) {
                  let oldTotalDuration = formationAtIndex.durationSeconds;
                  set({
                     formations: [
                        {
                           ...formationAtIndex,
                           durationSeconds: oldTotalDuration / (isLastFormationSelected ? 1 : 2),
                           transition: {
                              durationSeconds: 0,
                           },
                        },
                        {
                           ...formationAtIndex,
                           id: uuidv4(),
                           name: formationAtIndex.name + " copy",
                           durationSeconds: 0,
                           transition: {
                              durationSeconds: oldTotalDuration / (isLastFormationSelected ? 1 : 2),
                           },
                        },
                        ...get().formations.slice(selectedFormationIndex + 1),
                     ],
                  });
                  return;
               }

               set({
                  formations: [
                     ...get().formations.slice(0, selectedFormationIndex),
                     {
                        ...formationAtIndex,
                        durationSeconds: isLastFormationSelected ? formationAtIndex.durationSeconds : 0,
                        transition: {
                           durationSeconds: isLastFormationSelected ? formationAtIndex.transition.durationSeconds : oldTotalDuration / 2,
                        },
                     },
                     {
                        ...formationAtIndex,
                        id: uuidv4(),
                        name: formationAtIndex.name + " copy",
                        durationSeconds: isLastFormationSelected ? formationAtIndex.durationSeconds : 0,
                        transition: {
                           durationSeconds: isLastFormationSelected ? formationAtIndex.transition.durationSeconds : oldTotalDuration / 2,
                        },
                     },
                     ...get().formations.slice(selectedFormationIndex + 1),
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
            set({ segments });
         },
         updateSegmentProperty: (id: string, propertyKey: keyof segment, value: any) => {
            const updatedSegments = get().segments.map((seg) => {
               if (seg.id === id) {
                  return { ...seg, [propertyKey]: value };
               }
               return seg;
            });
            set({ segments: updatedSegments });
         },
         newSegment: () => {
            const { segments } = get();
            set({
               segments: [
                  ...segments,
                  {
                     name: `Segment ${segments.length + 1}`,
                     duration: 10,
                     color: getRandomColorWithMaxHueDistance(segments.map((segment) => segment.color)),
                     id: uuidv4(),
                  },
               ],
            });
         },

         dancers: [],
         setDancers: (dancers) => {
            set({ dancers });
         },

         formations: [],
         setFormations: (formations: formation[]) => {
            set({ formations });
         },
         newGroupOnSelectedFormation: () => {
            const { selectedFormations, formations } = get();
            const groupId = uuidv4();

            set({
               formations: formations.map((formation: formation) => {
                  if (selectedFormations.includes(formation.id)) {
                     return {
                        ...formation,
                        groups: [
                           ...(formation?.groups || []),
                           {
                              name: `Group ${(formation?.groups?.length || 0) + 1}`,
                              id: groupId,
                              color: getRandomColorWithMaxHueDistance(formation?.groups.map((group) => group?.color)),
                           },
                        ],
                     };
                  }
                  return formation;
               }),
            });
            return groupId;
         },
         newFormationFromLast: (keepGroups: boolean) => {
            const { formations } = get();

            set({
               formations: [
                  ...formations,
                  {
                     ...formations[formations.length - 1],
                     id: uuidv4(),
                     name: `Formation ${formations.length + 1}`,
                     positions: formations[formations.length - 1]?.positions.map((dancer: dancerPosition) => {
                        return {
                           ...dancer,
                           transitionType: "linear",
                        };
                     }),
                     comments: [],
                     notes: "",
                     groups: keepGroups ? formations[formations.length - 1]?.groups : [],
                  },
               ],
            });
            set({ selectedFormations: [formations[formations.length - 1]?.id] });
         },
         deleteGroup: (groupId: string) => {
            // delete group and remove group id from all dancers in that group and unhover all dancers
            const { formations, selectedFormations } = get();

            set({
               formations: formations.map((formation) => {
                  if (selectedFormations.includes(formation.id)) {
                     return {
                        ...formation,
                        groups: (formation?.groups || []).filter((groupx) => groupId !== groupx.id),
                        positions: formation.positions.map((position) => {
                           if (position.groupId === groupId) {
                              return { ...position, groupId: null };
                           }
                           return position;
                        }),
                     };
                  }
                  return formation;
               }),
               hoveringDancerIds: [],
            });
         },
         getFirstSelectedFormation: () => {
            const { formations, selectedFormations } = get();

            if (selectedFormations.length === 1) {
               return formations.find((formation) => formation.id === selectedFormations[0]);
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
            const { getSelectedFormationIndex, goToFormation, formations, selectedFormations } = get();
            if (!selectedFormations.length || getSelectedFormationIndex() === formations.length - 1) return;
            goToFormation(formations[getSelectedFormationIndex() + 1]?.id);
         },

         decrementSelectedFormation: () => {
            const { getSelectedFormationIndex, goToFormation, formations, selectedFormations } = get();
            if (!selectedFormations.length || getSelectedFormationIndex() === 0) return;
            goToFormation(formations[getSelectedFormationIndex() - 1]?.id);
         },

         getSelectedFormationIndex: () => {
            const selectedFormationId =
               get().formations[
                  Math.min(...get().selectedFormations.map((id: string) => get().formations.findIndex((formation) => formation.id === id)))
               ]?.id;
            if (!selectedFormationId) return null;
            return get().formations.findIndex((formation) => formation.id === selectedFormationId);
         },
         setSelectedPositionProperty: (propertyKey: keyof dancerPosition, value: any) => {
            const { selectedDancers, selectedFormations, formations } = get();
            if (!selectedDancers.length || !selectedFormations.length) return;

            set({
               formations: formations.map((formation) => {
                  if (selectedFormations.includes(formation.id)) {
                     return {
                        ...formation,
                        positions: formation.positions.map((position) => {
                           if (selectedDancers.includes(position.id)) {
                              return { ...position, [propertyKey]: value };
                           }
                           return position;
                        }),
                     };
                  }
                  return formation;
               }),
            });
         },

         getSelectedPositionsProperty: (propertyKey: keyof dancerPosition) => {
            const { selectedDancers, selectedFormations, formations, items } = get();
            if (!selectedDancers.length || !selectedFormations.length) return;
            const properties = formations
               .filter((formation: formation) => selectedFormations.includes(formation.id))
               .map((formation: formation) => formation.positions)
               .flat()
               .filter((dancerPosition: dancerPosition) => selectedDancers.includes(dancerPosition.id))
               .map((dancerPosition: dancerPosition) => dancerPosition[propertyKey]);

            if (properties.every((val) => val === null || val === undefined)) {
               return null;
            }
            if (properties.every((val) => val === properties[0])) {
               if (propertyKey === "itemId") {
                  return items.find((item) => item.id === properties[0])?.name || "Error";
               }

               return properties[0];
            }
            return "Mixed";
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

         props: [],
         setProps: (props: prop[]) => {
            set({ props });
         },

         items: [],
         setItems: (items: item[]) => {
            set({ items });
         },

         player: null,
         setPlayer: (player: any) => {
            set({ player });
         },
         goToFormation: (formationId: string) => {
            const { formations, songDuration, player } = get();
            const index = formations.findIndex((formation) => formation.id === formationId);
            let position = formations
               .map((formation, i) => formation.durationSeconds + (i === 0 ? 0 : formation.transition.durationSeconds))
               .slice(0, index)
               .reduce((a, b) => a + b, 0);

            set({ position, selectedFormations: [formationId] });
            if (!(songDuration && player) || position > songDuration / 1000) return;
            player.seekTo(Math.min(Math.max(0, position / (songDuration / 1000)), 1));
         },

         imageBlobs: {},
         setImageBlobs: (imageBlobs: any) => {
            set({ imageBlobs });
         },

         cloudSettings: {
            stageDimensions: { width: 40, height: 32 },
            horizontalFineDivisions: 4,
            verticalFineDivisions: 4,
            gridSubdivisions: 8,
            horizontalGridSubdivisions: 4,
            stageBackground: "gridfluid",
            collisionRadius: 1,
         },
         setCloudSettings: (cloudSettings: cloudSettings) => {
            set({ cloudSettings });
         },

         soundCloudTrackId: null,
         setSoundCloudTrackId: (soundCloudTrackId: string | null) => {
            set({ soundCloudTrackId });
         },

         viewOnly: false,
         setViewOnly: (viewOnly: boolean) => set({ viewOnly }),

         danceName: "initialName",
         setDanceName: (danceName: string) => {
            set({ danceName });
         },

         commandHeld: false,
         setCommandHeld: (commandHeld: boolean) => set({ commandHeld }),

         shiftHeld: false,
         setShiftHeld: (shiftHeld: boolean) => set({ shiftHeld }),

         nameOrEmail: "",
         setNameOrEmail: (nameOrEmail: string) => set({ nameOrEmail }),

         position: 0,
         setPosition: (position: number) => set({ position }),

         songDuration: null,
         setSongDuration: (songDuration: number | null) => set({ songDuration }),

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

function hslToHex(h, s, l) {
   l /= 100;
   const a = (s * Math.min(l, 1 - l)) / 100;
   const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
         .toString(16)
         .padStart(2, "0");
   };
   return `#${f(0)}${f(8)}${f(4)}`;
}

function hueDistance(hue1: number, hue2: number) {
   var diff = Math.abs(hue1 - hue2);
   return Math.min(diff, 360 - diff);
}

function getRandomColorWithMaxHueDistance(existingColors: string[]) {
   const saturation = 50;
   const lightness = 57;
   const existingHues = existingColors.map((color) => hexToHSL(color).h);

   if (existingHues.length === 0) {
      var randomHue = Math.floor(Math.random() * 360);
      return hslToHex(randomHue, saturation, lightness);
   }
   var maxDistance = 0;
   var furthestHue = 0;

   for (var i = 0; i < 360; i++) {
      // Check every hue
      var minDistance = existingHues.reduce((min, existingHue) => {
         var distance = hueDistance(i, existingHue);
         return Math.min(min, distance);
      }, 360);

      if (minDistance > maxDistance) {
         maxDistance = minDistance;
         furthestHue = i;
      }
   }

   return hslToHex(furthestHue, saturation, lightness); // hslToHex from previous example
}

function hexToHSL(H: string) {
   // Convert hex to RGB first
   let r = 0,
      g = 0,
      b = 0;
   if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
   } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
   }
   // Then to HSL
   r /= 255;
   g /= 255;
   b /= 255;
   let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

   if (delta == 0) h = 0;
   else if (cmax == r) h = ((g - b) / delta) % 6;
   else if (cmax == g) h = (b - r) / delta + 2;
   else h = (r - g) / delta + 4;

   h = Math.round(h * 60);

   if (h < 0) h += 360;

   l = (cmax + cmin) / 2;
   s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
   s = +(s * 100).toFixed(1);
   l = +(l * 100).toFixed(1);

   return { h, s, l };
}
