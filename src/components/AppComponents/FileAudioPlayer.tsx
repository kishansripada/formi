import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { formation, localSettings } from "../../types/types";
import TimelinePlugin from "../../timeline-plugin";
import WaveSurfer from "../../Wavesurfer"; // Importing local Wavesurfer

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
   localSettings: localSettings;
   videoPlayer: any;
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
      videoPlayer,
      localSettings,
   }) => {
      const [ready, setReady] = useState(false);
      const { isDarkMode } = localSettings;

      useEffect(() => {
         if (!document.getElementById("waveform")?.firstChild) return;
         document.getElementById("waveform").firstChild.style.overflowX = "hidden";
      }, [document.getElementById("waveform")?.firstChild]);

      useEffect(() => {
         if (!player) return;
         try {
            player.zoom(pixelsPerSecond);
         } catch {
            // console.log("zoom error");
         }
      }, [pixelsPerSecond, player, soundCloudTrackId]);

      useEffect(() => {
         if (document.getElementById("waveform")?.innerHTML) return;
         var wavesurfer = WaveSurfer.create({
            container: "#waveform",
            waveColor: "#a3a3a3",
            progressColor: "#db2777",
            normalize: true,
            cursorColor: "#db2777",
            barWidth: 4,
            barRadius: 5,
            cursorWidth: 2,
            height: 15,
            barGap: 2,
            backend: "MediaElement",
            plugins: [
               TimelinePlugin.create({
                  container: "#wave-timeline",
                  notchPercentHeight: 0,
                  height: 10,
                  color: "#FFFFFF",
                  style: {},
               }),
            ],
         });

         wavesurfer.load(videoPlayer.current);

         wavesurfer.on("audioprocess", function (e) {
            setPosition(Math.ceil(e / 0.01) * 0.01); // 100fps
         });
         wavesurfer.on("ready", function (e) {
            // console.log("ready");
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
      }, [videoPlayer.current]);

      return (
         <>
            {!ready ? (
               <div className="h-[35px] flex flex-row items-center justify-center bg-[#fafafa] dark:bg-neutral-800 w-screen">
                  <p className="font-semibold text-lg animate-bounce dark:text-white">loading audio...</p>
               </div>
            ) : null}

            <div
               style={{
                  display: ready ? "flex" : "none",
               }}
               id="layers"
               className={`flex-col justify-end w-full`}
            >
               <div
                  onClick={(e) => {
                     e.preventDefault();
                     var rect = e.target.getBoundingClientRect();
                     var x = e.clientX - rect.left; //x position within the element.
                     setPosition(x / pixelsPerSecond);
                  }}
                  id="waveform"
                  className="py-[10px] dark:bg-neutral-800"
                  style={{
                     overflowX: "hidden",
                  }}
               ></div>
            </div>
         </>
      );
   }
);
