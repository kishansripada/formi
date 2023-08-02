"use client";

import { dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
// import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { ProjectPreview } from "./ProjectPreview";
import { PerformancePreview } from "../_components/PerformancePreview";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { DndContext, useDroppable, MouseSensor, useSensors, useSensor } from "@dnd-kit/core";
import { Dance, Project } from "../../../types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const NotInFolder = dynamic(() => import("./NotInFolder"), {
   ssr: false,
});
export default function PageClient({ projects, myDances: initialMyDances }: { projects: Project[]; myDances: Dance[] }) {
   const [myDances, setMyDances] = useState(initialMyDances);

   const supabase = createClientComponentClient();
   const [activeId, setActiveId] = useState<string | null>(null);
   const mouseSensor = useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
         distance: 10,
      },
   });

   const sensors = useSensors(mouseSensor);

   async function handleDragEnd(event: any) {
      //   console.log(event);
      setActiveId(null);
      if (event.over) {
         setMyDances((myDances) => {
            return myDances.map((dance) => {
               if (dance.id === event.active.id) {
                  return {
                     ...dance,
                     project_id: event.over.id === "no folder" ? null : event.over.id,
                  };
               }
               return dance;
            });
         });
         const { error } = await supabase
            .from("dances")
            .update({ project_id: event.over.id === "no folder" ? null : event.over.id })
            .eq("id", event.active.id);

         if (error) {
            toast.error("There was an error moving the performance");
         }
      }
   }

   return (
      <>
         <DndContext id="test" sensors={sensors} onDragStart={(e) => setActiveId(e.active.id.toString())} onDragEnd={handleDragEnd}>
            <div className="overflow-y-scroll h-full flex-grow  ">
               {projects
                  ? projects.map((project) => {
                       return <ProjectPreview key={project.id} activeId={activeId} myDances={myDances} project={project}></ProjectPreview>;
                    })
                  : null}
               <NotInFolder activeId={activeId} myDances={myDances}></NotInFolder>
            </div>
         </DndContext>
      </>
   );
}
