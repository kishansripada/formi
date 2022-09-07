import { ReactEventHandler } from "react";
import { Formation } from "./Formation";
import { useCallback, useEffect, useState } from "react";
import { dancer, dancerPosition, formation } from "../../types/types";

export const Formations: React.FC<{
   formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   setFormations: Function;
   songDuration: number | null;
}> = ({ formations, selectedFormation, setSelectedFormation, setFormations, songDuration }) => {
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
         <div
            className=" h-[100px] flex flex-row pt-3 pb-6 px-6 bg-white"
            style={{
               width: songDuration ? songDuration / 100 + 123 : "100%",
            }}
            id="outside"
            onClick={clickOutsideFormations}
         >
            {/* progress bar */}
            {/* <div
               className="bg-red-500 w-[2px] relative z-50"
               style={{
                  left: 200,
               }}
            ></div> */}
            {/* progress bar */}

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
               className="h-16 w-16 hover:fill-slate-100 mr-5 ml-4 cursor-pointer shrink-0"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               strokeWidth={1.5}
            >
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

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
