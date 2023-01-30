import { dancer, dancerPosition, formation, stageDimensions } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { NewDancer } from "../NewDancer";
import { Dancer } from "../Dancer";

export const Roster: React.FC<{
   setDancers: Function;
   dancers: dancer[];
   formations: formation[];
   selectedFormation: number | null;
   setEditingDancer: Function;
   stageDimensions: stageDimensions;
   setFormations: Function;
   addToStack: Function;
   pushChange: Function;
   selectedDancers: string[];
}> = ({
   setDancers,
   dancers,
   setEditingDancer,
   formations,
   selectedFormation,
   stageDimensions,
   setFormations,
   pushChange,
   addToStack,
   selectedDancers,
}) => {
   return (
      <>
         <div className="lg:flex hidden  min-w-[350px] flex-col w-[23%]  bg-white border-r border-r-gray-300">
            <div className="flex flex-row justify-between items-center px-6">
               <p className="text-xl font-medium mb-2  py-6">Roster</p>
               <div className="flex flex-row justify-center items-center dfs">
                  {/* <p className="text-sm text-gray-500 mr-2">manzat core</p>
                  <button>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 stroke-gray-500"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                        />
                     </svg>
                  </button> */}
               </div>
            </div>

            <div className="flex flex-col  relative overflow-y-scroll overflow-x-hidden  ">
               <NewDancer
                  pushChange={pushChange}
                  addToStack={addToStack}
                  setFormations={setFormations}
                  stageDimensions={stageDimensions}
                  setDancers={setDancers}
               />

               {dancers.slice().map((dancer, index) => (
                  <Dancer
                     selectedDancers={selectedDancers}
                     setFormations={setFormations}
                     formations={formations}
                     selectedFormation={selectedFormation}
                     setDancers={setDancers}
                     dancer={dancer}
                     key={dancer.id}
                     dancers={dancers}
                     setEditingDancer={setEditingDancer}
                     index={index}
                  />
               ))}
            </div>
         </div>
      </>
   );
};
