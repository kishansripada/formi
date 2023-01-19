import { useState, useEffect, useRef, useMemo } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { GridLines } from "./GridLines";
import { dancer, dancerPosition, formation, dragBoxCoords, PIXELS_PER_SQUARE, comment } from "../../types/types";
import { toast, Toaster } from "react-hot-toast";

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
   isCommenting: boolean;
   setIsCommenting: Function;
   zoom: number;
   setZoom: Function;
   videoCoordinates: { left: number; top: number };
   setVideoCoordinates: Function;
   stageBackground: string;
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
   isCommenting,
   setIsCommenting,
   zoom,
   setZoom,
   videoCoordinates,
   setVideoCoordinates,
   stageBackground,
}) => {
   const [shiftHeld, setShiftHeld] = useState(false);
   const [draggingCommentId, setDraggingCommentId] = useState<string | null>();
   const [commandHeld, setCommandHeld] = useState(false);
   const [changingControlId, setChangingControlId] = useState<null | string>(null);
   const [changingControlType, setChangingControlType] = useState<"start" | "end" | null>(null);
   const [scrollOffset, setScrollOffset] = useState({ x: -442, y: -310 });

   const [copiedPositions, setCopiedPositions] = useState([]);
   const [dragBoxCoords, setDragBoxCoords] = useState<dragBoxCoords>({ start: { x: null, y: null }, end: { x: null, y: null } });
   const [isDragging, setIsDragging] = useState(false);
   const [isDraggingVideo, setIsDraggingVideo] = useState(false);
   const [cursorPosition, setCursorPoisition] = useState<{ x: number; y: number }>();

   const container = useRef();
   const stage = useRef();

   const session = useSession();

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
      if (e?.composedPath()?.[0]?.tagName === "INPUT" || e?.composedPath()?.[0]?.tagName === "TEXTAREA" || e.target.id === "input") return;

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
         setIsCommenting(false);
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

      if (isDraggingVideo) {
         console.log(isDraggingVideo);
         setVideoCoordinates((videoCoordinates) => {
            return { left: videoCoordinates.left + e.movementX, top: videoCoordinates.top + e.movementY };
         });
      }

      if (changingControlId) {
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
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

      if (dragBoxCoords.start.x && dragBoxCoords.start.y) {
         const target = e.currentTarget;

         // Get the bounding rectangle of target
         const rect = target.getBoundingClientRect();

         // Mouse position
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;

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
                        if (selectedDancers.includes(dancerPosition.id) && dancerPosition.transitionType === "cubic") {
                           return {
                              ...dancerPosition,
                              position: {
                                 x: dancerPosition.position.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.position.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                              },
                              controlPointEnd: {
                                 x: dancerPosition.controlPointEnd.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.controlPointEnd.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                              },
                           };
                        }
                        if (
                           selectedDancers.includes(dancerPosition.id) &&
                           (dancerPosition.transitionType === "linear" || !dancerPosition.transitionType)
                        ) {
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
               // if (index === selectedFormation) {
               //    return {
               //       ...formation,
               //       positions: formation.positions.map((dancerPosition) => {
               //          if (selectedDancers.includes(dancerPosition.id)) {
               //             return {
               //                ...dancerPosition,
               //                controlPointEnd: {
               //                   x: dancerPosition.controlPointEnd.x + e.movementX / PIXELS_PER_SQUARE / zoom,
               //                   y: dancerPosition.controlPointEnd.y - e.movementY / PIXELS_PER_SQUARE / zoom,
               //                },
               //             };
               //          }
               //          return dancerPosition;
               //       }),
               //    };
               // }
               return formation;
            });
         });
      }

      if (draggingCommentId) {
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
                  return {
                     ...formation,
                     comments: formation.comments.map((comment: comment) => {
                        // console.log(comment.id);
                        // console.log({ draggingCommentId });
                        if (comment.id === draggingCommentId) {
                           return {
                              ...comment,
                              position: {
                                 x: comment.position.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                                 y: comment.position.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                              },
                           };
                        }
                        return comment;
                     }),
                  };
               }

               return formation;
            });
         });
      }
   };

   const pointerDown = (e: any) => {
      if (e.target.id === "video") {
         setIsDraggingVideo(true);
      }

      if (isCommenting) {
         if (!session) {
            toast.error("sign in to comment");
            return;
         }
         const target = e.currentTarget;
         // Get the bounding rectangle of target
         const rect = target.getBoundingClientRect();
         // Mouse position
         const left = (e.clientX - rect.left) / zoom;
         const top = (e.clientY - rect.top) / zoom;
         const positionToCoords = (position: { left: number; top: number } | null | undefined) => {
            if (!position) return null;
            let { left, top } = position;
            return {
               x: Math.round(((left - (PIXELS_PER_SQUARE * stageDimensions.width) / 2) / PIXELS_PER_SQUARE) * 100) / 100,
               y: Math.round((-(top - (PIXELS_PER_SQUARE * stageDimensions.height) / 2) / PIXELS_PER_SQUARE) * 100) / 100,
            };
         };
         let newCommentCoords = positionToCoords({ left, top });
         setFormations((formations: formation[]) => {
            return formations.map((formation, i) => {
               if (i === selectedFormation) {
                  if (formation?.comments?.length) {
                     return {
                        ...formation,
                        comments: [
                           ...formation?.comments,
                           {
                              id: crypto.randomUUID(),
                              user: {
                                 name: session?.user.user_metadata.full_name,
                                 avatar_url: session?.user.user_metadata.avatar_url,
                                 id: session?.user.id,
                              },
                              content: "New comment...",
                              position: newCommentCoords,
                           },
                        ],
                     };
                  } else {
                     return {
                        ...formation,
                        comments: [
                           {
                              id: crypto.randomUUID(),
                              user: {
                                 name: session?.user.user_metadata.full_name,
                                 avatar_url: session?.user.user_metadata.avatar_url,
                                 id: session?.user.id,
                              },
                              content: "New comment...",
                              position: newCommentCoords,
                           },
                        ],
                     };
                  }
               }
               return formation;
            });
         });
         setIsCommenting(false);
      }

      if (e.target.dataset.type === "comment") {
         addToStack();
         setDraggingCommentId(e.target.id);
      }

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
      setIsDraggingVideo(false);

      if (changingControlId) {
         pushChange();
      }
      if (draggingCommentId) {
         pushChange();
      }
      setChangingControlId(null);
      setChangingControlType(null);
      setDraggingCommentId(null);
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
         onPointerUp={!viewOnly ? pointerUp : () => null}
      >
         {/* <div style={{ ...videoCoordinates }} className=" absolute z-[9999] pointer-events-none">
            <div className="relative w-10 h-4 bg-red-600 cursor-pointer select-none pointer-events-auto" id="video"></div>
            <iframe
               className="rounded-xl pointer-events-auto"
               src="https://www.youtube.com/embed/EuX1v3HfVZs"
               title="YouTube video player"
               frameborder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
               allowfullscreen
            ></iframe>
         </div> */}

         <Toaster />
         <div
            onPointerDown={!viewOnly ? pointerDown : () => null}
            onPointerMove={handleDragMove}
            ref={stage}
            className="relative bg-white rounded-xl"
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
            {stageBackground === "basketballCourt" ? (
               <img
                  src="/basketball.svg"
                  className="absolute top-0 left-0 right-0 bottom-0 m-auto opacity-40 pointer-events-none select-none"
                  alt=""
               />
            ) : null}
            {children}

            {/* {isCommenting ? (
               <svg
                  style={{
                     left: cursorPosition?.x / zoom - 20,
                     top: cursorPosition?.y / zoom - 20,
                     // left: 0,
                     // top: 0,
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 absolute z-[99999]"
               >
                  <path
                     fillRule="evenodd"
                     d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z"
                     clipRule="evenodd"
                  />
               </svg>
            ) : null} */}

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
