import Script from "next/script";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { PIXELS_PER_SECOND, formation } from "../../types/types";
import { v4 as uuidv4 } from "uuid";

export const SoundCloudComponent: React.FC<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSelectedFormation: Function;
   setFormations: Function;
   viewOnly: boolean;
}> = memo(({ setPosition, setIsPlaying, setSongDuration, songDuration, soundCloudTrackId, setFormations, setSelectedFormation, viewOnly }) => {
   const [player, setPlayer] = useState(null);

   // console.log("SoundCloudComponent rerendered");

   function handleLoad() {
      // console.log("handling load");

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
            setPosition(Math.ceil(e.currentPosition / 1000 / 0.01666) * 0.01666);
         });

         player.bind(SC.Widget.Events.PLAY, () => {
            console.log("play fired");
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
         <Script onReady={handleLoad} strategy="lazyOnload" src="https://w.soundcloud.com/player/api.js" />

         <div className="">
            <iframe
               scrolling="no"
               frameBorder="no"
               id="iframe"
               width="100%"
               // width={songDuration ? (songDuration / 1000) * pixelsPerSecond + 130 : "100%"}
               height="95"
               allow="autoplay"
               src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${soundCloudTrackId}&color=%23b42ae7&auto_play=false`}
            ></iframe>
         </div>
      </>
   );
});
