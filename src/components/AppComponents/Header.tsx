import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/router";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

export const Header = ({
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
}: {
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
}) => {
   const router = useRouter();
   const wrapperRef = useRef(null);
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (wrapperRef.current && !wrapperRef.current?.contains(event.target)) {
            setChangeSoundCloudIsOpen(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef]);
   let [changeSoundCloudIsOpen, setChangeSoundCloudIsOpen] = useState(false);
   let [newSoundCloudUrl, setNewSoundCloudUrl] = useState("");
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
                           {/* <svg
                              className="mr-2 w-6 h-6 text-gray-200 animate-spin  fill-blue-600"
                              viewBox="0 0 100 101"
                              fill="white"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                 fill="currentColor"
                              />
                              <path
                                 d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                 fill="currentFill"
                              />
                           </svg> */}
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

               <p className="text-sm font-medium text-gray-900 dark:text-gray-300">show next formation</p>
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

                  {changeSoundCloudIsOpen ? (
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
                  )}
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
