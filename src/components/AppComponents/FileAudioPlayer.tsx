import Script from "next/script";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { PIXELS_PER_SECOND, formation } from "../../types/types";
import { v4 as uuidv4 } from "uuid";

export const FileAudioPlayer: React.FC<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSelectedFormation: Function;
   setFormations: Function;
   viewOnly: boolean;
   pixelsPerSecond: number;
}> = memo(
   ({
      setPosition,
      setIsPlaying,
      setSongDuration,
      songDuration,
      soundCloudTrackId,
      setFormations,
      setSelectedFormation,
      viewOnly,
      pixelsPerSecond,
   }) => {
      const [player, setPlayer] = useState(null);

      useEffect(() => {
         if (!player) return;
         player.zoom(pixelsPerSecond);
         console.log("zoomed");
      }, [pixelsPerSecond, player, soundCloudTrackId]);

      useEffect(() => {
         return () => {
            console.log("cleanin up");
            if (!player) return;
            console.log("cleanup");
            player.destroy();
         };
      }, [soundCloudTrackId, player]);
      // console.log("SoundCloudComponent rerendered");

      function handleLoad() {
         if (document.getElementById("waveform")?.innerHTML) return;
         var wavesurfer = WaveSurfer.create({
            container: "#waveform",
            waveColor: "#420979",
            progressColor: "#db2777",
            cursorColor: "#4353FF",
            // backgroundColor: "#D3D3D3",
            barWidth: 5,
            barRadius: 6,
            cursorWidth: 1,
            height: 60,
            barGap: 1,
         });
         wavesurfer.load(soundCloudTrackId);
         wavesurfer.on("audioprocess", function (e) {
            // 30fps
            setPosition(Math.ceil(e / 0.033) * 0.033);

            // setPosition(e);
         });
         wavesurfer.on("ready", function (e) {
            setSongDuration(wavesurfer.getDuration() * 1000);
            wavesurfer.zoom(pixelsPerSecond);
         });
         wavesurfer.on("play", function (e) {
            setIsPlaying(true);
            wavesurfer.zoom(pixelsPerSecond);
         });

         wavesurfer.on("pause", function (e) {
            setIsPlaying(false);
         });

         wavesurfer.on("finish", function (e) {
            setIsPlaying(false);
         });

         setPlayer(wavesurfer);
      }

      return (
         <>
            <div
               className="fixed flex flex-row justify-start "
               style={{
                  left: "50%",
                  transform: "translateX(-50%)",
               }}
            >
               <button
                  onClick={() => (player ? player.playPause() : null)}
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
               {!viewOnly ? (
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
               ) : null}
            </div>
            <Script onReady={handleLoad} strategy="lazyOnload" src="https://unpkg.com/wavesurfer.js" />

            <div className=" h-[95px] flex flex-col justify-end w-full">
               <div id="waveform" className="w-full"></div>
            </div>
         </>
      );
   }
);
