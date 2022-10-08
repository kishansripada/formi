import { useState, useEffect, useRef, PointerEvent, PointerEventHandler } from "react";

import { GridLines } from "./GridLines";
import { dancer, dancerPosition, formation, dragBoxCoords } from "../../types/types";
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
   const [isDragging, setIsDragging] = useState(false);
   const [copiedPositions, setCopiedPositions] = useState(false);
   const [dragBoxCoords, setDragBoxCoords] = useState<dragBoxCoords>({ start: { x: null, y: null }, end: { x: null, y: null } });
   const downHandler = (e: any) => {
      if (e?.path?.[0]?.tagName === "INPUT") {
         console.log("in an input field");
         return;
      }
      if (e.key === "Meta") {
         console.log("command pressed");
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

      if (e.key === "a") {
         if (updatedSelectedFormation === null) return;
         e.preventDefault();
         setCommandHeld((commandHeld: boolean) => {
            if (commandHeld && updatedSelectedFormation !== null) {
               e.preventDefault();
               console.log(updatedSelectedFormation);
               setSelectedDancers([...updatedFormations[updatedSelectedFormation]?.positions.map((position) => position.id)]);
            }
            return commandHeld;
         });
      }
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

      // console.log(selectedDancers);
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
   };

   function upHandler({ key }) {
      if (key === "Shift") {
         setShiftHeld(false);
      }
      if (key === "Meta") {
         setCommandHeld(false);
      }
   }

   useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      return () => {
         window.removeEventListener("keydown", downHandler);
         window.removeEventListener("keyup", upHandler);
      };
   }, []);
   const coordsToPosition = (x: number, y: number) => {
      return { left: 400 + 40 * x, top: 400 + 40 * -y };
   };

   const handleDragMove = (e: any) => {
      if (e.target.id && !dragBoxCoords.start.x) {
         setIsDragging(true);
      }
      // Get the target
      const target = e.currentTarget;

      // Get the bounding rectangle of target
      const rect = target.getBoundingClientRect();

      // Mouse position
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (dragBoxCoords.start.x && dragBoxCoords.start.y) {
         setDragBoxCoords((dragBoxCoords) => {
            return { ...dragBoxCoords, end: { x: x, y: y + (800 - rect.height) / 2 } };
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
                           position: { x: dancerPosition.position.x + e.movementX / 40, y: dancerPosition.position.y - e.movementY / 40 },
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
      if (!e.target.id) {
         setSelectedDancers([]);
         // Get the target
         const target = e.currentTarget;

         // Get the bounding rectangle of target
         const rect = target.getBoundingClientRect();

         // Mouse position
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;
         setDragBoxCoords((dragBoxCoords) => {
            return { ...dragBoxCoords, start: { x: x, y: y + (800 - rect.height) / 2 } };
         });
         // console.log(y + (800 - rect.height) / 2);
         // console.log(x);
      }
      if (e.target.id) {
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
      setDragBoxCoords({ start: { x: null, y: null }, end: { x: null, y: null } });
      if (e.target.id && !shiftHeld && !isDragging) {
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

   return (
      <div
         className="flex flex-row justify-center items-center relative w-[800px] grow  overflow-hidden  border-black  mx-3 bg-white rounded-xl cursor-default "
         onPointerDown={pointerDown}
         onPointerUp={pointerUp}
         onPointerMove={handleDragMove}
         onKeyDown={() => console.log("test")}
      >
         <div className="h-[800px] w-[800px] absolute">
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

const positionToCoords = (left: number, top: number) => {
   return { x: Math.round((left - 400) / 40), y: Math.round((-1 * (top - 400)) / 40) + 0 };
};
