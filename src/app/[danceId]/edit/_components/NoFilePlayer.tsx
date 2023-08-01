import Script from "next/script";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { formation } from "../../../../types/types";
import TimelinePlugin from "../../../../timeline-plugin";

export const NoFilePlayer: React.FC<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;

   soundCloudTrackId: string | null;
   setSelectedFormation: Function;
   setFormations: Function;
   viewOnly: boolean;
   pixelsPerSecond: number;
   player: any;
   setPlayer: Function;
   formations: formation[];
   videoPlayer: any;
   isPlaying: boolean;
   position: number;
   playbackRate: number;
}> = memo(
   ({
      setPosition,
      setIsPlaying,
      setSongDuration,
      soundCloudTrackId,
      setFormations,
      setSelectedFormation,
      viewOnly,
      pixelsPerSecond,
      player,
      setPlayer,
      videoPlayer,
      formations,
      isPlaying,
      position,
      playbackRate,
   }) => {
      let songDuration = formations.map((formation) => formation.durationSeconds + formation.transition.durationSeconds).reduce((a, b) => a + b, 0);
      // console.log({ playbackRate });
      useEffect(() => {
         let interval;
         if (isPlaying) {
            interval = setInterval(() => {
               setPosition((prevTime: number) => {
                  if (prevTime < songDuration) {
                     //  console.log("adding 0.5 sec");
                     return prevTime + 0.02 * playbackRate;
                  } else {
                     setIsPlaying(false);
                     return 0;
                  }
               });
            }, 20);
         }
         return () => clearInterval(interval);
      }, [isPlaying, songDuration, playbackRate]);
      return (
         <>
            <div
               className="relative"
               style={{
                  left: 39,
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
               >
                  {/* <div
                     style={{
                        overflowX: "hidden",
                     }}
                     // className="w-full"
                  ></div> */}
                  {/* <div
                     style={{
                        left: position * pixelsPerSecond,
                     }}
                     className="bg-pink-600 absolute w-[2px] h-full"
                  ></div> */}
               </div>
            </div>
         </>
      );
   }
);
