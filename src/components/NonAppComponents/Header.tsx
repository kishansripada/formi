import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import logo from "../../../public/logo.svg";
import Image from "next/image";
export const Header = () => {
   return (
      <>
         <div className="sticky top-0 z-50  bg-neutral-900 ">
            {/* <Link href={"/pricing"}>
               <div className="h-12 bg-pink-600 cursor-pointer text-sm w-full text-neutral-100 flex flex-row items-center justify-center hidden lg:flex">
                  👨‍🎓 Get 80% off with a registered .edu email address for a limited time
               </div>
            </Link> */}

            <nav className="flex flex-row  justify-between text-white items-center  px-[5%]     border-b-neutral-200  dark:bg-neutral-900  ">
               {/* <div className="lg:flex flex-row items-center justify-center w-1/3 hidden ">
                  <a target="_black" href="https://www.tiktok.com/@formistudio.app/">
                     {" "}
                     <img
                        className="w-10 mr-7"
                        src="https://cdn4.iconfinder.com/data/icons/social-media-flat-7/64/Social-media_Tiktok-512.png"
                        alt=""
                     />
                  </a>
                  <a target="_black" href="https://instagram.com/formistudio.app">
                     <img className="w-10" src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="" />
                  </a>

                
               </div> */}
               <div className="flex flex-row  items-center justify-start w-full lg:w-1/3">
                  {/* <Link href={"/features"} className="z-50">
                     <button className="  text-medium hidden lg:block ">features</button>
                  </Link> */}

                  <Link href={"/"}>
                     <div className=" cursor-pointer ">
                        {/* <h1 className="text-6xl font-bold z-10 relative">naach.app</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[58%]"></div> */}
                        <h1 className="text-5xl font-bold z-10 dark:text-neutral-200 relative">FORMI</h1>
                        {/* <p className="font-bold text-5xl">FORMI</p> */}
                        {/* <img className="lg:w-12 min-w-10 w-10" src="/logo.png" alt="" /> */}
                        {/* <div className=" bg-pink-600 relative h-2  top-[-10px] mr-auto w-[100%]"></div> */}
                     </div>
                  </Link>

                  {/* <Link href={"/features"} className="z-50">
                     <button className="  text-medium hidden lg:block ">pricing</button>
                  </Link> */}
               </div>

               {/* <div>
                     <h1 className="text-7xl font-bold z-10 relative">n</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-full"></div>
                  </div> */}
               <div className=" flex-row items-center justify-end w-1/3 lg:flex hidden">
                  {/* <Link href={"/upgrade"} className="z-50">
                        <button className=" border-pink-600 border-2 mr-3 px-4 py-1 hidden lg:block  rounded-md ">pricing</button>
                     </Link> */}

                  <Link href={"/login"} className="z-50">
                     <p className=" mr-5 cursor-pointer">Login</p>
                  </Link>
                  <Link href={"/login"} className="z-50">
                     <button className="bg-pink-600 text-white  px-4 py-2 hidden lg:block  rounded-md">Get started</button>
                  </Link>
               </div>
            </nav>
         </div>
      </>
   );
};
