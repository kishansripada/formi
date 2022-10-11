import { useState, useEffect, useRef, PointerEvent, PointerEventHandler, useMemo } from "react";

import { GridLines } from "./GridLines";
import { dancer, dancerPosition, formation, dragBoxCoords, coordsToPosition, PIXELS_PER_SQUARE, GRID_HEIGHT, GRID_WIDTH } from "../../types/types";
import { CurrentFormation } from "./CurrentFormation";

export const Canvas: React.FC<{
   children: React.ReactNode;
   setDancers: Function;
   dancers: dancer[];
   setFormations: Function;
   selectedFormation: number | null;
   formations: formation[];
   selectedDancers: string[];
   setSelectedDancers: Function;
   setSelectedFormation: Function;
}> = ({ children, setDancers, dancers, setFormations, selectedFormation, formations, setSelectedDancers, selectedDancers, setSelectedFormation }) => {
   let [draggingDancerId, setDraggingDancerId] = useState<null | string>(null);
   const [shiftHeld, setShiftHeld] = useState(false);
   const [commandHeld, setCommandHeld] = useState(false);
   const [changingControlId, setChangingControlId] = useState<null | string>(null);
   const [changingControlType, setChangingControlType] = useState<"start" | "end" | null>(null);
   const [scrollOffset, setScrollOffset] = useState({ x: -648, y: -684 });
   const [zoom, setZoom] = useState(1);
   const [isDragging, setIsDragging] = useState(false);
   const [copiedPositions, setCopiedPositions] = useState(false);
   const [dragBoxCoords, setDragBoxCoords] = useState<dragBoxCoords>({ start: { x: null, y: null }, end: { x: null, y: null } });
   useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      return () => {
         window.removeEventListener("keydown", downHandler);
         window.removeEventListener("keyup", upHandler);
      };
   }, [selectedFormation, commandHeld]);

   const downHandler = (e: any) => {
      console.log(selectedFormation);
      if (e?.path?.[0]?.tagName === "INPUT") {
         console.log("in an input field");
         return;
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

      let updatedSelectedFormation: null | number = null;
      setSelectedFormation((selectedFormation: null | number) => {
         updatedSelectedFormation = selectedFormation;
         return selectedFormation;
      });

      let updatedFormations: formation[];
      setFormations((formations: formation[]) => {
         updatedFormations = formations;
         return formations;
      });
      if (e.key === "Backspace") {
         e.preventDefault();
         let updatedSelectedDancers: string[] = [];

         setSelectedDancers((selectedDancers: string[]) => {
            updatedSelectedDancers = selectedDancers;
            return selectedDancers;
         });

         setFormations((formations: formation[]) => {
            return formations.map((formation, i) => {
               if (i === updatedSelectedFormation) {
                  return {
                     ...formation,
                     positions: formation.positions.filter((dancerPosition: dancerPosition) => {
                        return !updatedSelectedDancers.find((id) => dancerPosition.id === id);
                     }),
                  };
               }
               return formation;
            });
         });
         setSelectedDancers((selectedDancers: string[]) => {
            return [];
         });
      }

      if (!commandHeld) return;
      if (selectedFormation === null) return;

      if (e.key === "a") {
         e.preventDefault();
         setSelectedDancers([...updatedFormations[updatedSelectedFormation]?.positions.map((position) => position.id)]);
      }

      // if (e.key === "a") {
      //    if (updatedSelectedFormation === null) return;
      //    e.preventDefault();
      //    setCommandHeld((commandHeld: boolean) => {
      //       if (commandHeld && updatedSelectedFormation !== null) {
      //          e.preventDefault();
      //          console.log(updatedSelectedFormation);
      //          setSelectedDancers([...updatedFormations[updatedSelectedFormation]?.positions.map((position) => position.id)]);
      //       }
      //       return commandHeld;
      //    });
      // }
      let updatedSelectedDancers: string[] = [];

      setSelectedDancers((selectedDancers: string[]) => {
         updatedSelectedDancers = selectedDancers;
         return selectedDancers;
      });

      // ////////////////////////// COPY PASTE ////////////////////////// ////////////////////////
      if (e.key === "c") {
         if (updatedSelectedFormation === null) return;

         // e.preventDefault();
         setCommandHeld((commandHeld: boolean) => {
            if (commandHeld && updatedSelectedDancers.length && updatedSelectedFormation !== null) {
               setCopiedPositions(
                  updatedFormations[updatedSelectedFormation].positions.filter((dancerPosition) => updatedSelectedDancers.includes(dancerPosition.id))
               );
            }
            return commandHeld;
         });
      }

      // on paste, filter out all of the dancers that are being pasted before splicing them into the array of positions
      if (e.key === "v") {
         console.log("v");
         console.log({ copiedPositions });
         if (updatedSelectedFormation === null) return;

         setCommandHeld((commandHeld: boolean) => {
            // if (!copiedPositions) return;
            if (commandHeld) {
               console.log("paste!");
               // e.preventDefault();
               setCopiedPositions((copiedPositions) => {
                  if (!copiedPositions) return false;
                  setFormations((formations) => {
                     return formations.map((formation, i) => {
                        if (i === updatedSelectedFormation) {
                           return {
                              ...formation,
                              positions: [
                                 ...formation.positions.filter((dancerPosition) => {
                                    return !copiedPositions.map((dancerPositionCopy) => dancerPositionCopy.id).includes(dancerPosition.id);
                                 }),
                                 ...copiedPositions,
                              ],
                           };
                        }

                        return formation;
                     });
                  });
                  return copiedPositions;
               });
            }
            return commandHeld;
         });
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
      if (changingControlId && changingControlType === "start") {
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
                  return {
                     ...formation,
                     positions: formation.positions.map((dancerPosition) => {
                        // dancerPosition.id === draggingDancerId
                        if (changingControlId === dancerPosition.id) {
                           return {
                              ...dancerPosition,
                              controlPointStart: {
                                 x: dancerPosition.controlPointStart.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.controlPointStart.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                              },
                           };
                           // ...positionToCoords(x, y + (800 - rect.height) / 2)
                        }
                        return dancerPosition;
                     }),
                  };
               }
               return formation;
            });
         });
      }
      if (changingControlId && changingControlType === "end") {
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
                  return {
                     ...formation,
                     positions: formation.positions.map((dancerPosition) => {
                        // dancerPosition.id === draggingDancerId
                        if (changingControlId === dancerPosition.id) {
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
      // console.log(target);
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
                        coordsToPosition(dancerPosition.position.x, dancerPosition.position.y).left >
                           Math.min(dragBoxCoords.start.x, dragBoxCoords.end.x) &&
                        coordsToPosition(dancerPosition.position.x, dancerPosition.position.y).left <
                           Math.max(dragBoxCoords.start.x, dragBoxCoords.end.x) &&
                        coordsToPosition(dancerPosition.position.x, dancerPosition.position.y).top >
                           Math.min(dragBoxCoords.start.y, dragBoxCoords.end.y) &&
                        coordsToPosition(dancerPosition.position.x, dancerPosition.position.y).top <
                           Math.max(dragBoxCoords.start.y, dragBoxCoords.end.y)
                     );
                  })
                  .map((dancerPosition: dancerPosition) => dancerPosition.id)
            );
         }
      }
      if (!draggingDancerId) return;
      setFormations((formations: formation[]) => {
         return formations.map((formation, index: number) => {
            if (index === selectedFormation) {
               return {
                  ...formation,
                  positions: formation.positions.map((dancerPosition) => {
                     // dancerPosition.id === draggingDancerId
                     if (selectedDancers.includes(dancerPosition.id)) {
                        return {
                           ...dancerPosition,
                           position: {
                              x: dancerPosition.position.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                              y: dancerPosition.position.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                           },
                           controlPointStart: {
                              x: dancerPosition.controlPointStart.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                              y: dancerPosition.controlPointStart.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                           },
                        };
                        // ...positionToCoords(x, y + (800 - rect.height) / 2)
                     }
                     return dancerPosition;
                  }),
               };
            }
            return formation;
         });
      });
   };

   const pointerDown = (e: any) => {
      if (e.target.dataset.type === "controlPointStart") {
         setChangingControlId(e.target.id);
         setChangingControlType("start");
      }
      if (e.target.dataset.type === "controlPointEnd") {
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
                     return { ...position, position: { x: Math.round(position.position.x), y: Math.round(position.position.y) } };
                  }),
               };
            });
         });
      }
      setDraggingDancerId(null);
      setIsDragging(false);
   };

   useEffect(() => {
      window.addEventListener("wheel", handleScroll, { passive: false });

      return () => {
         window.removeEventListener("wheel", handleScroll);
      };
   }, []);

   const handleScroll = (e) => {
      if (
         e
            .composedPath()
            .map((elem) => elem.id)
            .includes("stage") &&
         e.ctrlKey === false
      ) {
         e.preventDefault();
         setScrollOffset((scrollOffset) => {
            return { y: scrollOffset.y - e.deltaY, x: scrollOffset.x - e.deltaX };
         });
      }
      if (
         e
            .composedPath()
            .map((elem) => elem.id)
            .includes("stage") &&
         e.ctrlKey === true
      ) {
         e.preventDefault();
         setZoom((zoom) => (zoom - e.deltaY / 200 > 0.2 && zoom - e.deltaY / 200 < 1.2 ? zoom - e.deltaY / 200 : zoom));
      }
   };
   return (
      <div className="flex flex-row  h-full cursor-default w-1/2 overflow-hidden mx-4 px-3 rounded-xl  " id="stage" onPointerUp={pointerUp}>
         <div
            className="relative bg-white "
            onPointerDown={pointerDown}
            onPointerMove={handleDragMove}
            style={{
               top: scrollOffset.y,
               left: scrollOffset.x,
               transform: `scale(${zoom})`,
               height: GRID_HEIGHT * PIXELS_PER_SQUARE,
               width: GRID_WIDTH * PIXELS_PER_SQUARE,
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

            <GridLines />
         </div>
      </div>
   );
};

// const positionToCoords = (left: number, top: number) => {
//    return { x: Math.round((left - 400) / 40), y: Math.round((-1 * (top - 400)) / 40) + 0 };
// };
