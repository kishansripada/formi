import { ReactEventHandler } from "react";
import { Formation } from "./Formation";
// import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
// import { SortableContext } from "@dnd-kit/sortable";

import { useCallback, useEffect, useState } from "react";
import { dancer, dancerPosition, formation } from "../../types/types";
import { Layer } from "./Layer";
import cursor from "../../../public/cursor.svg";
import { PIXELS_PER_SECOND } from "../../types/types";
// import { horizontalListSortingStrategy } from "@dnd-kit/sortable";

export const Layers: React.FC<{
   formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   setFormations: Function;
   songDuration: number | null;
   position: number | null;
   isPlaying: boolean;
   soundCloudTrackId: string;
}> = ({ formations, selectedFormation, setSelectedFormation, setFormations, songDuration, position, isPlaying, soundCloudTrackId }) => {
   const [activeId, setActiveId] = useState(null);

   const clickOutsideFormations = (e: any) => {
      if (e.target.id !== "outside") return;
      e.stopPropagation();
      setSelectedFormation(null);
   };
   // function handleDragStart(event) {
   //    console.log(event);
   //    // const { active } = event;

   //    // setActiveId(active.id);
   // }

   // function handleDragEnd(event) {
   //    const { active, over } = event;

   //    // if (active.id !== over.id) {
   //    //    setItems((items) => {
   //    //       const oldIndex = items.indexOf(active.id);
   //    //       const newIndex = items.indexOf(over.id);

   //    //       return arrayMove(items, oldIndex, newIndex);
   //    //    });
   //    // }

   //    setActiveId(null);
   // }
   return (
      // <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart}>
      <div
         className="flex flex-col pt-2 pb-3 w-full  bg-white  max-h-[100px] overflow-x-scroll  "
         style={{
            width: songDuration ? (songDuration / 1000) * PIXELS_PER_SECOND : "100%",
            marginLeft: soundCloudTrackId ? (soundCloudTrackId.length < 15 ? 122 : 135) : 115,
         }}
         id="outside"
         onClick={clickOutsideFormations}
      >
         {/* <SortableContext strategy={horizontalListSortingStrategy} items={formations.map((formation) => formation.id)}> */}
         <Layer
            songDuration={songDuration}
            setFormations={setFormations}
            formations={formations}
            selectedFormation={selectedFormation}
            setSelectedFormation={setSelectedFormation}
            isPlaying={isPlaying}
            position={position}
         />
         {/* </SortableContext> */}
         {/* <DragOverlay>{activeId ? <Formation id={activeId} /> : null}</DragOverlay> */}
         <svg
            style={{
               left: position !== null ? position * PIXELS_PER_SECOND : 0,
               top: -40,
               transform: "translate(-50%, 0%) scale(2)",
            }}
            viewBox="0 0 3730 27444"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-70  relative z-50 pointer-events-none"
         >
            <path d="M1873 2248L1865.04 27443" stroke="white" strokeWidth="459" />
            <rect x="547" width="2635" height="2635" rx="400" fill="black" />
            <path
               d="M2200.22 3874.07C2042.45 4116.42 1687.55 4116.42 1529.78 3874.07L652.332 2526.23C479.11 2260.14 670.054 1908 987.557 1908L2742.44 1908C3059.95 1908 3250.89 2260.15 3077.67 2526.23L2200.22 3874.07Z"
               fill="black"
            />
         </svg>
      </div>
      // </DndContext>
   );
};
