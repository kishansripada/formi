"use client";

import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
export default function Header({ plan }: { plan: string | null }) {
   const pathname = usePathname();

   return (
      <div className="flex flex-row items-center  justify-between px-6 h-[72px] min-h-[72px] border-neutral-700 border-b  ml-auto w-full ">
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
               <a href={"/upgrade/customerportal"} className="mr-5 text-sm">
                  Manage Subscription
               </a>
            ) : null}
            {!plan ? (
               <Link href={"/upgrade"} className="mr-5 text-pink-300 text-sm font-semibold">
                  Upgrade
               </Link>
            ) : null}
            <Link prefetch={false} href={"/auth/logout"} className="mr-5  text-sm">
               Sign Out
            </Link>
         </div>
      </div>
   );
}
