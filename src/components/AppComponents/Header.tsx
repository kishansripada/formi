import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/router";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

export const Header: React.FC<{
   saved: boolean;
   session: any;
   danceName: string;
   setDanceName: Function;
   setSession: Function;
   viewAllPaths: boolean;
   setViewAllPaths: Function;
   setChangeSoundCloudIsOpen: Function;
   setShareIsOpen: Function;
   viewOnly: boolean;
}> = ({
   saved,
   session,
   danceName,
   setDanceName,
   setSession,
   viewAllPaths,
   setViewAllPaths,
   setChangeSoundCloudIsOpen,
   setShareIsOpen,
   viewOnly,
}) => {
   const router = useRouter();

   let [profileIsOpen, setProfileIsOpen] = useState(false);
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
         <div className=" h-[75px] flex flex-row items-center shrink-0 lg:pr-10 lg:pl-7 bg-white justify-between">
            <div className="flex flex-row items-center shrink-0">
               <div className=" flex-row items-center shrink-0 hidden lg:flex">
                  <Image className=" scale-[3.5]" src={logo} width={150} height={60} />
                  <div className="h-[40px] w-[1px] bg-gray-400 ml-3"></div>
               </div>

               <div className="h-full ">
                  <div className="flex flex-row justify-center items-center">
                     <input
                        value={danceName}
                        onChange={(e) => setDanceName(e.target.value)}
                        className={`h-6 text-xl px-1 focus:outline-pink-600 rounded-sm  ml-3  hover:outline-gray-400 focus:outline-2 hover:outline-2 focus:outline hover:outline ${
                           viewOnly ? "pointer-events-none" : ""
                        } `}
                     />

                     {!viewOnly ? (
                        <>
                           {saved ? (
                              <p className="ml-3 text-gray-500 flex flex-row items-center">saved</p>
                           ) : (
                              <div className="flex flex-row items-center  ml-3">
                                 <p className="text-gray-500">saving...</p>
                              </div>
                           )}
                        </>
                     ) : (
                        <p className="text-gray-500">viewing</p>
                     )}
                  </div>
                  {session ? (
                     <p className="text-sm ml-4 ">Welcome back, {session?.user?.user_metadata?.full_name}</p>
                  ) : (
                     <p className="text-sm ml-4 ">Not signed in</p>
                  )}
               </div>
            </div>

            <div>
               <hr />
            </div>

            <div className=" flex flex-row items-center ml-auto">
               {!viewOnly ? (
                  <>
                     <p className="mx-5">
                        stuck? watch a
                        <a className="text-pink-600" href="https://www.youtube.com/watch?v=1dj8L5tUAjU" target={"_blank"}>
                           {" "}
                           tutorial
                        </a>
                     </p>
                     <div className="flex flex-col items-center justify-center mx-5">
                        <label className="inline-flex relative items-center cursor-pointer">
                           <input
                              checked={viewAllPaths}
                              type="checkbox"
                              id="checked-toggle"
                              className="sr-only peer"
                              onChange={() => setViewAllPaths((value: boolean) => !value)}
                           />
                           <div className="w-11 h-6 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                        </label>
                        <p className="text-sm font-medium text-gray-900 ">view all paths</p>
                     </div>
                     <button
                        onClick={() => setChangeSoundCloudIsOpen((state: boolean) => !state)}
                        className="bg-black text-white px-2 py-1 rounded-md ml-2  "
                     >
                        change track
                     </button>

                     <button
                        onClick={() => setShareIsOpen((state: boolean) => !state)}
                        className="bg-blue-600 text-white px-2 py-1 rounded-md  ml-2 "
                     >
                        share
                     </button>
                  </>
               ) : null}

               <Link href="/mydances">
                  {session ? <a className="ml-2 bg-pink-600 hover:bg-pink-700 px-2 py-1 rounded-md text-white ">my dances</a> : <></>}
               </Link>
               <script src=""></script>
               {session ? (
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
                        onClick={() => {
                           router.push("/login");
                           setSession(null);
                           supabase.auth.signOut();
                        }}
                     >
                        sign out
                     </button>
                  </div>
               ) : null}
            </div>
         </div>
         <hr className="mb-2" />
         <Toaster />
      </>
   );
};
