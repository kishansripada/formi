import { useState, useEffect, useRef } from "react";
import { COLORS, dancer, dancerPosition, formation, formationGroup, localSettings, MAX_PIXELS_PER_SECOND, segment } from "../../../../types/types";
import { useHorizontalScrollInfo } from "../../../../utls";
import { Layers } from "./Layers";
import { NoFilePlayer } from "./NoFilePlayer";
import { useStore } from "../store";
import { useGesture } from "@use-gesture/react";
import { FileAudioPlayer } from "./FileAudioPlayer";
import { roundToHundredth } from "../../../../utls";
export const Timeline: React.FC<{
   selectedFormation: number | null;
   setSelectedFormation: Function;
   // setFormations: Function;

   position: number;
   isPlaying: boolean;
   soundCloudTrackId: string | null;

   pixelsPerSecond: number;
   setSelectedDancers: Function;
   addToStack: Function;
   pushChange: Function;

   formationGroups: formationGroup[];

   setIsPlaying: Function;
   setPosition: Function;
   videoPlayer: any;
   localSource: any;
   setPixelsPerSecond: Function;
   isScrollingTimeline: boolean;
   setIsScrollingTimeline: Function;
   localSettings: localSettings;
   playbackRate: number;
   shiftHeld: boolean;
   hasVisited: boolean;
   menuOpen: string | null;
   currentFormationIndex: number;
}> = ({
   position,
   isPlaying,
   soundCloudTrackId,

   pixelsPerSecond,
   setSelectedDancers,
   pushChange,
   addToStack,

   formationGroups,

   setIsPlaying,
   setPosition,
   videoPlayer,
   localSource,
   setPixelsPerSecond,
   isScrollingTimeline,
   setIsScrollingTimeline,
   localSettings,
   playbackRate,
   shiftHeld,
   hasVisited,
   menuOpen,
   currentFormationIndex,
}) => {
   let {
      segments,
      setSegments,
      get,
      formations,
      viewOnly,
      resumeHistory,
      pauseHistory,
      setSelectedFormations,
      isMobileView,
      player,
      songDuration,
      setSongDuration,
   } = useStore();
   const others = useStore((state) => state.liveblocks.others);
   const [resizingSegment, setResizingSegment] = useState<string | null>(null);

   const totalDurationOfFormations = formations
      .map((formation, i) => formation.durationSeconds + (i === 0 ? 0 : formation.transition.durationSeconds))
      .reduce((a, b) => a + b, 0);

   const timelineWidth = (songDuration ? Math.max(totalDurationOfFormations, songDuration / 1000) : totalDurationOfFormations) * pixelsPerSecond;

   useEffect(() => {
      if (!songDuration) return;

      setPixelsPerSecond(35);
      if (pixelsPerSecond * (songDuration / 1000) < window.screen.width - 20) {
         setPixelsPerSecond((window.screen.width - 20) / (songDuration / 1000));
      }
   }, [soundCloudTrackId, songDuration]);

   const [scrollRef, scrollInfo] = useHorizontalScrollInfo(pixelsPerSecond);
   // console.log(scrollInfo);
   const handleMouseMove = (e: MouseEvent) => {
      if (isScrollingTimeline) {
         scrollRef.current.scrollLeft = scrollRef.current.scrollLeft + (e.movementX * scrollInfo.scrollWidth) / scrollInfo.clientWidth;
      }

      if (viewOnly) return;

      if (resizingSegment !== null) {
         setSegments(
            get().segments.map((segment, i) => {
               if (segment.id === resizingSegment) {
                  if (segment.duration + e.movementX / pixelsPerSecond >= 0) {
                     return { ...segment, duration: roundToHundredth(segment.duration + e.movementX / pixelsPerSecond) };
                  }
               }
               return segment;
            })
         );
      }
   };

   useEffect(() => {
      window.addEventListener("mousemove", handleMouseMove);

      return () => window.removeEventListener("mousemove", handleMouseMove);
   }, [isScrollingTimeline, resizingSegment, pixelsPerSecond]);

   useEffect(() => {
      if (!scrollRef.current || !isPlaying || !localSettings.autoScroll) return;

      const scrollElement = scrollRef.current;
      const cursorPosition = (position || 0) * pixelsPerSecond + 32;
      const viewableAreaStart = scrollElement.scrollLeft;
      // const viewableAreaEnd = viewableAreaStart + scrollElement.clientWidth;
      const threshold = viewableAreaStart + 0.75 * scrollElement.clientWidth;

      // If the cursor is beyond the 75% threshold, adjust the scroll position.
      if (cursorPosition > threshold) {
         // Calculate the amount needed to scroll
         // const scrollTo = cursorPosition - 0.25 * scrollElement.clientWidth;
         // scrollElement.scrollLeft = scrollTo - viewableAreaStart;
         scrollElement.scrollLeft = cursorPosition - 0.25 * scrollElement.clientWidth;
      }
   }, [position, pixelsPerSecond]); // This effect runs every time the posi

   const handlePointerUp = (event) => {
      resumeHistory();
      setResizingSegment(null);
   };

   const handlePointerDown = (event) => {
      pauseHistory();
      if (event.target.dataset.type === "segment-resize") {
         setResizingSegment(event.target.id);
      }
   };

   useEffect(() => {
      // Attach the event listeners
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointerdown", handlePointerDown);

      // Return a cleanup function to remove the listeners when the component is unmounted
      return () => {
         window.removeEventListener("pointerup", handlePointerUp);
         window.removeEventListener("pointerdown", handlePointerDown);
      };
   }, [segments, resizingSegment]); // The empty dependency array ensures that the effect only runs once, similar to componentDidMount.

   useGesture(
      {
         onPinch: ({ offset: [d] }) => {
            const scrollElement = scrollRef.current;
            if (scrollElement) {
               setPixelsPerSecond((pixelsPerSecond: number) => {
                  let newPixelsPerSecond = d;

                  const oldCursorPosition = (position || 0) * pixelsPerSecond;
                  const newCursorPosition = (position || 0) * newPixelsPerSecond;
                  const delta = newCursorPosition - oldCursorPosition;

                  // delay the scroll left update until next repaint
                  requestAnimationFrame(() => {
                     scrollElement.scrollLeft += delta;
                  });

                  return newPixelsPerSecond;
               });
            }
         },
      },
      {
         eventOptions: { passive: false },
         target: scrollRef.current,
         pinch: {
            from: () => [pixelsPerSecond, pixelsPerSecond],
            scaleBounds: {
               min: Math.max((songDuration || 0) / 1000, totalDurationOfFormations)
                  ? (window.screen.width - 90) / Math.max((songDuration || 0) / 1000, totalDurationOfFormations)
                  : 10,
               max: MAX_PIXELS_PER_SECOND,
            },
         },
      }
   );

   const timeline = useRef<HTMLElement>();
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
         <style jsx>
            {`
               .removeScrollBar::-webkit-scrollbar {
                  display: none;
                  -webkit-appearance: none;
                  width: 0;
                  height: 0;
               }
            `}
         </style>
         <div className="w-full h-[10px] bg-neutral-50 dark:bg-neutral-900 select-none hidden lg:block  ">
            <div
               onMouseDown={() => {
                  setIsScrollingTimeline(true);
               }}
               id="scrollbar"
               style={{
                  width: (scrollInfo.clientWidth / scrollInfo.scrollWidth) * scrollInfo.clientWidth + pixelsPerSecond * 0 || 0,
                  left: (scrollInfo.scrollLeft / scrollInfo.scrollWidth) * scrollInfo.clientWidth || 0,
               }}
               className="h-[10px] cursor-pointer  dark:bg-neutral-700 bg-neutral-300 flex flex-row items-center  relative "
            ></div>
         </div>

         <div
            ref={scrollRef}
            className=" overflow-y-hidden overflow-x-scroll relative  removeScrollBar bg-neutral-50 dark:bg-neutral-900   pl-3 "
            style={{
               overscrollBehavior: "none",
               touchAction: "pan-x",
            }}
            id="layers"
         >
            <div
               style={{
                  width: timelineWidth,
               }}
               className=" relative  "
               ref={timeline}
            >
               <div
                  style={{
                     width: songDuration ? (songDuration / 1000) * pixelsPerSecond : "100%",
                  }}
                  className={` relative   py-1 ${!soundCloudTrackId ? "min-h-[18px]" : ""} `}
                  id="wave-timeline"
               ></div>

               {others
                  .filter((other) => other.canWrite)
                  .map((other) => {
                     return (
                        <div
                           key={other.id + Math.random()}
                           style={{
                              // add 40 but subract 9 to account for the width of the svg
                              left: (other.presence.position || 0) * pixelsPerSecond - 9,
                              opacity: 0.5,
                           }}
                           className="absolute z-[999] top-[0px] pointer-events-none   left-0"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 180 157">
                              <path
                                 fill={COLORS[other?.connectionId % COLORS.length]}
                                 d="M96 154c-3 4-9 4-12 0L2 11C-1 6 2 1 8 1h164c6 0 9 5 6 10L96 154Z"
                              />
                           </svg>
                           <div
                              style={{
                                 backgroundColor: COLORS[other?.connectionId % COLORS.length],
                              }}
                              className="h-[90px] ml-[7px] w-[2px]  absolute"
                           ></div>
                        </div>
                     );
                  })}
               <div
                  style={{
                     // add 40 but subract 9 to account for the width of the svg
                     left: (position || 0) * pixelsPerSecond - 9,
                  }}
                  className="absolute z-[999] top-[0px] pointer-events-none  "
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 180 157">
                     <path fill="#DB2777" d="M96 154c-3 4-9 4-12 0L2 11C-1 6 2 1 8 1h164c6 0 9 5 6 10L96 154Z" />
                  </svg>
                  <div className="h-[90px] ml-[7px] w-[2px] bg-pink-600  absolute"></div>
               </div>
            </div>

            <Layers
               formationGroups={formationGroups}
               addToStack={addToStack}
               pushChange={pushChange}
               setSelectedDancers={setSelectedDancers}
               isPlaying={isPlaying}
               position={position}
               soundCloudTrackId={soundCloudTrackId}
               pixelsPerSecond={pixelsPerSecond}
               setPosition={setPosition}
               player={player}
               localSettings={localSettings}
               shiftHeld={shiftHeld}
               hasVisited={hasVisited}
            />

            {segments.length ? (
               <div
                  style={{
                     width: timelineWidth || 0,
                  }}
                  className=" h-[16px]  relative z-[10] mt-1   overflow-hidden  flex flex-row justify-start   "
               >
                  {segments.map((section, index) => {
                     return (
                        <div
                           key={section.id}
                           className={`h-full  box-border rounded-sm px-2 dark:text-white md:text-[10px] text-[8px] relative cursor-pointer `}
                           onClick={(e: any) => {
                              if (menuOpen === "segments") return;

                              // if (isPlaying) {
                              let position = segments
                                 .map((segment, i) => segment.duration)
                                 .slice(0, index)
                                 .reduce((a, b) => a + b, 0);

                              setPosition(position);

                              if (!(songDuration && player)) return;
                              player.seekTo(Math.min(Math.max(0, position / (songDuration / 1000)), 1));
                           }}
                           style={{
                              width: section.duration * pixelsPerSecond - 4,
                              marginRight: 4,
                              minWidth: section.duration * pixelsPerSecond - 4,
                              // width: section.duration * pixelsPerSecond,

                              backgroundColor: hexToRgba(section.color, 0.4),
                              // borderColor: section.color,
                           }}
                        >
                           <p className=" font-semibold">
                              {section.name} - ({Math.round(section.duration)}s)
                           </p>
                           {menuOpen === "segments" && !viewOnly ? (
                              <div
                                 className="h-full  w-[15px] z-10 right-0 top-0 absolute cursor-ew-resize flex flex-row justify-center"
                                 data-type="segment-resize"
                                 id={section.id}
                              >
                                 <div className="h-full dark:bg-white bg-black pointer-events-none rounded-full w-[2px] mr-1"></div>
                                 <div className="h-full dark:bg-white bg-black pointer-events-none rounded-full w-[2px]"></div>
                              </div>
                           ) : null}
                        </div>
                     );
                  })}
               </div>
            ) : null}

            {soundCloudTrackId || localSource ? (
               <div
                  className="relative "
                  style={{
                     // left: 40,
                     borderColor: "#404040",
                     width: songDuration ? (songDuration / 1000) * pixelsPerSecond : "100%",
                  }}
               >
                  <FileAudioPlayer
                     key={localSource || soundCloudTrackId}
                     soundCloudTrackId={localSource || soundCloudTrackId}
                     player={player}
                     setSongDuration={setSongDuration}
                     setIsPlaying={setIsPlaying}
                     setPosition={setPosition}
                     songDuration={songDuration}
                     videoPlayer={videoPlayer}
                     pixelsPerSecond={pixelsPerSecond}
                     localSettings={localSettings}
                     isPlaying={isPlaying}
                     position={position}
                     currentFormationIndex={currentFormationIndex}
                  ></FileAudioPlayer>
               </div>
            ) : (
               <>
                  <NoFilePlayer
                     playbackRate={playbackRate}
                     player={player}
                     isPlaying={isPlaying}
                     key={localSource || soundCloudTrackId}
                     soundCloudTrackId={localSource || soundCloudTrackId}
                     setSongDuration={setSongDuration}
                     songDuration={songDuration}
                     setIsPlaying={setIsPlaying}
                     setPosition={setPosition}
                     pixelsPerSecond={pixelsPerSecond}
                     videoPlayer={videoPlayer}
                     position={position}
                     currentFormationIndex={currentFormationIndex}
                  ></NoFilePlayer>
               </>
            )}
         </div>
      </>
   );
};

function hexToRgba(hex: string, opacity: number): string {
   // Ensure the hex code starts with a '#'
   if (hex.charAt(0) !== "#") {
      hex = "#" + hex;
   }

   // Parse the r, g, b values
   let bigint = parseInt(hex.slice(1), 16);
   let r = (bigint >> 16) & 255;
   let g = (bigint >> 8) & 255;
   let b = bigint & 255;

   // Ensure opacity is between 0 and 1
   if (opacity < 0) {
      opacity = 0;
   }
   if (opacity > 1) {
      opacity = 1;
   }

   // Convert opacity from 0-1 to 0-255
   const alpha = Math.round(opacity * 255);

   // Convert alpha value to hex
   const alphaHex = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();

   // Return the rgba color
   return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}${alphaHex}`;
}
