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
      if (!copiedFormation) return;
      if (selectedFormation === null) {
         setFormations((formations: formation[]) => [...formations, copiedFormation]);
      }
      setFormations((formations: formation[]) => {
         return formations.map((formation, index) => {
            if (selectedFormation === index) {
               return copiedFormation;
            }
            return formation;
         });
      });
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
            className=" flex flex-row bg-white items-center border-y-black border-y-[1px]"
            style={{
               width: songDuration ? songDuration / 100 + 123 : "100%",
            }}
            id="outside"
            onClick={clickOutsideFormations}
         >
            <svg
               onClick={() => {
                  if (!formations.length) {
                     setFormations((formations: formation[]) => [
                        ...formations,
                        {
                           durationSeconds: 10,
                           positions: [],
                           transition: {
                              durationSeconds: 5,
                           },
                           name: `Untitled ${formations.length + 1}`,
                        },
                     ]);
                  } else {
                     setFormations((formations: formation[]) => [
                        ...formations,
                        { ...formations[formations.length - 1], name: `Untitled ${formations.length + 1}` },
                     ]);
                  }

                  setSelectedFormation(formations.length);
               }}
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth="1.5"
               stroke="black"
               className="w-6 h-6 cursor-pointer mr-2 fill-white"
            >
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>

            <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth={1.5}
               stroke="black"
               className="w-6 h-6 cursor-pointer mr-2"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
               />
               <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
