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
      <div className="flex flex-row items-center bg-[#fafafa]">
         <svg
            onClick={() => {
               setFormations((formations: formation[]) => [
                  ...formations,
                  {
                     durationSeconds: 10,
                     positions: [],
                     transition: {
                        durationSeconds: 5,
                     },
                     name: "Untitled",
                  },
               ]);
            }}
            className="h-12 w-12 hover:fill-slate-100 mr-9 ml-4 cursor-pointer shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
         >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
         <div
            className="flex flex-col pt-2 pb-3 px-6  overflow-y-scroll overflow-x-clip bg-[#fafafa] justify-center"
            style={{
               width: songDuration ? songDuration / 100 + 123 : "100%",
            }}
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
            {/* <Layer
               songDuration={songDuration}
               setFormations={setFormations}
               formations={formations}
               selectedFormation={selectedFormation}
               setSelectedFormation={setSelectedFormation}
               isPlaying={isPlaying}
               position={position}
            />
            <Layer
               songDuration={songDuration}
               setFormations={setFormations}
               formations={formations}
               selectedFormation={selectedFormation}
               setSelectedFormation={setSelectedFormation}
               isPlaying={isPlaying}
               position={position}
            /> */}
         </div>
      </div>
   );
};
