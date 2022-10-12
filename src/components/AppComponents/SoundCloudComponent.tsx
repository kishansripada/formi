import Script from "next/script";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { PIXELS_PER_SECOND, formation } from "../../types/types";
export const SoundCloudComponent: React.FC<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
   setSelectedFormation: Function;
   setFormations: Function;
}> = memo(
   ({ setPosition, setIsPlaying, setSongDuration, songDuration, soundCloudTrackId, setSoundCloudTrackId, setFormations, setSelectedFormation }) => {
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
         setPlayer(SC.Widget(widgetIframe));
         let player = SC.Widget(widgetIframe);

         player.bind(SC.Widget.Events.READY, (e: any) => {
            // console.log("ready");
            player.getDuration((e: any) => {
               // console.log("getting duration");
               setSongDuration(e);
            });
            // console.log("new position bound");
            player.bind(SC.Widget.Events.PLAY_PROGRESS, (e: any) => {
               setPosition(Math.ceil(e.currentPosition / 1000 / 0.033) * 0.033);
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z"
                     />
                  </svg>
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
                           return [
                              ...formations,
                              {
                                 ...formations[formations.length - 1],
                                 name: `Untitled ${formations.length + 1}`,
                                 transition: {
                                    durationSeconds: 5,
                                 },
                                 durationSeconds: 10,
                              },
                           ];
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
                  width={songDuration ? (songDuration / 1000) * PIXELS_PER_SECOND + 123 : "100%"}
                  height="95"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${soundCloudTrackId}&color=%23b42ae7&auto_play=false`}
               ></iframe>
            </div>
         </>
      );
   }
);
