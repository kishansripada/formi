import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import logo from "../../../public/logo.svg";
import Image from "next/image";
export const Footer = () => {
   return (
      <>
         <div className="bg-[#fafafa]  pt-6 pb-6 px-12 dark:bg-[#111111] w-full ">
            <div className="w-[150px] cursor-pointer">
               {/* <h1 className="text-6xl font-bold z-10 relative">naach.app</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[58%]"></div> */}
               <h1 className="text-4xl font-bold dark:text-white z-10 relative ">FORMI</h1>

               <div className="bg-[#E7ADC5] relative h-2  dark:bg-pink-600 top-[-10px] mr-auto w-[100%]"></div>
            </div>
            <p className="text-sm dark:text-neutral-200 text-neutral-500">© 2023 HOLYFEET, LLC. All Rights Reserved</p>
            <p className="text-neutral-500  max-w-[300px] text-sm mt-2">Contact us at: kishansripada@formistudio.app</p>
            <p className="text-neutral-400 max-w-[300px] text-sm mt-2">
               All trademarks, logos, and brand names are the property of their respective owners.
            </p>

            <div className=" flex flex-row  mt-12 ">
               <img className="ml-auto opacity-50 h-3" src="/holylogo.png" alt="" />
            </div>
         </div>
      </>
   );
};
