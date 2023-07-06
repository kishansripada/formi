import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
export const PerformancePreview: React.FC<{
   dance: any;
   setOpenPerformanceMenu: Function;
   openPerformanceMenu: string | null;
   invalidateDances: Function;
}> = ({ dance, setOpenPerformanceMenu, openPerformanceMenu, invalidateDances }) => {
   const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: dance.id,
   });

   const style = transform
      ? {
           transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;
   const session = useSession();
   return (
      <>
         <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            key={dance.id}
            onContextMenu={(e) => {
               e.preventDefault();
               setOpenPerformanceMenu(dance.id);
            }}
            className="flex flex-col items-center group   w-full relative cursor-pointer  "
         >
            <Link href={`/${dance.id}/edit`}>
               <div className="w-full border-neutral-800 group-hover:border-pink-600 transition border overflow-hidden  bg-neutral-800 rounded-xl">
                  <div className="bg-neutral-900 rounded-md min-h-[150px]  w-full relative border-transparent transition   ">
                     {dance.formations.positions?.map((position) => {
                        return (
                           <>
                              <div
                                 className="absolute w-2 h-2   rounded-full  pointer-events-none"
                                 style={{
                                    backgroundColor: dance.dancers.find((dancer) => dancer.id === position.id).color || "#db2777",
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
                     {/* {JSON.stringify(dance.settings.stageDimensions)} */}
                  </div>
                  <div className="flex flex-row justify-start items-center w-full  px-3 py-2 bg-neutral-800 rounded-b-xl">
                     <div>
                        <p className="mt-1 mb-1 text-xs font-semibold">{dance.name}</p>
                        <p className=" text-[10px] text-neutral-400">Edited {timeSince(dance.last_edited)} ago</p>
                        {/* <p className=" text-[10px] text-neutral-400">
                                             {dance.user != session?.user.id ? "Shared with me" : "Owned by me"}
                                          </p> */}
                     </div>
                  </div>
               </div>
            </Link>

            {openPerformanceMenu === dance.id ? (
               <Dropdown
                  setOpenPerformanceMenu={setOpenPerformanceMenu}
                  invalidateDances={invalidateDances}
                  dance={dance}
                  isMine={dance.user == session?.user.id}
               ></Dropdown>
            ) : null}
         </div>
      </>
   );
};

var timeSince = function (date: string) {
   if (typeof date !== "object") {
      date = new Date(date);
   }

   var seconds = Math.floor((new Date() - date) / 1000);
   var intervalType;

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
