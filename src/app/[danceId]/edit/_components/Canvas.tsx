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
} from "../../../../types/types";
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
   localSettings: localSettings;
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
   setProps: Function;
   selectedFormations: number[];
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
   setProps,
   selectedFormations,
}) => {
   let { stageDimensions, stageBackground } = cloudSettings;
   let { gridSnap } = localSettings;

   const stageFlippedFactor = stageFlipped ? -1 : 1;

   const [draggingCommentId, setDraggingCommentId] = useState<string | null>();
   const [changingControlId, setChangingControlId] = useState<null | string>(null);
   const [changingControlType, setChangingControlType] = useState<"start" | "end" | null>(null);
   const [dragBoxCoords, setDragBoxCoords] = useState<dragBoxCoords>({ start: { x: null, y: null }, end: { x: null, y: null } });
   const [isDragging, setIsDragging] = useState(false);
   const [rotatingDancerId, setRotatingDancerId] = useState(null);
   const [draggingPropId, setDraggingPropId] = useState(null);
   console.log(roundToNearestEven(stageDimensions.width + 30));
   const selectedDancersBoundingBox = useMemo(() => {
      function findBoundingBox(
         points: { x: number; y: number }[]
      ): { start: { left: number; top: number }; end: { left: number; top: number } } | null {
         if (points.length === 0) {
            throw new Error("Points array must not be empty");
         }
         const buffer = 0.6;

         let minX = points[0].x;
         let minY = points[0].y;
         let maxX = points[0].x;
         let maxY = points[0].y;

         for (let i = 1; i < points.length; i++) {
            const point = points[i];
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
         }

         return {
            start: coordsToPosition({ x: minX - buffer, y: maxY + buffer }), // In graphical representation, the top left point has the smallest x and the largest y
            end: coordsToPosition({ x: maxX + buffer, y: minY - buffer }), // Similarly, the bottom right point has the largest x and the smallest y
         };
      }
      if (selectedFormation === null) return null;
      if (selectedDancers.length < 2) return null;
      const positions = formations[selectedFormation]?.positions
         .filter((position: dancerPosition) => selectedDancers.includes(position.id))
         .map((position) => position.position);
      if (!positions?.length) return null;
      return findBoundingBox(positions);
   }, [selectedDancers, formations, selectedFormation]);

   const [resizingPropType, setResizingPropType] = useState(null);
   const positionToCoords = (position: { left: number; top: number }) => {
      if (!position) return null;
      let { left, top } = position;
      return {
         x: (left - (PIXELS_PER_SQUARE * cloudSettings.stageDimensions.width) / 2) / PIXELS_PER_SQUARE,
         y: -(top - (PIXELS_PER_SQUARE * cloudSettings.stageDimensions.height) / 2) / PIXELS_PER_SQUARE,
      };
   };

   const container = useRef();
   const stage = useRef();
   const session = useSession();

   const fitStageToScreen = () => {
      if (!container.current) return;
      if (!stage.current) return;

      let heightPercentage = (container.current.clientHeight - 75) / stage.current.clientHeight;
      let widthPercentage = (container.current.clientWidth - 75) / stage.current.clientWidth;
      // let heightPercentage = container.current.clientHeight / stage.current.clientHeight;
      // let widthPercentage = container.current.clientWidth / stage.current.clientWidth;
      setZoom(Math.min(heightPercentage, widthPercentage));
   };

   useEffect(() => {
      fitStageToScreen();
   }, [container?.current?.clientHeight, stage?.current?.clientHeight, stageDimensions]);

   const handleDragMove = (e: any) => {
      if (selectedFormation === null || isPlaying) return;

      const target = e.currentTarget;
      const stage = target.querySelector("#stage-cutout");

      // Get the bounding rectangle of target
      const rect = stage.getBoundingClientRect();

      const { x, y } = positionToCoords({ left: (e.clientX - rect.left) / zoom, top: (e.clientY - rect.top) / zoom });

      if (changingControlId) {
         if (viewOnly) return;
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
                                    Math.round(
                                       (dancerPosition.controlPointStart.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom) * 100
                                    ) / 100,
                                 y:
                                    Math.round(
                                       (dancerPosition.controlPointStart.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom) * 100
                                    ) / 100,
                              },
                           };
                        }
                        if (selectedDancers.includes(dancerPosition.id) && changingControlType === "end" && dancerPosition.controlPointEnd) {
                           return {
                              ...dancerPosition,
                              controlPointEnd: {
                                 x:
                                    Math.round(
                                       (dancerPosition.controlPointEnd.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom) * 100
                                    ) / 100,
                                 y:
                                    Math.round(
                                       (dancerPosition.controlPointEnd.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom) * 100
                                    ) / 100,
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
                                 x: dancerPosition.position.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.position.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom,
                              },
                              controlPointEnd: {
                                 x:
                                    Math.round(
                                       (dancerPosition.controlPointEnd.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom) * 100
                                    ) / 100,
                                 y:
                                    Math.round(
                                       (dancerPosition.controlPointEnd.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom) * 100
                                    ) / 100,
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
                                 x: dancerPosition.position.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.position.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom,
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
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
                  return {
                     ...formation,
                     comments: (formation.comments || []).map((comment: comment) => {
                        // console.log(comment.id);
                        // console.log({ draggingCommentId });
                        if (comment.id === draggingCommentId) {
                           return {
                              ...comment,
                              position: {
                                 x: Math.round((comment.position.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom) * 100) / 100,
                                 y: Math.round((comment.position.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom) * 100) / 100,
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
         if (viewOnly) return;
         if (props.find((prop: prop) => prop.id === draggingPropId)?.type === "static") {
            // const prop = props.find((prop: prop) => prop.id === draggingPropId);

            setProps((props: prop[]) => {
               return props.map((prop: prop) => {
                  if (prop.id === draggingPropId) {
                     return {
                        ...prop,
                        static: {
                           ...prop.static,
                           position: {
                              x: prop.static.position.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom,
                              y: prop.static.position.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom,
                           },
                        },
                     };
                  }
                  return prop;
               });
            });
         } else {
            setFormations((formations: formation[]) => {
               return formations.map((formation, index: number) => {
                  if (index === selectedFormation) {
                     return {
                        ...formation,
                        props: (formation.props || []).map((prop: propPosition) => {
                           if (prop.id === draggingPropId) {
                              return {
                                 ...prop,
                                 position: {
                                    x: prop.position.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom,
                                    y: prop.position.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom,
                                 },
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
      }

      if (resizingPropId) {
         if (viewOnly) return;
         // console.log(props.find((prop: prop) => prop.id === resizingPropId));
         setProps((props: prop[]) => {
            return props.map((prop: prop) => {
               if (prop.id === resizingPropId) {
                  let deltaX = (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom;
                  // console.log(resizingPropType);
                  if (resizingPropType === "prop-resize-top-left" || resizingPropType === "prop-resize-bottom-left") {
                     return {
                        ...prop,
                        static: {
                           ...prop.static,
                           width: Math.max((prop.static.width || 5) - deltaX, 1),
                        },
                     };
                  } else {
                     return {
                        ...prop,
                        static: {
                           ...prop.static,
                           width: Math.max((prop.static.width || 5) + deltaX, 1),
                        },
                     };
                  }
               }
               return prop;
            });
         });

         // if (props.find((prop: prop) => prop.id === resizingPropId)?.type === "static") {
         //    // console.log("test");

         // } else {
         //    setFormations((formations: formation[]) => {
         //       return formations.map((formation, index: number) => {
         //          if (index === selectedFormation) {
         //             return {
         //                ...formation,
         //                props: (formation.props || []).map((prop: propPosition) => {
         //                   if (prop.id === resizingPropId) {
         //                      let deltaX = (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom / devicePixelRatio;
         //                      if (resizingPropType === "prop-resize-top-left" || resizingPropType === "prop-resize-bottom-left") {
         //                         return {
         //                            ...prop,
         //                            width: Math.max(prop.width - deltaX, 1),
         //                         };
         //                      } else {
         //                         return {
         //                            ...prop,
         //                            width: Math.max(prop.width + deltaX, 1),
         //                         };
         //                      }
         //                   }
         //                   return prop;
         //                }),
         //             };
         //          }

         //          return formation;
         //       });
         //    });
         // }
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
         // if (props.find((prop: prop) => prop.id === draggingPropId)?.type === "static") {
         setProps((props: prop[]) => {
            return props.map((prop) => {
               if (prop.type === "static")
                  return {
                     ...prop,
                     static: {
                        ...prop.static,
                        position: {
                           x: Math.round(prop.static.position.x * gridSnap) / gridSnap,
                           y: Math.round(prop.static.position.y * gridSnap) / gridSnap,
                        },
                     },
                  };
               return prop;
            });
         });
         // } else {
         setFormations((formations: formation[]) => {
            return formations.map((formation) => {
               return {
                  ...formation,
                  props: (formation.props || []).map((prop: propPosition) => {
                     return {
                        ...prop,
                        position: {
                           x: Math.round(prop.position.x * gridSnap) / gridSnap,
                           y: Math.round(prop.position.y * gridSnap) / gridSnap,
                        },
                     };
                  }),
               };
            });
         });
         // }

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

         setFormations((formations: formation[]) => {
            return formations.map((formation, index) => {
               if (!selectedFormations.includes(index)) return formation;
               return {
                  ...formation,
                  positions: formation.positions.map((position) => {
                     if (selectedDancers.includes(position.id)) {
                        return {
                           ...position,
                           position: {
                              x: formations[selectedFormation].positions.find((pos) => pos.id === position.id).position.x,
                              y: formations[selectedFormation].positions.find((pos) => pos.id === position.id).position.y,
                           },
                        };
                     }
                     return position;
                  }),
               };
            });
         });
         pushChange();
      }

      setDraggingDancerId(null);
      setIsDragging(false);
   };

   const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
   const ZOOM_BASE = 1.6; // Adjust the base to fit your preferred zooming speed.

   useEffect(() => {
      const handleWheel = (event) => {
         if (
            !event
               .composedPath()
               .map((elem) => elem.id)
               .includes("stage")
         )
            return;
         if (event.ctrlKey) {
            event.preventDefault();
            setZoom((oldZoom) => {
               const logZoom = Math.log(oldZoom) / Math.log(ZOOM_BASE);
               const newZoom = Math.pow(ZOOM_BASE, logZoom - event.deltaY * 0.01);
               return Math.min(Math.max(0.1, newZoom), 4);
            });
         } else {
            event.preventDefault();
            setScrollOffset((scrollOffset) => ({
               x: scrollOffset.x - event.deltaX / zoom / 1.5,
               y: scrollOffset.y - event.deltaY / zoom / 1.5,
            }));
         }
      };

      document.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
         document.removeEventListener("wheel", handleWheel);
      };
   }, [zoom]);

   // useEffect(() => {
   //    const div = container.current;
   //    if (div) {
   //       const x = (div.scrollWidth - div.offsetWidth) / 2;
   //       const y = (div.scrollHeight - div.offsetHeight) / 2;
   //       div.scrollTo(x, y);
   //    }
   // }, [stageDimensions]);

   return (
      <>
         {/* <style>
            {`
#stage::-webkit-scrollbar:vertical {
   width: 11px;
}

#stage::-webkit-scrollbar:horizontal {
   height: 11px;
}
`}
         </style> */}
         <div
            // flex
            className="  relative  bg-neutral-100  dark:bg-neutral-900  h-full  w-full overflow-scroll  overscroll-contain  flex flex-row items-center justify-center "
            id="stage"
            ref={container}
            onPointerUp={pointerUp}
            onPointerMove={handleDragMove}
            style={{}}
            // style={{
            //    width: `${(stageDimensions.width * PIXELS_PER_SQUARE) / zoom}px`,
            //    height: `${(stageDimensions.height * PIXELS_PER_SQUARE) / zoom}px`,
            // }}
         >
            <Toaster />
            <div
               style={{
                  transform: `scale(${zoom}) translate(${scrollOffset.x}px, ${scrollOffset.y}px)`,
                  // width: PIXELS_PER_SQUARE * (stageDimensions.width + 30) * zoom,
                  // height: PIXELS_PER_SQUARE * (stageDimensions.height + 10) * zoom,
                  // transform: `scale(${zoom})`,
               }}
               // style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, transform: `scale(${zoom})`, transformOrigin: "center" }}
               className=" flex flex-row items-center justify-center  "
            >
               <div
                  className=" absolute opacity-50  "
                  style={{
                     height: PIXELS_PER_SQUARE * roundToNearestEven(stageDimensions.height + 10),
                     minHeight: PIXELS_PER_SQUARE * roundToNearestEven(stageDimensions.height + 10),
                     minWidth: PIXELS_PER_SQUARE * roundToNearestEven(stageDimensions.width + 30),
                     width: PIXELS_PER_SQUARE * roundToNearestEven(stageDimensions.width + 30),
                     // transform: `scale(${zoom}) translate(${scrollOffset.x}px, ${scrollOffset.y}px)`,
                     // transform: `scale(${zoom}) `,
                     // transformOrigin: "center",
                  }}
               >
                  <GridLines
                     cloudSettings={cloudSettings}
                     stageDimensions={{
                        width: roundToNearestEven(stageDimensions.width + 30),
                        height: roundToNearestEven(stageDimensions.height + 10),
                     }}
                  />
               </div>
               <div
                  onPointerDown={pointerDown}
                  ref={stage}
                  id="stage-cutout"
                  className="relative  border-2 dark:border-pink-600 border-pink-300 rounded-xl bg-white dark:bg-neutral-800 box-content "
                  // border-pink-600 border-4 box-border
                  style={{
                     // margin: 400,
                     // boxShadow: "inset 0px 0px 0px 4px #db2777",
                     // border: "solid 4px transparent",
                     // borderImage: "linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%)",
                     // backgroundImage: "linear-gradient(white, white), radial-gradient(circle at top left, #8e24aa,#db2777)",

                     // backgroundOrigin: "border-box",
                     // backgroundClip: "padding-box, border-box",
                     // top: scrollOffset.y,
                     // left: scrollOffset.x,
                     // transformOrigin: `${scrollOffset.x}px ${scrollOffset.y}px`,
                     // transform: `scale(${zoom}) `,
                     // transform: `scale(${zoom}) translate(${scrollOffset.x}px, ${scrollOffset.y}px)`,
                     // translate(${scrollOffset.x}px, ${scrollOffset.y}px)

                     // translate(${scrollOffset.x}px, ${scrollOffset.y}px)
                     height: stageDimensions.height * PIXELS_PER_SQUARE,
                     minHeight: stageDimensions.height * PIXELS_PER_SQUARE,
                     width: stageDimensions.width * PIXELS_PER_SQUARE,
                     minWidth: stageDimensions.width * PIXELS_PER_SQUARE,
                  }}
               >
                  {children}

                  {cloudSettings.backgroundUrl && cloudSettings.stageBackground === "custom" ? (
                     <img
                        draggable={false}
                        className="w-full h-full object-contain  select-none opacity-40 "
                        src={cloudSettings.backgroundUrl}
                        alt=""
                     />
                  ) : null}

                  {stageBackground === "grid" ? (
                     <GridLines localSettings={localSettings} zoom={zoom} cloudSettings={cloudSettings} stageDimensions={stageDimensions} />
                  ) : null}

                  {stageBackground === "cheer9" ? <CheerLines stageDimensions={stageDimensions}></CheerLines> : null}

                  {!isPlaying && !localSettings.stageFlipped && (
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                        <p className="text-center text-3xl dark:text-white font-extrabold opacity-30 tracking-widest">BACKSTAGE</p>
                     </div>
                  )}
                  {!isPlaying && localSettings.stageFlipped && (
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
                        <p className="text-center text-3xl dark:text-white font-extrabold opacity-30 tracking-widest">BACKSTAGE</p>
                     </div>
                  )}
                  {dragBoxCoords.start.x && dragBoxCoords.end.x && dragBoxCoords.start.y && dragBoxCoords.end.y && !isPlaying ? (
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

                  {selectedDancersBoundingBox && !isPlaying ? (
                     <>
                        <div
                           className="absolute  z-20 cursor-default border-2 border-blue-600 "
                           style={{
                              width: Math.abs(selectedDancersBoundingBox.end.left - selectedDancersBoundingBox.start.left),
                              height: Math.abs(selectedDancersBoundingBox.end.top - selectedDancersBoundingBox.start.top),
                              left: selectedDancersBoundingBox.start.left,
                              top: selectedDancersBoundingBox.start.top,
                           }}
                        ></div>
                        <div
                           id="rotate-group"
                           className="absolute -translate-x-1/2  w-7 h-7 grid place-items-center cursor-ew-resize  z-20 border border-neutral-300 bg-neutral-200 rounded-full "
                           style={{
                              left:
                                 selectedDancersBoundingBox.start.left +
                                 Math.abs(selectedDancersBoundingBox.end.left - selectedDancersBoundingBox.start.left) * 0.5,
                              top: selectedDancersBoundingBox.end.top + 20,
                           }}
                        >
                           <svg className=" w-5 h-5 fill-neutral-700 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path
                                 fill="currentColor"
                                 d="M15.25 18.48V15a.75.75 0 1 0-1.5 0v4c0 .97.78 1.75 1.75 1.75h4a.75.75 0 1 0 0-1.5h-2.6a8.75 8.75 0 0 0-2.07-15.53.75.75 0 1 0-.49 1.42 7.25 7.25 0 0 1 .91 13.34zM8.75 5.52V9a.75.75 0 0 0 1.5 0V5c0-.97-.78-1.75-1.75-1.75h-4a.75.75 0 0 0 0 1.5h2.6a8.75 8.75 0 0 0 2.18 15.57.75.75 0 0 0 .47-1.43 7.25 7.25 0 0 1-1-13.37z"
                              />
                           </svg>
                        </div>
                     </>
                  ) : (
                     <></>
                  )}
               </div>
            </div>
         </div>
      </>
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

function roundToNearestEven(n: number): number {
   // If n is an even number, return it as is.
   if (n % 2 === 0) {
      return n;
   } else {
      return n + 1;
   }
}