import { ReactEventHandler } from "react";
import { Formation } from "./Formation";
import { useCallback, useEffect, useState } from "react";
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
}> = ({ formations, selectedFormation, setSelectedFormation, setFormations, songDuration, position, isPlaying }) => {
   let [isCommandDown, setIsCommandDown] = useState<boolean>(false);

   let [copiedFormation, setCopiedFormation] = useState<null | formation>(null);

   const clickOutsideFormations = (e: any) => {
      if (e.target.id !== "outside") return;
      e.stopPropagation();
      setSelectedFormation(null);
   };

   const copy = () => {
      if (selectedFormation === null) return;
      setCopiedFormation(formations[selectedFormation] || null);
   };

   const paste = () => {
      if (!copiedFormation || selectedFormation === null) return;
      setFormations((formations: formation[]) => {
         return formations.map((formation, index) => {
            if (selectedFormation === index) {
               return copiedFormation;
            }
            return formation;
         });
      });
      console.log(copiedFormation);
   };

   const handleKeyDown = (event: any) => {
      if (event.key === "Meta") {
         setIsCommandDown(true);
      }
      if (event.key === "c" && isCommandDown) {
         copy();
      }
      if (event.key === "v" && isCommandDown) {
         paste();
      }
   };

   const handleKeyUp = useCallback((event: any) => {
      if (event.key === "Meta") {
         setIsCommandDown(false);
      }
   }, []);

   useEffect(() => {
      // attach the event listener
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);

      // remove the event listener
      return () => {
         document.removeEventListener("keydown", handleKeyDown);
         document.removeEventListener("keyup", handleKeyUp);
      };
   }, [handleKeyDown, handleKeyUp]);

   return (
      <div
         className="flex flex-row items-center bg-white w-full "
         style={{
            width: songDuration ? songDuration / 100 + 123 : "100%",
         }}
      >
         <div>
            <div
               className={` w-[3px] h-[50px] relative z-50 ${position === null || !isPlaying ? "bg-white" : "bg-black"}`}
               style={{
                  left: 119 + (position !== null && isPlaying ? position * 10 : 0),
               }}
            ></div>
         </div>

         <button className="w-7 text-white ">new layer</button>
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
