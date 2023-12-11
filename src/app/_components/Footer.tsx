import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import logo from "../../../public/logo.svg";
import Image from "next/image";
export const Footer = () => {
   return (
      <>
         <div className="  py-16 px-12  w-full ">
            <img src="/logo.png" className="h-12" alt="" />
            <p className="text-sm dark:text-neutral-200 text-neutral-50 mt-3">© 2023 HOLYFEET, LLC. All Rights Reserved</p>
            <p className="text-neutral-500  max-w-[300px] text-sm mt-2">Contact us at: inquiries@formistudio.app</p>
            <p className="text-neutral-400 max-w-[300px] text-sm mt-2">
               All trademarks, logos, and brand names are the property of their respective owners.
            </p>

            {/* <div className=" flex flex-row  mt-12 ">
               <img className="ml-auto opacity-50 h-3" src="/holylogo.png" alt="" />
            </div> */}
         </div>
      </>
   );
};
