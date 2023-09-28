"use client";

import { dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
// import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";

import { ProjectPreview } from "../myperformances/ProjectPreview";
import { PerformancePreview } from "./PerformancePreview";
import { DndContext, useDroppable, MouseSensor, useSensors, useSensor } from "@dnd-kit/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
export default function Header({ plan }: { plan: string | null }) {
   const pathname = usePathname();
   const router = useRouter();

   const supabase = createClientComponentClient();
   return (
      <div className="flex flex-row items-center  justify-between px-6 py-4 text-neutral-200 ml-auto w-full mt-3">
         <div className="mr-4 flex flex-row items-center">
            {pathname === "/dashboard" ? (
               <p>Home</p>
            ) : pathname === "/dashboard/myperformances" ? (
               <p>My files</p>
            ) : pathname === "/dashboard/sharedwithme" ? (
               <p>Shared With Me</p>
            ) : pathname === "/dashboard/trash" ? (
               <p>Trash</p>
            ) : pathname === "/dashboard/rosters" ? (
               "Rosters"
            ) : null}
         </div>

         <div>
            {plan ? (
               <a href={"/upgrade/customerportal"} className="mr-5 text-xs">
                  Manage Subscription
               </a>
            ) : null}
            {!plan ? (
               <Link href={"/upgrade"} className="mr-5 text-pink-300 text-sm font-semibold">
                  Upgrade
               </Link>
            ) : null}
            <Link
               prefetch={false}
               href={"/auth/logout"}
               // onClick={() => {
               //    supabase.auth.signOut().then((r) => {
               //       router.push("/login");
               //    });
               // }}
               className="mr-5  text-xs"
            >
               Sign Out
            </Link>
         </div>
      </div>
   );
}
