import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { formation } from "../../../../types/types";
import TimelinePlugin from "../../../../timeline-plugin";
import { useStore } from "../store";
import { useGesture } from "@use-gesture/react";

export const NoFilePlayer: React.FC<{
   pixelsPerSecond: number;
   playbackRate: number;
}> = memo(({ pixelsPerSecond, playbackRate }) => {
   let { get, isMobileView, goToPosition, isPlaying, setIsPlaying, setPosition } = useStore();
   const totalDurationOfFormations = useStore((state) => state.getTotalDurationOfFormations());

   useEffect(() => {
      let interval;
      if (isPlaying) {
         interval = setInterval(() => {
            const prevTime = get().position;
            let newTime;
            if (prevTime < totalDurationOfFormations + 1) {
               newTime = prevTime + 0.02;
            } else {
               setIsPlaying(false);
               newTime = 0;
            }
            setPosition(newTime);
         }, 20);
      }
      return () => clearInterval(interval);
   }, [isPlaying, totalDurationOfFormations, playbackRate]);

   const timeline = useRef();
   useGesture(
      {
         onDrag: ({ event: e, cancel }) => {
            if (isMobileView) cancel();

            e.preventDefault();
            if (!e.currentTarget) return;
            var rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            var x = (e as MouseEvent).clientX - rect.left; //x position within the element.
            goToPosition(x / pixelsPerSecond);
         },
         onClick: ({ event: e }) => {
            if (!isMobileView) return;
            e.preventDefault();
            if (!e.currentTarget) return;
            var rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            var x = (e as MouseEvent).clientX - rect.left; //x position within the element.
            goToPosition(x / pixelsPerSecond);
         },
      },

      {
         eventOptions: { passive: false },
         target: timeline.current,
         drag: { enabled: !isMobileView },
      }
   );
   return (
      <>
         <div
            className="relative "
            ref={timeline}
            style={{
               width: totalDurationOfFormations * pixelsPerSecond,
            }}
         >
            <div className={` h-[30px]   flex-col justify-end w-full`}></div>
         </div>
      </>
   );
});
