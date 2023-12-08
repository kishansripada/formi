import { useEffect, useState } from "react";

export const HelpUrl: React.FC<{
   setHelpUrl: Function;
   helpUrl: { url: string; event: MouseEvent };
}> = ({ setHelpUrl, helpUrl }) => {
   // // need to check to see if setting the video to the top-left would cut off the video
   // //    console.log(helpUrl.event.clientY);
   // const [translateYFull, setTranslateYFull] = useState(false);
   // useEffect(() => {
   //    if (!helpUrl?.event?.clientY) return;
   //    // get window height
   //    const windowHeight = window.innerHeight;
   //    setTranslateYFull(windowHeight - helpUrl.event.clientY < 560);
   // }, [helpUrl]);
   // return (
   //       <div
   //          onClick={() => {
   //             setHelpUrl(null);
   //             // setLocalSettings({ ...localSettings, hasNotSeenIntroVid: false });
   //          }}
   //          className="fixed top-0 left-0 z-[70] flex h-screen w-screen items-center justify-center "
   //       >
   //          <div className="  flex flex-row items-center justify-center">
   //             {/* <div className="w-full"></div> */}
   //             <iframe
   //                src={`https://www.youtube.com/embed/${
   //                   helpUrl?.url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/)[1]
   //                }?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=0`}
   //                title="YouTube video player"
   //                width="315"
   //                height="560"
   //                allow="accelerometer; autoplay; clipboard-write; encrypted-media;
   // gyroscope; picture-in-picture;
   // web-share"
   //                style={{
   //                   left: helpUrl.event ? helpUrl.event.clientX : "unset",
   //                   top: helpUrl.event ? helpUrl.event.clientY : "unset",
   //                   transform: ` translateY(${translateYFull ? "-100%" : "0%"})`,
   //                }}
   //                className="rounded-xl absolute  "
   //             ></iframe>
   //          </div>
   //       </div>
   // );
};
