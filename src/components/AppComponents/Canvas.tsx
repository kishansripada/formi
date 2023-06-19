import { useState, useEffect, useRef, useMemo } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { GridLines } from "./GridLines";
import { CheerLines } from "./CheerLines";
import {
   dancer,
   dancerPosition,
   formation,
   dragBoxCoords,
   PIXELS_PER_SQUARE,
   comment,
   cloudSettings,
   localSettings,
   prop,
   propPosition,
} from "../../types/types";
import { toast, Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { Prop } from "./Prop";

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
   soundCloudTrackId: string | null;
   cloudSettings: cloudSettings;
   stageFlipped: boolean;
   shiftHeld: boolean;
   setShiftHeld: Function;
   isPlaying: boolean;
   props: any;
   setSelectedPropIds: Function;
   selectedPropIds: string[];
   resizingPropId: string | null;
   setResizingPropId: Function;
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
   soundCloudTrackId,
   stageFlipped,
   shiftHeld,
   setShiftHeld,
   isPlaying,
   props,
   setSelectedPropIds,
   selectedPropIds,
   resizingPropId,
   setResizingPropId,
}) => {
   let { stageDimensions, stageBackground } = cloudSettings;
   let { gridSnap } = localSettings;
   function getDevicePixelRatio() {
      // return window.devicePixelRatio || 1;
      return 1;
   }

   const stageFlippedFactor = stageFlipped ? -1 : 1;

   const [draggingCommentId, setDraggingCommentId] = useState<string | null>();
   const [changingControlId, setChangingControlId] = useState<null | string>(null);
   const [changingControlType, setChangingControlType] = useState<"start" | "end" | null>(null);
   const [dragBoxCoords, setDragBoxCoords] = useState<dragBoxCoords>({ start: { x: null, y: null }, end: { x: null, y: null } });
   const [isDragging, setIsDragging] = useState(false);
   const [rotatingDancerId, setRotatingDancerId] = useState(null);
   const [draggingPropId, setDraggingPropId] = useState(null);

   const [resizingPropType, setResizingPropType] = useState(null);

   const container = useRef();
   const stage = useRef();
   const session = useSession();

   useEffect(() => {
      if (!container.current) return;
      if (!stage.current) return;

      let heightPercentage = (container.current.clientHeight - 75) / stage.current.clientHeight;
      let widthPercentage = (container.current.clientWidth - 75) / stage.current.clientWidth;
      // let heightPercentage = container.current.clientHeight / stage.current.clientHeight;
      // let widthPercentage = container.current.clientWidth / stage.current.clientWidth;
      setZoom(Math.min(heightPercentage, widthPercentage));
   }, [container?.current?.clientHeight, stage?.current?.clientHeight, stageDimensions]);

   const handleDragMove = (e: any) => {
      if (selectedFormation === null || isPlaying) return;

      if (changingControlId) {
         if (viewOnly) return;
         let devicePixelRatio = getDevicePixelRatio();
         // devicePixelRatio = devicePixelRatio / 2;
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
                  return {
                     ...formation,
                     positions: formation.positions.map((dancerPosition) => {
                        if (selectedDancers.includes(dancerPosition.id) && changingControlType === "start" && dancerPosition.controlPointStart) {
                           return {
                              ...dancerPosition,
                              controlPointStart: {
                                 x:
                                    dancerPosition.controlPointStart.x +
                                    (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
                                 y:
                                    dancerPosition.controlPointStart.y -
                                    (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
                              },
                           };
                        }
                        if (selectedDancers.includes(dancerPosition.id) && changingControlType === "end" && dancerPosition.controlPointEnd) {
                           return {
                              ...dancerPosition,
                              controlPointEnd: {
                                 x:
                                    dancerPosition.controlPointEnd.x +
                                    (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
                                 y:
                                    dancerPosition.controlPointEnd.y -
                                    (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
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

      // if (rotatingDancerId) {
      //    const target = e.currentTarget;

      //    // Get the bounding rectangle of target
      //    const rect = target.getBoundingClientRect();

      //    // Mouse position
      //    const left = e.clientX - rect.left;
      //    const top = e.clientY - rect.top;

      //    let dancerPos = coordsToPosition(formations[selectedFormation]?.positions.find((position) => position.id === rotatingDancerId)?.position);
      //    dancerPos = { left: dancerPos.left * zoom, top: dancerPos.top * zoom };
      //    function getAngle(pointA, pointB): number {
      //       const angleRad = Math.atan2(pointB.top - pointA.top, pointB.left - pointA.left);
      //       let angleDeg = (angleRad * 180) / Math.PI - 90;
      //       angleDeg = angleDeg >= 0 ? angleDeg : 360 + angleDeg;
      //       return angleDeg;
      //    }

      //    let angle = getAngle(dancerPos, { left, top });

      //    setFormations((formations: formation[]) => {
      //       return formations.map((formation, index: number) => {
      //          if (index === selectedFormation) {
      //             return {
      //                ...formation,
      //                positions: formation.positions.map((dancerPosition) => {
      //                   if (selectedDancers.length ? selectedDancers.includes(dancerPosition.id) : dancerPosition.id === rotatingDancerId) {
      //                      return {
      //                         ...dancerPosition,
      //                         rotation: {
      //                            angle: Math.round(angle / 45) * 45 === 360 ? 0 : Math.round(angle / 45) * 45,
      //                         },
      //                      };
      //                   }
      //                   return dancerPosition;
      //                }),
      //             };
      //          }
      //          return formation;
      //       });
      //    });
      // }

      if (dragBoxCoords.start.x && dragBoxCoords.start.y) {
         const target = e.currentTarget;
         const stage = target.querySelector("#stage-cutout");

         // Get the bounding rectangle of target
         const rect = stage.getBoundingClientRect();

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
                     let localDancerPosition = {
                        x: stageFlippedFactor * dancerPosition.position.x,
                        y: stageFlippedFactor * dancerPosition.position.y,
                     };
                     return (
                        coordsToPosition(localDancerPosition).left > Math.min(dragBoxCoords.start.x, dragBoxCoords.end.x) &&
                        coordsToPosition(localDancerPosition).left < Math.max(dragBoxCoords.start.x, dragBoxCoords.end.x) &&
                        coordsToPosition(localDancerPosition).top > Math.min(dragBoxCoords.start.y, dragBoxCoords.end.y) &&
                        coordsToPosition(localDancerPosition).top < Math.max(dragBoxCoords.start.y, dragBoxCoords.end.y)
                     );
                  })
                  .map((dancerPosition: dancerPosition) => dancerPosition.id)
            );
         }
      }
      if (draggingDancerId) {
         if (viewOnly) return;
         let devicePixelRatio = getDevicePixelRatio();
         // devicePixelRatio = devicePixelRatio / 2;
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
                  return {
                     ...formation,
                     positions: formation.positions.map((dancerPosition) => {
                        if (
                           selectedDancers.includes(dancerPosition.id) &&
                           dancerPosition.transitionType === "cubic" &&
                           dancerPosition.controlPointEnd &&
                           dancerPosition.controlPointStart
                        ) {
                           // console.log();
                           // console.log(dancerPosition.controlPointEnd.y);
                           return {
                              ...dancerPosition,
                              position: {
                                 x: dancerPosition.position.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
                                 y: dancerPosition.position.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
                              },
                              controlPointEnd: {
                                 x:
                                    dancerPosition.controlPointEnd.x +
                                    (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
                                 y:
                                    dancerPosition.controlPointEnd.y -
                                    (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
                              },
                           };
                        }
                        if (
                           selectedDancers.includes(dancerPosition.id) &&
                           (dancerPosition.transitionType === "linear" ||
                              !dancerPosition.transitionType ||
                              dancerPosition.transitionType === "teleport")
                        ) {
                           return {
                              ...dancerPosition,
                              position: {
                                 x: dancerPosition.position.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
                                 y: dancerPosition.position.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
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

      if (draggingCommentId) {
         if (viewOnly) return;
         let devicePixelRatio = getDevicePixelRatio();
         // devicePixelRatio = devicePixelRatio / 2;
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
                                 x: comment.position.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
                                 y: comment.position.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
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

      if (draggingPropId) {
         let appliedTransformation = null;
         if (viewOnly) return;
         let devicePixelRatio = getDevicePixelRatio();
         // devicePixelRatio = devicePixelRatio / 2;
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
                  return {
                     ...formation,
                     props: (formation.props || []).map((prop: propPosition) => {
                        // console.log(comment.id);
                        // console.log({ draggingCommentId });
                        if (prop.id === draggingPropId) {
                           appliedTransformation = {
                              x: prop.position.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
                              y: prop.position.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom / devicePixelRatio,
                           };
                           return {
                              ...prop,
                              position: appliedTransformation,
                           };
                        }
                        return prop;
                     }),
                  };
               }

               return formation;
            });
         });
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (props.find((prop: prop) => prop.id === draggingPropId).type === "static") {
                  return {
                     ...formation,
                     props: (formation.props || []).map((prop: propPosition) => {
                        // console.log(comment.id);
                        // console.log({ draggingCommentId });
                        if (prop.id === draggingPropId) {
                           return {
                              ...prop,
                              position: appliedTransformation,
                           };
                        }
                        return prop;
                     }),
                  };
               }

               return formation;
            });
         });
      }

      if (resizingPropId) {
         if (viewOnly) return;
         let devicePixelRatio = getDevicePixelRatio();
         let appliedTransformation = null;
         // devicePixelRatio = devicePixelRatio / 2;
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
                  return {
                     ...formation,
                     props: (formation.props || []).map((prop: propPosition) => {
                        if (prop.id === resizingPropId) {
                           let deltaX = (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom / devicePixelRatio;
                           let deltaY = (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom / devicePixelRatio;

                           if (resizingPropType === "prop-resize-top-left") {
                              appliedTransformation = Math.max(prop.width - deltaX, 1);
                              return {
                                 ...prop,
                                 width: Math.max(prop.width - deltaX, 1),
                              };
                           }
                           if (resizingPropType === "prop-resize-top-right") {
                              appliedTransformation = Math.max(prop.width + deltaX, 1);
                              return {
                                 ...prop,
                                 width: Math.max(prop.width + deltaY, 1),
                              };
                           }
                           if (resizingPropType === "prop-resize-bottom-right") {
                              appliedTransformation = Math.max(prop.width + deltaX, 1);
                              return {
                                 ...prop,
                                 width: Math.max(prop.width + deltaX, 1),
                              };
                           }
                           if (resizingPropType === "prop-resize-bottom-left") {
                              appliedTransformation = Math.max(prop.width - deltaX, 1);
                              return {
                                 ...prop,
                                 width: Math.max(prop.width - deltaX, 1),
                              };
                           }
                        }
                        return prop;
                     }),
                  };
               }

               return formation;
            });
         });
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (props.find((prop: propPosition) => prop.id === resizingPropId).type === "static") {
                  return {
                     ...formation,
                     props: (formation.props || []).map((prop: propPosition) => {
                        if (prop.id === resizingPropId) {
                           if (resizingPropType === "prop-resize-top-left" || resizingPropType === "prop-resize-bottom-left") {
                              return {
                                 ...prop,
                                 width: appliedTransformation,
                              };
                           } else {
                              return {
                                 ...prop,
                                 width: appliedTransformation,
                              };
                           }
                        }
                        return prop;
                     }),
                  };
               }

               return formation;
            });
         });
      }
   };

   const pointerDown = (e: any) => {
      if (isPlaying) return;
      if (isCommenting) {
         if (viewOnly) return;
         if (!session) {
            toast.error("Sign In to Comment");
            return;
         }
         // addToStack();
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
         if (stageFlipped) {
            newCommentCoords = { x: -newCommentCoords?.x, y: -newCommentCoords?.y };
         }
         setFormations((formations: formation[]) => {
            return formations.map((formation, i) => {
               if (i === selectedFormation) {
                  if (formation?.comments?.length) {
                     return {
                        ...formation,
                        comments: [
                           ...formation?.comments,
                           {
                              id: uuidv4(),
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
                              id: uuidv4(),
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
         pushChange();
         setIsCommenting(false);
      }

      if (e.target.dataset.type === "comment") {
         // addToStack();
         setDraggingCommentId(e.target.id);
      }

      if (e.target.dataset.type === "prop") {
         // addToStack();
         setDraggingPropId(e.target.id);

         if (!shiftHeld && !selectedPropIds.includes(e.target.id)) {
            setSelectedPropIds([e.target.id]);
         }

         if (shiftHeld) {
            if (!selectedPropIds.includes(e.target.id)) {
               setSelectedPropIds((selectedPropIds: string[]) => [...selectedPropIds, e.target.id]);
            } else {
               setSelectedPropIds((selectedPropIds: string[]) => selectedPropIds.filter((id) => id !== e.target.id));
            }
         }
      }
      if (e.target.dataset.type === "controlPointStart") {
         // addToStack();
         setChangingControlId(e.target.id);
         setChangingControlType("start");
      }

      if (e.target.dataset.type?.startsWith("prop-resize")) {
         // addToStack();
         setResizingPropType(e.target.dataset.type);
         setResizingPropId(e.target.id);
      }

      if (e.target.dataset.type === "controlPointEnd") {
         // addToStack();
         setChangingControlId(e.target.id);
         setChangingControlType("end");
      }

      if (e.target.dataset.type === "prop") {
         // addToStack();
         setDraggingPropId(e.target.id);
      }

      // if (e.target.dataset.type === "rotater") {
      //    addToStack();
      //    setRotatingDancerId(e.target.id);
      // }

      if (!e.target.id) {
         setSelectedDancers([]);
         setSelectedPropIds([]);
         // Get the target
         const target = e.currentTarget;

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
         // addToStack();
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
      if (resizingPropId) {
         pushChange();
      }
      if (draggingPropId) {
         pushChange();
      }
      // if (rotatingDancerId) {
      //    pushChange();
      // }

      setChangingControlId(null);
      setChangingControlType(null);
      setDraggingCommentId(null);
      setRotatingDancerId(null);
      setDraggingPropId(null);
      setResizingPropId(null);
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
      setDraggingDancerId(null);
      setIsDragging(false);
   };
   useEffect(() => {
      // This function is called when the wheel event is triggered
      const handleWheel = (event) => {
         // Check if the ctrl key is pressed

         if (
            event.ctrlKey &&
            event
               .composedPath()
               .map((elem) => elem.id)
               .includes("stage")
         ) {
            event.preventDefault();
            setZoom((zoom) => Math.min(Math.max(0.4, zoom + event.deltaY * -0.01), 4));
            // event.preventDefault();
            // Handle zooming or whatever functionality you want here...
         }
      };

      // Attach the event listener to the document
      // The third parameter is an options object where 'passive' is set to true,
      // meaning the event listener will not call preventDefault
      document.addEventListener("wheel", handleWheel, { passive: false });

      // Cleanup by removing the event listener when the component unmounts
      return () => {
         document.removeEventListener("wheel", handleWheel);
      };
   }, []);

   return (
      <div
         className="flex flex-row relative justify-center bg-neutral-100  dark:bg-neutral-900  h-full  w-full overflow-hidden  overscroll-contain items-center  "
         id="stage"
         ref={container}
         onPointerUp={pointerUp}
         onPointerMove={handleDragMove}
      >
         <Toaster />
         <div
            className=" absolute opacity-50 "
            style={{
               height: PIXELS_PER_SQUARE * (stageDimensions.height + 10),
               width: PIXELS_PER_SQUARE * (stageDimensions.width + 30),
               transform: `scale(${zoom})`,
            }}
         >
            <GridLines cloudSettings={cloudSettings} stageDimensions={{ width: stageDimensions.width + 30, height: stageDimensions.height + 10 }} />
         </div>
         <div
            onPointerDown={pointerDown}
            ref={stage}
            id="stage-cutout"
            className="relative  border-2 dark:border-pink-600 border-pink-300 rounded-xl bg-white dark:bg-neutral-800 box-content "
            // border-pink-600 border-4 box-border
            style={{
               // boxShadow: "inset 0px 0px 0px 4px #db2777",
               // border: "solid 4px transparent",
               // borderImage: "linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%)",
               // backgroundImage: "linear-gradient(white, white), radial-gradient(circle at top left, #8e24aa,#db2777)",

               // backgroundOrigin: "border-box",
               // backgroundClip: "padding-box, border-box",
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

            <div
               style={{
                  width: stageDimensions.width * PIXELS_PER_SQUARE,
               }}
            ></div>

            {cloudSettings.backgroundUrl && cloudSettings.stageBackground === "custom" ? (
               <img className="w-full h-full object-contain pointer-events-none select-none opacity-40 " src={cloudSettings.backgroundUrl} alt="" />
            ) : null}

            {stageBackground === "grid" ? <GridLines cloudSettings={cloudSettings} stageDimensions={stageDimensions} /> : null}

            {stageBackground === "cheer9" ? <CheerLines stageDimensions={stageDimensions}></CheerLines> : null}

            {!isPlaying && !localSettings.stageFlipped && (
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                  <p className="text-center text-3xl dark:text-white font-extrabold opacity-30 tracking-widest">AUDIENCE</p>
               </div>
            )}
            {!isPlaying && localSettings.stageFlipped && (
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
                  <p className="text-center text-3xl dark:text-white font-extrabold opacity-30 tracking-widest">BACKSTAGE</p>
               </div>
            )}
            {dragBoxCoords.start.x && dragBoxCoords.end.x && dragBoxCoords.start.y && dragBoxCoords.end.y ? (
               <div
                  className="absolute bg-pink-200/50 z-20 cursor-default "
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
         </div>
      </div>
   );
};
function getExtension(filename: string) {
   var parts = filename.split(".");
   return parts[parts.length - 1];
}

function isVideo(filename: string) {
   if (!filename) return false;
   var ext = getExtension(filename);
   switch (ext.toLowerCase()) {
      case "m4v":
      case "avi":
      case "mpg":
      case "mp4":
         // etc
         return true;
   }
   return false;
}
