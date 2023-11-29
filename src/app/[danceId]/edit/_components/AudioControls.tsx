import { dancer, dancerPosition, formation, localSettings, MAX_PIXELS_PER_SECOND, segment } from "../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "../store";
import { hexToRgba } from "../../../../utls";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "../../../../../@/components/ui/slider";
export const AudioControls: React.FC<{
   position: number | null;

   addToStack: Function;
   pushChange: Function;
   setPixelsPerSecond: Function;
   pixelsPerSecond: number;
   localSource: string | null;
   setPlaybackRate: Function;
   localSettings: localSettings;
   setLocalSettings: Function;
   setHelpUrl: Function;
}> = ({
   position,

   setPixelsPerSecond,
   pixelsPerSecond,
   setPlaybackRate,
   localSettings,
   setLocalSettings,
   setHelpUrl,
}) => {
   const {
      formations,
      setFormations,
      viewOnly,
      selectedFormations,
      setSelectedFormations,
      get,
      decrementSelectedFormation,
      incrementSelectedFormation,
      pauseHistory,
      resumeHistory,
      segments,
      newFormationFromLast,
      player,
      songDuration,
      togglePlayPause,
      isPlaying,
      setPosition,
      setIsPlaying,
   } = useStore();

   const [defaultVolume, setDefaultVolume] = useState(100);

   useEffect(() => {
      if (player) {
         setDefaultVolume(player.getVolume() * 100);
      }
   }, [player?.getVolume()]);

   const [playbackRateIndex, setPlaybackRateIndex] = useState(2);
   const playbackRates = [0.25, 0.5, 1, 1.5, 2];

   // };
   const totalDurationOfFormations = useStore((state) => state.getTotalDurationOfFormations());

   // function calculateFormationsInSegments(formations: formation[], segments: segment[]): segment[] {
   //    // Initialize formations array for each segment
   //    segments.forEach((segment) => (segment.formations = []));

   //    let currentTime = 0;

   //    formations.forEach((formation, index) => {
   //       // Calculate the total duration of the formation
   //       let formationDuration = formation.durationSeconds + (index === 0 ? 0 : formation.transition.durationSeconds);
   //       let formationStartTime = currentTime;
   //       let formationEndTime = formationStartTime + formationDuration;
   //       let formationMidPoint = formationStartTime + Math.ceil(formationDuration / 2);

   //       // Update currentTime for the next formation
   //       currentTime = formationEndTime;

   //       // Find the segment where the majority of the formation lies
   //       let segmentEndTime = 0;
   //       for (let segment of segments) {
   //          segmentEndTime += segment.duration;
   //          if (formationMidPoint <= segmentEndTime) {
   //             segment.formations.push(formation);
   //             break;
   //          }
   //       }
   //    });

   //    return segments;
   // }

   // console.log(calculateFormationsInSegments(formations, segments));
   return (
      <>
         <div className="min-h-[45px]  dark:bg-neutral-900 dark:text-neutral-100  bg-neutral-50 w-full border-t dark:border-neutral-700  border-neutral-300 flex flex-row items-center justify-between select-none">
            <div className="w-[45%] flex flex-col items-center justify-center   pl-4">
               {!viewOnly ? (
                  <>
                     <div className="flex flex-row  items-center justify-center mr-auto gap-3 ">
                        <button
                           onClick={() => newFormationFromLast()}
                           className=" rounded-md   transition duration-300   mr-4  flex  flex-row items-center   cursor-pointer  "
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 mr-1"
                           >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                           </svg>

                           <p className="text-sm hidden md:block">New Formation </p>
                           <p className="text-sm md:hidden block">New </p>
                        </button>

                        {/* <DropdownMenu className=" ">
                           <DropdownMenuTrigger asChild className=" text-sm border border-neutral-700 rounded-md py-1 px-2 ">
                              <p>Jump to formation</p>
                           </DropdownMenuTrigger>

                           <DropdownMenuContent side="top" className="DropdownMenuContent  p-0 overflow-scroll  ">
                              {calculateFormationsInSegments(formations, segments).map((segment) => {
                                 return (
                                    <>
                                       <DropdownMenuItem
                                          onClick={() => {
                                             setLocalSettings((s) => ({ ...s, autoScroll: !s.autoScroll }));
                                          }}
                                          style={{
                                             backgroundColor: hexToRgba(segment.color, 0.2),
                                             // backgroundOpacity: 0.2,
                                          }}
                                          className={`w-full   flex flex-row items-center justify-between  text-xs `}
                                       >
                                          {segment.name}
                                       </DropdownMenuItem>

                                       {segment.formations.map((formation) => {
                                          return (
                                             <DropdownMenuItem
                                                onClick={() => {
                                                   setLocalSettings((s) => ({ ...s, autoScroll: !s.autoScroll }));
                                                }}
                                                style={
                                                   {
                                                      // backgroundColor: hexToRgba(segment.color, 0.2),
                                                      // backgroundOpacity: 0.2,
                                                   }
                                                }
                                                className={`w-full  pl-5 flex flex-row items-center justify-between  text-xs `}
                                             >
                                                {formation.name}
                                             </DropdownMenuItem>
                                          );
                                       })}
                                    </>
                                 );
                              })}
                           </DropdownMenuContent>
                        </DropdownMenu> */}
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-5 h-5 ml-1  cursor-pointer hidden md:block"
                           onClick={(e) => {
                              setHelpUrl({ url: "https://www.youtube.com/shorts/m4uBCon7VR4", event: e });
                           }}
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                           />
                        </svg>
                     </div>
                  </>
               ) : null}
            </div>

            <div className={`flex flex-row items-center justify-center w-[10%] `}>
               <button onClick={decrementSelectedFormation}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                  </svg>
               </button>
               {isPlaying ? (
                  <div
                     className={`hover:bg-neutral-100 dark:hover:bg-neutral-800  transition duration-300 cursor-pointer p-1 rounded-2xl mx-3 select-none`}
                     onClick={togglePlayPause}
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 dark:fill-neutral-300 fill-neutral-600"
                     >
                        <path
                           fillRule="evenodd"
                           d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                           clipRule="evenodd"
                        />
                     </svg>
                  </div>
               ) : (
                  <div
                     className={`hover:bg-neutral-100 dark:hover:bg-neutral-800  transition duration-300 p-1 rounded-2xl mx-3 select-none cursor-pointer `}
                     onClick={togglePlayPause}
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 dark:fill-neutral-300 fill-neutral-600"
                     >
                        <path
                           fillRule="evenodd"
                           d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                           clipRule="evenodd"
                        />
                     </svg>
                  </div>
               )}
               <button onClick={incrementSelectedFormation}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                  </svg>
               </button>
            </div>

            <div className="w-[45%] pr-10 md:flex hidden flex-row  items-center ">
               <p className=" mr-auto  dark:text-neutral-400 text-neutral-600 lg:block hidden ">
                  <span>{formatTime(position || 0)}</span>
               </p>

               <DropdownMenu className="">
                  <DropdownMenuTrigger asChild className=" cursor-pointer rounded-md">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 3.75a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM4.25 17a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 17a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM9 10a.75.75 0 01-.75.75h-5.5a.75.75 0 010-1.5h5.5A.75.75 0 019 10zM17.25 10.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM14 10a2 2 0 10-4 0 2 2 0 004 0zM10 16.25a2 2 0 10-4 0 2 2 0 004 0z" />
                     </svg>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent side="top" className="DropdownMenuContent w-[300px] ">
                     {player ? (
                        <>
                           <DropdownMenuLabel>Volume</DropdownMenuLabel>
                           <DropdownMenuItem
                              onClick={() => {
                                 setLocalSettings((s) => ({ ...s, autoScroll: !s.autoScroll }));
                              }}
                              className={`w-full pb-2 pt-1  flex flex-row items-center justify-between  text-sm   ${
                                 localSettings.autoScroll ? "" : ""
                              }`}
                           >
                              <Slider
                                 onValueChange={(e) => {
                                    player.setVolume((e[0] || 0) / 100);
                                 }}
                                 defaultValue={[defaultVolume]}
                                 max={100}
                                 min={0}
                                 step={1}
                              />
                           </DropdownMenuItem>
                        </>
                     ) : null}
                     <DropdownMenuItem
                        onClick={() => {
                           setLocalSettings((s) => ({ ...s, autoScroll: !s.autoScroll }));
                        }}
                        className={`w-full py-2  flex flex-row items-center justify-between  text-sm   ${localSettings.autoScroll ? "" : ""}`}
                     >
                        <p>Autoscroll</p>
                        {localSettings.autoScroll ? (
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                              <path
                                 fillRule="evenodd"
                                 d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                 clipRule="evenodd"
                              />
                           </svg>
                        ) : null}
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={() => {
                           setPlaybackRateIndex((i) => i + 1);
                           setPlaybackRate(playbackRates[(playbackRateIndex + 1) % 5]);
                           // console.log(playbackRates[(playbackRateIndex + 1) % 5]);
                           if (player) {
                              player.setPlaybackRate(playbackRates[(playbackRateIndex + 1) % 5]);
                           }
                        }}
                        className="w-full  hover:bg-neutral-200"
                     >
                        <div className="  py-1  text-sm   flex flex-row items-center">
                           <p>Playback rate: {JSON.stringify(playbackRates[playbackRateIndex % 5])}x</p>
                        </div>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
               <div className="lg:flex hidden flex-row items-center ml-4">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                     className="w-5 h-5 "
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                     />
                  </svg>
                  <Slider
                     className="w-24 mx-2 "
                     onValueChange={(e) => {
                        setPixelsPerSecond(e[0] || 0);
                     }}
                     defaultValue={[pixelsPerSecond]}
                     max={MAX_PIXELS_PER_SECOND}
                     min={
                        Math.max((songDuration || 0) / 1000, totalDurationOfFormations)
                           ? (window.screen.width - 90) / Math.max((songDuration || 0) / 1000, totalDurationOfFormations)
                           : 10
                     }
                     value={[pixelsPerSecond]}
                     step={1}
                  />
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                     className="w-5 h-5 "
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                     />
                  </svg>
               </div>
            </div>
            <div className="flex flex-row items-center w-[45%] md:hidden">
               {!viewOnly ? (
                  <button
                     onClick={() => {
                        if (viewOnly) return;
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
                                          durationSeconds:
                                             formation.transition.durationSeconds + formation.durationSeconds + formations[0].durationSeconds,
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
                     }}
                     className=" ml-auto   text-xs shadow-sm grid cursor-pointer select-none rounded-md font-semibold   place-items-center  bg-opacity-20 py-1 px-3 mr-4 bg-red-500 dark:text-red-400 text-red-600  "
                  >
                     Delete
                  </button>
               ) : null}
            </div>
         </div>
      </>
   );
};

function formatTime(seconds: number): string {
   // Get minutes
   const minutes = Math.floor(seconds / 60);
   // Remaining seconds after extracting minutes
   const remainingSeconds = seconds % 60;
   // Get whole seconds
   let wholeSeconds = Math.floor(remainingSeconds);
   // Get the tenth of a second
   let tenthOfSecond = Math.round((remainingSeconds - wholeSeconds) * 10);

   // If tenthOfSecond is 10, reset it to 0 and increment wholeSeconds
   if (tenthOfSecond === 10) {
      tenthOfSecond = 0;
      wholeSeconds++;
   }

   // Format the string to MM:SS:D
   return `${String(minutes).padStart(2, "0")}:${String(wholeSeconds).padStart(2, "0")}:${tenthOfSecond}`;
}
