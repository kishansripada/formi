import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import logo from "../../../public/logo.svg";
import Image from "next/image";
export const Header = () => {
   const router = useRouter();
   let session = useSession();
   const supabase = useSupabaseClient();

   return (
      <>
         <div className="h-20 flex flex-row items-center px-[5%] justify-between">
            <div>
               <Image className="pointer-events-none" width={200} height={200} src={logo}></Image>
            </div>
            <button
               className="btn btn-ghost"
               onClick={() => {
                  supabase.auth.signOut().then(() => {
                     router.push("/login");
                  });
               }}
            >
               sign out
            </button>
         </div>
      </>
   );
};
