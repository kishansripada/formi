import { useGesture } from "@use-gesture/react";
import { useEffect, useRef, useState } from "react";

export const HelpUrl: React.FC<{
   setHelpUrl: Function;
   helpUrl: { url: string; event: MouseEvent };
}> = ({ setHelpUrl, helpUrl }) => {
   // need to check to see if setting the video to the top-left would cut off the video
   //    console.log(helpUrl.event.clientY);

   const [translateYFull, setTranslateYFull] = useState(false);
   useEffect(() => {
      if (!helpUrl?.event?.clientY) return;
      // get window height
      const windowHeight = window.innerHeight;
      setTranslateYFull(windowHeight - helpUrl.event.clientY < 560);
   }, [helpUrl]);

   useEffect(() => {
      // Function to handle the click event
      function handleClick(event) {
         // console.log("Button clicked!", event);
         if (event?.target?.attributes?.["video-url"]?.value) {
            setHelpUrl({ url: event.target.attributes["video-url"].value, event: { clientX: event.clientX, clientY: event.clientY } });
         }
         // You can perform any action you want when the button is clicked here.
      }

      // Add a click event listener to the document when the component mounts
      document.addEventListener("click", handleClick);

      // Clean up the event listener when the component unmounts
      return () => {
         document.removeEventListener("click", handleClick);
      };
   }, []); // The empty array [] means this effect runs once when the component mounts
   const container = useRef(null);
   useGesture(
      {
         onDrag: ({ delta: [movementX, movementY] }) => {
            setHelpUrl((helpUrl) => {
               return {
                  ...helpUrl,
                  event: { ...helpUrl.event, clientX: helpUrl.event.clientX + movementX, clientY: helpUrl.event.clientY + movementY },
               };
            });
         },

         onDragEnd: () => {
            // if (viewOnly) return;
            // roundPositions();
         },
      },

      {
         eventOptions: { passive: false },
         target: container.current,
      }
   );

   return (
      <div
         onClick={() => {
            // setHelpUrl(null);
            // setLocalSettings({ ...localSettings, hasNotSeenIntroVid: false });
         }}
         style={{
            pointerEvents: "none",
         }}
         className="fixed top-0 left-0 z-[70]  h-screen w-full  "
      >
         {helpUrl && (
            <div
               style={{
                  width: 720 / 3.5,
                  height: 1280 / 3.5,
                  left: helpUrl.event ? helpUrl.event.clientX : "unset",
                  top: helpUrl.event ? helpUrl.event.clientY : "unset",
                  transform: `translateY(${translateYFull ? "-100%" : "0%"})`,
               }}
               ref={container}
               className=" rounded-lg overflow-hidden relative bg-black shadow-2xl pointer-events-auto  cursor-pointer select-none"
            >
               <button onClick={() => setHelpUrl(null)} className="absolute top-3 pointer-events-auto right-3 ">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={2}
                     stroke="currentColor"
                     className="w-6 h-6 hover:scale-[1.2] transition "
                  >
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>

               <iframe
                  style={
                     {
                        // left: helpUrl.event ? helpUrl.event.clientX : "unset",
                        // top: helpUrl.event ? helpUrl.event.clientY : "unset",
                        // transform: `translateY(${translateYFull ? "-100%" : "0%"})`,
                        // width: 720 / 3,
                        // height: 1280 / 3,
                     }
                  }
                  src={helpUrl.url + "&autoplay=1"}
                  allow="autoplay; fullscreen; picture-in-picture"
                  className=" top-0 left-0 h-full w-full pointer-events-none"
                  title="TIMELINE"
               ></iframe>

               <script src="https://player.vimeo.com/api/player.js"></script>
            </div>
         )}
         <script src="https://player.vimeo.com/api/player.js"></script>
         {/* <div className="w-full flex flex-col h-full">
                     <button
                        onClick={() => {
                           setHelpUrl(null);
                        }}
                        className="mb-auto ml-2"
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-7 h-7 dark:text-white"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </button>
                  </div> */}
         {/* </div> */}
      </div>
   );
};
