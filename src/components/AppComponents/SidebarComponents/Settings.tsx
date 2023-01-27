import { dancer, dancerPosition, formation, stageDimensions } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export const Settings: React.FC<{
   stageDimensions: any;
   setStageDimensions: Function;
   previousFormationView: "none" | "ghostDancers" | "ghostDancersAndPaths";
   setPreviousFormationView: Function;
   setFormations: Function;
   pricingTier: string;
   formations: formation[];
   gridSnap: number;
   setGridSnap: Function;
}> = ({
   stageDimensions,
   setStageDimensions,
   setPreviousFormationView,
   previousFormationView,
   setFormations,
   pricingTier,
   formations,
   gridSnap,
   setGridSnap,
}) => {
   return (
      <>
         <Toaster></Toaster>
         <div className=" w-[23%]  min-w-[350px] hidden lg:block bg-white border-r border-r-gray-300 px-6 py-6 overflow-y-scroll">
            <h1 className="h-12 font-medium text-xl">Settings</h1>

            <p className="text-gray-500 font-medium mb-3 mt-10 text-sm">Previous Formation</p>

            <div className="border border-gray-200 rounded-xl w-full text-sm shadow-sm cursor-pointer select-none ">
               <div className="p-4 flex flex-row items-center" onClick={() => setPreviousFormationView("none")}>
                  {previousFormationView === "none" ? (
                     <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                        <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                     </div>
                  ) : (
                     <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                  )}
                  <p>None</p>
               </div>
               <hr />
               <div className="p-4 flex flex-row items-center" onClick={() => setPreviousFormationView("ghostDancers")}>
                  {previousFormationView === "ghostDancers" ? (
                     <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                        <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                     </div>
                  ) : (
                     <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                  )}
                  <p>View Ghost Dancers</p>
               </div>
               <hr />
               <div
                  className={`p-4 flex flex-row items-center `}
                  onClick={() => {
                     setPreviousFormationView("ghostDancersAndPaths");
                  }}
               >
                  {previousFormationView === "ghostDancersAndPaths" ? (
                     <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                        <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                     </div>
                  ) : (
                     <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                  )}

                  <p>View Ghost Dancers and Paths</p>
               </div>
            </div>

            <p className="text-gray-500 text-sm font-medium mt-10 mb-3">Grid Snap</p>

            <div className="border border-gray-200 rounded-xl w-full text-sm shadow-sm cursor-pointer select-none ">
               <div className="p-4 flex flex-row items-center" onClick={() => setGridSnap(100)}>
                  {gridSnap === 100 ? (
                     <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                        <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                     </div>
                  ) : (
                     <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                  )}
                  <p>None</p>
               </div>
               <hr />
               <div className="p-4 flex flex-row items-center" onClick={() => setGridSnap(2)}>
                  {gridSnap === 2 ? (
                     <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                        <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                     </div>
                  ) : (
                     <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                  )}
                  <p>Nearest Half Square</p>
               </div>
               <hr />
               <div className={`p-4 flex flex-row items-center `} onClick={() => setGridSnap(1)}>
                  {gridSnap === 1 ? (
                     <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                        <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                     </div>
                  ) : (
                     <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                  )}
                  <p>Nearest Whole Square</p>
               </div>
            </div>
         </div>
      </>
   );
};
