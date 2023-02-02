import { useState, useEffect, useRef, useMemo } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { GridLines } from "./GridLines";
import { CheerLines } from "./CheerLines";
import { dancer, dancerPosition, formation, dragBoxCoords, PIXELS_PER_SQUARE, comment, cloudSettings } from "../../types/types";
import { toast, Toaster } from "react-hot-toast";
import { Canvas as Canva, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, Stage, Grid, OrbitControls, Environment, useFBX } from "@react-three/drei";

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
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
   draggingDancerId: string | null;
   setDraggingDancerId: Function;
   player: any;
   undo: Function;
   addToStack: Function;
   pushChange: Function;
   localSettings: any;
   isCommenting: boolean;
   setIsCommenting: Function;
   zoom: number;
   setZoom: Function;

   cloudSettings: cloudSettings;
   isPreviewingThree: boolean;
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
   cloudSettings,
   coordsToPosition,
   draggingDancerId,
   setDraggingDancerId,
   undo,
   addToStack,
   pushChange,
   localSettings,
   isCommenting,
   setIsCommenting,
   zoom,
   setZoom,
   isPreviewingThree,
}) => {
   let { stageDimensions, stageBackground } = cloudSettings;
   const [shiftHeld, setShiftHeld] = useState(false);
   const [draggingCommentId, setDraggingCommentId] = useState<string | null>();
   const [commandHeld, setCommandHeld] = useState(false);
   const [changingControlId, setChangingControlId] = useState<null | string>(null);
   const [changingControlType, setChangingControlType] = useState<"start" | "end" | null>(null);

   const [copiedPositions, setCopiedPositions] = useState([]);
   const [dragBoxCoords, setDragBoxCoords] = useState<dragBoxCoords>({ start: { x: null, y: null }, end: { x: null, y: null } });
   const [isDragging, setIsDragging] = useState(false);

   let { gridSnap } = localSettings;
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
      if (!container.current) return;
      if (!stage.current) return;
      // let heightPercentage = (container.current.clientHeight - 50) / stage.current.clientHeight;
      // let widthPercentage = (container.current.clientWidth - 50) / stage.current.clientWidth;
      let heightPercentage = container.current.clientHeight / stage.current.clientHeight;
      let widthPercentage = container.current.clientWidth / stage.current.clientWidth;
      setZoom(Math.min(heightPercentage, widthPercentage));
   }, [container?.current?.clientHeight, stage?.current?.clientHeight, stageDimensions, children]);

   const downHandler = (e: any) => {
      if (e?.composedPath()?.[0]?.tagName === "INPUT" || e?.composedPath()?.[0]?.tagName === "TEXTAREA" || e.target.id === "input") return;

      // console.log(e.key);
      if (e.key === " ") {
         e.preventDefault();
         setIsPlaying((isPlaying: boolean) => {
            if (player) {
               if (!player?.isReady) return isPlaying;
               player?.playPause();
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
      let MAX_PIXELS_PER_SECOND = 45;
      let minPixelsPerSecond = songDuration ? ((window.screen.width - 10) * 1000) / songDuration : 10;

      if (
         e
            .composedPath()
            .map((elem) => elem.id)
            .includes("layers") &&
         e.ctrlKey === true
      ) {
         e.preventDefault();
         setPixelsPerSecond((pixelsPerSecond: number) => {
            let newPixelsPerSecond = pixelsPerSecond - e.deltaY / 25;

            if (newPixelsPerSecond < minPixelsPerSecond) return pixelsPerSecond;
            if (newPixelsPerSecond > MAX_PIXELS_PER_SECOND) {
               return pixelsPerSecond;
            }
            return newPixelsPerSecond;
         });
      }
   };
   // let canvasRef = useRef();
   // let columns = 20;
   // let rows = 20;
   // let cellSize = 60;

   // const [scale, setScale] = useState(1);
   // const [pan, setPan] = useState({ x: 0, y: 0 });

   // useEffect(() => {
   //    const canvas = canvasRef.current;
   //    const ctx = canvas.getContext("2d");

   //    ctx.save();

   //    // Use the identity matrix while clearing the canvas
   //    ctx.setTransform(1, 0, 0, 1, 0, 0);
   //    ctx.clearRect(0, 0, canvas.width, canvas.height);

   //    // Restore the transform
   //    ctx.restore();
   //    ctx.setTransform(scale, 0, 0, scale, pan.x, pan.y);

   //    for (let i = 0; i < rows; i++) {
   //       for (let j = 0; j < columns; j++) {
   //          ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
   //       }
   //    }
   // }, [rows, columns, cellSize, scale, pan]);

   // const handleWheel = (event) => {
   //    event.preventDefault();
   //    event.stopPropagation();
   //    event.nativeEvent.stopImmediatePropagation();
   //    if (event.ctrlKey) {
   //       const delta = event.deltaY > 0 ? 0.95 : 1.05;
   //       setScale(scale * delta);
   //    } else {
   //       const deltaX = event.deltaX;
   //       const deltaY = event.deltaY;
   //       setPan({ x: pan.x + deltaX, y: pan.y + deltaY });
   //    }
   //    return false;
   // };
   return (
      <div
         className="flex flex-row relative justify-center  h-full cursor-default w-full overflow-hidden  overscroll-contain items-center "
         id="stage"
         ref={container}
         onPointerUp={!viewOnly ? pointerUp : () => null}
      >
         {/* <canvas className="overscroll-contain" ref={canvasRef} width={columns * cellSize} height={rows * cellSize} onWheel={handleWheel} /> */}

         <Toaster />

         {isPreviewingThree ? (
            <Canva gl={{ logarithmicDepthBuffer: true }} camera={{ position: [10, 10, 10], fov: 40 }}>
               <Stage position={[10, 0, 0]} environment="apartment" adjustCamera={false}></Stage>
               <Grid
                  renderOrder={-1}
                  position={[0, 0, 0]}
                  args={[stageDimensions.width / 2, stageDimensions.height / 2]}
                  cellSize={0.5}
                  cellThickness={0.5}
                  sectionSize={2.5}
                  sectionThickness={1.5}
                  sectionColor={[0.5, 0.5, 10]}
               />

               {children}
               <OrbitControls autoRotate autoRotateSpeed={0} enableZoom={true} makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
            </Canva>
         ) : (
            <div
               onPointerDown={!viewOnly ? pointerDown : () => null}
               onPointerMove={handleDragMove}
               ref={stage}
               className="relative bg-white border border-gray-500"
               style={{
                  // top: scrollOffset.y,
                  // left: scrollOffset.x,
                  // transformOrigin: `${scrollOffset.x}px ${scrollOffset.y}px`,
                  transform: `scale(${zoom})  `,
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

               {stageBackground !== "cheer9" && stageBackground !== "cheer7" ? (
                  <>
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
                     ></div>
                  </>
               ) : null}

               <div
                  style={{
                     width: stageDimensions.width * PIXELS_PER_SQUARE,
                  }}
               ></div>

               {stageBackground === "grid" ? <GridLines stageDimensions={stageDimensions} /> : null}

               {stageBackground === "cheer9" ? (
                  <div className="absolute top-0 left-0 right-0 bottom-0 m-auto pointer-events-none select-none">
                     <CheerLines stageDimensions={stageDimensions}></CheerLines>
                  </div>
               ) : null}
            </div>
         )}
      </div>
   );
};
