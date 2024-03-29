import { dancer, dancerPosition, formation, localSettings, PIXELS_PER_SECOND } from "../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "../store";
import { Slider } from "../../../../../@/components/ui/slider";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export const FormationControls: React.FC<{
   zoom: number;
   selectedDancers: string[];
   setZoom: Function;
}> = ({ zoom, selectedDancers, setZoom }) => {
   const { formations, setFormations, selectedFormations, viewOnly, getFirstSelectedFormation, deleteSelectedFormations, splitSelectedFormations } =
      useStore();
   return (
      <div className="w-full h-[40px] min-h-[40px] max-h-[40px]  border-t-neutral-300 border-t bg-neutral-50 md:flex hidden flex-row items-center justify-between px-3  dark:bg-neutral-900 backdrop-blur-md mt-auto   dark:border-neutral-700 dark:text-neutral-200">
         {!viewOnly ? (
            <div
               style={{
                  display: selectedFormations.length ? "flex" : "none",
               }}
               className="flex flex-row items-center gap-4"
            >
               {formations.length !== 1 ? (
                  <button
                     onClick={() => {
                        deleteSelectedFormations();
                     }}
                     className="   text-sm shadow-sm   cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-1 px-3  bg-red-500 dark:text-red-400 text-red-600  "
                  >
                     {selectedFormations.length === 1 ? "Delete Formation" : "Delete Formations"}
                  </button>
               ) : null}
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
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                     />
                  </svg>

                  <p className="text-sm">Duplicate</p>
               </button>

               <DropdownMenu>
                  <DropdownMenuTrigger className="text-sm flex flex-row items-center">
                     More{" "}
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-1">
                        <path
                           fillRule="evenodd"
                           d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
                           clipRule="evenodd"
                        />
                     </svg>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top">
                     <DropdownMenuItem
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
                     >
                        <svg className="w-5 h-5 mr-2 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                           <path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q87-16 143.5-83T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z" />
                        </svg>
                        Reset to previous formation
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={() => {
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
                        }}
                     >
                        <svg className="w-5 h-5 mr-2 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                           <path d="M80 606v-60h800v60H80Zm210-120V386h380v100H290Zm0 280V666h380v100H290Z" />
                        </svg>
                        Flip {selectedDancers.length ? "selected" : null} dancers across X axis
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={() => {
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
                        }}
                     >
                        <svg className="w-5 h-5 mr-2 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                           <path d="M450 976V176h60v800h-60Zm120-210V386h100v380H570Zm-280 0V386h100v380H290Z" />
                        </svg>
                        Flip {selectedDancers.length ? "selected" : null} dancers across Y axis
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
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
