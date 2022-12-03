import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

export const ChooseAudioSource: React.FC<{
   audioFiles: any;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
}> = ({ audioFiles, setSoundCloudTrackId, soundCloudTrackId }) => {
   const [file, setFile] = useState(null);
   const router = useRouter();
   let session = useSession();
   const supabase = useSupabaseClient();

   console.log(audioFiles);
   useEffect(() => {
      if (!file?.name) return;
      const body = new FormData();
      body.append("file", file);

      let userId = session?.user?.id;

      toast.promise(
         supabase.storage.from("audiofiles").upload(`${userId}/${file.name}?q=${Math.floor(Math.random() * 10000)}`, body, {
            cacheControl: "no-cache",
            upsert: true,
         }),
         {
            loading: "Uploading file...",
            success: <b>File uploaded!</b>,
            error: <b>Could not upload file.</b>,
         }
      );
   }, [file]);

   return (
      <>
         <div className="flex  flex-col  bg-white border-r border-r-gray-300 w-[23%]  px-6 py-6">
            <div className="flex flex-col  ">
               <div className="flex flex-col mt-auto">
                  <p className="text-xl font-medium text-[#1A1B25] h-12"> add audio</p>

                  <button className="relative border border-dashed border-gray-300 h-36 w-full rounded-xl bg-gray-50 ">
                     <input
                        accept="audio/mp4,audio/mpeg,.aac,.wav,.m4a,audio/*"
                        type="file"
                        autoComplete="off"
                        tabIndex={-1}
                        className="cursor-pointer relative block opacity-0 w-full h-full p-20 z-50"
                        onChange={(event) => {
                           if (event.target.files && event.target.files[0]) {
                              const i = event.target.files[0];
                              console.log(i);
                              setFile(i);
                           }
                        }}
                     />
                     <div className=" w-full h-full rounded-xl absolute top-0 right-0 left-0 m-auto  flex flex-col items-center justify-center">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" color="#5D647B">
                           <path d="M16 16l-4-4-4 4M12 12v9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                           <path
                              d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                           ></path>
                           <path d="M16 16l-4-4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <p className="text-sm">upload a file</p>
                     </div>
                  </button>
               </div>

               <p className=" font-medium mb-2 mt-12">my audio files</p>
               <div className="flex flex-col overflow-y-scroll removeScrollBar h-[400px]">
                  {[...audioFiles.data].reverse().map((audiofile) => {
                     return (
                        <div
                           onClick={() =>
                              setSoundCloudTrackId(
                                 `https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/audiofiles/${session?.user.id}/${audiofile.name}`
                              )
                           }
                           className="p-3 border border-gray-300 rounded-md my-1 cursor-pointer w-full min-h-[48px] flex flex-row items-center justify-center whitespace-nowrap overflow-hidden "
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 mr-2 shrink-0"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                              />
                           </svg>
                           <p className="text-gray-700 text-sm font-medium w-full">{audiofile.name}</p>
                        </div>
                     );
                  })}
               </div>

               {/* <button
                  onClick={async () => {
                     // if (newUrl.length) {
                     //    await fetch(`/api/getSoundCloudTrackId?url=${newUrl}`)
                     //       .then((r) => r.json())
                     //       .then((r) => {
                     //          toast.success("successfully added SoundCloud track");
                     //          // console.log(r.trackId);
                     //          setSoundCloudTrackId(r.trackId);
                     //       })
                     //       .catch((r) => {
                     //          toast.error("invalid SoundCloud url");
                     //       });
                     //    setChangeSoundCloudIsOpen(false);
                     //    return;
                     // }
                  }}
                  className=""
               >
                  get started
               </button> */}
            </div>
         </div>

         <Toaster />
      </>
   );
};
