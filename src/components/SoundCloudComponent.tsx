import Script from "next/script";

export const SoundCloudComponent: React.FC<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
}> = ({ setPosition, setIsPlaying, setSongDuration, songDuration }) => {
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
               src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1310078686`}
            ></iframe>
         </div>
      </>
   );
};
