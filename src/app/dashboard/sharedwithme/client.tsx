"use client";

import { dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
// import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { ProjectPreview } from "../myperformances/ProjectPreview";
import { PerformancePreview } from "../_components/PerformancePreview";
import { DndContext, useDroppable, MouseSensor, useSensors, useSensor } from "@dnd-kit/core";

export default function PageClient({ sharedWithMe }) {
   return (
      <div className="w-full grid grid-cols-1 gap-[32px]   rounded-xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 col-span-4   overscroll-contain items-center">
         {sharedWithMe.length ? (
            sharedWithMe
               .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
               .filter((dance) => !dance.isInTrash)
               ?.map((dance) => {
                  return (
                     <>
                        <div
                           style={{
                              position: "relative",
                           }}
                        >
                           <PerformancePreview dance={dance}></PerformancePreview>
                        </div>
                     </>
                  );
               })
         ) : (
            <p>No performances here 🤷🏽‍♂️</p>
         )}
      </div>
   );
}
