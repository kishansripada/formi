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
   soundCloudTrackId: string;
   viewOnly: boolean;
   pixelsPerSecond: number;
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
}) => {
   const [resizingTransition, setResizingTransition] = useState<number | null>(null);
   const [resizingFormation, setResizingFormation] = useState<number | null>(null);

   const pointerUp = (e) => {
      setResizingTransition(null);
      setResizingFormation(null);
   };
   const pointerDown = (e) => {
      if (e.target.dataset.type === "transition-resize") {
         setResizingTransition(e.target.id);
      }
      if (e.target.dataset.type === "formation-resize") {
         setResizingFormation(e.target.id);
      }
   };
   const pointerMove = (e) => {
      if (viewOnly) return;
      if (!resizingFormation && !resizingTransition) return;

      if (resizingFormation !== null) {
         setFormations((formations: formation[]) => {
            return formations.map((formation, i) => {
               // console.log(formation.durationSeconds);
               if (i === parseInt(resizingFormation) && formation.durationSeconds + e.movementX / pixelsPerSecond > 0) {
                  return { ...formation, durationSeconds: formation.durationSeconds + e.movementX / pixelsPerSecond };
               }
               return formation;
            });
         });
      }

      if (resizingTransition !== null) {
         setFormations((formations: formation[]) => {
            return formations.map((formation, i) => {
               if (i === parseInt(resizingTransition) && formation.transition.durationSeconds - e.movementX / pixelsPerSecond > 1) {
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
         className="flex flex-col pt-2 pb-3 w-full  bg-white  max-h-[75px] overflow-hidden "
         style={{
            width: songDuration ? (songDuration / 1000) * pixelsPerSecond : "100%",
            marginLeft: soundCloudTrackId ? (soundCloudTrackId.length < 15 ? 122 : 10) : 115,
         }}
         onPointerUp={pointerUp}
         onPointerDown={pointerDown}
         onPointerMove={pointerMove}
         id="layers"
      >
         <Layer
            viewOnly={viewOnly}
            songDuration={songDuration}
            setFormations={setFormations}
            formations={formations}
            selectedFormation={selectedFormation}
            setSelectedFormation={setSelectedFormation}
            isPlaying={isPlaying}
            position={position}
            pixelsPerSecond={pixelsPerSecond}
         />

         <svg
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
         </svg>

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
