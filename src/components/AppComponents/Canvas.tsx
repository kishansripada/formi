import { useState, useEffect, useRef } from "react";

import { GridLines } from "./GridLines";
import { dancer, dancerPosition, formation } from "../../types/types";

export interface DragItem {
   type: string;
   id: string;
   top: number;
   left: number;
   formations: formation[];
   selectedFormation: number;
}

export const Canvas: React.FC<{
   children: React.ReactNode;
   setDancers: Function;
   dancers: dancer[];
   setFormations: Function;
   selectedFormation: number | null;
   formations: formation[];
}> = ({ children, setDancers, dancers, setFormations, selectedFormation, formations }) => {
   let [draggingDancerId, setDraggingDancerId] = useState<null | string>(null);

   const coordsToPosition = (x: number, y: number) => {
      return { left: 400 + 40 * x, top: 400 + 40 * -y };
   };

   const handleDragMove = (e) => {
      if (!draggingDancerId) return;
      // Get the target
      const target = e.currentTarget;

      // Get the bounding rectangle of target
      const rect = target.getBoundingClientRect();

      // Mouse position
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setFormations((formations: formation[]) => {
         return formations.map((formation, index: number) => {
            if (index === selectedFormation) {
               return {
                  ...formation,
                  positions: formation.positions.map((dancerPosition) => {
                     if (dancerPosition.id === draggingDancerId) {
                        return {
                           ...dancerPosition,
                           position: { ...positionToCoords(x, y + (800 - rect.height) / 2) },
                        };
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
      if (e.target.id) {
         console.log(e.target.id);
         setDraggingDancerId(e.target.id);
      } else {
         console.log("drag to select");
      }
   };

   const pointerUp = (e) => {
      setDraggingDancerId(null);
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
            <GridLines />
         </div>
      </div>
   );
};

const positionToCoords = (left: number, top: number) => {
   return { x: Math.round((left - 400) / 40), y: Math.round((-1 * (top - 400)) / 40) + 0 };
};
