import { ReactEventHandler } from "react";
import { Formation } from "./Formation";
type dancer = {
   name?: string;
   id: string;
   isOnStage?: boolean;
   position: { x: number | null; y: number | null };
};
type formation = {
   durationSeconds: number;
   positions: dancer[];
};

export const Formations: React.FC<{
   formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   setFormations: Function;
}> = ({ formations, selectedFormation, setSelectedFormation, setFormations }) => {
   const clickOutsideFormations = (e) => {
      if (e.target.id !== "outside") return;
      e.stopPropagation();
      setSelectedFormation(null);
   };

   return (
      <>
         <div
            className="bg-red-200 w-full min-h-[100px] flex flex-row pt-3 pb-6 px-6 overflow-x-scroll "
            id="outside"
            onClick={clickOutsideFormations}
         >
            <svg
               onClick={() => {
                  setFormations((formations) => [
                     ...formations,
                     {
                        durationSeconds: 2,
                        positions: [],
                        transition: {
                           durationSeconds: 1,
                        },
                     },
                  ]);
               }}
               className="h-16 w-16 hover:fill-slate-100 mr-10 ml-4 cursor-pointer"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               strokeWidth={1.5}
            >
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            {formations.map((formation, index) => (
               <div key={index} onClick={() => setSelectedFormation(index)}>
                  <Formation formation={formation} index={index} amSelected={index === selectedFormation} />
               </div>
            ))}
         </div>
      </>
   );
};
