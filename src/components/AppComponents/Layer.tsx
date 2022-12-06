import { ReactEventHandler } from "react";
import { Formation } from "./Formation";
import { useCallback, useEffect, useState } from "react";
import { dancer, dancerPosition, formation } from "../../types/types";
// import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
// import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

export const Layer: React.FC<{
   formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   setFormations: Function;
   songDuration: number | null;
   position: number | null;
   isPlaying: boolean;
   viewOnly: boolean;
   pixelsPerSecond: number;
   setSelectedDancers: Function;
}> = ({
   formations,
   selectedFormation,
   setSelectedFormation,
   setFormations,
   songDuration,
   position,
   isPlaying,
   viewOnly,
   pixelsPerSecond,
   setSelectedDancers,
}) => {
   const clickOutsideFormations = (e: any) => {
      if (e.target.id !== "outside") return;
      e.stopPropagation();
      setSelectedFormation(null);
   };

   return (
      <>
         <div className=" flex flex-row  items-center w-full bg-[#fafafa] " id="outside" onClick={clickOutsideFormations}>
            {formations.map((formation, index) => (
               <div
                  key={index}
                  id="formation"
                  onClick={(e: any) => {
                     if (selectedFormation === index) return;
                     setSelectedDancers([]);
                     setSelectedFormation(index);
                  }}
               >
                  <Formation
                     viewOnly={viewOnly}
                     setSelectedFormation={setSelectedFormation}
                     setFormations={setFormations}
                     formation={formation}
                     index={index}
                     amSelected={index === selectedFormation}
                     pixelsPerSecond={pixelsPerSecond}
                  />
               </div>
            ))}
         </div>
      </>
   );
};
