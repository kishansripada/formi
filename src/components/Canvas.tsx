import { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import type { XYCoord } from "react-dnd";
import { GridLines } from "../components/GridLines";
import { dancer, dancerPosition, formation } from "../types/types";

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
   const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: ["dancerAlias", "dancer"],
      drop: (item: DragItem, monitor) => {
         if (item?.formations?.[item.selectedFormation]?.positions.find((dancer: dancerPosition) => dancer.id === item.id)) {
            // console.log("dancer already on stage");
            const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
            const left = Math.round(item.left + delta.x);
            const top = Math.round(item.top + delta.y);

            if (item.selectedFormation !== null) {
               setFormations((formations: formation[], index: number) => {
                  return formations.map((formation, i) => {
                     if (i === item.selectedFormation) {
                        return {
                           ...formation,
                           positions: formation.positions.map((dancer) => {
                              if (dancer.id === item.id) {
                                 return { ...dancer, position: { x: positionToCoords(left, top).x, y: positionToCoords(left, top).y } };
                              }
                              return dancer;
                           }),
                        };
                     }

                     return formation;
                  });
               });
            }
         } else {
            //  new dancer
            // console.log("new dancer");

            if (item.selectedFormation !== null) {
               // console.log("selected formation is not null and new dancer");
               setFormations((formations: formation[], index: number) => {
                  return formations.map((formation, i) => {
                     if (i === item.selectedFormation) {
                        return {
                           ...formation,
                           positions: [
                              ...formation.positions,
                              { id: item.id, position: { x: 0, y: 0 }, exitStrategy: "closest", enterStrategy: "closest" },
                           ],
                        };
                     }

                     return formation;
                  });
               });
            }
         }
      },
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
         canDrop: monitor.canDrop(),
      }),
   }));

   return (
      <>
         <div
            className="flex flex-row justify-center items-center relative w-[800px] grow  overflow-hidden  border-2 border-black rounded-xl mx-3"
            id="grid"
            ref={drop}
         >
            <div className="h-[800px] w-[800px] absolute">
               <GridOverlay />
               {children}
               <GridLines />
            </div>
         </div>
      </>
   );
};

const positionToCoords = (left: number, top: number) => {
   return { x: Math.round((left - 400) / 40), y: Math.round((-1 * (top - 400)) / 40) + 0 };
};

// overlay when moving a dancer on the stage for the first time
export const GridOverlay: React.FC<{}> = ({}) => {
   const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: ["dancer"],
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
         canDrop: monitor.canDrop(),
      }),
   }));

   return canDrop ? (
      <div className=" w-[800px] h-[800px] bg-red-200 opacity-30 flex flex-row justify-center items-center absolute z-20" ref={drop}>
         add to scene
      </div>
   ) : (
      <div></div>
   );
};
