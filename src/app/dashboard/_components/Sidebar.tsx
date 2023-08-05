"use client";

import { dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthSession } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { PerformancePreview } from "./PerformancePreview";
import { useDroppable } from "@dnd-kit/core";
import { usePathname } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { NewFolderModel } from "./NewFolderModel";
export const Sidebar: React.FC<{
   rosters: any;
   session: AuthSession;
}> = ({ rosters, session }) => {
   const supabase = createClientComponentClient();
   const pathname = usePathname();
   const router = useRouter();

   const [newFolderOpen, setNewFolderOpen] = useState(false);

   const [newFolderName, setNewFolderName] = useState("");
   async function createNewDance(roster?: any) {
      if (session === null) {
         router.push(`/login`);
         return;
      }

      if (roster?.roster?.length) {
         roster.roster = roster.roster.map((dancer) => {
            return { ...dancer, id: uuidv4() };
         });
         const { data, error } = await supabase
            .from("dances")
            .insert([
               {
                  user: session.user.id,
                  last_edited: new Date(),
                  dancers: roster.roster,
                  formations: [
                     {
                        name: "First formation",
                        id: uuidv4(),
                        positions: roster.roster.map((dancer, index) => {
                           return { id: dancer.id, position: { x: index - 18, y: 0 } };
                        }),
                        durationSeconds: 3,
                        transition: { durationSeconds: 3 },
                     },
                  ],
               },
            ])
            .select("id")
            .single();
         if (!data?.id) return;
         router.refresh();
         router.push(`/${data.id}/edit`);
         return;
      }
      const { data, error } = await supabase
         .from("dances")
         .insert([{ user: session.user.id, last_edited: new Date() }])
         .select("id")
         .single();

      if (!data?.id) return;
      router.push(`/${data.id}/edit`);
   }

   return (
      <>
         {newFolderOpen ? (
            <NewFolderModel
               newFolderName={newFolderName}
               setNewFolderName={setNewFolderName}
               setNewFolderOpen={setNewFolderOpen}
               session={session}
            ></NewFolderModel>
         ) : null}
         <div
            style={{
               backgroundColor: "rgb(16, 16, 16)",
            }}
            className="min-w-[280px]  w-[280px] px-6  border-r border-neutral-800   py-4 h-screen lg:flex hidden flex-col box-border  text-sm  "
         >
            <div className="flex flex-row mt-3 ml-2   ">
               {session?.user.user_metadata.avatar_url ? (
                  <img
                     referrerPolicy="no-referrer"
                     className="rounded-md w-10 pointer-events-none select-none mr-3"
                     src={
                        session?.user.user_metadata.avatar_url ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjof8tQrQxYWAJQ7ICx4AaaN9rZK_bfgKsFuqssREfxA&s"
                     }
                     alt=""
                  />
               ) : null}

               <div className="flex flex-col items-start justify-center w-full">
                  <p className="font-semibold">{session?.user.user_metadata?.full_name || session.user.email}</p>
                  <div className="text-neutral-500 text-sm flex flex-row items-center justify-between w-full">
                     {/* {subscription.plan.product === "legacy" ? <p>Early Adopter</p> : subscription.plan.product ? <p>FORMI Pro </p> : <p> </p>} */}
                  </div>
               </div>
            </div>
            <div className="bg-neutral-800 rounded-xl px-3 py-3 mt-7 text-xs ">
               <Link
                  href="/dashboard"
                  prefetch={true}
                  className={`flex flex-row justify-between  items-center rounded-xl ${
                     pathname === "/dashboard" ? "bg-neutral-700" : ""
                  }   w-full h-9 px-3`}
               >
                  <p>Home</p>
               </Link>
               <Link
                  href="/dashboard/myperformances"
                  prefetch={true}
                  className={`flex flex-row justify-between rounded-xl items-center ${
                     pathname === "/dashboard/myperformances" ? "bg-neutral-700" : ""
                  }   w-full h-9 px-3`}
               >
                  <p>My files</p>
               </Link>
               <Link
                  href="/dashboard/sharedwithme"
                  prefetch={true}
                  className={`flex flex-row justify-between rounded-xl items-center ${
                     pathname === "/dashboard/sharedwithme" ? "bg-neutral-700" : ""
                  }   w-full h-9 px-3`}
               >
                  <p>Shared With Me</p>
               </Link>
               <Link
                  href="/dashboard/rosters"
                  prefetch={true}
                  className={`flex flex-row justify-between rounded-xl items-center ${
                     pathname === "/dashboard/rosters" ? "bg-neutral-700" : ""
                  }   w-full h-9 px-3`}
               >
                  <p>Rosters</p>
               </Link>
            </div>
            <button
               onClick={() => {
                  setNewFolderOpen(true);
               }}
               className=" border border-neutral-800 mt-5 w-full text-white text-xs py-2 px-4 rounded-lg mr-auto "
            >
               New folder
            </button>
            <button
               onClick={() => {
                  createNewDance();
               }}
               className="bg-pink-600  mt-3 w-full text-white text-xs py-2 px-4  rounded-lg mr-auto "
            >
               New performance
            </button>

            {rosters.length ? <p className=" text-neutral-300 text-sm mt-5">New performance from roster:</p> : null}
            {rosters.map((roster: any) => {
               return (
                  <button
                     onClick={() => {
                        createNewDance(roster);
                     }}
                     className="flex flex-row items-center mt-3 justify-between w-full text-neutral-400 px-1 hover:text-white transition "
                  >
                     <p className=" text-sm  ">{roster.name} </p>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                     </svg>
                  </button>
               );
            })}
            <Link
               href={"/dashboard/trash"}
               className={`flex flex-row justify-between rounded-xl mt-auto items-center ${
                  pathname === "/dashboard/trash" ? "bg-neutral-700" : ""
               }   w-full h-9 px-3`}
            >
               <p>Trash</p>
            </Link>
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
