import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

export const Settings: React.FC<{
   selectedFormation: number | null;
   formations: formation[];
   setFormations: Function;
   dancers: dancer[];
   setSelectedFormation: Function;
   selectedDancers: string[];
   setSelectedDancers: Function;
}> = ({ formations, selectedFormation, setFormations, dancers, setSelectedFormation, selectedDancers, setSelectedDancers }) => {
   return (
      <>
         <div className="w-[23%] bg-white border-r border-r-gray-300 px-6 py-6">
            <h1 className="h-12 font-medium text-xl">performance settings</h1>

            <p className="font-medium h-10">stage dimensions</p>

            <p className="text-gray-500">width</p>
            <p className="text-gray-500">height</p>
         </div>
      </>
   );
};
