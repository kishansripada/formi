import { dancer, dancerPosition, formation, localSettings, stageDimensions } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
export const Collisions: React.FC<{
   setLocalSettings: Function;
   localSettings: any;
   dropDownToggle: boolean;
}> = ({ setLocalSettings, localSettings, dropDownToggle }) => {
   let { previousFormationView, gridSnap, dancerStyle, viewCollisions } = localSettings;
   const setCollisionsOn = (val: boolean) => {
      if (val) {
         setLocalSettings((settings: localSettings) => {
            return { ...settings, viewingTwo: true, viewingThree: false };
         });
      }
      setLocalSettings((settings: localSettings) => {
         return { ...settings, viewCollisions: val };
      });
   };

   return (
      <>
         <Toaster></Toaster>
         <div className=" w-[260px]  min-w-[260px] hidden lg:block bg-white dark:bg-neutral-800 dark:text-white h-full  py-4 overflow-y-scroll pl-1">
            <p className=" pl-3  font-medium text-sm mb-3">View Collisions</p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={viewCollisions ? "Enabled" : "Disabled"}
               actions={[() => setCollisionsOn(true), () => setCollisionsOn(false)]}
               options={["Enabled", "Disabled"]}
            ></Dropdown>
         </div>
      </>
   );
};
