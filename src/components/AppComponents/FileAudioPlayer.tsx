import Script from "next/script";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { formation } from "../../types/types";

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
   player: any;
   setPlayer: Function;
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
      player,
      setPlayer,
   }) => {
      const [ready, setReady] = useState(false);

      useEffect(() => {
         if (!document.getElementById("waveform")?.firstChild) return;
         document.getElementById("waveform").firstChild.style.overflowX = "hidden";
      }, [document.getElementById("waveform")?.firstChild]);

      useEffect(() => {
         if (!player) return;
         try {
            player.zoom(pixelsPerSecond);
         } catch {
            console.log("zoom error");
         }
      }, [pixelsPerSecond, player]);

      useEffect(() => {
         return () => {
            if (!player) return;
            player.destroy();
         };
      }, [soundCloudTrackId, player]);

      function handleLoad() {
         if (document.getElementById("waveform")?.innerHTML) return;
         var wavesurfer = WaveSurfer.create({
            container: "#waveform",
            waveColor: "#9ca3af",
            progressColor: "#6b7280",
            cursorColor: "#db2777",
            backgroundColor: "#fafafa",
            barWidth: 4,
            barRadius: 5,
            cursorWidth: 2,
            height: 60,
            barGap: 2,
         });
         wavesurfer.load(soundCloudTrackId);
         wavesurfer.on("audioprocess", function (e) {
            setPosition(Math.ceil(e / 0.01) * 0.01); // 100fps
         });
         wavesurfer.on("ready", function (e) {
            console.log("ready");
            setReady(true);

            let duration = wavesurfer.getDuration() * 1000;
            setSongDuration(duration);
            wavesurfer.zoom(pixelsPerSecond);
         });
         wavesurfer.on("play", function (e) {
            setIsPlaying(true);
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
            <Script onReady={handleLoad} strategy="lazyOnload" src="https://unpkg.com/wavesurfer.js" />

            {!ready ? (
               <div className="h-[60px] flex flex-row items-center justify-center bg-[#fafafa] w-screen">
                  <p className="font-semibold text-xl animate-bounce">loading audio...</p>
               </div>
            ) : null}

            <div
               style={{
                  display: ready ? "flex" : "none",
               }}
               id="layers"
               className={` h-[60px]  flex-col justify-end w-full`}
            >
               <div
                  id="waveform"
                  style={{
                     overflowX: "hidden",
                  }}
                  // className="w-full"
               ></div>
            </div>
         </>
      );
   }
);
