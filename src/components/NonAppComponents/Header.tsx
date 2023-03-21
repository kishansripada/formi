import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import logo from "../../../public/logo.svg";
import Image from "next/image";
export const Header = () => {
   return (
      <>
         <div className="sticky top-0 z-50  ">
            <Link href={"/pricing"}>
               <div className="h-12 bg-pink-600 cursor-pointer text-sm w-full text-white flex flex-row items-center justify-center hidden lg:flex">
                  👨‍🎓 Get 80% off with a registered .edu email address for a limited time
               </div>
            </Link>

            <nav className="flex flex-row py-3 lg:justify-between text-black items-center justify-center px-[10%]  bg-[#fafafa]  ">
               <div className="flex flex-row items-center">
                  <Link href={"/"}>
                     <div className="w-[150px] cursor-pointer">
                        {/* <h1 className="text-6xl font-bold z-10 relative">naach.app</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[58%]"></div> */}
                        <h1 className="text-4xl font-bold z-10 relative">FORMI</h1>

                        <div className="bg-pink-600 relative h-2 opacity-40 top-[-10px] mr-auto w-[100%]"></div>
                     </div>
                  </Link>
                  <div className="flex flex-row items-center ml-9 ">
                     <Link href={"/features"} className="z-50">
                        <button className="text-gray-700 hover:text-black text-medium hidden lg:block mr-8">Features</button>
                     </Link>
                     <Link href={"/blog"} className="z-50">
                        <button className="text-gray-700 hover:text-black text-medium hidden lg:block mr-8 ">Blog</button>
                     </Link>
                     <Link href={"/pricing"} className="z-50">
                        <button className="text-gray-700 hover:text-black text-medium hidden lg:block mr-8">Pricing</button>
                     </Link>
                  </div>
               </div>

               {/* <div>
                     <h1 className="text-7xl font-bold z-10 relative">n</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-full"></div>
                  </div> */}
               <div className="flex flex-row items-center justify-center">
                  {/* <Link href={"/upgrade"} className="z-50">
                        <button className=" border-pink-600 border-2 mr-3 px-4 py-1 hidden lg:block  rounded-md ">pricing</button>
                     </Link> */}

                  <Link href={"/login"} className="z-50">
                     <button className=" border-2 text-pink-600 border-pink-600 mr-2  px-4 py-2 hidden lg:block  rounded-full">Login</button>
                  </Link>
                  <Link href={"/login"} className="z-50">
                     <button className="bg-pink-600 text-white  px-4 py-2 hidden lg:block  rounded-full">Try Free</button>
                  </Link>
               </div>
            </nav>
            <hr></hr>
         </div>
      </>
   );
};
