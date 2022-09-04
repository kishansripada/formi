import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabase";
export const Header = ({ session, setSession }) => {
   const router = useRouter();
   return (
      <>
         <div className="h-20 flex flex-row items-center px-[5%]">
            <p className="text-3xl">
               naach <span className="text-xs">early access</span>
            </p>
            <button
               className="ml-auto"
               onClick={() => {
                  supabase.auth.signOut();
                  setSession(null);
                  router.push("/login");
               }}
            >
               sign out
            </button>
         </div>
      </>
   );
};
