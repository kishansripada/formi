import { dancer, dancerPosition, formation, PIXELS_PER_SECOND } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export const AudioControls: React.FC<{
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
}) => {
   const [isChangingZoom, setIsChangingZoom] = useState(false);
   const [playbackRateIndex, setPlaybackRateIndex] = useState(2);
   const playbackRates = [0.25, 0.5, 1, 1.5, 2];

   let MAX_PIXELS_PER_SECOND = 45;
   let minPixelsPerSecond = songDuration ? ((window.screen.width - 10) * 1000) / songDuration : 10;
   let percentZoom = (pixelsPerSecond - minPixelsPerSecond) / (MAX_PIXELS_PER_SECOND - minPixelsPerSecond);

   const handleMouseMove = (e) => {
      if (isChangingZoom) {
         // console.log(pixelsPerSecond + (e.movementX / 96) * (MAX_PIXELS_PER_SECOND - minPixelsPerSecond));
         let newPixelsPerSecond = pixelsPerSecond + (e.movementX / 96) * (MAX_PIXELS_PER_SECOND - minPixelsPerSecond);
         if (newPixelsPerSecond > minPixelsPerSecond && newPixelsPerSecond < MAX_PIXELS_PER_SECOND) {
            setPixelsPerSecond(newPixelsPerSecond);
         }
      }
   };

   // useEffect(() => {
   //    window.addEventListener("mousemove", handleMouseMove);

   //    return () => window.removeEventListener("mousemove", handleMouseMove);
   // }, [isChangingZoom, pixelsPerSecond]);

   // const handleDocumentMouseUp = () => {
   //    setIsChangingZoom(false);
   // };

   // useEffect(() => {
   //    document.addEventListener("mouseup", handleDocumentMouseUp);
   //    return () => {
   //       document.removeEventListener("mouseup", handleDocumentMouseUp);
   //    };
   // }, []);

   return (
      <>
         <div className="min-h-[50px] bg-[#fafafa] w-full border-t border-gray-300 flex flex-row items-center justify-between select-none">
            <div className="w-[45%] flex flex-col items-center justify-center   pl-4">
               {!viewOnly ? (
                  <>
                     <div className="flex flex-row items-center justify-center mr-auto">
                        <button
                           onClick={() => {
                              addToStack();
                              let id = crypto.randomUUID();
                              setFormations((formations: formation[]) => {
                                 return [
                                    ...formations,
                                    {
                                       ...formations[formations.length - 1],
                                       id,
                                       name: `Untitled ${formations.length + 1}`,
                                    },
                                 ];
                              });
                              setSelectedFormation(formations.length);
                              pushChange();
                           }}
                           className=" rounded-md  hidden transition duration-300  text-[#18191B]  hover:bg-gray-100 lg:flex  flex-row items-center  px-2 py-2  cursor-pointer  "
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 mr-1"
                           >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>

                           <p className="text-sm">Add</p>
                        </button>
                        <button
                           onClick={() => {
                              if (selectedFormation === null) return;

                              if (formations.length === 1) {
                                 toast.error("you must have at least one formation");
                                 return;
                              }
                              addToStack();
                              if (selectedFormation === formations.length - 1) {
                                 setSelectedFormation(selectedFormation - 1);
                              }

                              setFormations((formations: formation[]) => {
                                 return formations.filter((formation, index) => {
                                    return index !== selectedFormation;
                                 });
                              });
                              toast.success("formation deleted");
                              pushChange();
                           }}
                           className="rounded-md  hidden transition duration-300   text-[#18191B]  hover:bg-gray-100 lg:flex  flex-row items-center  px-2 py-2  cursor-pointer "
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 mr-1"
                           >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                           <p className="text-sm"> Delete </p>
                        </button>
                        <button
                           onClick={() => {
                              if (selectedFormation === null) return;

                              addToStack();

                              setFormations((formations: formation[]) => {
                                 formations.splice(selectedFormation + 1, 0, {
                                    ...formations[selectedFormation],
                                    id: crypto.randomUUID(),
                                    name: formations[selectedFormation].name + " copy",
                                 });
                                 return formations;
                              });
                              setSelectedFormation((i) => i + 1);
                              toast.success("formation duplicated");
                              pushChange();
                           }}
                           className="rounded-md  hidden transition duration-300 mr-auto  text-[#18191B]  hover:bg-gray-100 lg:flex  flex-row items-center  px-2 py-2  cursor-pointer "
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 mr-1"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                              />
                           </svg>

                           <p className="text-sm">Duplicate</p>
                        </button>
                     </div>
                  </>
               ) : null}
            </div>

            <div className={`flex flex-row items-center justify-center w-[10%] `}>
               <button
                  onClick={() =>
                     setSelectedFormation((i: number | null) => {
                        if (i === null) return 0;
                        return i === 0 ? 0 : i - 1;
                     })
                  }
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
                     />
                  </svg>
               </button>
               {isPlaying ? (
                  <div
                     className={`hover:bg-gray-100 transition duration-300 cursor-pointer p-1 rounded-2xl mx-3 select-none ${
                        !soundCloudTrackId && !localSource ? "opacity-40 pointer-events-none" : ""
                     }`}
                     onClick={() => {
                        if (!player) return;
                        if (!player.isReady) return;
                        player.playPause();
                        setIsPlaying(!isPlaying);
                     }}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 fill-gray-600">
                        <path
                           fillRule="evenodd"
                           d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                           clipRule="evenodd"
                        />
                     </svg>
                  </div>
               ) : (
                  <div
                     className={`hover:bg-gray-100 transition duration-300 p-1 rounded-2xl mx-3 select-none cursor-pointer ${
                        !soundCloudTrackId && !localSource ? "opacity-40 pointer-events-none" : ""
                     }`}
                     onClick={() => {
                        if (!player) return;
                        if (!player.isReady) return;
                        player.playPause();
                        setIsPlaying(!isPlaying);
                     }}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 fill-gray-600">
                        <path
                           fillRule="evenodd"
                           d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                           clipRule="evenodd"
                        />
                     </svg>
                  </div>
               )}
               <button onClick={() => setSelectedFormation((i) => (i === formations.length - 1 ? i : i + 1))}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
                     />
                  </svg>
               </button>
            </div>

            <div className="w-[45%] pr-10 flex flex-row justify-center items-center ">
               <p className=" ml-auto lg:mr-auto text-gray-600 ">
                  {msToTime((position || 0) * 1000)}:<span className="text-gray-500">{Math.round(((position || 0) * 10) % 10)}</span>
               </p>

               <button
                  className="hidden lg:block"
                  onClick={() => {
                     setPlaybackRateIndex((i) => i + 1);
                     player.setPlaybackRate(playbackRates[(playbackRateIndex + 1) % 5]);
                  }}
               >
                  <p>{JSON.stringify(playbackRates[playbackRateIndex % 5])}x</p>
               </button>

               {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 mr-2 ml-auto lg:block hidden"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                  />
               </svg>

               <p className=" font-medium whitespace-nowrap overflow-hidden lg:block hidden ">
                  {soundCloudTrackId ? soundCloudTrackId?.split("/").slice(-1)[0] : "No Audio Selected"}
               </p> */}

               {/* <div className="flex flex-row items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                     />
                  </svg>

                  <div className="w-24 rounded-full h-1 bg-gray-200 mx-2 relative">
                     <div
                        onMouseDown={() => {
                           setIsChangingZoom(true);
                        }}
                        // onMouseMove={(e) => {
                        //    if (isChangingZoom) {
                        //       // console.log(pixelsPerSecond + (e.movementX / 96) * (MAX_PIXELS_PER_SECOND - minPixelsPerSecond));
                        //       let newPixelsPerSecond = pixelsPerSecond + (e.movementX / 96) * (MAX_PIXELS_PER_SECOND - minPixelsPerSecond);
                        //       if (newPixelsPerSecond > minPixelsPerSecond && newPixelsPerSecond < MAX_PIXELS_PER_SECOND) {
                        //          setPixelsPerSecond(newPixelsPerSecond);
                        //       }
                        //    }
                        // }}
                        style={{
                           left: `${Math.round(percentZoom * 100)}%`,
                        }}
                        className="h-4  w-4 border-[3px] border-pink-600 rounded-full hover:shadow absolute box-border -translate-y-1/2 -translate-x-1/2 bg-white cursor-pointer top-[2px]"
                     ></div>
                  </div>

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                     />
                  </svg>
               </div> */}
            </div>
         </div>
      </>
   );
};

function msToTime(duration) {
   var seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = hours < 10 ? "0" + hours : hours;
   minutes = minutes < 10 ? "0" + minutes : minutes;
   seconds = seconds < 10 ? "0" + seconds : seconds;

   return minutes + ":" + seconds;
}
