import { dancer, dancerPosition, formation, localSettings, stageDimensions } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export const Collisions: React.FC<{
   setLocalSettings: Function;
   localSettings: localSettings;
}> = ({ setLocalSettings, localSettings }) => {
   let { previousFormationView, viewCollisions } = localSettings;

   return (
      <>
         <Toaster></Toaster>
         <div className=" w-[23%]  min-w-[350px] hidden lg:block bg-white border-r border-r-gray-300 px-6 py-6 overflow-y-scroll">
            <h1 className="h-12 font-medium text-xl">Collision Detection</h1>

            <p className="text-gray-500 font-medium mb-3 mt-10 text-sm">View Collisions</p>

            <div className="border border-gray-200 rounded-xl w-full text-sm shadow-sm cursor-pointer select-none ">
               <div
                  className="p-4 flex flex-row items-center"
                  onClick={() =>
                     setLocalSettings((settings: localSettings) => {
                        return { ...settings, viewCollisions: false };
                     })
                  }
               >
                  {!viewCollisions ? (
                     <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                        <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                     </div>
                  ) : (
                     <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                  )}
                  <p>Off</p>
               </div>
               <hr />
               <div
                  className="p-4 flex flex-row items-center"
                  onClick={() =>
                     setLocalSettings((settings: localSettings) => {
                        return { ...settings, viewCollisions: true };
                     })
                  }
               >
                  {viewCollisions ? (
                     <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                        <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                     </div>
                  ) : (
                     <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                  )}
                  <p>On</p>
               </div>
            </div>
         </div>
      </>
   );
};
