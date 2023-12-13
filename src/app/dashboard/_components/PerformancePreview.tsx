"use client";

import { MAX_NUMBER_OF_DANCES_FOR_FREE_PLAN, dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dance, Database } from "../../../types/supabase";
import { useStore } from "../store";
import { AuthSession } from "@supabase/supabase-js";
import {
   ContextMenu,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuSeparator,
   ContextMenuSub,
   ContextMenuSubContent,
   ContextMenuSubTrigger,
   ContextMenuTrigger,
} from "@/components/ui/context-menu";

export const PerformancePreview = ({ dance, session, projects }: { dance: Dance; session: AuthSession }) => {
   const { plan, numberOfDances } = useStore();

   const supabase = createClientComponentClient<Database>();
   const router = useRouter();

   const moveToTrash = async (id: number) => {
      const { data, error } = await supabase.from("dances").update({ isInTrash: true }).eq("id", id);

      if (!error) {
         toast.success("Moved to trash");
      } else {
         toast.error("There was an error moving to trash");
      }
      router.refresh();
   };

   const duplicateDance = async (danceId: number) => {
      if (!plan && numberOfDances >= MAX_NUMBER_OF_DANCES_FOR_FREE_PLAN) {
         router.push("/upgrade");
         return;
      }
      let dance = await supabase
         .from("dances")
         .select("*")
         .eq("id", danceId)
         .single()
         .then((r) => r.data);

      delete dance.id;
      delete dance.created_at;
      delete dance.last_edited;
      delete dance.sharesettings;

      const { data: newDance, error } = await supabase
         .from("dances")
         .insert([{ ...dance, name: "Copy of " + dance.name, user: (await supabase.auth.getUser()).data.user?.id, last_edited: new Date() }])
         .select("id")
         .single();

      if (!newDance?.id) return;
      router.refresh();
      router.push(`/${newDance.id}/edit`);
   };

   const duplicateRoster = async (dance: Dance) => {
      if (!plan && numberOfDances >= MAX_NUMBER_OF_DANCES_FOR_FREE_PLAN) {
         router.push("/upgrade");
         return;
      }
      // console.log(dance);
      const sessionId = (await supabase.auth.getUser()).data.user?.id;
      if (!sessionId) {
         router.push(`/login`);
         return;
      }
      const { data: newDance } = await supabase
         .from("dances")
         .insert([{ user: sessionId, last_edited: new Date(), dancers: dance.dancers, formations: [dance.formations] }])
         .select("id")
         .single();

      if (!newDance?.id) return;
      router.push(`/${newDance.id}/edit`);
   };

   return (
      <>
         <ContextMenu>
            <ContextMenuContent>
               <ContextMenuItem
                  onClick={() => {
                     duplicateDance(dance.id);
                  }}
               >
                  Duplicate
               </ContextMenuItem>
               <ContextMenuItem
                  onClick={() => {
                     duplicateRoster(dance);
                  }}
               >
                  New From Roster
               </ContextMenuItem>
               {projects?.length && (
                  <ContextMenuSub>
                     <ContextMenuSubTrigger>{dance.project_id ? "Move to" : "Add to project"}</ContextMenuSubTrigger>
                     <ContextMenuSubContent className="">
                        {projects
                           .filter((project) => project.id !== dance.project_id)
                           .map((project) => {
                              return (
                                 <ContextMenuItem
                                    key={project.id}
                                    onClick={async () => {
                                       const { data, error } = await supabase.from("dances").update({ project_id: project.id }).eq("id", dance.id);
                                       if (!error) {
                                          toast.success("Added to project");
                                       } else {
                                          toast.error("There was an error adding to project");
                                       }
                                       router.refresh();
                                    }}
                                 >
                                    {project.name}
                                 </ContextMenuItem>
                              );
                           })}
                     </ContextMenuSubContent>
                  </ContextMenuSub>
               )}

               {session && session.user.id === dance.user ? (
                  <>
                     {" "}
                     <ContextMenuSeparator></ContextMenuSeparator>
                     <ContextMenuItem
                        onClick={() => {
                           moveToTrash(dance.id);
                        }}
                     >
                        Delete
                     </ContextMenuItem>
                  </>
               ) : null}
            </ContextMenuContent>

            <ContextMenuTrigger>
               <div key={dance.id} className="flex flex-col items-center group   w-full relative cursor-default  ">
                  <Toaster></Toaster>

                  <Link prefetch={false} className="w-full cursor-default" href={`/${dance.id}/edit`}>
                     <div className="w-full ">
                        <div className=" rounded-t-md min-h-[200px]  w-full relative  transition border-transparent group-hover:border-[#FEA3E5]  border overflow-hidden   rounded-md bg-neutral-800  ">
                           {dance.formations.positions?.map((position: dancerPosition) => {
                              return (
                                 <div
                                    key={position.id}
                                    className="absolute w-2 h-2  -translate-x-1/2 -translate-y-1/2 rounded-full  pointer-events-none"
                                    style={{
                                       backgroundColor: dance?.dancers?.find((dancer: dancer) => dancer.id === position.id)?.color || "#db2777",
                                       left: `${
                                          ((position.position.x + dance.settings.stageDimensions.width / 2) / dance.settings.stageDimensions.width) *
                                          100
                                       }%`,
                                       top: `${
                                          ((-position.position.y + dance.settings.stageDimensions.height / 2) /
                                             dance.settings.stageDimensions.height) *
                                          100
                                       }%`,
                                    }}
                                 ></div>
                              );
                           })}
                        </div>
                        <div className="flex flex-row justify-start items-center w-full  py-1 rounded-b-xl">
                           <div className="w-full">
                              <p className="mt-1 mb-1 text-sm font-semibold">{dance.name}</p>
                              <div className="flex flex-row items-center text-xs text-neutral-300 justify-between w-full">
                                 <p className=" ">Edited {timeSince(dance.last_edited)} ago</p>
                                 {dance.user !== session?.user?.id ? (
                                    <p>Shared with me</p>
                                 ) : projects?.length ? (
                                    projects.find((project) => project?.id === dance?.project_id)?.name || ""
                                 ) : (
                                    <></>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </Link>
               </div>
            </ContextMenuTrigger>
         </ContextMenu>
      </>
   );
};
var timeSince = function (date: string | Date) {
   if (typeof date === "string") {
      date = new Date(date);
   }

   var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
   var intervalType = "";

   var interval = Math.floor(seconds / 31536000);
   if (interval >= 1) {
      intervalType = "year";
   } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
         intervalType = "month";
      } else {
         interval = Math.floor(seconds / 86400);
         if (interval >= 1) {
            intervalType = "day";
         } else {
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
               intervalType = "hour";
            } else {
               interval = Math.floor(seconds / 60);
               if (interval >= 1) {
                  intervalType = "minute";
               } else {
                  interval = seconds;
                  intervalType = "second";
               }
            }
         }
      }
   }

   if (interval > 1 || interval === 0) {
      intervalType += "s";
   }

   return interval + " " + intervalType;
};
