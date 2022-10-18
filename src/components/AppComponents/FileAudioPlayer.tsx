import Script from "next/script";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { PIXELS_PER_SECOND, formation } from "../../types/types";
import ReactPlayer from "react-player/file";
import { v4 as uuidv4 } from "uuid";

export const FileAudioPlayer: React.FC<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
   setSelectedFormation: Function;
   setFormations: Function;
   isPlaying: boolean;
}> = ({
   setPosition,
   setIsPlaying,
   setSongDuration,
   songDuration,
   soundCloudTrackId,
   setSoundCloudTrackId,
   setFormations,
   setSelectedFormation,
   isPlaying,
}) => {
   return (
      <>
         <Toaster />
         <div
            className="fixed flex flex-row justify-start z-10 "
            style={{
               left: "50%",
               transform: "translateX(-50%)",
            }}
         >
            <button
               onClick={() => setIsPlaying((isPlaying) => !isPlaying)}
               className=" rounded-b-md bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 mx-1 "
            >
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
                     let totalFormationLength = formations
                        .map((formation) => formation.durationSeconds + formation.transition.durationSeconds)
                        .reduce((a, b) => a + b, 0);
                     let roomLeft = songDuration / 1000 - totalFormationLength;

                     if (roomLeft < 3) {
                        toast.error("there's not enough room!");
                        return formations;
                     }
                     if (!formations.length) {
                        setSelectedFormation(formations.length);
                        return [
                           ...formations,
                           {
                              durationSeconds: roomLeft > 15 ? 10 : roomLeft / 2,
                              positions: [],
                              transition: {
                                 durationSeconds: roomLeft > 15 ? 5 : roomLeft / 2,
                              },
                              name: `Untitled ${formations.length + 1}`,
                           },
                        ];
                     } else {
                        setSelectedFormation(formations.length);
                        return [
                           ...formations,
                           {
                              id: uuidv4(),
                              ...formations[formations.length - 1],
                              name: `Untitled ${formations.length + 1}`,
                              transition: {
                                 durationSeconds: roomLeft > 15 ? 10 : roomLeft / 2,
                              },
                              durationSeconds: roomLeft > 15 ? 5 : roomLeft / 2,
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
               playing={isPlaying}
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
