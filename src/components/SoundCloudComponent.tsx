import Script from "next/script";
import { useState } from "react";
import { trpc } from "../utils/trpc";

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
         <div className="h-[95px] bg-red-200 flex flex-col justify-center items-center">
            <p>paste a soundcloud embed url</p>
            <input onChange={(e) => setNewUrl(e.target.value)} className="w-[800px] h-8" type="text" />
            <button
               onClick={async () => {
                  const trackId = await fetch(`/api/getSoundCloudTrackId?url=${newUrl}`)
                     .then((r) => r.json())
                     .then((r) => r.trackId);
                  console.log(trackId);
                  setSoundCloudTrackId(trackId);
               }}
            >
               go
            </button>
         </div>
      );
   }

   function handleLoad() {
      let SC = (window as any).SC;
      var widgetIframe = document.getElementById("iframe");
      let player = SC.Widget(widgetIframe);

      player.bind(SC.Widget.Events.READY, () => {
         player.getDuration((e: any) => {
            setSongDuration(e);
         });
         player.bind(SC.Widget.Events.PLAY_PROGRESS, (e: any) => {
            setPosition(e.currentPosition / 1000);
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
         <Script onLoad={handleLoad} strategy="lazyOnload" src="https://w.soundcloud.com/player/api.js" />

         <div className="">
            <iframe
               scrolling="no"
               frameBorder="no"
               id="iframe"
               width={songDuration ? songDuration / 100 + 123 : "100%"}
               height="95"
               allow="autoplay"
               src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${soundCloudTrackId}&color=%2331292d&auto_play=false`}
            ></iframe>
         </div>
      </>
   );
};
