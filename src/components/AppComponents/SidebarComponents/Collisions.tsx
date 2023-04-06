import { cloudSettings, dancer, dancerPosition, formation, localSettings, stageDimensions } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export const Collisions: React.FC<{
   setLocalSettings: Function;
   localSettings: localSettings;
   setCloudSettings: Function;
   cloudSettings: cloudSettings;
   setIsChangingCollisionRadius: Function;
   isChangingCollisionRadius: boolean;
   setUpgradeIsOpen: Function;
   pricingTier: string;
}> = ({
   setLocalSettings,
   localSettings,
   cloudSettings,
   setCloudSettings,
   setIsChangingCollisionRadius,
   isChangingCollisionRadius,
   pricingTier,
   setUpgradeIsOpen,
}) => {
   let { previousFormationView, viewCollisions } = localSettings;
   const handleMouseMove = (e: MouseEvent) => {
      if (!isChangingCollisionRadius) return;

      let newRadius = cloudSettings.collisionRadius + (e.movementX / 250) * 0.9;
      if (newRadius > 1 || newRadius < 0.1) return;

      setCloudSettings((cloudSettings: cloudSettings) => {
         return { ...cloudSettings, collisionRadius: newRadius };
      });
   };
   const handleDocumentMouseUp = () => {
      setIsChangingCollisionRadius(false);
   };
   useEffect(() => {
      document.addEventListener("mouseup", handleDocumentMouseUp);
      return () => {
         document.removeEventListener("mouseup", handleDocumentMouseUp);
      };
   }, [isChangingCollisionRadius]);

   useEffect(() => {
      window.addEventListener("mousemove", handleMouseMove);

      return () => window.removeEventListener("mousemove", handleMouseMove);
   }, [cloudSettings.collisionRadius, isChangingCollisionRadius]);
   return (
      <>
         <Toaster></Toaster>
         <div className=" w-[250px]  min-w-[250px] hidden h-full lg:block bg-white border-r border-r-gray-300 px-6 py-6 overflow-y-scroll">
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
                        if (pricingTier === "basic") {
                           setUpgradeIsOpen(true);
                           return { ...settings, viewCollisions: false };
                        }
                        return { ...settings, viewCollisions: true };
                     })
                  }
               >
                  {pricingTier === "basic" ? (
                     <p className="mr-3">⚡️</p>
                  ) : (
                     <>
                        {viewCollisions ? (
                           <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                              <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                           </div>
                        ) : (
                           <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                        )}
                     </>
                  )}

                  <p>On</p>
               </div>
            </div>

            <div className="mt-10 select-none">
               <p className="mb-5 text-2xl text-gray-700 pointer-events-none flex flex-row justify-between items-end ">
                  <p className="text-sm">Collision Radius</p>
                  <p>
                     {Math.round(cloudSettings.collisionRadius * 100) / 100} <span className="text-gray-700 text-sm">squares</span>
                  </p>
               </p>
               <div className="w-[250px] h-1 bg-gray-200 rounded-full relative mx-auto">
                  <div
                     onPointerDown={() => {
                        setLocalSettings((settings: localSettings) => {
                           if (pricingTier === "basic") {
                              return { ...settings, viewCollisions: false };
                           }
                           return { ...settings, viewCollisions: true };
                        });
                        setIsChangingCollisionRadius(true);
                     }}
                     style={{
                        left: ((cloudSettings.collisionRadius - 0.1) / 0.9) * 100 + "%",
                     }}
                     className="w-4 h-4 bg-white  border-pink-600 border-2 rounded-full -translate-y-[7px] -translate-x-1/2  absolute cursor-pointer"
                  ></div>
               </div>
            </div>
         </div>
      </>
   );
};
