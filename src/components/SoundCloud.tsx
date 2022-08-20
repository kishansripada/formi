import Script from "next/script";

export const SoundCloud: React.FC<{}> = () => {
   //    var widget = SC.Widget("iframe");
   //    console.log(widget);

   return (
      <>
         <Script src="https://w.soundcloud.com/player/api.js" />

         <div className="">
            <iframe
               id="iframe"
               width="3000"
               height="95"
               allow="autoplay"
               src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1310078686"
            ></iframe>
         </div>
      </>
   );
};
