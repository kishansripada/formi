import { dancer, dancerPosition, formation, localSettings, PIXELS_PER_SECOND } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const FormationControls: React.FC<{
   soundCloudTrackId: string | null;
   setSelectedFormation: Function;
   player: any;
   isPlaying: boolean;
   setIsPlaying: Function;
   formations: formation[];
   position: number | null;
   setFormations: Function;
   songDuration: number | null;
   selectedFormation: number | null;
   viewOnly: boolean;
   addToStack: Function;
   pushChange: Function;
   setPixelsPerSecond: Function;
   pixelsPerSecond: number;
   localSource: string | null;
   setPlaybackRate: Function;
   localSettings: localSettings;
   setLocalSettings: Function;
   isChangingZoom: boolean;
   setIsChangingZoom: Function;
   zoom: number;
   selectedDancers: string[];
}> = ({
   soundCloudTrackId,
   setSelectedFormation,
   player,
   isPlaying,
   setIsPlaying,
   formations,
   position,
   setFormations,
   songDuration,
   selectedFormation,
   viewOnly,
   addToStack,
   pushChange,
   setPixelsPerSecond,
   pixelsPerSecond,
   localSource,
   setPlaybackRate,
   localSettings,
   setLocalSettings,
   isChangingZoom,
   setIsChangingZoom,
   zoom,
   selectedDancers,
}) => {
   //    let MAX_ZOOM = 4;
   //    let MIN_ZOOM = 0.4;
   //    let percentZoom = (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM);

   //    useEffect(() => {
   //       let animationFrameId;

   //       const handleMouseMove = (e) => {
   //          if (isChangingZoom) {
   //             cancelAnimationFrame(animationFrameId);
   //             animationFrameId = requestAnimationFrame(() => {
   //                let newPixelsPerSecond = pixelsPerSecond + (e.movementX / 96) * (MAX_PIXELS_PER_SECOND - minPixelsPerSecond);
   //                if (newPixelsPerSecond > minPixelsPerSecond && newPixelsPerSecond < MAX_PIXELS_PER_SECOND) {
   //                   setPixelsPerSecond(newPixelsPerSecond);
   //                }
   //             });
   //          }
   //       };
   //       window.addEventListener("mousemove", handleMouseMove);

   //       return () => {
   //          cancelAnimationFrame(animationFrameId);
   //          window.removeEventListener("mousemove", handleMouseMove);
   //       };
   //    }, [isChangingZoom, pixelsPerSecond, MAX_ZOOM]);

   return (
      <>
         <div className="w-full h-12 border-t-neutral-300 border-t bg-white flex flex-row items-center justify-end px-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
            <button
               onClick={() => {
                  if (selectedFormation === null) return;

                  if (formations.length === 1) {
                     toast.error("You must have at least one formation");
                     return;
                  }

                  setFormations((formations: formation[]) => {
                     if (selectedFormation === formations.length - 1) {
                        return formations;
                     }
                     if (selectedFormation === 0) {
                        return formations.map((formation, index) => {
                           if (index === 1) {
                              return {
                                 ...formation,
                                 durationSeconds: formation.transition.durationSeconds + formation.durationSeconds + formations[0].durationSeconds,
                              };
                           }
                           return formation;
                        });
                     } else {
                        return formations.map((formation, index) => {
                           if (index === selectedFormation - 1) {
                              return {
                                 ...formation,
                                 durationSeconds:
                                    formation.durationSeconds +
                                    formations[selectedFormation]?.transition.durationSeconds +
                                    formations[selectedFormation].durationSeconds,
                              };
                           }
                           return formation;
                        });
                     }
                  });

                  if (selectedFormation === formations.length - 1) {
                     setSelectedFormation(selectedFormation - 1);
                  }

                  // remove the formation
                  setFormations((formations: formation[]) => {
                     return formations.filter((formation, index) => {
                        return index !== selectedFormation;
                     });
                  });

                  pushChange();
               }}
               className="   text-sm shadow-sm   cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-1 px-3 mr-4 bg-red-500 dark:text-red-400 text-red-600  "
            >
               Delete Formation
            </button>
            <button
               onClick={() => {
                  if (selectedFormation === null) return;
                  const lastIsSelected = selectedFormation === formations.length - 1;
                  setFormations((formations: formation[]) => {
                     return [
                        ...formations.slice(0, selectedFormation),
                        {
                           ...formations[selectedFormation],
                           durationSeconds: formations[selectedFormation].durationSeconds / (lastIsSelected ? 1 : 2),
                           transition: {
                              durationSeconds: formations[selectedFormation].transition.durationSeconds / (lastIsSelected ? 1 : 2),
                           },
                        },
                        {
                           ...formations[selectedFormation],
                           id: uuidv4(),
                           name: formations[selectedFormation].name + " copy",
                           durationSeconds: formations[selectedFormation].durationSeconds / (lastIsSelected ? 1 : 2),
                           transition: {
                              durationSeconds: formations[selectedFormation].transition.durationSeconds / (lastIsSelected ? 1 : 2),
                           },
                        },
                        ...formations.slice(selectedFormation + 1),
                     ];
                  });
                  setSelectedFormation((i: number) => i + 1);

                  pushChange();
               }}
               className="rounded-md  hidden transition duration-300  lg:flex  flex-row items-center    cursor-pointer "
            >
               <svg className="w-5 h-5 mr-1 dark:fill-neutral-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                  <path d="M180 975q-24 0-42-18t-18-42V312h60v603h474v60H180Zm120-120q-24 0-42-18t-18-42V235q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440V235H300v560Zm0 0V235v560Z" />
               </svg>

               <p className="text-sm">Duplicate in Place</p>
            </button>
            <button
               onClick={() => {
                  if (selectedFormation === null) return;

                  setFormations((formations: formation[]) => {
                     return formations.map((formation) => {
                        if (formation.id === formations[selectedFormation].id) {
                           return {
                              ...formation,
                              positions: formation.positions.map((position) => {
                                 if (selectedDancers.length && !selectedDancers.includes(position.id)) return position;
                                 return { ...position, position: { x: position.position.x, y: -position.position.y } };
                              }),
                           };
                        }
                        return formation;
                     });
                  });

                  pushChange();
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
                  if (selectedFormation === null) return;

                  setFormations((formations: formation[]) => {
                     return formations.map((formation) => {
                        if (formation.id === formations[selectedFormation].id) {
                           return {
                              ...formation,
                              positions: formation.positions.map((position) => {
                                 if (selectedDancers.length && !selectedDancers.includes(position.id)) return position;
                                 return { ...position, position: { x: -position.position.x, y: position.position.y } };
                              }),
                           };
                        }
                        return formation;
                     });
                  });

                  pushChange();
               }}
               className="rounded-md  hidden transition duration-300 mr-auto    lg:flex  flex-row items-center  px-2 py-2  cursor-pointer "
            >
               <svg className="w-5 h-5 mr-1 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                  <path d="M450 976V176h60v800h-60Zm120-210V386h100v380H570Zm-280 0V386h100v380H290Z" />
               </svg>
               <p className="text-sm">Flip Y</p>
            </button>

            {selectedFormation !== null ? (
               <p className="mr-5 text-sm font-semibold">{`Formation ${selectedFormation + 1}/${formations.length}`}</p>
            ) : null}

            <div className="w-[1px] bg-neutral-300 dark:bg-neutral-700 h-[70%]"></div>
            <div className="flex flex-row items-center ml-7 text-neutral-700 dark:text-neutral-200 mr-5">
               <div className="w-24 rounded-full h-1 dark:bg-neutral-600 bg-neutral-200 mx-2 relative">
                  <div
                     // onMouseDown={() => {
                     //    setIsChangingZoom(true);
                     // }}
                     style={{
                        left: `${((zoom - 0.4) / 3.6) * 100}%`,
                     }}
                     className="h-4  w-4 border-[3px] dark:border-pink-600 border-pink-300 rounded-full hover:shadow absolute box-border -translate-y-1/2 -translate-x-1/2 bg-white dark:bg-black cursor-pointer top-[2px]"
                  ></div>
               </div>

               <div className="grid place-items-center w-10 ml-4">
                  <p className="text-sm font-semibold">{`${Math.round(((zoom - 0.4) / 3.6) * 100)}%`}</p>
               </div>
            </div>
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
               />
            </svg> */}
         </div>
      </>
   );
};
