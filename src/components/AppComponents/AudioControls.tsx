import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
}) => {
   return (
      <>
         <div className="min-h-[60px] bg-[#fafafa] w-full border-t border-gray-300 flex flex-row items-center justify-between select-none">
            <div className="w-[45%] pl-10 flex flex-row justify-center items-center ">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 mr-2 lg:block hidden"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                  />
               </svg>

               <p className="mr-auto font-medium whitespace-nowrap overflow-hidden lg:block hidden ">
                  {soundCloudTrackId ? soundCloudTrackId?.split("/").slice(-1)[0] : "no audio file selected"}
               </p>
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
                        !soundCloudTrackId ? "opacity-40 pointer-events-none" : ""
                     }`}
                     onClick={() => {
                        player ? player.playPause() : null;
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
                        !soundCloudTrackId ? "opacity-40 pointer-events-none" : ""
                     }`}
                     onClick={() => {
                        player ? player.playPause() : null;
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

            <div className="w-[45%] flex flex-row items-center justify-center pr-10">
               <p className=" ml-auto lg:mr-auto text-gray-600 ">
                  {msToTime((position || 0) * 1000)}:<span className="text-gray-500">{Math.round(((position || 0) * 10) % 10)}</span>
               </p>
               {!viewOnly ? (
                  <>
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
                        className="rounded-md  hidden transition duration-300 ml-auto  text-[#18191B]  hover:bg-gray-100 lg:flex  flex-row items-center  px-3 py-2 mx-1 cursor-pointer "
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-6 h-6 mr-2"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        delete formation
                     </button>
                     <button
                        onClick={() => {
                           addToStack();
                           let id = uuidv4();
                           setFormations((formations: formation[]) => {
                              return [
                                 ...formations,
                                 {
                                    ...formations[formations.length - 1],
                                    id,
                                    name: `Untitled ${formations.length + 1}`,
                                    transition: {
                                       durationSeconds: 5,
                                    },
                                    durationSeconds: 10,
                                 },
                              ];
                              //   }
                           });
                           setSelectedFormation(formations.length);
                           pushChange();
                        }}
                        className=" rounded-md  hidden transition duration-300  text-[#18191B]  hover:bg-gray-100 lg:flex  flex-row items-center  px-3 py-2 mx-1 cursor-pointer  "
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-5 h-5 mr-2"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                        <p>new formation</p>
                     </button>
                  </>
               ) : null}
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
