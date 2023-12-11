"use client";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

import { PerformancePreview } from "../_components/PerformancePreview";
import dynamic from "next/dynamic";
import { DndContext, useDroppable, MouseSensor, useSensors, useSensor } from "@dnd-kit/core";
import { Dance, Project } from "../../../types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthSession } from "@supabase/supabase-js";

export default function Client({ projects, myDances, session }: { projects: Project[]; myDances: Dance[]; session: AuthSession }) {
   return (
      <div className="overflow-y-scroll h-full flex-grow px-4 py-5 flex flex-col gap-5 ">
         <p className="text-3xl font-semibold">Owned by me</p>

         <div className="w-full grid grid-cols-1 gap-[32px]    rounded-xl sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-4   overscroll-contain items-center">
            {myDances.length ? (
               myDances
                  .sort((a: Dance, b: Dance) => new Date(b.last_edited).getTime() - new Date(a.last_edited).getTime())
                  ?.map((dance: Dance) => {
                     return (
                        <div key={dance.id}>
                           <PerformancePreview projects={projects} dance={dance} session={session}></PerformancePreview>
                        </div>
                     );
                  })
            ) : (
               <p className="text-sm font-medium">No performances here</p>
            )}
         </div>
      </div>
   );
}
