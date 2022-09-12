import { ReactEventHandler } from "react";
import { Formation } from "./Formation";
import { useCallback, useEffect, useState } from "react";
import { dancer, dancerPosition, formation } from "../../types/types";

export const Layer: React.FC<{
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
      <>
         {/* <div>
            {position !== null && isPlaying ? (
               <div
                  className="bg-red-500 w-[5px] h-[100px] absolute z-50"
                  style={{
                     left: 119 + position * 10,
                  }}
               ></div>
            ) : null}
         </div> */}

         <div
            className=" flex flex-row bg-[#fafafa]"
            style={{
               width: songDuration ? songDuration / 100 + 123 : "100%",
            }}
            id="outside"
            onClick={clickOutsideFormations}
         >
            {formations.map((formation, index) => (
               <div
                  key={index}
                  id="formation"
                  onClick={(e: any) => {
                     if (e.target.id === "delete") return;
                     setSelectedFormation(index);
                  }}
               >
                  <Formation
                     setSelectedFormation={setSelectedFormation}
                     setFormations={setFormations}
                     formation={formation}
                     index={index}
                     amSelected={index === selectedFormation}
                  />
               </div>
            ))}
         </div>
      </>
   );
};
