"use client";

import { DndContext, useDroppable, MouseSensor, useSensors, useSensor } from "@dnd-kit/core";
import { PerformancePreview } from "../_components/PerformancePreview";
import { Dance } from "../../../types/supabase";
export default function NotInFolder({ myDances, activeId, session }: { myDances: any; activeId: string | null; session }) {
   const { isOver, setNodeRef } = useDroppable({
      id: "no folder",
   });
   return (
      <div
         ref={setNodeRef}
         style={{
            borderColor: isOver ? "white" : "transparent",
         }}
         className="w-full grid grid-cols-1 gap-[32px] border px-4 py-5  rounded-xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 col-span-4   overscroll-contain items-center"
      >
         {myDances.length ? (
            myDances
               // .filter((dance: Dance) => !dance.project_id)
               .sort((a: Dance, b: Dance) => new Date(b.last_edited).getTime() - new Date(a.last_edited).getTime())
               ?.map((dance: Dance) => {
                  const style = activeId === dance.id.toString() ? { zIndex: 10, position: "relative" } : {};

                  return (
                     <div key={dance.id} style={style}>
                        <PerformancePreview dance={dance} session={session}></PerformancePreview>
                     </div>
                  );
               })
         ) : (
            <p className="text-sm font-medium">No performances here</p>
         )}
      </div>
   );
}
