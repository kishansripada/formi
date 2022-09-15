import Script from "next/script";
import { useEffect, useState } from "react";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { formation } from "../../types/types";

export const SoundCloudComponent: React.FC<{
   setFormations: Function;
   isPlaying: boolean;
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
   setSelectedFormation: Function;
}> = memo(
   ({
      setPosition,
      setIsPlaying,
      setSongDuration,
      songDuration,
      soundCloudTrackId,
      setSoundCloudTrackId,
      setFormations,
      isPlaying,
      setSelectedFormation,
   }) => {
      const [newUrl, setNewUrl] = useState("");
      const [player, setPlayer] = useState(null);
      console.log("SoundCloudComponent rerendered");
      if (!soundCloudTrackId) {
         return (
            <>
               <div className="fixed top-0 left-0 z-[70] flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]">
                  <div className="flex  w-[700px] flex-col rounded-xl bg-white">
                     <div className="flex flex-col rounded-xl px-10 py-10 h-full">
                        <div className="flex flex-col mt-auto">
                           <p className="text-xl text-gray-500">Add a SoundCloud track to get started</p>

                           <div className="flex flex-row items-center pt-3 ">
                              <div className="flex flex-row items-center  w-full border-2 rounded-md border-black">
                                 <input
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    className="  rounded-md focus:outline-none px-2 h-8  grow mr-3"
                                    type="text"
                                    placeholder="SoundCloud url..."
                                 />
                                 <img src="https://static.cdnlogo.com/logos/s/19/soundcloud.svg" className="w-12 mr-2" alt="" />
                              </div>

                              <button
                                 onClick={async () => {
                                    await fetch(`/api/getSoundCloudTrackId?url=${newUrl}`)
                                       .then((r) => r.json())
                                       .then((r) => {
                                          toast.success("successfully added SoundCloud track");
                                          // console.log(r.trackId);
                                          setSoundCloudTrackId(r.trackId);
                                       })
                                       .catch((r) => {
                                          toast.error("invalid SoundCloud url");
                                       });
                                 }}
                                 className=" bg-pink-600 hover:bg-pink-700 rounded-md text-white px-3 py-1 ml-3 w-32"
                              >
                                 Get Started
                              </button>
                           </div>
                        </div>

                        <div className="flex flex-row justify-center mt-20">
                           <p>
                              or{" "}
                              <button
                                 onClick={() => {
                                    setSoundCloudTrackId("257461521");
                                    toast.success("using example track");
                                 }}
                                 className="text-pink-600"
                              >
                                 use example track
                              </button>
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               <Toaster />
            </>
         );
      }

      function handleLoad() {
         console.log("handling load");
         let SC = (window as any).SC;
         var widgetIframe = document.getElementById("iframe");
         let player = SC.Widget(widgetIframe);
         setPlayer(player);
         player.bind(SC.Widget.Events.READY, (e: any) => {
            console.log("ready");
            player.getDuration((e: any) => {
               console.log("getting duration");
               setSongDuration(e);
            });
            player.bind(SC.Widget.Events.PLAY_PROGRESS, (e: any) => {
               setPosition(Math.ceil(e.currentPosition / 1000 / 0.016) * 0.016);
               // setPosition(Math.round(e.currentPosition / 10) / 100);
               // setPosition(e.currentPosition / 1000);
            });

            player.bind(SC.Widget.Events.PLAY, () => {
               setIsPlaying(true);
            });
            player.bind(SC.Widget.Events.PAUSE, () => {
               setIsPlaying(false);
            });
            player.bind(SC.Widget.Events.FINISH, () => {
               setIsPlaying(false);
            });
         });
      }

      return (
         <>
            <div
               className="fixed flex flex-row justify-start "
               style={{
                  left: "50%",
                  transform: "translateX(-50%)",
               }}
            >
               <button
                  onClick={() => (player ? (player as any).toggle() : null)}
                  className=" rounded-b-md bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 mx-1 "
               >
                  {isPlaying ? (
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                  ) : (
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                        />
                     </svg>
                  )}
               </button>
               <button
                  onClick={() => {
                     setFormations((formations: formation[]) => {
                        if (!formations.length) {
                           setSelectedFormation(formations.length);
                           return [
                              ...formations,
                              {
                                 durationSeconds: 10,
                                 positions: [],
                                 transition: {
                                    durationSeconds: 5,
                                 },
                                 name: `Untitled ${formations.length + 1}`,
                              },
                           ];
                        } else {
                           setSelectedFormation(formations.length);
                           return [...formations, { ...formations[formations.length - 1], name: `Untitled ${formations.length + 1}` }];
                        }
                     });
                  }}
                  className=" rounded-b-md bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 mx-1 cursor-pointer"
               >
                  + new formation
               </button>
            </div>
            <Script onReady={handleLoad} strategy="lazyOnload" src="https://w.soundcloud.com/player/api.js" />

            <div className="">
               <iframe
                  scrolling="no"
                  frameBorder="no"
                  id="iframe"
                  width={songDuration ? songDuration / 100 + 123 : "100%"}
                  height="95"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${soundCloudTrackId}&color=%23b42ae7&auto_play=false`}
               ></iframe>
            </div>
         </>
      );
   }
);
