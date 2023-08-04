import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { formation, localSettings } from "../../../../types/types";
import TimelinePlugin from "../../../../timeline-plugin";
import WaveSurfer from "../../../../Wavesurfer"; // Importing local Wavesurfer

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
   formations: formation[];
   isPlaying: boolean;
   position: number;
}> = memo(
   ({
      setPosition,
      setIsPlaying,
      setSongDuration,
      // songDuration,
      soundCloudTrackId,
      setFormations,
      setSelectedFormation,
      viewOnly,
      pixelsPerSecond,
      player,
      setPlayer,
      videoPlayer,
      localSettings,
      formations,
      isPlaying,
      songDuration,
      position,
   }) => {
      const [ready, setReady] = useState(false);
      const [isInBonus, setIsInBonus] = useState(false);
      const [movePlayhead, setMovePlayhead] = useState(false);
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
                  primaryFontColor: isDarkMode ? "#FFFFFF" : "#000000",
                  primaryColor: isDarkMode ? "#FFFFFF" : "#000000",
                  secondaryColor: isDarkMode ? "#FFFFFF" : "#000000",
                  secondaryFontColor: isDarkMode ? "#FFFFFF" : "#000000",
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
            // setIsPlaying(true);
         });

         wavesurfer.on("pause", function (e) {});

         wavesurfer.on("finish", function (e) {
            // console.log("finish");
            // setIsPlaying(false);
            // setIsInBonus(true);
         });

         setPlayer(wavesurfer);
      }, [videoPlayer.current]);
      const totalDurationOfFormations = formations
         .map((formation, i) => formation.durationSeconds + (i === 0 ? 0 : formation.transition.durationSeconds))
         .reduce((a, b) => a + b, 0);

      const timelineWidth = (songDuration ? Math.max(totalDurationOfFormations, songDuration / 1000) : totalDurationOfFormations) * pixelsPerSecond;
      const formationsAreLongerThanAudio = totalDurationOfFormations > (songDuration || 0) / 1000;
      useEffect(() => {
         let interval;
         if (isPlaying && position > (songDuration || 0) / 1000 && formationsAreLongerThanAudio) {
            interval = setInterval(() => {
               setPosition((prevTime: number) => {
                  if (prevTime < (songDuration || 0)) {
                     //  console.log("adding 0.5 sec");
                     return prevTime + 0.02;
                     // playbackRate
                  } else {
                     setIsPlaying(false);
                     return 0;
                  }
               });
            }, 20);
         }
         return () => clearInterval(interval);
      }, [isPlaying, songDuration, position]);
      // playbackRate
      return (
         <>
            {!ready ? (
               <div className="h-[35px] flex flex-row items-center justify-center bg-[#fafafa] dark:bg-black w-screen">
                  <p className="font-semibold text-lg  dark:text-white">loading audio...</p>
               </div>
            ) : null}
            <div
               style={{
                  width: timelineWidth,
               }}
               onClick={(e) => {
                  e.preventDefault();
                  var rect = e.currentTarget.getBoundingClientRect();
                  var x = e.clientX - rect.left; //x position within the element.

                  songDuration = (songDuration || 0) / 1000;
                  const clickEventSeconds = x / pixelsPerSecond;

                  setPosition(clickEventSeconds);

                  if (clickEventSeconds < songDuration) {
                     player.seekTo(Math.min(1, clickEventSeconds / songDuration));
                  }

                  if (isPlaying) {
                     if (clickEventSeconds < songDuration && position > songDuration) {
                        player.play();
                     }

                     if (clickEventSeconds > songDuration && position < songDuration) {
                        setMovePlayhead(clickEventSeconds);
                        player.pause();
                     }
                  }
               }}
               className="flex flex-row items-center"
            >
               <div
                  /** THE FILE AUDIO PART */
                  style={{
                     display: ready ? "flex" : "none",
                     width: ((songDuration || 0) / 1000) * pixelsPerSecond,
                  }}
                  id="layers"
                  className={`flex-col justify-end w-full`}
               >
                  <div
                     id="waveform"
                     className="py-[10px] dark:bg-black pointer-events-none"
                     style={{
                        overflowX: "hidden",
                     }}
                  ></div>
               </div>
               <div
                  /** THE PART WHERE THERE IS NO AUDIO, but the length of formations exceeds audio lenght */
                  className="relative"
                  style={{
                     width: timelineWidth - ((songDuration || 0) / 1000) * pixelsPerSecond,
                  }}
               >
                  <div className={` h-[35px]   flex-col justify-end w-full`}></div>
               </div>
            </div>
         </>
      );
   }
);
