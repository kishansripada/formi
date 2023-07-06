import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { ProjectPreview } from "./ProjectPreview";
import { PerformancePreview } from "./PerformancePreview";

export const MyDances: React.FC<{
   myDances: any;
   invalidateDances: Function;
   openPerformanceMenu: any;
   setOpenPerformanceMenu: Function;
   projects: any;
}> = ({ myDances, invalidateDances, projects, openPerformanceMenu, setOpenPerformanceMenu }) => {
   console.log(projects);

   const session = useSession();

   return (
      <>
         <style></style>
         <div className="overflow-y-scroll overflow-hidden p-4">
            {projects
               ? projects.map((project) => {
                    return <ProjectPreview project={project}></ProjectPreview>;
                 })
               : null}
            <div className="w-full grid grid-cols-1 gap-[32px]   sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 col-span-4   overscroll-contain items-center">
               {myDances.length ? (
                  myDances
                     .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                     ?.map((dance) => {
                        return (
                           <>
                              <PerformancePreview
                                 invalidateDances={invalidateDances}
                                 dance={dance}
                                 openPerformanceMenu={openPerformanceMenu}
                                 setOpenPerformanceMenu={setOpenPerformanceMenu}
                              ></PerformancePreview>
                           </>
                        );
                     })
               ) : (
                  <p>Looks like you don't have any performances</p>
               )}
            </div>
            {/* </div> */}
            {/* </div> */}
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
