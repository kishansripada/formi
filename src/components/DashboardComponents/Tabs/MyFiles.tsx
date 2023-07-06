import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
// import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { ProjectPreview } from "../ProjectPreview";
import { PerformancePreview } from "../PerformancePreview";
import { DndContext, useDroppable, MouseSensor, useSensors, useSensor } from "@dnd-kit/core";
export const MyFiles: React.FC<{
   myDances: any;
   invalidateDances: Function;
   createNewDance: Function;
   canCreatePerformance: boolean;
   projects: any;
   setMyDances: Function;
   deleteProject: Function;
   openPerformanceMenu: string;
   setOpenPerformanceMenu: Function;
}> = ({ myDances, invalidateDances, createNewDance, projects, setMyDances, deleteProject, openPerformanceMenu, setOpenPerformanceMenu }) => {
   const supabase = useSupabaseClient();
   const [activeId, setActiveId] = useState(null);
   const mouseSensor = useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
         distance: 10,
      },
   });
   const sensors = useSensors(mouseSensor);

   function handleDragEnd(event) {
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

         supabase
            .from("dances")
            .update({ project_id: event.over.id === "no folder" ? null : event.over.id })
            .eq("id", event.active.id)
            .then((r) => {
               console.log(r);
            });
      }
   }

   return (
      <DndContext sensors={sensors} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
         <div className="overflow-y-scroll p-4 flex-grow  ">
            {projects
               ? projects.map((project) => {
                    return (
                       <ProjectPreview
                          activeId={activeId}
                          openPerformanceMenu={openPerformanceMenu}
                          invalidateDances={invalidateDances}
                          setOpenPerformanceMenu={setOpenPerformanceMenu}
                          deleteProject={deleteProject}
                          myDances={myDances}
                          project={project}
                       ></ProjectPreview>
                    );
                 })
               : null}
            <NotInFolder
               activeId={activeId}
               invalidateDances={invalidateDances}
               openPerformanceMenu={openPerformanceMenu}
               setOpenPerformanceMenu={setOpenPerformanceMenu}
               myDances={myDances}
            ></NotInFolder>
         </div>
      </DndContext>
   );
};

const NotInFolder = ({
   myDances,
   openPerformanceMenu,
   setOpenPerformanceMenu,
   invalidateDances,
   activeId,
}: {
   myDances: any;
   openPerformanceMenu: string;
   setOpenPerformanceMenu: Function;
   invalidateDances: Function;
   activeId: string;
}) => {
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
                  return (
                     <>
                        <div
                           style={{
                              zIndex: activeId === dance.id ? 10 : 0,
                              position: "relative",
                           }}
                        >
                           <PerformancePreview
                              invalidateDances={invalidateDances}
                              dance={dance}
                              openPerformanceMenu={openPerformanceMenu}
                              setOpenPerformanceMenu={setOpenPerformanceMenu}
                           ></PerformancePreview>
                        </div>
                     </>
                  );
               })
         ) : (
            <p>No performances here 🤷🏽‍♂️</p>
         )}
      </div>
   );
};
