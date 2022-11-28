import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/router";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

export const Header: React.FC<{
   saved: boolean;
   danceName: string;
   setDanceName: Function;
   viewAllPaths: boolean;
   setViewAllPaths: Function;
   setChangeSoundCloudIsOpen: Function;
   setShareIsOpen: Function;
   viewOnly: boolean;
}> = ({ saved, danceName, setDanceName, viewAllPaths, setViewAllPaths, setChangeSoundCloudIsOpen, setShareIsOpen, viewOnly }) => {
   const router = useRouter();
   let session = useSession();
   const supabase = useSupabaseClient();

   const initials = (name) => {
      if (!name) return "";
      return name
         .split(" ")
         .map((word) => word[0])
         .slice(0, 3)
         .join("")
         .toUpperCase();
   };

   return (
      <>
         <div className=" min-h-[75px] flex flex-row items-center   bg-white border-b border-b-300">
            <div className="flex flex-row items-center ">
               {/* <div className=" flex-row items-center hidden lg:flex">
                  <Image className=" scale-[3.5]" src={logo} width={150} height={60} />
                  <div className="h-[40px] w-[1px] bg-gray-400 ml-3"></div>
               </div> */}

               <div className="h-full ">
                  <div className="flex flex-row justify-center items-center">
                     <input
                        value={danceName}
                        onChange={(e) => setDanceName(e.target.value)}
                        className={`h-6 text-xl px-1 focus:outline-pink-700 rounded-sm  ml-3  hover:outline-gray-400 focus:outline-2 hover:outline-2 focus:outline hover:outline ${
                           viewOnly ? "pointer-events-none" : ""
                        } `}
                     />

                     {!viewOnly ? (
                        <>
                           {saved ? (
                              <></>
                           ) : (
                              <div className="flex flex-row items-center  ml-3">
                                 <p className="text-gray-500 text-sm">saving...</p>
                              </div>
                           )}
                        </>
                     ) : (
                        <p className="text-gray-500">viewing</p>
                     )}
                  </div>
                  {session ? <></> : <p className="text-sm ml-4 ">Not signed in</p>}
               </div>
            </div>

            <div className=" flex flex-row items-center ml-auto ">
               {!viewOnly ? (
                  <>
                     <a href="https://www.youtube.com/watch?v=wXaq0cF0dkI" target={"_blank"}>
                        <p className="text-sm text-gray-500">
                           stuck? — <span className="underline text-blue-500">watch a tutorial</span>{" "}
                        </p>
                     </a>

                     <button onClick={() => setShareIsOpen((state: boolean) => !state)} className="btn btn-secondary btn-sm h-10 ml-2">
                        <div className="flex flex-row items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path
                                 fillRule="evenodd"
                                 d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                                 clipRule="evenodd"
                              />
                           </svg>

                           <p className="ml-1">share</p>
                        </div>
                     </button>
                  </>
               ) : null}
               {session ? (
                  <Link href="/mydances">
                     <button className="ml-2 btn btn-primary btn-sm h-10 ">
                        <div className="flex flex-row items-center">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                              />
                           </svg>
                           <p className="ml-1"> my dances</p>
                        </div>
                     </button>
                  </Link>
               ) : (
                  <Link href="/login">
                     <a className="ml-2 bg-pink-700 hover:bg-pink-700 px-2 py-1 rounded-md text-white ">sign in</a>
                  </Link>
               )}

               {/* {session ? (
                  <button
                     onClick={() => {
                        setProfileIsOpen((state) => !state);
                     }}
                     className={`w-[50px] ml-6 h-[50px] hidden lg:flex  rounded-full  flex-row justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500   `}
                  >
                     {session?.user?.user_metadata?.avatar_url ? (
                        <img className="w-[45px] h-[45px] rounded-full select-none " src={session?.user?.user_metadata?.avatar_url} alt="" />
                     ) : session?.user?.user_metadata?.full_name ? (
                        <div className="bg-white rounded-full w-[45px] h-[45px] grid place-items-center cursor-default  font-semibold  ">
                           <p className="cursor-default ">{initials(session?.user?.user_metadata?.full_name)}</p>
                        </div>
                     ) : null}
                  </button>
               ) : null}

               {profileIsOpen ? (
                  <div className="bg-white ring-gray-500 ring-1 absolute w-24 h-10 right-10 top-[70px] z-50 rounded-md flex flex-col justify-center items-center">
                     <button
                        className=""
                        onClick={async () => {
                           router.push("/login");
                           const { error } = await supabase.auth.signOut();
                        }}
                     >
                        sign out
                     </button>
                  </div>
               ) : null} */}
            </div>
         </div>
         {/* <hr className="mb-2" />
         <Toaster /> */}
      </>
   );
};
