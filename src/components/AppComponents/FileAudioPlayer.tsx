import Script from "next/script";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { PIXELS_PER_SECOND, formation } from "../../types/types";
import ReactPlayer from "react-player/file";

export const FileAudioPlayer: React.FC<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
   setSelectedFormation: Function;
   setFormations: Function;
}> = ({ setPosition, setIsPlaying, setSongDuration, songDuration, soundCloudTrackId, setSoundCloudTrackId, setFormations, setSelectedFormation }) => {
   return (
      <>
         <div
            className="fixed flex flex-row justify-start z-10 "
            style={{
               left: "50%",
               transform: "translateX(-50%)",
            }}
         >
            <button onClick={() => console.log("play file")} className=" rounded-b-md bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 mx-1 ">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z"
                  />
               </svg>
            </button>
            <button
               onClick={() => {
                  setFormations((formations: formation[]) => {
                     if (!formations.length) {
                        setSelectedFormation(formations.length);
                        return [
                           ...formations,
                           {
                              durationSeconds: 10,
                              positions: [],
                              transition: {
                                 durationSeconds: 5,
                              },
                              name: `Untitled ${formations.length + 1}`,
                           },
                        ];
                     } else {
                        setSelectedFormation(formations.length);
                        return [
                           ...formations,
                           {
                              ...formations[formations.length - 1],
                              name: `Untitled ${formations.length + 1}`,
                              transition: {
                                 durationSeconds: 5,
                              },
                              durationSeconds: 10,
                           },
                        ];
                     }
                  });
               }}
               className=" rounded-b-md bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 mx-1 cursor-pointer"
            >
               + new formation
            </button>
         </div>

         <div className=" h-[95px]">
            <ReactPlayer
               width={songDuration ? (songDuration / 1000) * PIXELS_PER_SECOND + 230 : "100%"}
               height="100%"
               controls={true}
               progressInterval={33}
               onProgress={(e) => {
                  setPosition(e.playedSeconds);
               }}
               onPlay={() => {
                  setIsPlaying(true);
               }}
               onPause={() => {
                  setIsPlaying(false);
               }}
               onDuration={(e) => {
                  setSongDuration(e * 1000);
               }}
               url={soundCloudTrackId}
            />
         </div>
      </>
   );
};
