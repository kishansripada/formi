import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { formation, localSettings } from "../../../../types/types";
import Timeline from "../../../../timeline-plugin";
import { useStore } from "../store";
import WaveSurfer from "wavesurfer.js";
import { useGesture } from "@use-gesture/react";

export const FileAudioPlayer: React.FC<{
   setPosition: Function;

   soundCloudTrackId: string | null;
   setSelectedFormation: Function;
   pixelsPerSecond: number;

   localSettings: localSettings;
   videoPlayer: any;
   // formations: formation[];

   position: number;
   currentFormationIndex: number;
}> = memo(
   ({
      setPosition,

      soundCloudTrackId,

      pixelsPerSecond,

      videoPlayer,
      localSettings,

      position,
      currentFormationIndex,
   }) => {
      let {
         formations,
         get,
         setSelectedFormations,
         isMobileView,
         setPlayer,
         player,
         songDuration,
         setSongDuration,
         goToPosition,
         setIsPlaying,
         isPlaying,
      } = useStore();
      const { isDarkMode } = localSettings;

      const useWavesurfer = (containerRef: MutableRefObject<undefined>, options: WaveShaperOptions) => {
         const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

         // Initialize wavesurfer when the container mounts
         // or any of the props change
         useEffect(() => {
            if (!containerRef.current) return;

            const ws = WaveSurfer.create({
               ...options,
               container: containerRef.current,
            });

            setWavesurfer(ws);

            return () => {
               ws.destroy();
            };
         }, []);

         return wavesurfer;
      };

      const [ready, setReady] = useState(false);

      const totalDurationOfFormations = useStore((state) => state.getTotalDurationOfFormations());

      const timelineWidth = (songDuration ? Math.max(totalDurationOfFormations, songDuration / 1000) : totalDurationOfFormations) * pixelsPerSecond;
      const formationsAreLongerThanAudio = totalDurationOfFormations > (songDuration || 0) / 1000;
      useEffect(() => {
         let interval: ReturnType<typeof setInterval>;

         if (isPlaying && position >= (songDuration || 0) / 1000 && formationsAreLongerThanAudio) {
            interval = setInterval(() => {
               const prevTime = get().position;
               let newTime = prevTime;
               if (prevTime < totalDurationOfFormations) {
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
      }, [isPlaying, songDuration, position, totalDurationOfFormations]);
      const containerRef = useRef();
      const trackRef = useRef();
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
            target: trackRef.current,
            drag: { enabled: !isMobileView },
         }
      );

      // const [isPlaying, setIsPlaying] = useState(false);
      // const [currentTime, setCurrentTime] = useState(0);
      const wavesurfer = useWavesurfer(containerRef, {
         url: soundCloudTrackId,
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
         partialRender: true,
         // autoScroll: true,
         media: videoPlayer.current,
         plugins: [
            Timeline.create({
               height: 10,
               // insertPosition: "beforebegin",
               timeInterval: Math.round(pixelsPerSecond / 10),
               primaryLabelInterval: 5,
               secondaryLabelInterval: 1,
               container: "#wave-timeline",
               style: {
                  fontSize: "8px",
                  color: isDarkMode ? "#FFFFFF" : "#000000",
               },
            }),
         ],
      });

      useEffect(() => {
         if (!wavesurfer) return;

         setPosition(0);
         setIsPlaying(false);

         setPlayer(wavesurfer);
         const subscriptions = [
            wavesurfer.on("timeupdate", (currentTime) => setPosition(Math.ceil(currentTime / 0.01) * 0.01)), // 100fps)),

            wavesurfer.on("ready", (duration) => {
               setReady(true);
               setSongDuration(duration * 1000);
            }),

            wavesurfer.on("play", () => {
               setIsPlaying(true);
            }),
            wavesurfer.on("pause", () => {
               // setIsPlaying(false);
            }),

            wavesurfer.on("finish", () => {
               const duration = wavesurfer.getDuration();
               setPosition(duration);
            }),
         ];
         return () => {
            subscriptions.forEach((unsub) => unsub());
         };
      }, [wavesurfer]);
      return (
         <>
            {!ready ? (
               <div className="h-[30px] flex flex-row items-center justify-center bg-neutral-50 dark:bg-neutral-900 w-screen">
                  <p className="font-semibold text-lg  dark:text-white">loading audio...</p>
               </div>
            ) : null}
            <div
               style={{
                  width: timelineWidth,
                  display: ready ? "flex" : "none",
               }}
               ref={trackRef}
               className="flex flex-row items-center h-[30px]"
            >
               <div
                  className=" dark:bg-neutral-900 pointer-events-none"
                  ref={containerRef}
                  style={{ minHeight: "15px", width: ((songDuration || 0) / 1000) * pixelsPerSecond }}
               />

               <div
                  /** THE PART WHERE THERE IS NO AUDIO, but the length of formations exceeds audio lenght */
                  className="relative"
                  style={{
                     width: timelineWidth - ((songDuration || 0) / 1000) * pixelsPerSecond,
                  }}
               >
                  <div className={` h-[30px]   flex-col justify-end w-full`}></div>
               </div>
            </div>
         </>
      );
   }
);
