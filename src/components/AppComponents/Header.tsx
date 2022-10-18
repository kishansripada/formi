import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/router";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

export const Header: React.FC<{
   saved: boolean;
   setSoundCloudTrackId: Function;
   session: any;
   danceName: string;
   setDanceName: Function;
   setSession: Function;
   soundCloudTrackId: string | null;
   setShowPreviousFormation: Function;
   showPreviousFormation: boolean;
   viewAllPaths: boolean;
   setViewAllPaths: Function;
   changeSoundCloudIsOpen: boolean;
   setChangeSoundCloudIsOpen: Function;
}> = ({
   saved,
   setSoundCloudTrackId,
   session,
   danceName,
   setDanceName,
   setSession,
   soundCloudTrackId,
   showPreviousFormation,
   setShowPreviousFormation,
   viewAllPaths,
   setViewAllPaths,
   changeSoundCloudIsOpen,
   setChangeSoundCloudIsOpen,
}) => {
   const router = useRouter();
   const wrapperRef = useRef(null);

   return (
      <>
         <div className=" h-[75px] flex flex-row items-center shrink-0 pr-10 pl-7 bg-white justify-between">
            <div className="flex flex-row items-center shrink-0">
               <Image className="scale-[3.5]" src={logo} width={150} height={60} />
               <div className="h-[40px] w-[1px] bg-gray-400 ml-3"></div>

               <div className="h-full ">
                  <div className="flex flex-row justify-center items-center">
                     <input
                        value={danceName}
                        onChange={(e) => setDanceName(e.target.value)}
                        className="h-6 text-xl px-1 focus:outline-pink-600 rounded-sm  ml-3  hover:outline-gray-400 focus:outline-2 hover:outline-2 focus:outline hover:outline "
                     />
                     {saved ? (
                        <p className="ml-3 text-gray-500 flex flex-row items-center">saved</p>
                     ) : (
                        <div className="flex flex-row items-center  ml-3">
                           <p className="text-gray-500">saving...</p>
                        </div>
                     )}
                  </div>

                  <p className="text-sm ml-4 ">Welcome back, {session?.user?.user_metadata?.full_name}</p>
               </div>
            </div>

            <div>
               <hr />
            </div>

            <p>
               stuck? watch a
               <a className="text-pink-600" href="https://www.youtube.com/watch?v=1dj8L5tUAjU" target={"_blank"}>
                  {" "}
                  tutorial
               </a>
            </p>
            <div className="flex flex-col items-center justify-center">
               <label className="inline-flex relative items-center cursor-pointer">
                  <input
                     checked={showPreviousFormation}
                     type="checkbox"
                     id="checked-toggle"
                     className="sr-only peer"
                     onChange={() => setShowPreviousFormation((value: boolean) => !value)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
               </label>

               <p className="text-sm font-medium text-gray-900 dark:text-gray-300">show previous formation</p>
            </div>

            <div className="flex flex-col items-center justify-center">
               <label className="inline-flex relative items-center cursor-pointer">
                  <input
                     checked={viewAllPaths}
                     type="checkbox"
                     id="checked-toggle"
                     className="sr-only peer"
                     onChange={() => setViewAllPaths((value: boolean) => !value)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
               </label>
               <p className="text-sm font-medium text-gray-900 dark:text-gray-300">view all paths</p>
            </div>

            <div className=" flex flex-row items-center">
               <div ref={wrapperRef}>
                  <button onClick={() => setChangeSoundCloudIsOpen((state) => !state)} className="bg-black text-white px-2 py-1 rounded-md ml-auto  ">
                     change track
                  </button>

                  {/* {changeSoundCloudIsOpen ? (
                     <div className="w-[200px]  absolute bg-white border-[1px] border-gray-300 rounded-xl right-[175px] top-16 px-3 py-3 z-50">
                        <div className="flex flex-row"></div>
                        <input
                           placeholder="soundcloud URL"
                           value={newSoundCloudUrl}
                           onChange={(e) => setNewSoundCloudUrl(e.target.value)}
                           type="text"
                           className="border-gray-500 border-2 rounded-md  px-2 w-full focus:outline-pink-600"
                        />
                        <button
                           className="bg-orange-600 py-1 px-1 w-full mt-2 rounded-md text-white hover:bg-orange-700"
                           onClick={async () => {
                              fetch(`/api/getSoundCloudTrackId?url=${newSoundCloudUrl}`)
                                 .then((r) => r.json())
                                 .then((r) => {
                                    if (r.trackId === soundCloudTrackId) {
                                       toast("thats the same track silly");
                                       return;
                                    }
                                    toast.success("track switched!");
                                    // console.log(r.trackId);
                                    setSoundCloudTrackId(r.trackId);
                                    setChangeSoundCloudIsOpen(false);
                                 })
                                 .catch((r) => {
                                    toast.error("invalid SoundCloud url");
                                 });
                           }}
                        >
                           go
                        </button>
                     </div>
                  ) : (
                     <></>
                  )} */}
               </div>

               <Link href="/mydances">
                  {session ? <a className="ml-2 bg-pink-600 hover:bg-pink-700 px-2 py-1 rounded-md text-white">my dances</a> : <></>}
               </Link>
               <button
                  className="ml-6"
                  onClick={() => {
                     router.push("/login");
                     setSession(null);
                     supabase.auth.signOut();
                  }}
               >
                  sign out
               </button>
            </div>
         </div>
         <hr className="mb-2" />
         <Toaster />
      </>
   );
};
