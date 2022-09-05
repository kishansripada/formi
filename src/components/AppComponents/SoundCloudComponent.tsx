import Script from "next/script";
import { useEffect, useState } from "react";
import logo from "../../../public/logo.svg";
import Image from "next/image";

export const SoundCloudComponent: React.FC<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
}> = ({ setPosition, setIsPlaying, setSongDuration, songDuration, soundCloudTrackId, setSoundCloudTrackId }) => {
   const [newUrl, setNewUrl] = useState("");

   if (!soundCloudTrackId) {
      return (
         <>
            <div className="fixed top-0 left-0 z-[70] flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]">
               <div className="flex  w-[700px] flex-col rounded-xl bg-white">
                  <div className="flex flex-col rounded-xl px-10 py-10 h-full">
                     <div className="flex flex-row items-center mb-12">
                        <img src="https://static.cdnlogo.com/logos/s/19/soundcloud.svg" className="w-24" alt="" />
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-6 h-6 mx-6 scale-150"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <Image src={logo} width={200} height={80} />
                     </div>
                     <div className="flex flex-col mt-auto">
                        <p className="text-xl">Let's add a SoundCloud track to get started!</p>
                        <p className="">Paste a link to a public track URL below:</p>
                        <div className="flex flex-row items-center">
                           <input
                              onChange={(e) => setNewUrl(e.target.value)}
                              className=" border-black border-2 rounded-md focus:outline-none px-2 h-8 mt-3 grow mr-3"
                              type="text"
                           />
                           <button
                              onClick={async () => {
                                 const trackId = await fetch(`/api/getSoundCloudTrackId?url=${newUrl}`)
                                    .then((r) => r.json())
                                    .then((r) => r.trackId);
                                 console.log(trackId);
                                 setSoundCloudTrackId(trackId);
                              }}
                              className="ml-auto mt-3 bg-pink-600 hover:bg-pink-700 rounded-xl text-white px-3 py-2"
                           >
                              Get Started
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </>
      );
   }

   function handleLoad() {
      let SC = (window as any).SC;
      var widgetIframe = document.getElementById("iframe");
      let player = SC.Widget(widgetIframe);

      player.bind(SC.Widget.Events.READY, () => {
         console.log("readt");
         player.getDuration((e: any) => {
            setSongDuration(e);
         });
         player.bind(SC.Widget.Events.PLAY_PROGRESS, (e: any) => {
            setPosition(parseFloat((e.currentPosition / 1000).toFixed(2)));
         });
         player.bind(SC.Widget.Events.PLAY, (e: any) => {
            setIsPlaying(true);
         });
         player.bind(SC.Widget.Events.PAUSE, (e: any) => {
            setIsPlaying(false);
         });
         player.bind(SC.Widget.Events.FINISH, (e: any) => {
            setIsPlaying(false);
         });
      });
   }

   return (
      <>
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
};
