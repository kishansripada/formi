import { dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Dropdown } from "../_components/Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { PerformancePreview } from "../_components/PerformancePreview";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useDroppable } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
export const ProjectPreview: React.FC<{
   project: any;
   myDances: any;
   activeId: string | null;
}> = ({ project, myDances, activeId }) => {
   const supabase = createClientComponentClient();
   const projectPerformances = myDances.filter((performance) => project.id === performance.project_id);
   const { isOver, setNodeRef } = useDroppable({
      id: project.id,
   });
   const router = useRouter();
   const deleteProject = async (id: number) => {
      const { data, error } = await supabase.from("projects").delete().eq("id", id);
      if (error) {
         toast.error("there was an issue deleting your dance");
         return;
      }
      router.refresh();
      toast.success("Deleted project");
   };

   return (
      <>
         <div
            style={{
               borderColor: isOver ? "white" : "rgb(38 38 38)",
            }}
            ref={setNodeRef}
            className=" h-[310px] mb-4 p-4 min-h-[310px] border-2 border-neutral-800 flex flex-col  bg-neutral-900 rounded-xl  w-full"
         >
            <style jsx>{`
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
               }
            `}</style>
            <div className="flex flex-row items-start justify-between    h-10">
               <Link href={`/dashboard/project/${project.id}`} className="flex group flex-row items-start">
                  <div className="rounded-lg  bg-neutral-800 grid place-items-center p-3 mr-4">
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
                  <p className="text-xs text-white mt-1 mr-2">{project.name}</p>
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                     className="w-6 h-6 stroke-neutral-600 group-hover:stroke-neutral-100 transition"
                  >
                     <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
               </Link>

               <button
                  onClick={() => {
                     deleteProject(project.id);
                  }}
                  className="ml-auto hidden lg:grid  px-3 text-sm shadow-sm cursor-pointer select-none rounded-md font-semibold  place-items-center  bg-opacity-20 py-2 bg-red-500 text-red-400  "
               >
                  Delete Project
               </button>
            </div>

            <div className="w-full mt-auto pb-2  flex flex-row items-center overflow-x-scroll  ">
               {projectPerformances
                  .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                  .map((dance) => {
                     const style = activeId === dance.id ? { zIndex: 10, position: "relative" } : {};
                     return (
                        <div style={style} className="w-[280px] min-w-[280px] mr-4 ">
                           <PerformancePreview dance={dance}></PerformancePreview>
                        </div>
                     );
                  })}
            </div>
         </div>
      </>
   );
};
