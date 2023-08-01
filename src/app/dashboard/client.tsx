"use client";

import { dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
// import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { ProjectPreview } from "../../../components/DashboardComponents/ProjectPreview";
import { PerformancePreview } from "./_components/PerformancePreview";
import { DndContext, useDroppable, MouseSensor, useSensors, useSensor } from "@dnd-kit/core";

export default function Client({ myDances, sharedWithMe }) {
   const videos = [
      { url: "uiTwpkpsL1E", title: "Tutorial/Demo" },
      { url: "JRS1tPHJKAI", title: "Welcome to FORMI" },
      { url: "pY0IUM1ebHE", title: "Previous formation settings" },
      { url: "rhGn486vJJc", title: "What's a set piece?" },
   ];
   return (
      <>
         <div className=" pb-10 h-full flex flex-col overflow-hidden">
            <div className="h-[310px] min-h-[310px] overflow-scroll bg-neutral-900 rounded-xl border-2 border-neutral-800 ">
               <div className="flex flex-row items-center justify-between p-5">
                  <p className=" text-sm">Recents</p>
                  <Link
                     href={"/dashboard/myperformances"}
                     className="flex flex-row items-center text-xs border border-neutral-700 px-3 py-1 rounded-full"
                  >
                     <p>All my files</p>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 ml-2"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                     </svg>
                  </Link>
               </div>
               <div className="flex flex-row px-5">
                  {myDances.length ? (
                     [...myDances.filter((dance) => !dance.isInTrash), ...sharedWithMe.filter((dance) => !dance.isInTrash)]
                        .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                        .slice(0, 4)
                        ?.map((dance) => {
                           return (
                              <>
                                 <div className="w-full mr-5 max-w-[300px]">
                                    <PerformancePreview dance={dance}></PerformancePreview>
                                 </div>
                              </>
                           );
                        })
                  ) : (
                     <p className="text-sm">Click new performance to create your first performance</p>
                  )}
               </div>
            </div>
            <div className=" h-full bg-neutral-900 mt-10 py-5  rounded-xl border-2 border-neutral-800">
               {/* <p className=" text-sm">Tutorials</p> */}
               <div className="flex flex-row  h-full px-6">
                  {videos.map((video) => {
                     return (
                        <iframe
                           src={`https://www.youtube.com/embed/${video.url}?rel=0&modestbranding=1&showinfo=0&controls=0`}
                           title="YouTube video player"
                           width="200"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media;
gyroscope; picture-in-picture;
web-share"
                           height="100%"
                           className=" rounded-xl  mr-6"
                        ></iframe>
                     );
                  })}
               </div>
            </div>
         </div>
      </>
   );
}
