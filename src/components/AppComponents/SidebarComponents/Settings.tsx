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
   console.log(localSettings);
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

   // const setAutoScroll = (val: boolean) => {
   //    setLocalSettings((settings: localSettings) => {
   //       return { ...settings, autoScroll: val };
   //    });
   // };
   return (
      <>
         <Toaster></Toaster>
         <div className=" w-[260px]  min-w-[260px] hidden lg:block bg-white dark:bg-neutral-800 dark:text-white h-full  py-4 overflow-y-scroll pl-1">
            <p className=" pl-3  font-medium mb-1 text-sm">Previous Formation's Avatars</p>
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

            {/* <hr className="my-2" /> */}

            <p className="pl-3 font-medium mb-1 text-sm mt-4">Grid Snap</p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={gridSnap === 100 ? "None" : gridSnap === 1 ? "Whole Square" : "Half Square"}
               actions={[() => setGridSnap(100), () => setGridSnap(2), () => setGridSnap(1)]}
               options={["None", "Half Square", "Whole Square"]}
            ></Dropdown>

            {/* <hr className="my-2" /> */}

            <p className="  pl-3 font-medium mb-1 text-sm mt-4">Dancer Style</p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={dancerStyle === "initials" ? "Initials" : dancerStyle === "numbered" ? "Numbered" : "Solid"}
               actions={[() => setDancerStyle("initials"), () => setDancerStyle("numbered"), () => setDancerStyle("solid")]}
               options={["Initials", "Numbered", "Solid"]}
            ></Dropdown>

            {/* <p className="  pl-3 font-medium mb-1 text-sm mt-4">Auto Scroll</p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={localSettings.autoScroll ? "On" : "Off"}
               actions={[() => setAutoScroll(true), () => setAutoScroll(false)]}
               options={["On", "Off"]}
            ></Dropdown> */}

            {/* <hr className="my-2" /> */}
         </div>
      </>
   );
};
