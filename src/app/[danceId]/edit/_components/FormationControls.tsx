import { dancer, dancerPosition, formation, localSettings, PIXELS_PER_SECOND } from "../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "../store";

export const FormationControls: React.FC<{
   // setSelectedFormation: Function;
   player: any;
   isPlaying: boolean;
   setIsPlaying: Function;
   // formations: formation[];
   position: number | null;
   // setFormations: Function;
   songDuration: number | null;
   // selectedFormation: number | null;
   // viewOnly: boolean;
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
   // setSelectedFormation,
   player,
   isPlaying,
   setIsPlaying,
   // formations,
   position,
   // setFormations,
   songDuration,
   // selectedFormation,
   // viewOnly,
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
   } = useStore();
   return (
      <>
         <div
            style={{
               pointerEvents: viewOnly ? "none" : "all",
            }}
            className="w-full h-[40px] min-h-[40px] max-h-[40px]  border-t-neutral-300 border-t bg-white md:flex hidden flex-row items-center justify-end px-3 dark:bg-neutral-800 mt-auto dark:border-neutral-700 dark:text-white"
         >
            <button
               onClick={() => {
                  pauseHistory();
                  if (!selectedFormations.length) return;

                  if (get().formations.length === 1) {
                     toast.error("You must have at least one formation");
                     return;
                  }

                  selectedFormations.forEach((selectedFormationId) => {
                     if (selectedFormationId === get().formations[0].id) {
                        setFormations(
                           get().formations.map((formation, index) => {
                              if (index === 1) {
                                 return {
                                    ...formation,
                                    durationSeconds: formation.transition.durationSeconds + formation.durationSeconds + formations[0].durationSeconds,
                                 };
                              }
                              return formation;
                           })
                        );
                     } else if (selectedFormationId !== get().formations[get().formations.length - 1].id) {
                        // console.log("trigger");
                        setFormations(
                           get().formations.map((formation, index) => {
                              if (index === formations.findIndex((formation) => formation.id === selectedFormationId) - 1) {
                                 return {
                                    ...formation,
                                    durationSeconds:
                                       formation.durationSeconds +
                                       get().formations.find((formation) => formation.id === selectedFormationId)?.transition.durationSeconds +
                                       get().formations.find((formation) => formation.id === selectedFormationId).durationSeconds,
                                 };
                              }
                              return formation;
                           })
                        );
                     }
                  });

                  setSelectedFormations([]);
                  // remove the formation
                  setFormations(
                     get().formations.filter((formation) => {
                        return !selectedFormations.includes(formation.id);
                     })
                  );
                  resumeHistory();
                  // pushChange();
               }}
               className="   text-sm shadow-sm   cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-1 px-3 mr-4 bg-red-500 dark:text-red-400 text-red-600  "
            >
               {selectedFormations.length === 1 ? "Delete Formation" : "Delete Formations"}
            </button>

            <button
               onClick={() => {
                  if (!selectedFormations.length) return;

                  selectedFormations.forEach((selectedFormationId) => {
                     const selectedFormation = get().formations.findIndex((formation) => formation.id === selectedFormationId);
                     const lastIsSelected = selectedFormation === get().formations.length - 1;
                     let oldTotalDuration =
                        get().formations[selectedFormation].durationSeconds + get().formations[selectedFormation].transition.durationSeconds;

                     if (selectedFormation === 0) {
                        let oldTotalDuration = get().formations[selectedFormation].durationSeconds;
                        setFormations([
                           {
                              ...get().formations[selectedFormation],
                              durationSeconds: 0,
                              durationSeconds: oldTotalDuration / (lastIsSelected ? 1 : 2),
                              transition: {
                                 durationSeconds: 0,
                              },
                           },
                           {
                              ...get().formations[selectedFormation],
                              id: uuidv4(),
                              name: get().formations[selectedFormation].name + " copy",
                              durationSeconds: 0,
                              transition: {
                                 durationSeconds: oldTotalDuration / (lastIsSelected ? 1 : 2),
                              },
                           },
                           ...get().formations.slice(selectedFormation + 1),
                        ]);
                        return;
                     }

                     setFormations([
                        ...get().formations.slice(0, selectedFormation),
                        {
                           ...get().formations[selectedFormation],
                           durationSeconds: 0,
                           transition: {
                              durationSeconds: oldTotalDuration / (lastIsSelected ? 1 : 2),
                           },
                        },
                        {
                           ...get().formations[selectedFormation],
                           id: uuidv4(),
                           name: get().formations[selectedFormation].name + " copy",
                           durationSeconds: 0,
                           transition: {
                              durationSeconds: oldTotalDuration / (lastIsSelected ? 1 : 2),
                           },
                        },
                        ...get().formations.slice(selectedFormation + 1),
                     ]);

                     // setFormations([
                     //    ...get().formations.slice(0, selectedFormation),
                     //    {
                     //       ...get().formations[selectedFormation],
                     //       durationSeconds: get().formations[selectedFormation].durationSeconds / (lastIsSelected ? 1 : 2),
                     //       transition: {
                     //          durationSeconds:
                     //             get().formations[selectedFormation].transition.durationSeconds / (lastIsSelected ? 1 : 2) > 0.5
                     //                ? get().formations[selectedFormation].transition.durationSeconds / (lastIsSelected ? 1 : 2)
                     //                : get().formations[selectedFormation].transition.durationSeconds,
                     //       },
                     //    },
                     //    {
                     //       ...get().formations[selectedFormation],
                     //       id: uuidv4(),
                     //       name: get().formations[selectedFormation].name + " copy",
                     //       durationSeconds: get().formations[selectedFormation].durationSeconds / (lastIsSelected ? 1 : 2),
                     //       transition: {
                     //          durationSeconds:
                     //             get().formations[selectedFormation].transition.durationSeconds / (lastIsSelected ? 1 : 2) > 0.5
                     //                ? get().formations[selectedFormation].transition.durationSeconds / (lastIsSelected ? 1 : 2)
                     //                : get().formations[selectedFormation].transition.durationSeconds,
                     //       },
                     //    },
                     //    ...get().formations.slice(selectedFormation + 1),
                     // ]);
                  });
                  // setSelectedFormation(selectedFormation + 1);

                  pushChange();
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

                  pushChange();
               }}
               className="rounded-md  hidden transition duration-300 mr-auto    lg:flex  flex-row items-center  px-2 py-2  cursor-pointer "
            >
               <svg className="w-5 h-5 mr-1 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                  <path d="M450 976V176h60v800h-60Zm120-210V386h100v380H570Zm-280 0V386h100v380H290Z" />
               </svg>
               <p className="text-sm">Flip Y</p>
            </button>

            {selectedFormations.length === 1 ? (
               <p className="mr-5 text-sm font-semibold">{`Formation ${
                  formations.findIndex((formation) => formation.id === getFirstSelectedFormation()?.id) + 1
               }/${formations.length}`}</p>
            ) : null}

            <div className="w-[1px] bg-neutral-300 dark:bg-neutral-700 h-[70%]"></div>
            <div className="lg:flex hidden flex-row items-center ml-7 text-neutral-700 dark:text-neutral-200 mr-5">
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
