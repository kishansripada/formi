"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HStack } from "../../../../@/components/ui/stacks";
import { HDivider } from "../../../../@/components/ui/hdivider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
export default function Header({ plan }: { plan: string | null }) {
   const pathname = usePathname();
   const supabase = createClientComponentClient();
   return (
      <>
         <HStack className="justify-between px-5 h-[71px] min-h-[71px] w-full ">
            <HStack>
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
            </HStack>

            <HStack className="text-sm gap-5">
               {plan ? (
                  <a href={"/upgrade/customerportal"} className="">
                     Manage Subscription
                  </a>
               ) : null}
               {!plan ? (
                  <Link href={"/upgrade"} className="text-pink-300 font-semibold">
                     Upgrade
                  </Link>
               ) : null}
               <button
                  onClick={async () => {
                     await supabase.auth.signOut().then((_) => {
                        window.location.href = "/login";
                     });
                  }}
               >
                  Sign Out
               </button>
            </HStack>
         </HStack>
         <HDivider></HDivider>
      </>
   );
}
