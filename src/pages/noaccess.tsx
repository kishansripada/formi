import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Header } from "../components/NonAppComponents/Header";
import { Session } from "@supabase/supabase-js";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
const NoAccess = () => {
   return (
      <>
         <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center">
               <p>You don't have permission to view this performance</p>
               <Link href="/dashboard">
                  <button className="bg-pink-600 text-white p-2 rounded-md mt-2">Go to Dashboard</button>
               </Link>
            </div>
         </div>
      </>
   );
};
export default NoAccess;
