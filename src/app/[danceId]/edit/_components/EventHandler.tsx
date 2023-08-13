import { useState, useEffect, useRef, useMemo } from "react";
import {
   dancer,
   dancerPosition,
   formation,
   dragBoxCoords,
   PIXELS_PER_SQUARE,
   comment,
   cloudSettings,
   MAX_PIXELS_PER_SECOND,
   localSettings,
} from "../../../../types/types";

export const EventHandler: React.FC<{
   children: React.ReactNode;
   setFormations: Function;
   selectedFormation: number | null;
   formations: formation[];
   selectedDancers: string[];
   setSelectedDancers: Function;
   setSelectedFormation: Function;
   setIsPlaying: Function;
   viewOnly: boolean;
   setPixelsPerSecond: Function;
   songDuration: number | null;
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
   draggingDancerId: string | null;
   setDraggingDancerId: Function;
   player: any;
   undo: Function;
   addToStack: Function;
   pushChange: Function;
   localSettings: any;
   isCommenting: boolean;
   setIsCommenting: Function;
   zoom: number;
   setZoom: Function;
   soundCloudTrackId: string | null;
   cloudSettings: cloudSettings;
   stageFlipped: boolean;
   shiftHeld: boolean;
   setShiftHeld: Function;
   setDropDownToggle: Function;
   dancers: dancer[];
   setIsChangingCollisionRadius: Function;
   selectedPropIds: string[];
   setIsScrollingTimeline: Function;
   setIsChangingZoom: Function;
   setPosition: Function;
   position: number | null;
   setLocalSettings: Function;
}> = ({
   player,
   children,
   setFormations,
   selectedFormation,
   formations,
   setSelectedDancers,
   selectedDancers,
   setSelectedFormation,
   setIsPlaying,
   viewOnly,
   setPixelsPerSecond,
   songDuration,
   cloudSettings,
   coordsToPosition,
   draggingDancerId,
   setDraggingDancerId,
   undo,
   addToStack,
   pushChange,
   localSettings,
   isCommenting,
   setIsCommenting,
   zoom,
   setZoom,
   soundCloudTrackId,
   stageFlipped,
   shiftHeld,
   setShiftHeld,
   setDropDownToggle,
   dancers,
   setIsChangingCollisionRadius,
   setIsScrollingTimeline,
   setIsChangingZoom,
   selectedPropIds,
   setPosition,
   position,
   setLocalSettings,
}) => {
   const [commandHeld, setCommandHeld] = useState(false);
   const [copiedPositions, setCopiedPositions] = useState([]);

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
   }, [selectedFormation, commandHeld, selectedDancers, formations, copiedPositions, songDuration, position]);

   const pointerUp = (e: PointerEvent) => {
      setIsScrollingTimeline(false);
      setIsChangingZoom(false);
   };
   const pointerDown = (e: PointerEvent) => {
      if (
         !e
            .composedPath()
            .map((el) => el.id)
            .includes("dropdown-menu")
      ) {
         setDropDownToggle((x: boolean) => !x);
         setIsChangingCollisionRadius(false);
      }
   };

   const downHandler = (e: any) => {
      if (e?.composedPath()?.[0]?.tagName === "INPUT" || e?.composedPath()?.[0]?.tagName === "TEXTAREA" || e.target.id === "input") return;

      // console.log(e.key);
      if (e.key === " ") {
         e.preventDefault();
         // if (player && player.isReady) {
         //    player.playPause();
         //    setIsPlaying((isPlaying: boolean) => !isPlaying);
         // } else {
         //    setIsPlaying((isPlaying: boolean) => !isPlaying);
         // }
         // const playPause = () => {
         if (player) {
            if (player.isReady) {
               if (songDuration && position < songDuration / 1000) {
                  player.playPause();
               }

               setIsPlaying((isPlaying: boolean) => !isPlaying);
            }
         } else {
            setIsPlaying((isPlaying: boolean) => !isPlaying);
         }
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
            setFormations((formations: formation[]) => {
               return formations.map((formation, i) => {
                  if (i === selectedFormation) {
                     return {
                        ...formation,
                        props: (formation.props || []).filter((prop) => !selectedPropIds.includes(prop.id)),
                     };
                  }
                  return formation;
               });
            });
         }
      }
      if (e.key === "ArrowRight") {
         if (selectedFormation === null) return;
         e.preventDefault();
         let index = selectedFormation === formations.length - 1 ? selectedFormation : selectedFormation + 1;

         // if (isPlaying) {
         let position = formations
            .map((formation, i) => formation.durationSeconds + (i === 0 ? 0 : formation.transition.durationSeconds))
            .slice(0, index)
            .reduce((a, b) => a + b, 0);

         // if (songDuration && player) {
         //    console.log(position / (songDuration / 1000));
         // }
         // position = position + formations[index]?.transition.durationSeconds;
         // console.log(position);
         setPosition(position);
         setSelectedFormation(index);
         if (!(songDuration && player)) return;
         Math.min(Math.max(0, position / (songDuration / 1000)), 1);

         player.seekTo(Math.min(Math.max(0, position / (songDuration / 1000)), 1));
      }
      if (e.key === "ArrowLeft") {
         if (selectedFormation === null) return;
         e.preventDefault();
         let index = selectedFormation === 0 ? 0 : selectedFormation - 1;

         // if (isPlaying) {
         let position = formations
            .map((formation, i) => formation.durationSeconds + (i === 0 ? 0 : formation.transition.durationSeconds))
            .slice(0, index)
            .reduce((a, b) => a + b, 0);

         // if (songDuration && player) {
         //    console.log(position / (songDuration / 1000));
         // }
         // position = position + formations[index]?.transition.durationSeconds;
         // console.log(position);
         setPosition(position);
         setSelectedFormation(index);
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
         //  setDragBoxCoords({ start: { x: null, y: null }, end: { x: null, y: null } });
         setIsCommenting(false);
      }
      if (selectedFormation === null) return;

      if (!commandHeld) return;

      if (e.key === "=") {
         e.preventDefault();
         setZoom((zoom: number) => zoom * 1.1);
      }
      if (e.key === "-") {
         e.preventDefault();
         setZoom((zoom: number) => zoom * 0.9);
      }

      // on paste, filter out all of the dancers that are being pasted before splicing them into the array of positions
      if (e.key === "v" && copiedPositions.length) {
         setFormations((formations: formation[]) => {
            return formations.map((formation, i) => {
               if (i === selectedFormation) {
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
            });
         });
         pushChange();
      }
      if (e.key === "a") {
         e.preventDefault();
         setSelectedDancers([...formations[selectedFormation]?.positions.map((position) => position.id)]);
      }

      if (e.key === "b") {
         e.preventDefault();
         setFormations((formations: formation[]) => {
            return formations.map((formation) => {
               return {
                  ...formation,
                  positions: formation.positions.filter((position) => {
                     return dancers.map((dancer) => dancer.id).includes(position.id);
                  }),
               };
            });
         });
      }

      if (e.key === "c" && selectedDancers.length) {
         // addToStack();
         e.preventDefault();
         setCopiedPositions(formations[selectedFormation].positions.filter((dancerPosition) => selectedDancers.includes(dancerPosition.id)));
      }

      if (e.key === "z") {
         e.preventDefault();
         undo();
      }
   };

   function upHandler({ key }) {
      if (key === "Shift") {
         setShiftHeld(false);
      }
      if (key === "Meta") {
         setCommandHeld(false);
      }
   }

   return <></>;
};
