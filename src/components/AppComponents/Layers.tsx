import { useState } from "react";
import { dancer, dancerPosition, formation, formationGroup } from "../../types/types";
import { Layer } from "./Layer";

export const Layers: React.FC<{
   formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   setFormations: Function;
   songDuration: number | null;
   position: number | null;
   isPlaying: boolean;
   soundCloudTrackId: string | null;
   viewOnly: boolean;
   pixelsPerSecond: number;
   setSelectedDancers: Function;
   addToStack: Function;
   pushChange: Function;
   userPositions: any;
   onlineUsers: any;
   formationGroups: formationGroup[];
}> = ({
   formations,
   selectedFormation,
   setSelectedFormation,
   setFormations,
   songDuration,
   position,
   isPlaying,
   soundCloudTrackId,
   viewOnly,
   pixelsPerSecond,
   setSelectedDancers,
   pushChange,
   addToStack,
   userPositions,
   onlineUsers,
   formationGroups,
}) => {
   const [resizingTransition, setResizingTransition] = useState<string | null>(null);
   const [resizingFormation, setResizingFormation] = useState<string | null>(null);

   const pointerUp = (e: PointerEvent) => {
      if (resizingFormation === null && resizingTransition === null) return;
      setFormations((formations: formation[]) => {
         return formations.map((formation, i) => {
            return {
               ...formation,
               durationSeconds: Math.round(formation.durationSeconds * 100) / 100,
               transition: { durationSeconds: Math.round(formation.transition.durationSeconds * 100) / 100 },
            };
         });
      });

      setResizingTransition(null);
      setResizingFormation(null);
      pushChange();
   };
   const pointerDown = (e) => {
      if (e.target.dataset.type === "transition-resize") {
         addToStack();
         setResizingTransition(e.target.id);
      }
      if (e.target.dataset.type === "formation-resize") {
         addToStack();
         setResizingFormation(e.target.id);
      }
   };
   const pointerMove = (e: PointerEvent) => {
      if (viewOnly) return;
      if (resizingFormation === null && resizingTransition === null) return;

      if (resizingFormation !== null) {
         setFormations((formations: formation[]) => {
            return formations.map((formation, i) => {
               if (formation.id === resizingFormation) {
                  if (formation.durationSeconds + e.movementX / pixelsPerSecond >= 0) {
                     return { ...formation, durationSeconds: formation.durationSeconds + e.movementX / pixelsPerSecond };
                  } else {
                     if (formation.transition.durationSeconds + e.movementX / pixelsPerSecond > 1) {
                        return {
                           ...formation,
                           transition: {
                              ...formation.transition,
                              durationSeconds: formation.transition.durationSeconds + e.movementX / pixelsPerSecond,
                           },
                        };
                     }
                  }
               }
               return formation;
            });
         });
      }

      if (resizingTransition !== null) {
         setFormations((formations: formation[]) => {
            return formations.map((formation) => {
               if (
                  formation.id === resizingTransition &&
                  // transition should be longer than 1 second
                  formation.transition.durationSeconds + e.movementX / pixelsPerSecond > 1 &&
                  // formation should be longer than 0 seconds
                  formation.durationSeconds - e.movementX / pixelsPerSecond > 0
               ) {
                  return {
                     ...formation,
                     durationSeconds: formation.durationSeconds - e.movementX / pixelsPerSecond,
                     transition: { ...formation.transition, durationSeconds: formation.transition.durationSeconds + e.movementX / pixelsPerSecond },
                  };
               }
               return formation;
            });
         });
      }
   };

   return (
      <div
         className="flex flex-col  bg-[#fafafa]  select-none mt-2"
         style={{
            width: songDuration
               ? Math.max(
                    formations.map((formation) => formation.durationSeconds + formation.transition.durationSeconds).reduce((a, b) => a + b, 0) *
                       pixelsPerSecond,
                    (songDuration / 1000) * pixelsPerSecond
                 )
               : "100%",

            // width: "100%",
            // width: songDuration
            //    ? Math.max(
            //         formations.map((formation) => formation.durationSeconds + formation.transition.durationSeconds).reduce((a, b) => a + b, 0),
            //         (songDuration / 1000) * pixelsPerSecond
            //      )
            //    : "100%",
            marginLeft: 10,
         }}
         onPointerUp={pointerUp}
         onPointerDown={pointerDown}
         onPointerMove={pointerMove}
         id="layers"
      >
         <Layer
            userPositions={userPositions}
            onlineUsers={onlineUsers}
            setSelectedDancers={setSelectedDancers}
            viewOnly={viewOnly}
            songDuration={songDuration}
            setFormations={setFormations}
            formations={formations}
            selectedFormation={selectedFormation}
            setSelectedFormation={setSelectedFormation}
            isPlaying={isPlaying}
            position={position}
            pixelsPerSecond={pixelsPerSecond}
            addToStack={addToStack}
            pushChange={pushChange}
            formationGroups={formationGroups}
         />
      </div>
   );
};
