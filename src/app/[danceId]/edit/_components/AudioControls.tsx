import { dancer, dancerPosition, formation, localSettings, MAX_PIXELS_PER_SECOND } from "../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "../store";

export const AudioControls: React.FC<{
   setSelectedFormation: Function;
   player: any;
   isPlaying: boolean;
   setIsPlaying: Function;
   // formations: formation[];
   position: number | null;
   // setFormations: Function;
   songDuration: number | null;
   selectedFormation: number | null;
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
   setHelpUrl: Function;
}> = ({
   setSelectedFormation,
   player,
   isPlaying,
   setIsPlaying,
   // formations,
   position,
   // setFormations,
   songDuration,
   selectedFormation,
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
   setHelpUrl,
}) => {
   const { formations, setFormations, viewOnly } = useStore();

   const [playbackRateIndex, setPlaybackRateIndex] = useState(2);
   const playbackRates = [0.25, 0.5, 1, 1.5, 2];

   let minPixelsPerSecond = songDuration ? ((window.screen.width - 10) * 1000) / songDuration : 10;
   let percentZoom = (pixelsPerSecond - minPixelsPerSecond) / (MAX_PIXELS_PER_SECOND - minPixelsPerSecond);

   useEffect(() => {
      let animationFrameId;

      const handleMouseMove = (e) => {
         if (isChangingZoom) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
               let newPixelsPerSecond = pixelsPerSecond + (e.movementX / 96) * (MAX_PIXELS_PER_SECOND - minPixelsPerSecond);
               if (newPixelsPerSecond > minPixelsPerSecond && newPixelsPerSecond < MAX_PIXELS_PER_SECOND) {
                  setPixelsPerSecond(newPixelsPerSecond);
               }
            });
         }
      };
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
         cancelAnimationFrame(animationFrameId);
         window.removeEventListener("mousemove", handleMouseMove);
      };
   }, [isChangingZoom, pixelsPerSecond, MAX_PIXELS_PER_SECOND]);

   const newFormation = () => {
      let id = uuidv4();
      setFormations([
         ...formations,
         {
            ...formations[formations.length - 1],
            id,
            name: `Untitled ${formations.length + 1}`,
            positions: formations[formations.length - 1]?.positions.map((dancer: dancerPosition) => {
               return {
                  ...dancer,
                  transitionType: "linear",
               };
            }),
            notes: "",
         },
      ]);
      setSelectedFormation(formations.length);
      pushChange();
   };
   const totalDurationOfFormations = formations
      .map((formation, i) => formation.durationSeconds + (i === 0 ? 0 : formation.transition.durationSeconds))
      .reduce((a, b) => a + b, 0);
   // const timelineWidth = (songDuration ? Math.max(totalDurationOfFormations, songDuration / 1000) : totalDurationOfFormations) * pixelsPerSecond;

   const playPause = () => {
      if (player) {
         if (player.isReady) {
            if (position < songDuration / 1000) {
               player.playPause();
            }

            setIsPlaying(!isPlaying);
         }
      } else {
         setIsPlaying(!isPlaying);
      }
   };

   return (
      <>
         <div className="min-h-[45px]  dark:bg-black dark:text-neutral-100  bg-neutral-50 w-full border-t dark:border-neutral-700  border-neutral-300 flex flex-row items-center justify-between select-none">
            <div className="w-[45%] flex flex-col items-center justify-center   pl-4">
               {!viewOnly ? (
                  <>
                     <div className="flex flex-row items-center justify-center mr-auto ">
                        <button
                           onClick={newFormation}
                           className=" rounded-md  hidden transition duration-300   mr-4  lg:flex  flex-row items-center   cursor-pointer  "
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

                           <p className="text-sm">New Formation </p>
                        </button>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-5 h-5 ml-1  cursor-pointer"
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
               <button onClick={() => setSelectedFormation(selectedFormation === null ? 0 : selectedFormation === 0 ? 0 : selectedFormation - 1)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                  </svg>
               </button>
               {isPlaying ? (
                  <div
                     className={`hover:bg-neutral-100 dark:hover:bg-neutral-800  transition duration-300 cursor-pointer p-1 rounded-2xl mx-3 select-none`}
                     onClick={playPause}
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
                     onClick={playPause}
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
               <button onClick={() => setSelectedFormation(selectedFormation === formations.length - 1 ? selectedFormation : selectedFormation + 1)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                  </svg>
               </button>
            </div>

            <div className="w-[45%] pr-10 flex flex-row  items-center ">
               <p className=" mr-auto  dark:text-neutral-400 text-neutral-600 ">
                  <span>{formatTime(position || 0)}</span>
               </p>

               <button
                  onClick={() => {
                     setLocalSettings((s) => ({ ...s, autoScroll: !s.autoScroll }));
                  }}
                  className={`py-1 px-2 rounded-md border focus:outline-none hidden lg:flex flex-row items-center ${
                     localSettings.autoScroll ? "dark:border-pink-600 border-pink-300 " : " border-neutral-200 dark:border-neutral-600"
                  }`}
               >
                  <svg
                     className="h-4 w-5 mr-2 dark:fill-white fill-neutral-800"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 57 352.71 403"
                  >
                     <path d="M189.856 204c-6.158 10.667-21.554 10.667-27.712 0L91.1295 81c-6.1584-10.6667 1.5396-24 13.8565-24h142.028c12.317 0 20.015 13.3333 13.857 24l-71.015 123Z" />
                     <rect width="34" height="372" x="159" y="88" rx="16" />
                     <rect width="27" height="128" x="109.708" y="296.51" rx="8" transform="rotate(135 109.708 296.51)" />
                     <rect width="27" height="128" x="90.5095" y="278.25" rx="8" transform="rotate(45 90.5095 278.25)" />
                     <rect width="27" height="128" x="243" y="297.341" rx="8" transform="rotate(-45 243 297.341)" />
                     <rect width="27" height="128" x="262.199" y="315.601" rx="8" transform="rotate(-135 262.199 315.601)" />
                  </svg>
                  <p className="text-sm">Auto Scroll</p>
               </button>
               <button
                  className="hidden lg:block ml-7"
                  onClick={() => {
                     setPlaybackRateIndex((i) => i + 1);
                     setPlaybackRate(playbackRates[(playbackRateIndex + 1) % 5]);
                     // console.log(playbackRates[(playbackRateIndex + 1) % 5]);
                     if (player) {
                        player.setPlaybackRate(playbackRates[(playbackRateIndex + 1) % 5]);
                     }
                  }}
               >
                  <p>{JSON.stringify(playbackRates[playbackRateIndex % 5])}x</p>
               </button>

               <div className="flex flex-row items-center ml-7 text-neutral-700 dark:text-neutral-200">
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

                  <div className="w-24 rounded-full h-1 dark:bg-neutral-600 bg-neutral-200 mx-2 relative">
                     <div
                        onMouseDown={() => {
                           setIsChangingZoom(true);
                        }}
                        style={{
                           left: `${Math.round(percentZoom * 100)}%`,
                        }}
                        className="h-4  w-4 border-[3px] dark:border-pink-600 border-pink-300 rounded-full hover:shadow absolute box-border -translate-y-1/2 -translate-x-1/2 bg-white dark:bg-black cursor-pointer top-[2px]"
                     ></div>
                  </div>

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
         </div>
      </>
   );
};

function formatTime(seconds: number): string {
   const totalMilliseconds = Math.round(seconds * 1000);
   const totalSeconds = Math.round(totalMilliseconds / 1000);
   const minutes = Math.floor(totalSeconds / 60);
   const remainingSeconds = totalSeconds % 60;
   const deciseconds = Math.floor(totalMilliseconds / 100) % 10;

   const formattedMinutes = minutes.toString().padStart(2, "0");
   const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
   const formattedDeciseconds = deciseconds.toString();

   return `${formattedMinutes}:${formattedSeconds}:${formattedDeciseconds}`;
}
