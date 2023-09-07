import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { formation } from "../../../../types/types";
import TimelinePlugin from "../../../../timeline-plugin";
import { useStore } from "../store";
import { useGesture } from "@use-gesture/react";

export const NoFilePlayer: React.FC<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;

   setSelectedFormation: Function;

   pixelsPerSecond: number;
   player: any;
   setPlayer: Function;
   // formations: formation[];
   videoPlayer: any;
   isPlaying: boolean;
   position: number;
   playbackRate: number;
   currentFormationIndex: number;
}> = memo(
   ({
      setPosition,
      setIsPlaying,
      setSongDuration,

      setSelectedFormation,

      pixelsPerSecond,
      player,
      setPlayer,
      videoPlayer,
      // formations,
      isPlaying,
      position,
      playbackRate,
      currentFormationIndex,
   }) => {
      const { formations, get, setSelectedFormations, isMobileView } = useStore();
      let songDuration = formations.map((formation) => formation.durationSeconds + formation.transition.durationSeconds).reduce((a, b) => a + b, 0);
      // console.log({ playbackRate });
      useEffect(() => {
         let interval;
         if (isPlaying) {
            interval = setInterval(() => {
               const prevTime = get().position;
               let newTime = prevTime;
               if (prevTime < songDuration) {
                  //  console.log("adding 0.5 sec");
                  newTime = prevTime + 0.02;
                  // playbackRate
               } else {
                  setIsPlaying(false);
                  newTime = 0;
               }
               setPosition(newTime);
            }, 20);
         }
         return () => clearInterval(interval);
      }, [isPlaying, songDuration, playbackRate]);
      const timeline = useRef();
      useGesture(
         {
            onDrag: ({ event: e, cancel }) => {
               if (isMobileView) cancel();
               const formationIdToSelect = formations.find((formation, i) => i === currentFormationIndex)?.id || null;
               setSelectedFormations(formationIdToSelect ? [formationIdToSelect] : []);

               e.preventDefault();
               if (!e.currentTarget) return;
               var rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

               var x = (e as MouseEvent).clientX - rect.left; //x position within the element.

               songDuration = (songDuration || 0) / 1000;
               const clickEventSeconds = x / pixelsPerSecond;
               if (clickEventSeconds < 0) return;
               setPosition(clickEventSeconds);
               if (clickEventSeconds < songDuration && player) {
                  player.seekTo(Math.max(Math.min(1, clickEventSeconds / songDuration), 0));
               }
               if (isPlaying) {
                  if (clickEventSeconds < songDuration && position > songDuration) {
                     player.play();
                  }
                  if (clickEventSeconds > songDuration && position < songDuration) {
                     player.pause();
                  }
               }
            },
            onClick: ({ event: e }) => {
               if (!isMobileView) return;
               const formationIdToSelect = formations.find((formation, i) => i === currentFormationIndex)?.id || null;
               setSelectedFormations(formationIdToSelect ? [formationIdToSelect] : []);

               e.preventDefault();
               if (!e.currentTarget) return;
               var rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

               var x = (e as MouseEvent).clientX - rect.left; //x position within the element.

               songDuration = (songDuration || 0) / 1000;
               const clickEventSeconds = x / pixelsPerSecond;
               if (clickEventSeconds < 0) return;
               setPosition(clickEventSeconds);
               if (clickEventSeconds < songDuration && player) {
                  player.seekTo(Math.max(Math.min(1, clickEventSeconds / songDuration), 0));
               }
               if (isPlaying) {
                  if (clickEventSeconds < songDuration && position > songDuration) {
                     player.play();
                  }
                  if (clickEventSeconds > songDuration && position < songDuration) {
                     player.pause();
                  }
               }
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
                  width:
                     formations.map((formation) => formation.durationSeconds + formation.transition.durationSeconds).reduce((a, b) => a + b, 0) *
                     pixelsPerSecond,
               }}
            >
               <div
                  onClick={(e) => {
                     var rect = e.target.getBoundingClientRect();
                     var x = e.clientX - rect.left; //x position within the element.
                     setPosition(x / pixelsPerSecond);
                  }}
                  className={` h-[35px]   flex-col justify-end w-full`}
               ></div>
            </div>
         </>
      );
   }
);
