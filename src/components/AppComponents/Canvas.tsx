import { useState, useEffect, useRef, useMemo } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { GridLines } from "./GridLines";
import { CheerLines } from "./CheerLines";
import { dancer, dancerPosition, formation, dragBoxCoords, PIXELS_PER_SQUARE, comment, cloudSettings } from "../../types/types";
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

   const container = useRef();
   const stage = useRef();
   const session = useSession();

   useEffect(() => {
      if (!container.current) return;
      if (!stage.current) return;

      let heightPercentage = (container.current.clientHeight - (isVideo(soundCloudTrackId) ? 5 : 15)) / stage.current.clientHeight;
      let widthPercentage = (container.current.clientWidth - (isVideo(soundCloudTrackId) ? 5 : 30)) / stage.current.clientWidth;
      // let heightPercentage = container.current.clientHeight / stage.current.clientHeight;
      // let widthPercentage = container.current.clientWidth / stage.current.clientWidth;
      setZoom(Math.min(heightPercentage, widthPercentage));
   }, [container?.current?.clientHeight, stage?.current?.clientHeight, stageDimensions, children]);

   const handleDragMove = (e: any) => {
      if (selectedFormation === null) return;

      if (changingControlId) {
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
                                 x: dancerPosition.controlPointStart.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.controlPointStart.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom,
                              },
                           };
                        }
                        if (selectedDancers.includes(dancerPosition.id) && changingControlType === "end" && dancerPosition.controlPointEnd) {
                           return {
                              ...dancerPosition,
                              controlPointEnd: {
                                 x: dancerPosition.controlPointEnd.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.controlPointEnd.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom,
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

      if (rotatingDancerId) {
         const target = e.currentTarget;

         // Get the bounding rectangle of target
         const rect = target.getBoundingClientRect();

         // Mouse position
         const left = e.clientX - rect.left;
         const top = e.clientY - rect.top;

         let dancerPos = coordsToPosition(formations[selectedFormation]?.positions.find((position) => position.id === rotatingDancerId)?.position);
         dancerPos = { left: dancerPos.left * zoom, top: dancerPos.top * zoom };
         function getAngle(pointA, pointB): number {
            const angleRad = Math.atan2(pointB.top - pointA.top, pointB.left - pointA.left);
            let angleDeg = (angleRad * 180) / Math.PI - 90;
            angleDeg = angleDeg >= 0 ? angleDeg : 360 + angleDeg;
            return angleDeg;
         }

         let angle = getAngle(dancerPos, { left, top });

         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
                  return {
                     ...formation,
                     positions: formation.positions.map((dancerPosition) => {
                        if (selectedDancers.length ? selectedDancers.includes(dancerPosition.id) : dancerPosition.id === rotatingDancerId) {
                           return {
                              ...dancerPosition,
                              rotation: {
                                 angle: Math.round(angle / 45) * 45 === 360 ? 0 : Math.round(angle / 45) * 45,
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
                                 x: dancerPosition.controlPointEnd.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.controlPointEnd.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom,
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
                                 x: comment.position.x + (stageFlippedFactor * e.movementX) / PIXELS_PER_SQUARE / zoom,
                                 y: comment.position.y - (stageFlippedFactor * e.movementY) / PIXELS_PER_SQUARE / zoom,
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
         pushChange();
         setIsCommenting(false);
      }

      if (e.target.dataset.type === "comment") {
         // addToStack();
         setDraggingCommentId(e.target.id);
      }

      if (e.target.dataset.type === "controlPointStart") {
         // addToStack();
         setChangingControlId(e.target.id);
         setChangingControlType("start");
      }

      if (e.target.dataset.type === "controlPointEnd") {
         // addToStack();
         setChangingControlId(e.target.id);
         setChangingControlType("end");
      }

      // if (e.target.dataset.type === "rotater") {
      //    addToStack();
      //    setRotatingDancerId(e.target.id);
      // }

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
      // if (rotatingDancerId) {
      //    pushChange();
      // }

      setChangingControlId(null);
      setChangingControlType(null);
      setDraggingCommentId(null);
      setRotatingDancerId(null);
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

   return (
      <div
         className="flex flex-row relative justify-center bg-neutral-100  h-full  w-full overflow-hidden  overscroll-contain items-center  "
         id="stage"
         ref={container}
         onPointerUp={!viewOnly ? pointerUp : () => null}
      >
         <Toaster />

         <div
            onPointerDown={!viewOnly ? pointerDown : () => null}
            onPointerMove={handleDragMove}
            ref={stage}
            className="relative  border-2 border-neutral-300 bg-white  box-content "
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
                  width: stageDimensions.width * PIXELS_PER_SQUARE,
               }}
            ></div>

            {cloudSettings.backgroundUrl && cloudSettings.stageBackground === "custom" ? (
               <img className="w-full h-full object-contain pointer-events-none select-none opacity-40 " src={cloudSettings.backgroundUrl} alt="" />
            ) : null}

            {stageBackground === "grid" ? <GridLines cloudSettings={cloudSettings} stageDimensions={stageDimensions} /> : null}

            {stageBackground === "cheer9" ? (
               <div className="absolute top-0 left-0 right-0 bottom-0 m-auto pointer-events-none select-none">
                  <CheerLines stageDimensions={stageDimensions}></CheerLines>
               </div>
            ) : null}
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
