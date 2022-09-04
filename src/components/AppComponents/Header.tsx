import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/router";
export const Header = ({
   saved,
   setSoundCloudTrackId,
   session,
   danceName,
   setDanceName,
   setSession,
}: {
   saved: boolean;
   setSoundCloudTrackId: Function;
   session: any;
   danceName: string;
   setDanceName: Function;
   setSession: Function;
}) => {
   const router = useRouter();
   const wrapperRef = useRef(null);
   useEffect(() => {
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
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
         <div className=" h-[75px] flex flex-row items-center shrink-0 px-10 bg-white justify-between">
            <div className="flex flex-row items-end">
               <p className="text-3xl">
                  naach <span className="text-xs">early access</span>
               </p>
               <p className="text-sm mb-1 ml-4">Welcome back, {session?.user?.user_metadata?.full_name}</p>
            </div>

            <div>
               <input
                  value={danceName}
                  onChange={(e) => setDanceName(e.target.value)}
                  type="text"
                  className="w-96 h-10 text-3xl focus:outline-none text-center"
               />
               <hr />
            </div>

            <div className=" flex flex-row items-center">
               {saved ? (
                  <p className="mr-6 text-gray-500">saved</p>
               ) : (
                  <div className="flex flex-row items-center mr-6 ">
                     <svg
                        className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
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
                     </svg>
                     <p className="text-gray-500">saving...</p>
                  </div>
               )}

               <div ref={wrapperRef}>
                  <button onClick={() => setChangeSoundCloudIsOpen((state) => !state)} className="bg-black text-white px-2 py-1 rounded-md ml-auto ">
                     change track
                  </button>

                  {changeSoundCloudIsOpen ? (
                     <div className="w-[200px] h-[100px] absolute bg-white border-2 border-black rounded-xl right-[70px] top-16 px-2 py-1">
                        <div className="flex flex-row">
                           <p className="text-sm ">paste in a new SoundCloud url</p>
                           <button
                              className="bg-blue-500 py-1 px-1"
                              onClick={async () => {
                                 const trackId = await fetch(`/api/getSoundCloudTrackId?url=${newSoundCloudUrl}`)
                                    .then((r) => r.json())
                                    .then((r) => r.trackId);
                                 console.log(trackId);
                                 setSoundCloudTrackId(trackId);
                              }}
                           >
                              go
                           </button>
                        </div>
                        <input
                           placeholder="New dancer"
                           value={newSoundCloudUrl}
                           onChange={(e) => setNewSoundCloudUrl(e.target.value)}
                           type="text"
                           className="border-gray-500 border-2 rounded-md ml-2 px-2 w-44"
                           // onKeyDown={(event) => (event.key === "Enter" ? createNewDancer() : null)}
                        />
                     </div>
                  ) : (
                     <></>
                  )}
               </div>

               <Link href="/mydances">
                  <a className="ml-2 bg-pink-600 hover:bg-pink-700 px-2 py-1 rounded-md text-white">my dances</a>
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
      </>
   );
};
