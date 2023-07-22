import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { PerformancePreview } from "./PerformancePreview";
import { useDroppable } from "@dnd-kit/core";
export const Sidebar: React.FC<{
   setMenuOpen: Function;
   menuOpen: string;
   createNewDance: Function;
   createNewProject: Function;
   setNewFolderOpen: Function;
   rosters: any;
}> = ({ setMenuOpen, menuOpen, createNewDance, createNewProject, setNewFolderOpen, rosters }) => {
   const session = useSession();

   return (
      <>
         <div className="min-w-[280px]  w-[280px] px-6   py-4 h-screen lg:flex hidden flex-col box-border  text-sm  ">
            <div className="flex flex-row mt-3 ml-2   ">
               <img
                  referrerPolicy="no-referrer"
                  className="rounded-md w-10 pointer-events-none select-none mr-3"
                  src={
                     session?.user.user_metadata.avatar_url ||
                     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjof8tQrQxYWAJQ7ICx4AaaN9rZK_bfgKsFuqssREfxA&s"
                  }
                  alt=""
               />

               <div className="flex flex-col items-start justify-center w-full">
                  <p className="font-semibold">{session?.user.user_metadata?.full_name}</p>
                  <div className="text-neutral-500 text-sm flex flex-row items-center justify-between w-full">
                     {/* {subscription.plan.product === "legacy" ? <p>Early Adopter</p> : subscription.plan.product ? <p>FORMI Pro </p> : <p> </p>} */}
                  </div>
               </div>
            </div>
            <div className="bg-neutral-800 rounded-xl px-3 py-3 mt-7 text-xs ">
               <button
                  className={`flex flex-row justify-between  items-center rounded-xl ${
                     menuOpen === "home" ? "bg-neutral-700" : ""
                  }   w-full h-9 px-3`}
                  onClick={() => setMenuOpen("home")}
               >
                  <p>Home</p>
               </button>
               <button
                  className={`flex flex-row justify-between rounded-xl items-center ${
                     menuOpen === "myfiles" ? "bg-neutral-700" : ""
                  }   w-full h-9 px-3`}
                  onClick={() => setMenuOpen("myfiles")}
               >
                  <p>My files</p>
               </button>
               <button
                  className={`flex flex-row justify-between rounded-xl items-center ${
                     menuOpen === "shared" ? "bg-neutral-700" : ""
                  }   w-full h-9 px-3`}
                  onClick={() => setMenuOpen("shared")}
               >
                  <p>Shared With Me</p>
               </button>
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
            <button
               className={`flex flex-row mt-auto justify-between rounded-xl items-center ${
                  menuOpen === "trash" ? "bg-neutral-700" : ""
               }   w-full h-9 px-3`}
               onClick={() => setMenuOpen("trash")}
            >
               <p>Trash</p>
            </button>
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
