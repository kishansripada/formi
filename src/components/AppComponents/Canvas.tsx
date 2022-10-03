import { useState, useEffect, useRef } from "react";

import { GridLines } from "./GridLines";
import { dancer, dancerPosition, formation } from "../../types/types";
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
   const [dragBoxCoords, setDragBoxCoords] = useState({ start: { x: null, y: null }, end: { x: null, y: null } });
   const downHandler = (e) => {
      // console.log(updatedCommandHeld);
      // console.log(e.key);
      let updatedSelectedFormation: null | number = null;
      setSelectedFormation((selectedFormation: null | number) => {
         updatedSelectedFormation = selectedFormation;
         return selectedFormation;
      });

      let updatedFormations;
      setFormations((formations: null | number) => {
         updatedFormations = formations;
         return formations;
      });

      if (e.key === "Meta") {
         console.log("command pressed");
         setCommandHeld(true);
      }

      if (e.key === "a") {
         if (updatedSelectedFormation === null) return;

         setCommandHeld((commandHeld: boolean) => {
            if (commandHeld) {
               e.preventDefault();
               console.log(updatedSelectedFormation);
               setSelectedDancers([...updatedFormations[updatedSelectedFormation]?.positions.map((position) => position.id)]);
            }
            return commandHeld;
         });
      }

      // console.log(selectedDancers);
      if (e.key === "Backspace") {
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
      if (e.key === "Shift") {
         setShiftHeld(true);
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

   const handleDragMove = (e) => {
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
         if (dragBoxCoords.end.x && dragBoxCoords.end.y) {
            setSelectedDancers(
               formations?.[selectedFormation]?.positions
                  .filter((dancerPosition) => {
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
                  .map((dancerPosition) => dancerPosition.id)
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

   const pointerDown = (e) => {
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
         if (shiftHeld) {
            if (!selectedDancers.includes(e.target.id)) {
               setSelectedDancers((selectedDancers: string[]) => [...selectedDancers, e.target.id]);
            } else {
               setSelectedDancers((selectedDancers: string[]) => selectedDancers.filter((id) => id !== e.target.id));
            }
         }
      }

      if (selectedDancers.length > 0 && e.target.id && !shiftHeld && !selectedDancers.includes(e.target.id)) {
         setSelectedDancers([e.target.id]);
      }

      if (!selectedDancers.length && e.target.id) {
         setSelectedDancers([e.target.id]);
      }
   };

   const pointerUp = (e) => {
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
         className="flex flex-row justify-center items-center relative w-[800px] grow  overflow-hidden  border-black  mx-3 bg-white rounded-xl"
         onPointerDown={pointerDown}
         onPointerUp={pointerUp}
         onPointerMove={handleDragMove}
      >
         <div className="h-[800px] w-[800px] absolute">
            {children}
            {dragBoxCoords.start.x && dragBoxCoords.end.x ? (
               <div
                  className="absolute bg-blue-200/50 z-10"
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
