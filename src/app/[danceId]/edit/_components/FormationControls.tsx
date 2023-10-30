import { dancer, dancerPosition, formation, localSettings, PIXELS_PER_SECOND } from "../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "../store";
import { Slider } from "../../../../../@/components/ui/slider";

export const FormationControls: React.FC<{
   zoom: number;
   selectedDancers: string[];
   setZoom: Function;
}> = ({ zoom, selectedDancers, setZoom }) => {
   const {
      formations,
      setFormations,
      pauseHistory,
      resumeHistory,
      selectedFormations,
      setSelectedFormations,
      get,
      viewOnly,
      getFirstSelectedFormation,
      deleteSelectedFormations,
      splitSelectedFormations,
   } = useStore();
   return (
      <div className="w-full h-[40px] min-h-[40px] max-h-[40px]  border-t-neutral-300 border-t bg-neutral-50 md:flex hidden flex-row items-center justify-between px-3 dark:bg-neutral-900 backdrop-blur-md mt-auto   dark:border-neutral-700 dark:text-white">
         {!viewOnly ? (
            <div className="flex flex-row items-center">
               <button
                  onClick={() => {
                     deleteSelectedFormations();
                  }}
                  className="   text-sm shadow-sm   cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-1 px-3 mr-4 bg-red-500 dark:text-red-400 text-red-600  "
               >
                  {selectedFormations.length === 1 ? "Delete Formation" : "Delete Formations"}
               </button>

               <button
                  onClick={() => {
                     splitSelectedFormations();
                  }}
                  className="rounded-md  hidden transition duration-300  lg:flex  flex-row items-center    cursor-pointer "
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                     className="w-5 h-5 mr-1 dark:stroke-neutral-100"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664"
                     />
                  </svg>

                  <p className="text-sm">Split</p>
               </button>
               <button
                  onClick={() => {
                     if (!selectedFormations.length) return;

                     setFormations(
                        formations.map((formation) => {
                           if (selectedFormations.includes(formation.id)) {
                              return {
                                 ...formation,
                                 positions: formation.positions.map((position) => {
                                    if (selectedDancers.length && !selectedDancers.includes(position.id)) return position;
                                    return { ...position, position: { x: position.position.x, y: -position.position.y } };
                                 }),
                              };
                           }
                           return formation;
                        })
                     );

                     // pushChange();
                  }}
                  className="rounded-md  hidden transition duration-300 ml-3 lg:flex  flex-row items-center  px-2 py-2  cursor-pointer "
               >
                  <svg className="w-5 h-5 mr-1 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                     <path d="M80 606v-60h800v60H80Zm210-120V386h380v100H290Zm0 280V666h380v100H290Z" />
                  </svg>
                  <p className="text-sm">Flip X</p>
               </button>
               <button
                  onClick={() => {
                     if (!selectedFormations.length) return;

                     setFormations(
                        formations.map((formation) => {
                           if (selectedFormations.includes(formation.id)) {
                              return {
                                 ...formation,
                                 positions: formation.positions.map((position) => {
                                    if (selectedDancers.length && !selectedDancers.includes(position.id)) return position;
                                    return { ...position, position: { x: -position.position.x, y: position.position.y } };
                                 }),
                              };
                           }
                           return formation;
                        })
                     );

                     // pushChange();
                  }}
                  className="rounded-md  hidden transition duration-300    lg:flex  flex-row items-center  px-2 py-2  cursor-pointer "
               >
                  <svg className="w-5 h-5 mr-1 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                     <path d="M450 976V176h60v800h-60Zm120-210V386h100v380H570Zm-280 0V386h100v380H290Z" />
                  </svg>
                  <p className="text-sm">Flip Y</p>
               </button>
               {selectedFormations.length === 1 ? (
                  <button
                     title="Reset to previous formation"
                     onClick={() => {
                        setFormations(
                           formations.map((formation, index) => {
                              if (selectedFormations.includes(formation.id)) {
                                 return {
                                    ...formation,
                                    positions: formations[index === 0 ? 0 : index - 1].positions,
                                 };
                              }
                              return formation;
                           })
                        );
                     }}
                     className="rounded-md  hidden transition duration-300 mr-auto    lg:flex  flex-row items-center  px-2 py-2  cursor-pointer "
                  >
                     <svg className="w-5 h-5 mr-1 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q87-16 143.5-83T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z" />
                     </svg>
                     <p className="text-sm">Reset</p>
                  </button>
               ) : null}
            </div>
         ) : null}

         <div className="flex flex-row ml-auto">
            {selectedFormations.length === 1 ? (
               <p className="mr-5 text-sm font-semibold">{`Formation ${
                  formations.findIndex((formation) => formation.id === getFirstSelectedFormation()?.id) + 1
               }/${formations.length}`}</p>
            ) : null}

            <div className="w-[1px] bg-neutral-300 dark:bg-neutral-700 h-[70%]"></div>
            <div className="lg:flex hidden flex-row items-center ml-7 text-neutral-700 dark:text-neutral-200 mr-5">
               <Slider
                  className="w-36 mx-2 "
                  onValueChange={(e) => {
                     setZoom(e[0] || 0);
                  }}
                  defaultValue={[zoom]}
                  max={6}
                  min={0.1}
                  value={[zoom]}
                  step={0.01}
               />

               <div className="grid place-items-center w-10 ml-4">
                  <p className="text-sm font-semibold">{`${Math.round(((zoom - 0.1) / 6) * 100)}%`}</p>
               </div>
            </div>
         </div>
      </div>
   );
};
