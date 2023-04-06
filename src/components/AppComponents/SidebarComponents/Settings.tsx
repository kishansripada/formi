import { dancer, dancerPosition, formation, localSettings, stageDimensions } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
export const Settings: React.FC<{
   setLocalSettings: Function;
   localSettings: any;
   dropDownToggle: boolean;
}> = ({ setLocalSettings, localSettings, dropDownToggle }) => {
   let { previousFormationView, gridSnap, dancerStyle } = localSettings;
   const setPreviousFormationView = (val: string) => {
      setLocalSettings((settings: localSettings) => {
         return { ...settings, previousFormationView: val };
      });
   };

   const setGridSnap = (val: number) => {
      setLocalSettings((settings: localSettings) => {
         return { ...settings, gridSnap: val };
      });
   };
   const setDancerStyle = (val: string) => {
      setLocalSettings((settings: localSettings) => {
         return { ...settings, dancerStyle: val };
      });
   };
   return (
      <>
         <Toaster></Toaster>
         <div className=" w-[250px]  min-w-[250px] hidden lg:block bg-white h-full  py-4 overflow-y-scroll pl-1">
            <p className="text-neutral-800 pl-3  font-medium mb-1 text-sm">Previous Formation</p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={
                  previousFormationView === "none" ? "None" : previousFormationView === "ghostDancers" ? "Ghost Dancers" : "Ghost Dancers + Paths"
               }
               actions={[
                  () => setPreviousFormationView("none"),
                  () => setPreviousFormationView("ghostDancers"),
                  () => setPreviousFormationView("ghostDancersAndPaths"),
               ]}
               options={["None", "Ghost Dancers", "Ghost Dancers + Paths"]}
            ></Dropdown>

            <hr className="my-2" />

            <p className="text-neutral-800 pl-3 font-medium mb-1 text-sm">Grid Snap</p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={gridSnap === 100 ? "None" : gridSnap === 1 ? "Whole Square" : "Half Square"}
               actions={[() => setGridSnap(100), () => setGridSnap(2), () => setGridSnap(1)]}
               options={["None", "Half Square", "Whole Square"]}
            ></Dropdown>

            <hr className="my-2" />

            <p className="text-neutral-800  pl-3 font-medium mb-1 text-sm">Dancer Style</p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={dancerStyle === "initials" ? "Initials" : dancerStyle === "numbered" ? "Numbered" : "Solid"}
               actions={[() => setDancerStyle("initials"), () => setDancerStyle("numbered"), () => setDancerStyle("solid")]}
               options={["Initials", "Numbered", "Solid"]}
            ></Dropdown>

            <hr className="my-2" />
         </div>
      </>
   );
};
