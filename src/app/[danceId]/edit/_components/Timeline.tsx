import { useState, useEffect } from "react";
import { dancer, dancerPosition, formation, formationGroup, localSettings, MAX_PIXELS_PER_SECOND, segment } from "../../../../types/types";
import { useHorizontalScrollInfo } from "../../../../hooks";
import { Layer } from "./Layer";
import { Layers } from "./Layers";

import dynamic from "next/dynamic";
import { NoFilePlayer } from "./NoFilePlayer";
const FileAudioPlayer = dynamic<{
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
}>(() => import("./FileAudioPlayer").then((mod) => mod.FileAudioPlayer), {
   ssr: false,
});

export const Timeline: React.FC<{
   formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   setFormations: Function;
   songDuration: number | null;
   position: number | null;
   isPlaying: boolean;
   soundCloudTrackId: string | null;
   viewOnly: boolean;
   pixelsPerSecond: number;
   setSelectedDancers: Function;
   addToStack: Function;
   pushChange: Function;
   userPositions: any;
   onlineUsers: any;
   formationGroups: formationGroup[];
   player: any;
   setPlayer: Function;
   setSongDuration: Function;
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
   segments: segment[];
   setSegments: Function;
   menuOpen: string;
}> = ({
   formations,
   selectedFormation,
   setSelectedFormation,
   setFormations,
   songDuration,
   position,
   isPlaying,
   soundCloudTrackId,
   viewOnly,
   pixelsPerSecond,
   setSelectedDancers,
   pushChange,
   addToStack,
   userPositions,
   onlineUsers,
   formationGroups,
   player,
   setPlayer,
   setSongDuration,
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
   segments,
   setSegments,
   menuOpen,
}) => {
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
         setSegments((segments: segment[]) => {
            return segments.map((segment, i) => {
               if (segment.id === resizingSegment) {
                  if (segment.duration + e.movementX / pixelsPerSecond >= 0) {
                     return { ...segment, duration: roundToHundredth(segment.duration + e.movementX / pixelsPerSecond) };
                  }
               }
               return segment;
            });
         });
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

   useEffect(() => {
      window.addEventListener("wheel", handleScroll, { passive: false });

      return () => {
         window.removeEventListener("wheel", handleScroll);
      };
   }, [selectedFormation, formations, songDuration, scrollInfo, position, pixelsPerSecond]);
   // console.log(position);
   const handleScroll = (e) => {
      let minPixelsPerSecond = Math.max((songDuration || 0) / 1000, totalDurationOfFormations)
         ? (window.screen.width - 90) / Math.max((songDuration || 0) / 1000, totalDurationOfFormations)
         : 10;

      if (
         e
            .composedPath()
            .map((elem) => elem.id)
            .includes("layers") &&
         e.ctrlKey === true
      ) {
         e.preventDefault();
         const scrollElement = scrollRef.current;
         if (scrollElement) {
            setPixelsPerSecond((pixelsPerSecond: number) => {
               let newPixelsPerSecond = pixelsPerSecond - e.deltaY / 10;

               if (newPixelsPerSecond < minPixelsPerSecond || newPixelsPerSecond > MAX_PIXELS_PER_SECOND) return pixelsPerSecond;

               const oldCursorPosition = (position || 0) * pixelsPerSecond + 32;
               const newCursorPosition = (position || 0) * newPixelsPerSecond + 32;
               const delta = newCursorPosition - oldCursorPosition;

               // delay the scroll left update until next repaint
               requestAnimationFrame(() => {
                  scrollElement.scrollLeft += delta;
               });

               return newPixelsPerSecond;
            });
         }
      }
   };

   const handlePointerUp = (event) => {
      setResizingSegment(null);
   };

   const handlePointerDown = (event) => {
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
         <div className="w-full h-[10px] bg-neutral-100 dark:bg-black select-none  ">
            <div
               onMouseDown={() => {
                  setIsScrollingTimeline(true);
               }}
               id="scrollbar"
               style={{
                  width: (scrollInfo.clientWidth / scrollInfo.scrollWidth) * scrollInfo.clientWidth + pixelsPerSecond * 0,
                  left: (scrollInfo.scrollLeft / scrollInfo.scrollWidth) * scrollInfo.clientWidth,
               }}
               className="h-[10px] cursor-pointer rounded-full bg-neutral-400 flex flex-row items-center  relative "
            >
               <div className="rounded-l-full  bg-pink-600 w-[10px] mr-auto h-[10px]"></div>
               <div className="rounded-r-full bg-pink-600 w-[10px] ml-auto h-[10px]"></div>
            </div>
         </div>

         <div
            ref={scrollRef}
            className=" overflow-y-hidden overflow-x-scroll   removeScrollBar bg-neutral-100 dark:bg-black   pl-3 "
            style={{
               overscrollBehavior: "none",
            }}
            id="layers"
            // style={{
            //    width: timelineWidth,
            // }}
         >
            <div
               style={{
                  width: timelineWidth,
               }}
               onClick={(e) => {
                  // var rect = e.currentTarget.getBoundingClientRect();
                  // var x = e.clientX - rect.left; //x position within the element.
                  // if (x < 0) return;

                  // setPosition(x / pixelsPerSecond);

                  // if (!(songDuration && player)) return;

                  // player.seekTo(x / pixelsPerSecond / (songDuration / 1000));
                  e.preventDefault();
                  var rect = e.currentTarget.getBoundingClientRect();
                  var x = e.clientX - rect.left; //x position within the element.

                  songDuration = (songDuration || 0) / 1000;
                  const clickEventSeconds = x / pixelsPerSecond;

                  setPosition(clickEventSeconds);

                  if (clickEventSeconds < songDuration) {
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
               }}
               className=" relative  "
            >
               <div
                  style={{
                     width: songDuration ? (songDuration / 1000) * pixelsPerSecond : "100%",
                  }}
                  className={` relative   py-1 ${!soundCloudTrackId ? "h-[15px]" : ""} `}
                  id="wave-timeline"
               ></div>

               <div
                  style={{
                     // add 40 but subract 9 to account for the width of the svg
                     left: (position || 0) * pixelsPerSecond - 9,
                  }}
                  className="absolute z-[999] top-[0px] pointer-events-none   left-0"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 180 157">
                     <path fill="#DB2777" d="M96 154c-3 4-9 4-12 0L2 11C-1 6 2 1 8 1h164c6 0 9 5 6 10L96 154Z" />
                  </svg>
                  <div className="h-[90px] ml-[7px] w-[2px] bg-pink-600  absolute"></div>
               </div>
            </div>

            <Layers
               formationGroups={formationGroups}
               userPositions={userPositions}
               onlineUsers={onlineUsers}
               addToStack={addToStack}
               pushChange={pushChange}
               setSelectedDancers={setSelectedDancers}
               viewOnly={viewOnly}
               songDuration={songDuration}
               setFormations={setFormations}
               formations={formations}
               selectedFormation={selectedFormation}
               setSelectedFormation={setSelectedFormation}
               isPlaying={isPlaying}
               position={position}
               soundCloudTrackId={soundCloudTrackId}
               pixelsPerSecond={pixelsPerSecond}
               setPosition={setPosition}
               player={player}
               localSettings={localSettings}
               shiftHeld={shiftHeld}
               hasVisited={hasVisited}
               // setSelectedFormations={setSelectedFormations}
               // selectedFormations={selectedFormations}
            />
            <div
               style={{
                  width: timelineWidth,
               }}
               className=" h-[20px] bg-neutral-500 dark:bg-black relative  overflow-hidden  flex flex-row justify-start  "
            >
               {segments.map((section, index) => {
                  return (
                     <div
                        className="h-full border-2  grid rounded-md place-items-center text-white text-[10px] relative cursor-pointer "
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
                           minWidth: section.duration * pixelsPerSecond,
                           borderColor: section.color,
                        }}
                     >
                        {section.name} - ({Math.round(section.duration)}s)
                        {menuOpen === "segments" ? (
                           <div
                              className="h-full  w-[15px] right-0 absolute cursor-ew-resize flex flex-row justify-center"
                              data-type="segment-resize"
                              id={section.id}
                           >
                              <div className="h-full bg-white pointer-events-none rounded-full w-[2px] mr-1"></div>
                              <div className="h-full bg-white pointer-events-none rounded-full w-[2px]"></div>
                           </div>
                        ) : null}
                     </div>
                  );
               })}
            </div>
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
                     setSelectedFormation={setSelectedFormation}
                     setFormations={setFormations}
                     soundCloudTrackId={localSource || soundCloudTrackId}
                     player={player}
                     setPlayer={setPlayer}
                     setSongDuration={setSongDuration}
                     setIsPlaying={setIsPlaying}
                     setPosition={setPosition}
                     songDuration={songDuration}
                     videoPlayer={videoPlayer}
                     viewOnly={viewOnly}
                     pixelsPerSecond={pixelsPerSecond}
                     localSettings={localSettings}
                     formations={formations}
                     isPlaying={isPlaying}
                     position={position}
                  ></FileAudioPlayer>
               </div>
            ) : (
               <>
                  <NoFilePlayer
                     playbackRate={playbackRate}
                     player={player}
                     isPlaying={isPlaying}
                     setPlayer={setPlayer}
                     key={localSource || soundCloudTrackId}
                     setSelectedFormation={setSelectedFormation}
                     setFormations={setFormations}
                     soundCloudTrackId={localSource || soundCloudTrackId}
                     setSongDuration={setSongDuration}
                     songDuration={songDuration}
                     setIsPlaying={setIsPlaying}
                     setPosition={setPosition}
                     viewOnly={viewOnly}
                     pixelsPerSecond={pixelsPerSecond}
                     videoPlayer={videoPlayer}
                     formations={formations}
                     position={position}
                  ></NoFilePlayer>
               </>
            )}
         </div>

         {/* <div
            style={{
               width: songDuration ? (songDuration / 1000) * pixelsPerSecond : "100%",
            }}
            className="w-full h-[5px] bg-neutral-500 dark:bg-neutral-700 "
         ></div> */}
      </>
   );
};
function roundToHundredth(value: number): number {
   return Math.round(value * 100) / 100;
}
