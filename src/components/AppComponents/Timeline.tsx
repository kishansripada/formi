import { useState, useEffect } from "react";
import { dancer, dancerPosition, formation, formationGroup } from "../../types/types";
import { useHorizontalScrollInfo } from "../../hooks";
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
}) => {
   useEffect(() => {
      if (!songDuration) return;

      setPixelsPerSecond(30);
      if (pixelsPerSecond * (songDuration / 1000) < window.screen.width - 20) {
         setPixelsPerSecond((window.screen.width - 20) / (songDuration / 1000));
      }
   }, [soundCloudTrackId, songDuration]);
   const [isScrollingTimeline, setIsScrollingTimeline] = useState(false);
   const [scrollRef, scrollInfo] = useHorizontalScrollInfo(pixelsPerSecond);
   const handleMouseMove = (e: MouseEvent) => {
      if (isScrollingTimeline) {
         scrollRef.current.scrollLeft = scrollRef.current.scrollLeft + (e.movementX * scrollInfo.scrollWidth) / scrollInfo.clientWidth;
      }
   };
   const handleDocumentMouseUp = () => {
      setIsScrollingTimeline(false);
   };

   useEffect(() => {
      document.addEventListener("mouseup", handleDocumentMouseUp);
      return () => {
         document.removeEventListener("mouseup", handleDocumentMouseUp);
      };
   }, [isScrollingTimeline]);

   useEffect(() => {
      window.addEventListener("mousemove", handleMouseMove);

      return () => window.removeEventListener("mousemove", handleMouseMove);
   }, [isScrollingTimeline]);
   return (
      <>
         <div className="w-full h-[10px] bg-neutral-100 select-none">
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

         <div ref={scrollRef} className="overflow-x-scroll removeScrollBar   overscroll-contain ">
            <div
               style={{
                  width: songDuration
                     ? Math.max(
                          formations.map((formation) => formation.durationSeconds + formation.transition.durationSeconds).reduce((a, b) => a + b, 0) *
                             pixelsPerSecond,
                          (songDuration / 1000) * pixelsPerSecond
                       )
                     : "100%",
               }}
               className=" relative  "
               // id="wave-timeline"
            >
               <div
                  onClick={(e) => {
                     var rect = e.currentTarget.getBoundingClientRect();
                     var x = e.clientX - rect.left; //x position within the element.
                     setPosition(x / pixelsPerSecond);

                     if (!(songDuration && player)) return;

                     player.seekTo(x / pixelsPerSecond / (songDuration / 1000));
                  }}
                  style={{
                     width: songDuration ? (songDuration / 1000) * pixelsPerSecond : "100%",
                  }}
                  className={` relative left-[40px] py-1 ${!soundCloudTrackId ? "h-[15px]" : ""} `}
                  id="wave-timeline"
               ></div>
               <div
                  style={{
                     // add 40 but subract 8 to account for the width of the svg
                     left: (position || 0) * pixelsPerSecond + 32,
                  }}
                  className="absolute z-[999] top-[0px] pointer-events-none   left-0"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 180 157">
                     <path fill="#DB2777" d="M96 154c-3 4-9 4-12 0L2 11C-1 6 2 1 8 1h164c6 0 9 5 6 10L96 154Z" />
                  </svg>
                  <div className="h-[90px] ml-[7px] w-[2px] bg-pink-600  absolute"></div>
               </div>
            </div>

            <div
               style={{
                  width: songDuration
                     ? Math.max(
                          formations.map((formation) => formation.durationSeconds + formation.transition.durationSeconds).reduce((a, b) => a + b, 0) *
                             pixelsPerSecond,
                          (songDuration / 1000) * pixelsPerSecond
                       )
                     : formations.map((formation) => formation.durationSeconds + formation.transition.durationSeconds).reduce((a, b) => a + b, 0) *
                       pixelsPerSecond,
               }}
               className="bg-neutral-400 h-[1px] "
            />

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
            />

            <div
               style={{
                  width: songDuration
                     ? Math.max(
                          formations.map((formation) => formation.durationSeconds + formation.transition.durationSeconds).reduce((a, b) => a + b, 0) *
                             pixelsPerSecond,
                          (songDuration / 1000) * pixelsPerSecond
                       )
                     : formations.map((formation) => formation.durationSeconds + formation.transition.durationSeconds).reduce((a, b) => a + b, 0) *
                       pixelsPerSecond,
               }}
               className="bg-neutral-400 h-[1px] "
            />

            {soundCloudTrackId || localSource ? (
               <div
                  className="relative "
                  style={{
                     left: 40,
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
                  ></FileAudioPlayer>
               </div>
            ) : (
               <>
                  <NoFilePlayer
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
         <div
            style={{
               width: songDuration ? (songDuration / 1000) * pixelsPerSecond : "100%",
            }}
            className="w-full h-[10px] bg-neutral-500 "
         ></div>
      </>
   );
};
