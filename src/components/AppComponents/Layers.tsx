import { ReactEventHandler } from "react";
import { Formation } from "./Formation";
import { useCallback, useEffect, useState } from "react";
import { dancer, dancerPosition, formation } from "../../types/types";
import { Layer } from "./Layer";
import cursor from "../../../public/cursor.svg";
import { PIXELS_PER_SECOND } from "../../types/types";

export const Layers: React.FC<{
   formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   setFormations: Function;
   songDuration: number | null;
   position: number | null;
   isPlaying: boolean;
}> = ({ formations, selectedFormation, setSelectedFormation, setFormations, songDuration, position, isPlaying }) => {
   // let [isCommandDown, setIsCommandDown] = useState<boolean>(false);

   // let [copiedFormation, setCopiedFormation] = useState<null | formation>(null);

   const clickOutsideFormations = (e: any) => {
      if (e.target.id !== "outside") return;
      e.stopPropagation();
      setSelectedFormation(null);
   };

   // const copy = () => {
   //    if (selectedFormation === null) return;
   //    setCopiedFormation(formations[selectedFormation] || null);
   // };

   // const paste = () => {
   //    if (!copiedFormation || selectedFormation === null) return;
   //    setFormations((formations: formation[]) => {
   //       return formations.map((formation, index) => {
   //          if (selectedFormation === index) {
   //             return copiedFormation;
   //          }
   //          return formation;
   //       });
   //    });
   //    console.log(copiedFormation);
   // };

   // const handleKeyDown = (event: any) => {
   //    if (event.key === "Meta") {
   //       setIsCommandDown(true);
   //    }
   //    if (event.key === "c" && isCommandDown) {
   //       copy();
   //    }
   //    if (event.key === "v" && isCommandDown) {
   //       paste();
   //    }
   // };

   // const handleKeyUp = useCallback((event: any) => {
   //    if (event.key === "Meta") {
   //       setIsCommandDown(false);
   //    }
   // }, []);

   // useEffect(() => {
   //    // attach the event listener
   //    document.addEventListener("keydown", handleKeyDown);
   //    document.addEventListener("keyup", handleKeyUp);

   //    // remove the event listener
   //    return () => {
   //       document.removeEventListener("keydown", handleKeyDown);
   //       document.removeEventListener("keyup", handleKeyUp);
   //    };
   // }, [handleKeyDown, handleKeyUp]);

   return (
      <div
         className="flex flex-row items-center bg-white w-full "
         style={{
            width: songDuration ? (songDuration / 1000) * PIXELS_PER_SECOND + 123 : "100%",
         }}
      >
         <svg
            style={{
               left: 114 + (position !== null ? position * PIXELS_PER_SECOND : 0),
            }}
            width="3730"
            height="27444"
            viewBox="0 0 3730 27444"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-20 relative z-50 pointer-events-none"
         >
            <path d="M1873 2248L1865.04 27443" stroke="white" strokeWidth="459" />
            <rect x="547" width="2635" height="2635" rx="400" fill="black" />
            <path
               d="M2200.22 3874.07C2042.45 4116.42 1687.55 4116.42 1529.78 3874.07L652.332 2526.23C479.11 2260.14 670.054 1908 987.557 1908L2742.44 1908C3059.95 1908 3250.89 2260.15 3077.67 2526.23L2200.22 3874.07Z"
               fill="black"
            />
         </svg>

         <button className="w-[18px] text-white ">new layer</button>
         <div
            className="flex flex-col pt-2 pb-3 px-6  overflow-y-scroll overflow-x-clip bg-white  max-h-[100px] "
            id="outside"
            onClick={clickOutsideFormations}
         >
            <Layer
               songDuration={songDuration}
               setFormations={setFormations}
               formations={formations}
               selectedFormation={selectedFormation}
               setSelectedFormation={setSelectedFormation}
               isPlaying={isPlaying}
               position={position}
            />
         </div>
      </div>
   );
};
