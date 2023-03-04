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
   cloudSettings: any;
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
   cloudSettings,
   setFormations,
   pushChange,
   addToStack,
   selectedDancers,
}) => {
   let { stageDimensions } = cloudSettings;
   return (
      <>
         <div className="lg:flex hidden  min-w-[350px] flex-col w-[23%]  bg-white border-r border-r-gray-300">
            <div className="flex flex-row justify-between items-center px-6">
               <p className="text-xl font-medium mb-2  py-6">Roster</p>
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
