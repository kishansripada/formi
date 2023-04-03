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
   userPositions: any;
   setSelectedFormation: Function;
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
   userPositions,
   setSelectedFormation,
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
         <div className=" min-h-[60px] flex flex-row items-center w-full  bg-white border-b border-b-300 ">
            <div className="flex flex-row items-center ">
               <div className="h-full">
                  <div className="flex flex-col lg:flex-row justify-center lg:items-center">
                     <input
                        value={danceName}
                        // onBlur={() => {
                        //    if (danceName.length > 0) {
                        //       setDanceName(e.target.value);
                        //    }
                        // }}
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
               <a href="https://forms.gle/qTo1MAenHpguvsXW7" target={"_blank"} className="text-sm mr-5 text-neutral-500 hidden lg:block">
                  Send Feedback
               </a>
               {onlineUsers
                  ? Object.keys(onlineUsers).map((id, i) => {
                       return (
                          <>
                             <div
                                onClick={() => {
                                   setSelectedFormation(userPositions?.[id]?.selectedFormation || 0);
                                }}
                                style={{
                                   border: "3px solid",
                                   borderColor: onlineUsers[id][0].color,
                                }}
                                className="bg-white grid place-items-center w-9 select-none cursor-pointer  h-9 rounded-full mr-2"
                             >
                                <img className="rounded-full" src={onlineUsers[id][0]?.profilePicUrl} alt="" />{" "}
                                {/* <p className="font-bold">{initials(onlineUsers[id][0]?.name)}</p> */}
                             </div>
                          </>
                       );
                    })
                  : null}
               <button
                  onClick={() =>
                     setLocalSettings((settings: localSettings) => {
                        return { ...settings, stageFlipped: !localSettings.stageFlipped };
                     })
                  }
                  className="border hidden lg:block border-black text-sm rounded-md px-3 py-2 ml-4"
               >
                  <div className="flex flex-row items-center ">
                     <p className="">Flip Stage</p>
                  </div>
               </button>
               {!viewOnly ? (
                  <>
                     {/* <button className="mx-3 hidden lg:block" onClick={undo}>
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
                     </button> */}

                     <button
                        onClick={() => setShareIsOpen((state: boolean) => !state)}
                        className="border hidden lg:block border-black text-sm rounded-md px-3 py-2 ml-4"
                     >
                        <div className="flex flex-row items-center ">
                           <p className="">Share</p>
                        </div>
                     </button>
                  </>
               ) : null}
               <button
                  onClick={() => setIsPreviewingThree((isPreviewingThree: boolean) => false)}
                  className={`border group hidden lg:block border-black border-r-0 text-sm rounded-l-md px-3 py-2 ml-4 ${
                     !isPreviewingThree ? "bg-slate-800 text-white" : ""
                  }`}
               >
                  <div className="flex flex-row items-center  ">
                     <p className="">2D</p>
                  </div>
               </button>
               <button
                  onClick={() => setIsPreviewingThree(true)}
                  className={`border group hidden lg:block border-black text-sm rounded-r-md px-3 py-2 ${
                     isPreviewingThree ? "bg-slate-800 text-white" : ""
                  } `}
               >
                  <div className="flex flex-row items-center  ">
                     <p className="">3D</p>
                  </div>
               </button>
               {session ? (
                  <Link href="/dashboard">
                     <button className="mx-4">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-6 h-6"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                     </button>
                  </Link>
               ) : (
                  <Link href="/login">
                     <button className="bg-slate-800  text-white text-sm rounded-md px-3 py-2 ml-4 mr-4 ">
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
