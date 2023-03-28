import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formation, localSettings } from "../../types/types";
import { useRouter } from "next/router";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

export const Header: React.FC<{
   saved: boolean;
   danceName: string;
   setDanceName: Function;
   undo: Function;
   setShareIsOpen: Function;
   viewOnly: boolean;
   setFormations: Function;
   onlineUsers: any;
   isPreviewingThree: boolean;
   setIsPreviewingThree: Function;
   pricingTier: string;
   setUpgradeIsOpen: Function;
   localSettings: localSettings;
   setLocalSettings: Function;
}> = ({
   saved,
   danceName,
   setDanceName,
   setShareIsOpen,
   viewOnly,
   setFormations,
   onlineUsers,
   undo,
   isPreviewingThree,
   setIsPreviewingThree,
   pricingTier,
   setUpgradeIsOpen,
   localSettings,
   setLocalSettings,
}) => {
   const router = useRouter();
   let session = useSession();
   const supabase = useSupabaseClient();

   let initials = (name: string) => {
      if (!name) return "";
      return name
         .split(" ")
         .map((word: string) => word[0])
         .slice(0, 3)
         .join("")
         .toUpperCase();
   };

   return (
      <>
         <div className=" min-h-[75px] flex flex-row items-center w-full  bg-white border-b border-b-300 ">
            <div className="flex flex-row items-center ">
               <div className="h-full">
                  <div className="flex flex-col lg:flex-row justify-center lg:items-center">
                     <input
                        value={danceName}
                        onChange={(e) => setDanceName(e.target.value)}
                        placeholder={"performance name"}
                        className={`h-6  px-3 py-4 w-fit  transition duration-300  rounded-md  ml-3 hover:bg-gray-100 text-gray-500 focus:bg-gray-100 outline-none cursor-pointer  ${
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
                        <p className="text-gray-500 ml-6 lg:ml-0">viewing</p>
                     )}
                  </div>
               </div>
            </div>

            <div className=" flex flex-row items-center ml-auto ">
               {/* {onlineUsers
                  ? Object.keys(onlineUsers).map((id, i) => {
                       return (
                          <>
                             <div
                                style={{
                                   border: "4px solid",
                                   borderColor: onlineUsers[id][0].color,
                                }}
                                className="bg-white grid place-items-center w-9 select-none cursor-pointer  h-9 rounded-full mr-2"
                             >
                                <p className="font-bold">{initials(onlineUsers[id][0]?.name)}</p>
                             </div>
                          </>
                       );
                    })
                  : null} */}

               <a href="https://forms.gle/qTo1MAenHpguvsXW7" target={"_blank"} className="text-sm mr-5 text-blue-700 hidden lg:block">
                  Report Bug
               </a>
               <button
                  onClick={() =>
                     setLocalSettings((settings: localSettings) => {
                        return { ...settings, stageFlipped: !localSettings.stageFlipped };
                     })
                  }
                  className="border hidden lg:block border-black text-sm rounded-md px-3 py-3 ml-4"
               >
                  <div className="flex flex-row items-center ">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                        <path d="M19.6 42H9q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h10.6v3H9v30h10.6Zm3 4V2h3v44ZM39 9h-.7V6h.7q1.2 0 2.1.9.9.9.9 2.1v.7h-3Zm0 17.75v-5.5h3v5.5ZM39 42h-.7v-3h.7v-.7h3v.7q0 1.2-.9 2.1-.9.9-2.1.9Zm0-23.75V12.7h3v5.55Zm0 17.05v-5.55h3v5.55ZM28.6 42v-3h6.7v3Zm0-33V6h6.7v3Z" />
                     </svg>

                     <p className="ml-1">Flip Stage</p>
                  </div>
               </button>
               {!viewOnly ? (
                  <>
                     <button className="mx-3 hidden lg:block" onClick={undo}>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-6 h-6"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                     </button>

                     <button
                        onClick={() => setShareIsOpen((state: boolean) => !state)}
                        className="border hidden lg:block border-black text-sm rounded-md px-3 py-3 ml-4"
                     >
                        <div className="flex flex-row items-center ">
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
                                 d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                              />
                           </svg>

                           <p className="ml-1">Invite</p>
                        </div>
                     </button>
                  </>
               ) : null}
               <button
                  onClick={() => setIsPreviewingThree((isPreviewingThree: boolean) => false)}
                  className={`border group hidden lg:block border-black border-r-0 text-sm rounded-l-md px-3 py-3 ml-4 ${
                     !isPreviewingThree ? "bg-slate-800 text-white" : ""
                  }`}
               >
                  <div className="flex flex-row items-center  ">
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
                           d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
                        />
                     </svg>

                     <p className="ml-2">2D</p>
                  </div>
               </button>
               <button
                  onClick={() => setIsPreviewingThree(true)}
                  className={`border group hidden lg:block border-black text-sm rounded-r-md px-3 py-3 ${
                     isPreviewingThree ? "bg-slate-800 text-white" : ""
                  } `}
               >
                  <div className="flex flex-row items-center  ">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 group-hover:animate-spin group-hover:scale-110 transition"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                        />
                     </svg>

                     <p className="ml-2">3D</p>
                  </div>
               </button>
               {session ? (
                  <Link href="/dashboard">
                     <button>
                        <div className="bg-white border-2 border-gray-400 w-14 h-14 grid place-items-center mx-6 rounded-full">
                           <img className="w-12 rounded-full h-12 " referrerPolicy="no-referrer" src={session.user.user_metadata.avatar_url} alt="" />
                        </div>
                     </button>
                     {/* <button className="bg-slate-800  text-white text-sm rounded-md px-3 py-3 ml-4 mr-4 ">
                        <div className="flex flex-row items-center">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              className="w-5 h-5 stroke-gray-300"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                              />
                           </svg>
                           <p className="ml-2 text-gray-100">Dashboard</p>
                        </div>
                     </button> */}
                  </Link>
               ) : (
                  <Link href="/login">
                     <button className="bg-slate-800  text-white text-sm rounded-md px-3 py-3 ml-4 mr-4 ">
                        <p className=" text-gray-100">Log In</p>
                     </button>
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
