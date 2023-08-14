import { useState } from "react";
import { dancer, dancerPosition, formation, formationGroup, localSettings } from "../../../../types/types";
import { Layer } from "./Layer";
import { useStore } from "../store";

export const Layers: React.FC<{
   // formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   // setFormations: Function;
   songDuration: number | null;
   position: number | null;
   isPlaying: boolean;

   pixelsPerSecond: number;
   setSelectedDancers: Function;
   addToStack: Function;
   pushChange: Function;

   formationGroups: formationGroup[];
   setPosition: Function;
   player: any;
   localSettings: localSettings;
   shiftHeld: boolean;
   hasVisited: boolean;
   // setSelectedFormations: Function;
   // selectedFormations: number[];
}> = ({
   // formations,
   selectedFormation,
   setSelectedFormation,
   // setFormations,
   songDuration,
   position,
   isPlaying,

   pixelsPerSecond,
   setSelectedDancers,
   pushChange,
   addToStack,
   formationGroups,
   setPosition,
   player,
   localSettings,
   shiftHeld,
   hasVisited,
   // setSelectedFormations,
   // selectedFormations,
}) => {
   const { formations, setFormations, get, viewOnly, pauseHistory, resumeHistory } = useStore();
   const [resizingTransition, setResizingTransition] = useState<string | null>(null);
   const [resizingFormation, setResizingFormation] = useState<string | null>(null);
   const [showTutorial, setShowTutorial] = useState<boolean | "shown">(false);
   const pointerUp = (e: PointerEvent) => {
      if (resizingFormation === null && resizingTransition === null) return;
      setFormations(
         formations.map((formation, i) => {
            return {
               ...formation,
               durationSeconds: Math.round(formation.durationSeconds * 100) / 100,
               transition: { durationSeconds: Math.round(formation.transition.durationSeconds * 100) / 100 },
            };
         })
      );

      setResizingTransition(null);
      setResizingFormation(null);
      // pushChange();
      resumeHistory();
   };
   const pointerDown = (e) => {
      pauseHistory();
      if (e.target.dataset.type === "transition-resize") {
         // addToStack();
         setResizingTransition(e.target.id);
      }
      if (e.target.dataset.type === "formation-resize") {
         // addToStack();
         setResizingFormation(e.target.id);
      }
   };

   const MIN_TRANSITION_DURATION = 0.3;
   const pointerMove = (e: PointerEvent) => {
      if (viewOnly) return;
      if (resizingFormation === null && resizingTransition === null) return;

      if (resizingFormation !== null) {
         if (!hasVisited && showTutorial !== "shown") setShowTutorial(true);
         setFormations(
            get().formations.map((formation, i) => {
               if (formation.id === resizingFormation) {
                  // console.log(formation);
                  if (formation.durationSeconds + e.movementX / pixelsPerSecond >= 0) {
                     return { ...formation, durationSeconds: formation.durationSeconds + e.movementX / pixelsPerSecond };
                  } else {
                     // transition should be longer than 0.5 seconds
                     if (formation.transition.durationSeconds + e.movementX / pixelsPerSecond > MIN_TRANSITION_DURATION) {
                        return {
                           ...formation,
                           durationSeconds: 0,
                           transition: {
                              ...formation.transition,
                              durationSeconds: formation.transition.durationSeconds + e.movementX / pixelsPerSecond,
                           },
                        };
                     } else {
                        return {
                           ...formation,
                           durationSeconds: 0,
                           transition: {
                              ...formation.transition,
                              durationSeconds: MIN_TRANSITION_DURATION,
                           },
                        };
                     }
                  }
               }
               if (shiftHeld) return formation;
               if (i === formations.findIndex((f) => f.id === resizingFormation) + 1) {
                  if (
                     formation.durationSeconds - e.movementX / pixelsPerSecond >= 0 &&
                     !(formations[i - 1]?.transition.durationSeconds === MIN_TRANSITION_DURATION && formations[i - 1]?.durationSeconds === 0)
                  ) {
                     return { ...formation, durationSeconds: formation.durationSeconds - e.movementX / pixelsPerSecond };
                  } else {
                     return formation;
                     // transition should be longer than 0.5 seconds
                     // if (formation.transition.durationSeconds + e.movementX / pixelsPerSecond > 0.5) {
                     //    return {
                     //       ...formation,
                     //       transition: {
                     //          ...formation.transition,
                     //          durationSeconds: formation.transition.durationSeconds + e.movementX / pixelsPerSecond,
                     //       },
                     //    };
                     // }
                  }
               }

               return formation;
            })
         );
      }

      if (resizingTransition !== null) {
         setFormations(
            get().formations.map((formation) => {
               if (
                  formation.id === resizingTransition &&
                  // transition should be longer than 0.5 seconds
                  formation.transition.durationSeconds + e.movementX / pixelsPerSecond > MIN_TRANSITION_DURATION &&
                  // formation should be longer than 0 seconds
                  formation.durationSeconds - e.movementX / pixelsPerSecond >= 0
               ) {
                  return {
                     ...formation,
                     durationSeconds: formation.durationSeconds - e.movementX / pixelsPerSecond,
                     transition: { ...formation.transition, durationSeconds: formation.transition.durationSeconds + e.movementX / pixelsPerSecond },
                  };
               }
               return formation;
            })
         );
      }
   };
   const totalDurationOfFormations = formations
      .map((formation, i) => formation.durationSeconds + (i === 0 ? 0 : formation.transition.durationSeconds))
      .reduce((a, b) => a + b, 0);

   const timelineWidth = (songDuration ? Math.max(totalDurationOfFormations, songDuration / 1000) : totalDurationOfFormations) * pixelsPerSecond;

   return (
      <div
         className="flex flex-col   select-none"
         style={{
            width: timelineWidth + 1000,

            // width: "100%",
            // width: songDuration
            //    ? Math.max(
            //         formations.map((formation) => formation.durationSeconds + formation.transition.durationSeconds).reduce((a, b) => a + b, 0),
            //         (songDuration / 1000) * pixelsPerSecond
            //      )
            //    : "100%",
            // marginLeft: 40,
         }}
         onPointerUp={pointerUp}
         onPointerDown={pointerDown}
         onPointerMove={pointerMove}
         // id="layers"
      >
         <>
            <div
               style={{
                  opacity: showTutorial === true ? 1 : 0,
                  pointerEvents: showTutorial === true ? "all" : "none",
               }}
               className="fixed flex flex-row items-center w-[600px] text-neutral-200 px-4 text-sm h-[50px] bg-black/80 rounded-xl -translate-x-1/2 left-1/2 transition opacity-0 bottom-[150px] "
            >
               <p className="mr-3">Hold shift when changing formation duration to move all future formations</p>
               <button
                  onClick={() => {
                     setShowTutorial("shown");
                  }}
                  className="bg-white px-3 py-2 text-black rounded-md ml-auto"
               >
                  Ok
               </button>
            </div>
         </>
         <Layer
            setPosition={setPosition}
            player={player}
            setSelectedDancers={setSelectedDancers}
            songDuration={songDuration}
            selectedFormation={selectedFormation}
            setSelectedFormation={setSelectedFormation}
            isPlaying={isPlaying}
            position={position}
            pixelsPerSecond={pixelsPerSecond}
            addToStack={addToStack}
            pushChange={pushChange}
            formationGroups={formationGroups}
            localSettings={localSettings}
            shiftHeld={shiftHeld}
            // setSelectedFormations={setSelectedFormations}
            // selectedFormations={selectedFormations}
         />
      </div>
   );
};
