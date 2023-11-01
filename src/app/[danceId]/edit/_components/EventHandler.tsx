import { useState, useEffect, useRef, useMemo } from "react";
import { dancer, dancerPosition, localSettings } from "../../../../types/types";
import { useStore, useTemporalStore } from "../store";

export const EventHandler: React.FC<{
   children: React.ReactNode;

   selectedDancers: string[];
   setSelectedDancers: Function;
   setSelectedFormation: Function;
   setIsPlaying: Function;
   // viewOnly: boolean;
   setPixelsPerSecond: Function;
   songDuration: number | null;
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
   draggingDancerId: string | null;
   setDraggingDancerId: Function;
   player: any;
   undo: () => void;
   addToStack: Function;
   pushChange: Function;
   localSettings: any;
   isCommenting: boolean;
   setIsCommenting: Function;
   zoom: number;
   setZoom: Function;

   stageFlipped: boolean;
   shiftHeld: boolean;
   setShiftHeld: Function;
   setDropDownToggle: Function;
   dancers: dancer[];

   selectedPropIds: string[];
   setIsScrollingTimeline: Function;
   setPosition: Function;
   position: number;
   setLocalSettings: Function;
   fullscreenContainer: any;
}> = ({
   player,
   setSelectedDancers,
   selectedDancers,
   setIsPlaying,
   songDuration,
   undo,
   setIsCommenting,
   setZoom,
   setShiftHeld,
   setDropDownToggle,
   dancers,

   setIsScrollingTimeline,
   selectedPropIds,
   setPosition,
   position,
   setLocalSettings,
   shiftHeld,
   fullscreenContainer,
}) => {
   const {
      formations,
      setFormations,
      selectedFormations,
      incrementSelectedFormation,
      decrementSelectedFormation,
      getSelectedFormationIndex,
      commandHeld,
      copiedPositions,
      setCommandHeld,
      copySelectedPositions,
      pasteCopiedPositions,
   } = useStore();

   // const [copiedPositions, setCopiedPositions] = useState<dancerPosition[]>([]);

   useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      window.addEventListener("pointerdown", pointerDown);
      window.addEventListener("pointerup", pointerUp);
      return () => {
         window.removeEventListener("keydown", downHandler);
         window.removeEventListener("keyup", upHandler);
         window.removeEventListener("pointerdown", pointerDown);
         window.removeEventListener("pointerup", pointerUp);
      };
   }, [selectedFormations, commandHeld, selectedDancers, formations, copiedPositions, songDuration, position, shiftHeld]);

   const pointerUp = (e: PointerEvent) => {
      setIsScrollingTimeline(false);
   };

   const pointerDown = (e: PointerEvent) => {
      if (
         !e
            .composedPath()
            .map((el) => el.id)
            .includes("dropdown-menu")
      ) {
         setDropDownToggle((x: boolean) => !x);
      }
   };

   const downHandler = (e: any) => {
      if (e?.composedPath()?.[0]?.tagName === "INPUT" || e?.composedPath()?.[0]?.tagName === "TEXTAREA" || e.target.id === "input") return;

      // console.log(e.key);
      if (e.key === " ") {
         e.preventDefault();

         // const playPause = () => {
         if (player) {
            if (position < songDuration / 1000) {
               player.isPlaying() ? player.pause() : player.play();
            }

            setIsPlaying((isPlaying) => !isPlaying);
         } else {
            setIsPlaying((isPlaying) => !isPlaying);
         }
         // };

         // };
      }

      if (e.key === "2") {
         setLocalSettings((localSettings: localSettings) => {
            return {
               ...localSettings,
               viewingTwo: true,
               viewingThree: false,
            };
         });
      }

      if (e.key === "r" && !commandHeld) {
         setLocalSettings((localSettings: localSettings) => {
            return {
               ...localSettings,
               stageFlipped: !localSettings.stageFlipped,
            };
         });
      }

      if (e.key === "f") {
         if (fullscreenContainer.current) {
            if (fullscreenContainer.current.requestFullscreen) {
               fullscreenContainer.current.requestFullscreen();
            } else if (fullscreenContainer.current.mozRequestFullScreen) {
               /* Firefox */
               fullscreenContainer.current.mozRequestFullScreen();
            } else if (fullscreenContainer.current.webkitRequestFullscreen) {
               /* Chrome, Safari and Opera */
               fullscreenContainer.current.webkitRequestFullscreen();
            } else if (fullscreenContainer.current.msRequestFullscreen) {
               /* IE/Edge */
               fullscreenContainer.current.msRequestFullscreen();
            }
         }
         setLocalSettings((localSettings: localSettings) => {
            return { ...localSettings, fullScreen: false };
         });
      }

      if (e.key === "3") {
         setLocalSettings((localSettings: localSettings) => {
            return {
               ...localSettings,
               viewingTwo: false,
               viewingThree: true,
            };
         });
      }
      // on delete, check the selectedPropIds array to see if any props are selected. If so, delete them. Otherwise, delete the selected dancers
      if (e.key === "Backspace" || e.key === "Delete") {
         e.preventDefault();
         if (selectedPropIds.length) {
            setFormations(
               formations.map((formation, i) => {
                  if (selectedFormations.includes(formation.id)) {
                     return {
                        ...formation,
                        props: (formation.props || []).filter((prop) => !selectedPropIds.includes(prop.id)),
                     };
                  }
                  return formation;
               })
            );
         }
      }
      if (e.key === "ArrowRight") {
         e.preventDefault();
         const selectedFormationIndex = getSelectedFormationIndex();
         if (!selectedFormations.length || selectedFormationIndex === formations.length - 1) return;

         // let index = selectedFormation === formations.length - 1 ? selectedFormation : selectedFormation + 1;

         // if (isPlaying) {
         let position = formations
            .map((formation, i) => formation.durationSeconds + (i === 0 ? 0 : formation.transition.durationSeconds))
            .slice(0, selectedFormationIndex + 1)
            .reduce((a, b) => a + b, 0);

         setPosition(position);
         incrementSelectedFormation();
         if (!(songDuration && player)) return;
         // Math.min(Math.max(0, position / (songDuration / 1000)), 1);

         player.seekTo(Math.min(Math.max(0, position / (songDuration / 1000)), 1));
      }
      if (e.key === "ArrowLeft") {
         e.preventDefault();
         const selectedFormationIndex = getSelectedFormationIndex();
         if (!selectedFormations.length || !selectedFormationIndex) return;

         // let index = selectedFormation === 0 ? 0 : selectedFormation - 1;

         // if (isPlaying) {
         let position = formations
            .map((formation, i) => formation.durationSeconds + (i === 0 ? 0 : formation.transition.durationSeconds))
            .slice(0, selectedFormationIndex - 1)
            .reduce((a, b) => a + b, 0);

         setPosition(position);
         decrementSelectedFormation();
         if (!(songDuration && player)) return;

         player.seekTo(Math.min(Math.max(0, position / (songDuration / 1000)), 1));
      }
      if (e.key === "Meta" || e.key === "Control") {
         setCommandHeld(true);
      }
      if (e.key === "Shift") {
         setShiftHeld(true);
      }
      if (e.key === "Escape") {
         setSelectedDancers([]);
         setShiftHeld(false);
         setCommandHeld(false);
         setIsCommenting(false);
      }

      if (!commandHeld) return;

      if (e.key === "=") {
         e.preventDefault();
         setZoom((zoom: number) => zoom * 1.1);
      }
      if (e.key === "-") {
         e.preventDefault();
         setZoom((zoom: number) => zoom * 0.9);
      }
      // console.log(copiedPositions);
      // on paste, filter out all of the dancers that are being pasted before splicing them into the array of positions
      if (e.key === "v" && copiedPositions.length) {
         pasteCopiedPositions();
         // pushChange();
      }
      if (e.key === "a") {
         if (!selectedFormations.length) return;
         e.preventDefault();
         setSelectedDancers([...formations?.[0]?.positions?.map((position) => position.id)] || []);
      }

      if (e.key === "b") {
         if (!selectedFormations.length) return;
         e.preventDefault();
         setFormations(
            formations.map((formation) => {
               return {
                  ...formation,
                  positions: formation.positions.filter((position) => {
                     return dancers.map((dancer) => dancer.id).includes(position.id);
                  }),
               };
            })
         );
      }

      if (e.key === "c") {
         e.preventDefault();
         copySelectedPositions();
      }

      if (e.key === "z") {
         e.preventDefault();
         undo();
      }
   };

   function upHandler({ key }: { key: string }) {
      if (key === "Shift") {
         setShiftHeld(false);
      }
      if (key === "Meta") {
         setCommandHeld(false);
      }
   }

   return <></>;
};
