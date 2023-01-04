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
            <h1 className="h-12 font-medium text-xl">performance settings</h1>

            <p className="font-medium h-10">stage dimensions</p>

            <p className="text-gray-500 font-medium text-sm">width</p>
            <div className="my-6 flex flex-row justify-center items-center">
               <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                  onClick={() => {
                     for (let i = 0; i < formations.length; i++) {
                        for (let j = 0; j < formations[i].positions.length; j++) {
                           if (
                              formations[i].positions[j]?.position.x === stageDimensions.width / 2 - 3 ||
                              formations[i].positions[j]?.position.x === -stageDimensions.width / 2 + 3
                           ) {
                              toast.error("dancers will fall off the stage");
                              return;
                           }
                        }
                     }

                     setFormations((formations: formation[]) => {
                        return formations.map((formation, i) => {
                           return {
                              ...formation,
                              positions: formation.positions.map((position) => {
                                 if (position.position.x < -(stageDimensions.width / 2 - 3)) {
                                    return { ...position, position: { ...position.position, x: position.position.x + 1 } };
                                 }
                                 if (position.position.x > stageDimensions.width / 2 - 3) {
                                    return { ...position, position: { ...position.position, x: position.position.x - 1 } };
                                 }
                                 return position;
                              }),
                           };
                        });
                     });
                     setStageDimensions((stageDimensions: stageDimensions) => {
                        return { ...stageDimensions, width: stageDimensions.width - 2 };
                     });
                  }}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                  </svg>
               </button>
               <div className="flex flex-col justify-center items-center">
                  <p className="mx-6 text-2xl text-gray-700">{stageDimensions.width}</p>
                  <p className="text-gray-400 text-xs">squares</p>
               </div>
               <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                  onClick={() => {
                     setFormations((formations: formation[]) => {
                        return formations.map((formation, i) => {
                           return {
                              ...formation,
                              positions: formation.positions.map((position) => {
                                 if (position.position.x < -(stageDimensions.width / 2 - 3)) {
                                    return { ...position, position: { ...position.position, x: position.position.x - 1 } };
                                 }
                                 if (position.position.x > stageDimensions.width / 2 - 3) {
                                    return { ...position, position: { ...position.position, x: position.position.x + 1 } };
                                 }
                                 return position;
                              }),
                           };
                        });
                     });
                     setStageDimensions((stageDimensions: stageDimensions) => {
                        return { ...stageDimensions, width: stageDimensions.width + 2 };
                     });
                  }}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
               </button>
            </div>

            <p className="text-gray-500 font-medium text-sm">height</p>
            <div className="my-6 flex flex-row justify-center items-center">
               <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                  onClick={() => {
                     for (let i = 0; i < formations.length; i++) {
                        for (let j = 0; j < formations[i].positions.length; j++) {
                           if (
                              formations[i].positions[j]?.position.y === stageDimensions.height / 2 - 1 ||
                              formations[i].positions[j]?.position.y === -stageDimensions.height / 2 + 1
                           ) {
                              toast.error("dancers will fall off the stage");
                              return;
                           }
                        }
                     }

                     setStageDimensions((stageDimensions: stageDimensions) => {
                        return { ...stageDimensions, height: stageDimensions.height - 2 };
                     });
                  }}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                  </svg>
               </button>
               <div className="flex flex-col justify-center items-center">
                  <p className="mx-6 text-2xl text-gray-700">{stageDimensions.height}</p>
                  <p className="text-gray-400 text-xs">squares</p>
               </div>
               <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                  onClick={() =>
                     setStageDimensions((stageDimensions: stageDimensions) => {
                        return { ...stageDimensions, height: stageDimensions.height + 2 };
                     })
                  }
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
               </button>
            </div>
            <p className="text-gray-500 font-medium mb-3 mt-10 text-sm">previous formation</p>

            <div className="border border-gray-200 rounded-xl w-full text-sm shadow-sm cursor-pointer select-none ">
               <div className="p-4 flex flex-row items-center" onClick={() => setPreviousFormationView("none")}>
                  {previousFormationView === "none" ? (
                     <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                        <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                     </div>
                  ) : (
                     <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                  )}
                  <p>none</p>
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
                  <p>view ghost dancers</p>
               </div>
               <hr />
               <div
                  className={`p-4 flex flex-row items-center ${pricingTier === "basic" ? "" : ""}`}
                  onClick={() => {
                     if (pricingTier === "basic") {
                        toast("that's a premium feature", {
                           icon: "😛",
                        });
                        return;
                     }
                     setPreviousFormationView("ghostDancersAndPaths");
                  }}
               >
                  {pricingTier === "basic" ? (
                     <>
                        <p className="mr-3 opacity-100">⚡️</p>
                     </>
                  ) : (
                     <>
                        {previousFormationView === "ghostDancersAndPaths" ? (
                           <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                              <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                           </div>
                        ) : (
                           <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                        )}
                     </>
                  )}

                  <p className={`${pricingTier === "basic" ? "opacity-40" : ""}`}>view ghost dancers and paths</p>
               </div>
            </div>

            <p className="text-gray-500 text-sm font-medium mt-10 mb-3">grid snap</p>

            <div className="border border-gray-200 rounded-xl w-full text-sm shadow-sm cursor-pointer select-none ">
               <div className="p-4 flex flex-row items-center" onClick={() => setGridSnap(100)}>
                  {gridSnap === 100 ? (
                     <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                        <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                     </div>
                  ) : (
                     <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                  )}
                  <p>none</p>
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
                  <p>nearest half square</p>
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
                  <p>nearest whole square</p>
               </div>
            </div>
         </div>
      </>
   );
};
