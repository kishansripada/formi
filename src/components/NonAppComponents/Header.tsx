import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabase";
import { Session } from "@supabase/supabase-js";
// export interface Session {
//     provider_token?: string | null
//     access_token: string
//     /**
//      * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
//      */
//     expires_in?: number
//     /**
//      * A timestamp of when the token will expire. Returned when a login is confirmed.
//      */
//     expires_at?: number
//     refresh_token?: string
//     token_type: string
//     user: User | null
//   }
export const Header = ({ session, setSession }: { session: Session; setSession: Function }) => {
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
