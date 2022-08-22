import { ReactEventHandler } from "react";
import { Formation } from "./Formation";
type dancer = {
   name?: string;
   id: string;
   position: { x: number | null; y: number | null };
};

type formation = {
   durationSeconds: number;
   positions: dancer[];
   transition: {
      durationSeconds: number;
   };
};

export const Formations: React.FC<{
   formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   setFormations: Function;
   songDuration: number | null;
}> = ({ formations, selectedFormation, setSelectedFormation, setFormations, songDuration }) => {
   const clickOutsideFormations = (e) => {
      if (e.target.id !== "outside") return;
      e.stopPropagation();
      setSelectedFormation(null);
   };

   const deleteFormation = (index: number) => {
      //  if the user deletes the selected formation, unselect it and select the one before it
      if (selectedFormation === index) {
         setSelectedFormation(index - 1);
      }
      setFormations((formations: formation[]) => {
         return formations.filter((_, i) => i !== index);
      });
   };
   return (
      <>
         <div
            className=" bg-red-200 min-h-[100px] flex flex-row pt-3 pb-6 px-6"
            style={{
               width: songDuration ? songDuration / 100 + 123 : "100%",
            }}
            id="outside"
            onClick={clickOutsideFormations}
         >
            <svg
               onClick={() => {
                  setFormations((formations: formation[]) => [
                     ...formations,
                     {
                        durationSeconds: Math.random() * 10 + 2,
                        positions: [],
                        transition: {
                           durationSeconds: 5,
                        },
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
                  onClick={(e) => {
                     if (e.target?.id === "delete") return;
                     setSelectedFormation(index);
                  }}
               >
                  <Formation
                     deleteFormation={deleteFormation}
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
