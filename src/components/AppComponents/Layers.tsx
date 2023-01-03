import { useState } from "react";
import { dancer, dancerPosition, formation } from "../../types/types";
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
                  formation.transition.durationSeconds - e.movementX / pixelsPerSecond > 1 &&
                  // formation should be longer than 0 seconds
                  formation.durationSeconds + e.movementX / pixelsPerSecond > 0
               ) {
                  return {
                     ...formation,
                     durationSeconds: formation.durationSeconds + e.movementX / pixelsPerSecond,
                     transition: { ...formation.transition, durationSeconds: formation.transition.durationSeconds - e.movementX / pixelsPerSecond },
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
         />

         {/* <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="547 0 2635 27672.5"
            style={{
               // left: position !== null ? position * pixelsPerSecond : 0,
               transform: `translateX(${position !== null ? position * pixelsPerSecond : 0}px)`,
               top: -30,
            }}
         >
            <path d="m1873 2248-7.96 25195" stroke="#fff" strokeWidth={459} />
            <rect x={547} width={2635} height={2635} rx={400} fill="#000" />
            <path
               d="M2200.22 3874.07c-157.77 242.35-512.67 242.35-670.44 0L652.332 2526.23C479.11 2260.14 670.054 1908 987.557 1908H2742.44c317.51 0 508.45 352.15 335.23 618.23l-877.45 1347.84Z"
               fill="#000"
            />
         </svg> */}

         {/* <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="547 0 2635 27672.5"
            style={{
               // left: position !== null ? position * pixelsPerSecond : 0,
               transform: `translateX(${position !== null ? position * pixelsPerSecond : 0}px)`,
               top: -30,
            }}
            className="h-[100px] w-4"
         >
            <path d="m1873 2248-7.96 25195" stroke="#fff" stroke-width="459"></path>
            <rect x="547" width="2635" height="2635" rx="400" fill="#000"></rect>
            <path
               d="M2200.22 3874.07c-157.77 242.35-512.67 242.35-670.44 0L652.332 2526.23C479.11 2260.14 670.054 1908 987.557 1908H2742.44c317.51 0 508.45 352.15 335.23 618.23l-877.45 1347.84Z"
               fill="#000"
            ></path>
         </svg> */}
      </div>
   );
};
