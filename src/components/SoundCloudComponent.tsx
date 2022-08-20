import Script from "next/script";
import { useRef, useState } from "react";
import { useEffect } from "react";

export const SoundCloudComponent: React.FC<{ setPositionSeconds: Function; setIsPlaying: Function }> = ({ setPositionSeconds, setIsPlaying }) => {
   const [duration, setDuration] = useState(null);
   function handleLoad() {
      var widgetIframe = document.getElementById("iframe"),
         player = SC.Widget(widgetIframe);

      player.bind(window.SC.Widget.Events.READY, () => {
         console.log("READY");
         player.getDuration((e) => {
            setDuration(e);
         });
         player.bind(SC.Widget.Events.PLAY_PROGRESS, (e) => {
            setPositionSeconds(e.currentPosition / 1000);
         });
         player.bind(SC.Widget.Events.PLAY, (e) => {
            setIsPlaying(true);
         });
         player.bind(SC.Widget.Events.PAUSE, (e) => {
            setIsPlaying(false);
         });
         player.bind(SC.Widget.Events.FINISH, (e) => {
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
               width={duration ? duration / 100 : "100%"}
               height="95"
               allow="autoplay"
               src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1310078686`}
            ></iframe>
         </div>
         {/* <button onClick={() => widget.getPosition((position: number) => console.log(position / 1000))}>PLAY</button> */}
      </>
   );
};
