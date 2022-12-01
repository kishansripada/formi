import { dancer, dancerPosition, formation } from "../../../types/types";
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
}> = ({ setDancers, dancers, setEditingDancer, formations, selectedFormation }) => {
   return (
      <>
         <div className="flex flex-col w-[23%]  bg-white border-r border-r-gray-300">
            <p className="text-xl font-medium mb-2 px-6 py-6">roster</p>
            <div className="flex flex-col  relative overflow-y-scroll overflow-x-hidden  ">
               <NewDancer setDancers={setDancers} />

               {dancers
                  .slice()
                  .reverse()
                  .map((dancer, index) => (
                     <Dancer
                        formations={formations}
                        selectedFormation={selectedFormation}
                        setDancers={setDancers}
                        dancer={dancer}
                        key={dancer.id}
                        dancers={dancers}
                        setEditingDancer={setEditingDancer}
                     />
                  ))}
            </div>
         </div>
      </>
   );
};
