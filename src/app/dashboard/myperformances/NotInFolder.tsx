"use client";

import { DndContext, useDroppable, MouseSensor, useSensors, useSensor } from "@dnd-kit/core";
import { PerformancePreview } from "../_components/PerformancePreview";
export default function NotInFolder({ myDances, activeId }: { myDances: any; activeId: string | null }) {
   const { isOver, setNodeRef } = useDroppable({
      id: "no folder",
   });
   return (
      <div
         ref={setNodeRef}
         style={{
            borderColor: isOver ? "white" : "transparent",
         }}
         className="w-full grid grid-cols-1 gap-[32px] border  rounded-xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 col-span-4   overscroll-contain items-center"
      >
         {myDances.length ? (
            myDances
               .filter((dance) => !dance.project_id)
               .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
               ?.map((dance) => {
                  const style = activeId === dance.id ? { zIndex: 10, position: "relative" } : {};

                  return (
                     <>
                        <div key={dance.id} style={style}>
                           <PerformancePreview dance={dance}></PerformancePreview>
                        </div>
                     </>
                  );
               })
         ) : (
            <p>No performances here 🤷🏽‍♂️</p>
         )}
      </div>
   );
}
