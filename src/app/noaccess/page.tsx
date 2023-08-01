import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
export default async function Page({}) {
   return (
      <div className="flex flex-col items-center justify-center h-screen">
         <div className="flex flex-col items-center">
            <p>You don't have permission to view this performance</p>
            <Link href="/dashboard">
               <button className="bg-pink-600 text-white p-2 rounded-md mt-2">Go to Dashboard</button>
            </Link>
         </div>
      </div>
   );
}
