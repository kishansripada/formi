import { useState, useEffect, useRef, useMemo } from "react";

import { GridLines } from "./GridLines";
import { dancer, dancerPosition, formation, dragBoxCoords, PIXELS_PER_SQUARE } from "../../types/types";

export const Canvas: React.FC<{
   children: React.ReactNode;
   setFormations: Function;
   selectedFormation: number | null;
   formations: formation[];
   selectedDancers: string[];
   setSelectedDancers: Function;
   setSelectedFormation: Function;
   setIsPlaying: Function;
   viewOnly: boolean;
   setPixelsPerSecond: Function;
   songDuration: number | null;
   stageDimensions: { width: number; height: number };
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
   draggingDancerId: string | null;
   setDraggingDancerId: Function;
   player: any;
   undo: Function;
   addToStack: Function;
   pushChange: Function;
   gridSnap: number;
}> = ({
   player,
   children,
   setFormations,
   selectedFormation,
   formations,
   setSelectedDancers,
   selectedDancers,
   setSelectedFormation,
   setIsPlaying,
   viewOnly,
   setPixelsPerSecond,
   songDuration,
   stageDimensions,
   coordsToPosition,
   draggingDancerId,
   setDraggingDancerId,
   undo,
   addToStack,
   pushChange,
   gridSnap,
}) => {
   const [shiftHeld, setShiftHeld] = useState(false);
   const [commandHeld, setCommandHeld] = useState(false);
   const [changingControlId, setChangingControlId] = useState<null | string>(null);
   const [changingControlType, setChangingControlType] = useState<"start" | "end" | null>(null);
   const [scrollOffset, setScrollOffset] = useState({ x: -442, y: -310 });
   const [zoom, setZoom] = useState(1);
   const [copiedPositions, setCopiedPositions] = useState([]);
   const [dragBoxCoords, setDragBoxCoords] = useState<dragBoxCoords>({ start: { x: null, y: null }, end: { x: null, y: null } });
   const [isDragging, setIsDragging] = useState(false);

   const container = useRef();
   const stage = useRef();
   useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      return () => {
         window.removeEventListener("keydown", downHandler);
         window.removeEventListener("keyup", upHandler);
      };
   }, [selectedFormation, commandHeld, selectedDancers, formations, copiedPositions]);

   useEffect(() => {
      let heightPercentage = (container.current.clientHeight - 50) / stage.current.clientHeight;
      let widthPercentage = (container.current.clientWidth - 50) / stage.current.clientWidth;
      setZoom(Math.min(heightPercentage, widthPercentage));
   }, [container?.current?.clientHeight, stage?.current?.clientHeight, stageDimensions]);

   const downHandler = (e: any) => {
      if (e?.path?.[0]?.tagName === "INPUT" || e?.path?.[0]?.tagName === "TEXTAREA") return;
      // console.log(e.key);
      if (e.key === " ") {
         e.preventDefault();
         console.log(player);
         setIsPlaying((isPlaying: boolean) => {
            if (player) {
               player.playPause();
               return !isPlaying;
            }
         });
      }
      if (e.key === "ArrowRight") {
         e.preventDefault();
         setSelectedFormation((i) => (i === formations.length - 1 ? i : i + 1));
      }
      if (e.key === "ArrowLeft") {
         e.preventDefault();
         setSelectedFormation((i) => (i === 0 ? 0 : i - 1));
      }
      if (e.key === "Meta") {
         setCommandHeld(true);
      }
      if (e.key === "Shift") {
         setShiftHeld(true);
      }
      if (e.key === "Escape") {
         setSelectedDancers([]);
         setDragBoxCoords({ start: { x: null, y: null }, end: { x: null, y: null } });
      }
      if (selectedFormation === null) return;

      if (!commandHeld) return;

      // on paste, filter out all of the dancers that are being pasted before splicing them into the array of positions
      if (e.key === "v" && copiedPositions.length) {
         setFormations((formations: formation[]) => {
            return formations.map((formation, i) => {
               if (i === selectedFormation) {
                  return {
                     ...formation,
                     positions: [
                        ...formation.positions.filter((dancerPosition) => {
                           return !copiedPositions.map((dancerPositionCopy: dancerPosition) => dancerPositionCopy.id).includes(dancerPosition.id);
                        }),
                        ...copiedPositions,
                     ],
                  };
               }
               return formation;
            });
         });
      }
      if (e.key === "a") {
         e.preventDefault();
         setSelectedDancers([...formations[selectedFormation]?.positions.map((position) => position.id)]);
      }

      if (e.key === "c" && selectedDancers.length) {
         addToStack();
         e.preventDefault();
         setCopiedPositions(formations[selectedFormation].positions.filter((dancerPosition) => selectedDancers.includes(dancerPosition.id)));
      }

      if (e.key === "z") {
         e.preventDefault();
         undo();
      }
   };

   function upHandler({ key }) {
      if (key === "Shift") {
         setShiftHeld(false);
      }
      if (key === "Meta") {
         setCommandHeld(false);
      }
   }

   const handleDragMove = (e: any) => {
      if (selectedFormation === null) return;
      if (changingControlId) {
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation - 1) {
                  return {
                     ...formation,
                     positions: formation.positions.map((dancerPosition) => {
                        if (changingControlId === dancerPosition.id && changingControlType === "start") {
                           return {
                              ...dancerPosition,
                              controlPointStart: {
                                 x: dancerPosition.controlPointStart.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.controlPointStart.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                              },
                           };
                        }
                        if (changingControlId === dancerPosition.id && changingControlType === "end") {
                           return {
                              ...dancerPosition,
                              controlPointEnd: {
                                 x: dancerPosition.controlPointEnd.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.controlPointEnd.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                              },
                           };
                        }
                        return dancerPosition;
                     }),
                  };
               }
               return formation;
            });
         });
      }

      if (e.target.dataset.type === "dancer" && !dragBoxCoords.start.x) {
         setIsDragging(true);
      }
      const target = e.currentTarget;

      // Get the bounding rectangle of target
      const rect = target.getBoundingClientRect();

      // Mouse position
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (dragBoxCoords.start.x && dragBoxCoords.start.y) {
         setDragBoxCoords((dragBoxCoords) => {
            return { ...dragBoxCoords, end: { x: x / zoom, y: y / zoom } };
         });
         if (
            dragBoxCoords.start.x !== null &&
            dragBoxCoords.end.y !== null &&
            dragBoxCoords.start.y !== null &&
            dragBoxCoords.end.y !== null &&
            selectedFormation !== null
         ) {
            setSelectedDancers(
               formations?.[selectedFormation]?.positions
                  .filter((dancerPosition: dancerPosition) => {
                     return (
                        coordsToPosition(dancerPosition.position).left > Math.min(dragBoxCoords.start.x, dragBoxCoords.end.x) &&
                        coordsToPosition(dancerPosition.position).left < Math.max(dragBoxCoords.start.x, dragBoxCoords.end.x) &&
                        coordsToPosition(dancerPosition.position).top > Math.min(dragBoxCoords.start.y, dragBoxCoords.end.y) &&
                        coordsToPosition(dancerPosition.position).top < Math.max(dragBoxCoords.start.y, dragBoxCoords.end.y)
                     );
                  })
                  .map((dancerPosition: dancerPosition) => dancerPosition.id)
            );
         }
      }
      if (draggingDancerId) {
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
                  return {
                     ...formation,
                     positions: formation.positions.map((dancerPosition) => {
                        if (selectedDancers.includes(dancerPosition.id)) {
                           return {
                              ...dancerPosition,
                              position: {
                                 x: dancerPosition.position.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.position.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                              },
                           };
                        }
                        return dancerPosition;
                     }),
                  };
               }
               if (index === selectedFormation - 1) {
                  return {
                     ...formation,
                     positions: formation.positions.map((dancerPosition) => {
                        if (selectedDancers.includes(dancerPosition.id) && dancerPosition.transitionType === "cubic") {
                           return {
                              ...dancerPosition,
                              controlPointEnd: {
                                 x: dancerPosition.controlPointEnd.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.controlPointEnd.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                              },
                           };
                        }
                        return dancerPosition;
                     }),
                  };
               }
               return formation;
            });
         });
      }
   };

   const pointerDown = (e: any) => {
      if (e.target.dataset.type === "controlPointStart") {
         addToStack();
         setChangingControlId(e.target.id);
         setChangingControlType("start");
      }
      if (e.target.dataset.type === "controlPointEnd") {
         addToStack();
         setChangingControlId(e.target.id);
         setChangingControlType("end");
      }
      if (!e.target.id) {
         setSelectedDancers([]);
         // Get the target
         const target = e.currentTarget;
         // console.log(target);
         // Get the bounding rectangle of target
         const rect = target.getBoundingClientRect();

         // Mouse position
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;

         setDragBoxCoords((dragBoxCoords) => {
            return { ...dragBoxCoords, start: { x: x / zoom, y: y / zoom } };
         });
      }
      if (e.target.dataset.type === "dancer") {
         addToStack();
         setDraggingDancerId(e.target.id);
         if (!shiftHeld && !selectedDancers.includes(e.target.id)) {
            setSelectedDancers([e.target.id]);
         }

         if (shiftHeld) {
            if (!selectedDancers.includes(e.target.id)) {
               setSelectedDancers((selectedDancers: string[]) => [...selectedDancers, e.target.id]);
            } else {
               setSelectedDancers((selectedDancers: string[]) => selectedDancers.filter((id) => id !== e.target.id));
            }
         }
      }
   };

   const pointerUp = (e: any) => {
      if (changingControlId) {
         pushChange();
      }
      setChangingControlId(null);
      setChangingControlType(null);
      setDragBoxCoords({ start: { x: null, y: null }, end: { x: null, y: null } });
      if (e.target.dataset.type === "dancer" && !shiftHeld && !isDragging) {
         setSelectedDancers([e.target.id]);
      }
      // if a dancer was dragged (moved), then update round the formations to the nearest whole (persists to database)
      if (isDragging) {
         setFormations((formations: formation[]) => {
            return formations.map((formation) => {
               return {
                  ...formation,
                  positions: formation.positions.map((position) => {
                     return {
                        ...position,
                        position: {
                           x: Math.round(position.position.x * gridSnap) / gridSnap,
                           y: Math.round(position.position.y * gridSnap) / gridSnap,
                        },
                     };
                  }),
               };
            });
         });
         pushChange();
      }
      // console.log(formations);

      setDraggingDancerId(null);
      setIsDragging(false);
   };

   useEffect(() => {
      window.addEventListener("wheel", handleScroll, { passive: false });

      return () => {
         window.removeEventListener("wheel", handleScroll);
      };
   }, [songDuration]);

   const handleScroll = (e) => {
      if (
         e
            .composedPath()
            .map((elem) => elem.id)
            .includes("layers") &&
         e.ctrlKey === true
      ) {
         e.preventDefault();
         setPixelsPerSecond((pixelsPerSecond) => {
            if ((songDuration * (pixelsPerSecond - e.deltaY / 25)) / 1000 < window.screen.width - 20) return pixelsPerSecond;
            if (pixelsPerSecond - e.deltaY / 25 > 38) {
               return pixelsPerSecond;
            }
            return pixelsPerSecond - e.deltaY / 25;
         });
      }
   };

   return (
      <div
         className="flex flex-row relative justify-center  h-full cursor-default w-full overflow-hidden  overscroll-contain items-center "
         id="stage"
         ref={container}
         onPointerUp={!viewOnly ? pointerUp : null}
      >
         <div
            ref={stage}
            className="relative bg-white rounded-xl"
            onPointerDown={!viewOnly ? pointerDown : null}
            onPointerMove={handleDragMove}
            style={{
               // top: scrollOffset.y,
               // left: scrollOffset.x,
               // transformOrigin: `${scrollOffset.x}px ${scrollOffset.y}px`,
               transform: `scale(${zoom}) `,
               // translate(${scrollOffset.x}px, ${scrollOffset.y}px)
               height: stageDimensions.height * PIXELS_PER_SQUARE,
               width: stageDimensions.width * PIXELS_PER_SQUARE,
            }}
         >
            {children}

            {dragBoxCoords.start.x && dragBoxCoords.end.x && dragBoxCoords.start.y && dragBoxCoords.end.y ? (
               <div
                  className="absolute bg-blue-200/50 z-10 cursor-default "
                  style={{
                     width: Math.abs(dragBoxCoords.end.x - dragBoxCoords.start.x),
                     height: Math.abs(dragBoxCoords.end.y - dragBoxCoords.start.y),
                     left: dragBoxCoords.end.x - dragBoxCoords.start.x < 0 ? dragBoxCoords.end.x : dragBoxCoords.start.x,
                     top: dragBoxCoords.end.y - dragBoxCoords.start.y < 0 ? dragBoxCoords.end.y : dragBoxCoords.start.y,
                  }}
               ></div>
            ) : (
               <></>
            )}

            <div
               style={{
                  width: PIXELS_PER_SQUARE * 2.5,
               }}
               className="absolute h-full bg-black opacity-30 z-[100] pointer-events-none border-r-pink-700  "
            ></div>
            <div
               style={{
                  width: PIXELS_PER_SQUARE * 2.5,
               }}
               className="absolute h-full bg-black opacity-30 z-[100] right-0 pointer-events-none flex flex-col justify-center border-l-pink-700 "
            >
               {/* <p className="text-white z-50  text-3xl  ">text</p> */}
            </div>
            <GridLines stageDimensions={stageDimensions} />
         </div>
      </div>
   );
};
