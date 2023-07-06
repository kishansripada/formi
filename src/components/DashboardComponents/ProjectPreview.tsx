import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { PerformancePreview } from "./PerformancePreview";
import { useDroppable } from "@dnd-kit/core";
export const ProjectPreview: React.FC<{
   project: any;
   myDances: any;
   deleteProject: Function;
   openPerformanceMenu: string;
   setOpenPerformanceMenu: Function;
   invalidateDances: Function;
   activeId: string | null;
}> = ({ project, myDances, deleteProject, openPerformanceMenu, setOpenPerformanceMenu, invalidateDances, activeId }) => {
   const projectPerformances = myDances.filter((performance) => project.id === performance.project_id);
   const { isOver, setNodeRef } = useDroppable({
      id: project.id,
   });

   return (
      <>
         <style>{`
      
      /* This will target the scrollbar track (the space the scrollbar travels along) */
::-webkit-scrollbar {
    width: 8px; /* Adjust width for vertical scrollbar */
    height: 8px; /* Adjust height for horizontal scrollbar */
}

/* This will target the scrollbar thumb (the element inside the track that can be dragged) */
::-webkit-scrollbar-thumb {
    background: #888; /* Change to your desired color */
    border-radius: 4px; /* If you want to round your corners */
}

/* This will target the scrollbar thumb when it's being hovered over */
::-webkit-scrollbar-thumb:hover {
    background: #555; /* Change to your desired color */
}`}</style>
         <div
            style={{
               borderColor: isOver ? "white" : "transparent",
            }}
            ref={setNodeRef}
            className=" h-[310px] mb-4 p-4 min-h-[310px] flex flex-col  border bg-neutral-900 rounded-xl border-nuetral-800 w-full"
         >
            <div className="flex flex-row items-start justify-between    h-10">
               <div className="flex flex-row items-start">
                  <div className="rounded-lg bg-neutral-800 grid place-items-center p-3 mr-4">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 stroke-neutral-500"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                        />
                     </svg>
                  </div>
                  <p className="text-xs text-white mt-2">{project.name}</p>
               </div>
               <button
                  onClick={() => {
                     deleteProject(project.id);
                  }}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                     />
                  </svg>
               </button>
            </div>

            <div className="w-full mt-auto pb-2  flex flex-row items-center overflow-x-scroll  ">
               {projectPerformances
                  .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                  .map((dance) => {
                     return (
                        <div
                           style={{
                              zIndex: activeId === dance.id ? 10 : 0,
                           }}
                           className="w-[280px] min-w-[280px] mr-4 relative"
                        >
                           <PerformancePreview
                              invalidateDances={invalidateDances}
                              dance={dance}
                              openPerformanceMenu={openPerformanceMenu}
                              setOpenPerformanceMenu={setOpenPerformanceMenu}
                           ></PerformancePreview>
                        </div>
                     );
                  })}
            </div>
         </div>
      </>
   );
};
