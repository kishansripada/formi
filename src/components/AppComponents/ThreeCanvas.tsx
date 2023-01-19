import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { GridLines } from "./GridLines";
import { dancer, dancerPosition, formation, dragBoxCoords, PIXELS_PER_SQUARE, comment } from "../../types/types";
import { toast, Toaster } from "react-hot-toast";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, Stage, Grid, OrbitControls, Environment, useFBX } from "@react-three/drei";
import { ThreeDancer } from "./ThreeDancer";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const ThreeCanvas: React.FC<{
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
   position: number | null;
   dancers: dancer[];
   currentFormationIndex: number | null;
   percentThroughTransition: number;
   isPlaying: boolean;
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
   position,
   dancers,
   currentFormationIndex,
   percentThroughTransition,
   isPlaying,
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

   const session = useSession();

   useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      return () => {
         window.removeEventListener("keydown", downHandler);
         window.removeEventListener("keyup", upHandler);
      };
   }, [selectedFormation, commandHeld, selectedDancers, formations, copiedPositions]);

   const downHandler = (e: any) => {
      if (e?.path?.[0]?.tagName === "INPUT" || e?.path?.[0]?.tagName === "TEXTAREA" || e.target.id === "input") return;
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
      <div className="flex flex-row relative justify-center  h-full w-full overflow-hidden  overscroll-contain ">
         <p className="absolute bottom-1 left-2 z-50 text-white text-xs">The 3D preview is currently limited to view only.</p>
         <Canvas gl={{ logarithmicDepthBuffer: true }} shadows camera={{ position: [-15, 0, 10], fov: 25 }}>
            {/* <fog attach="fog" args={["black", 15, 21.5]} /> */}
            <Stage
               position={[10, 0, 0]}
               intensity={0.5}
               environment="dawn"
               //    shadows={{ type: "accumulative", bias: -0.001 }}
               adjustCamera={false}
            ></Stage>
            <Grid
               renderOrder={-1}
               position={[0, 0, 0]}
               args={[stageDimensions.width / 2, stageDimensions.height / 2]}
               cellSize={0.5}
               cellThickness={0.5}
               sectionSize={2.5}
               sectionThickness={1.5}
               sectionColor={[0.5, 0.5, 10]}
               //    fadeDistance={30}
            />
            {selectedFormation !== null
               ? formations[selectedFormation].positions.map((dancerPosition: dancerPosition) => {
                    return (
                       <ThreeDancer
                          isPlaying={isPlaying}
                          currentFormationIndex={currentFormationIndex}
                          percentThroughTransition={percentThroughTransition}
                          dancers={dancers}
                          position={position}
                          dancerPosition={dancerPosition}
                          formations={formations}
                       ></ThreeDancer>
                    );
                 })
               : null}

            <OrbitControls autoRotate autoRotateSpeed={0} enableZoom={true} makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
            <Environment background preset="city" blur={0.8} />
         </Canvas>
      </div>
   );
};
