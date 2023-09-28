"use client";

import { dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDraggable } from "@dnd-kit/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dance, Database } from "../../../types/supabase";
import { useStore } from "../store";
export const PerformancePreview = ({ dance }: { dance: Dance }) => {
   const MAX_NUMBER_OF_DANCES_FOR_FREE_PLAN = 3;
   const { plan, numberOfDances } = useStore();

   const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: dance.id,
   });

   const supabase = createClientComponentClient<Database>();
   const router = useRouter();
   const [open, setOpen] = useState(false);
   const moveToTrash = async (id: number) => {
      const { data, error } = await supabase.from("dances").update({ isInTrash: true }).eq("id", id);

      if (!error) {
         setOpen(false);
         toast.success("Moved to trash");
         router.refresh();
      } else {
         toast.error("There was an error moving to trash");
      }
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

   const style = transform
      ? {
           transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

   return (
      <>
         {open ? (
            <>
               <div
                  className="fixed top-0 left-0 z-[100] flex transition h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
                  id="outside"
                  onClick={(e) => {
                     if ((e.target as HTMLDivElement).id === "outside") {
                        setOpen(false);
                     }
                  }}
               >
                  <div className="flex z-[50] w-[500px] flex-col relative  bg-neutral-800/90 border border-neutral-500  px-10 pt-6 pb-6   rounded-xl  text-sm ">
                     <p className="text-xl font-bold">{dance.name}</p>
                     <div className="flex flex-row mt-10 items-center w-full ">
                        <button
                           onClick={() => {
                              moveToTrash(dance.id);
                           }}
                           className="  px-3 text-sm shadow-sm cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-2 bg-red-500 text-red-400  "
                        >
                           Move to Trash
                        </button>

                        <button
                           onClick={() => {
                              duplicateRoster(dance);
                           }}
                           className="  ml-auto mr-2 px-3 text-sm shadow-sm cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-2 bg-blue-500 text-blue-400  "
                        >
                           New From Roster
                        </button>
                        <button
                           onClick={() => {
                              duplicateDance(dance.id);
                           }}
                           className=" px-3 text-sm shadow-sm cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-2 bg-blue-500 text-blue-400  "
                        >
                           Duplicate
                        </button>
                     </div>
                  </div>
               </div>
            </>
         ) : null}

         <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            key={dance.id}
            onContextMenu={(e) => {
               e.preventDefault();
               setOpen(true);
            }}
            className="flex flex-col items-center group   w-full relative cursor-pointer  "
         >
            <Toaster></Toaster>

            <Link prefetch={false} className="w-full" href={`/${dance.id}/edit`}>
               <div className="w-full border-neutral-800 group-hover:border-pink-600 transition border overflow-hidden  bg-neutral-800 rounded-xl">
                  <div className="bg-neutral-900 rounded-md min-h-[150px]  w-full relative border-transparent transition   ">
                     {dance.formations.positions?.map((position: dancerPosition) => {
                        return (
                           <>
                              <div
                                 className="absolute w-2 h-2   rounded-full  pointer-events-none"
                                 style={{
                                    backgroundColor: dance?.dancers?.find((dancer: dancer) => dancer.id === position.id)?.color || "#db2777",
                                    left: `${
                                       ((position.position.x + dance.settings.stageDimensions.width / 2) / dance.settings.stageDimensions.width) * 100
                                    }%`,
                                    top: `${
                                       ((-position.position.y + dance.settings.stageDimensions.height / 2) / dance.settings.stageDimensions.height) *
                                       100
                                    }%`,
                                 }}
                              ></div>
                           </>
                        );
                     })}
                  </div>
                  <div className="flex flex-row justify-start items-center w-full  px-3 py-2 bg-neutral-800 rounded-b-xl">
                     <div>
                        <p className="mt-1 mb-1 text-xs font-semibold">{dance.name}</p>
                        <p className=" text-[10px] text-neutral-400">Edited {timeSince(dance.last_edited)} ago</p>
                     </div>
                  </div>
               </div>
            </Link>
         </div>
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
