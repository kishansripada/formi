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
   setAudiofiles: Function;
   sampleAudioFiles: any;
}> = ({ audioFiles, setSoundCloudTrackId, soundCloudTrackId, setAudiofiles, sampleAudioFiles }) => {
   console.log(audioFiles);
   const [file, setFile] = useState<File>();
   const router = useRouter();
   let session = useSession();
   const supabase = useSupabaseClient();

   useEffect(() => {
      if (!file?.name) return;
      const body = new FormData();
      body.append("file", file);

      let userId = session?.user?.id;

      toast
         .promise(
            supabase.storage.from("audiofiles").upload(`${userId}/${file.name}?q=${Math.floor(Math.random() * 10000)}`, body, {
               cacheControl: "no-cache",
               upsert: true,
            }),
            {
               loading: "Uploading file...",
               success: <b>File uploaded!</b>,
               error: <b>Could not upload file.</b>,
            }
         )
         .then((r) => {
            supabase.storage
               .from("audiofiles")
               .list(session?.user.id, {})
               .then((r) => {
                  setAudiofiles(r);
               });
         });
   }, [file]);

   return (
      <>
         <div className="lg:flex hidden overflow-y-scroll  min-w-[350px] w-[23%]  flex-col   bg-white border-r border-r-gray-300   px-6 py-6 overflow-hidden">
            <div className="flex flex-col ">
               <p className="text-xl font-medium text-[#1A1B25] h-12"> add audio</p>

               <button className="relative border border-dashed border-gray-300 h-24 w-full rounded-xl bg-gray-50 ">
                  <input
                     accept="audio/mp4,audio/mpeg,.aac,.wav,.m4a,audio/*"
                     type="file"
                     autoComplete="off"
                     tabIndex={-1}
                     className="cursor-pointer relative block opacity-0 w-full h-full p-20 z-50"
                     onChange={(event) => {
                        if (event.target.files && event.target.files[0]) {
                           const i = event.target.files[0];
                           // console.log(i);
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

            <div>
               <p className=" font-medium mb-2 mt-4 text-gray-600">selected file</p>
               <div className="p-3 rounded-md my-1 cursor-pointer w-full min-h-[48px] flex flex-row items-center justify-center whitespace-nowrap bg-pink-100 border-pink-600 border-2">
                  {soundCloudTrackId ? (
                     <>
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
                        <p className="text-gray-700 text-sm font-medium w-[200px] text-ellipsis overflow-hidden">
                           {soundCloudTrackId?.split("/").slice(-1)[0]}
                        </p>

                        <button
                           onClick={async (e) => {
                              e.stopPropagation();
                              setSoundCloudTrackId(null);
                              toast.success("removed track");
                           }}
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 ml-auto"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                           </svg>
                        </button>
                     </>
                  ) : (
                     <>
                        <p className="text-gray-600">no file selected</p>
                     </>
                  )}
               </div>
            </div>

            <p className=" font-medium mb-2 mt-6 text-gray-600">my uploaded files</p>
            <div className="h-[300px]">
               <div className=" flex flex-col overflow-scroll removeScrollBar ">
                  {audioFiles.data.length ? (
                     [...audioFiles.data].reverse().map((audiofile) => {
                        return (
                           <div
                              onClick={() =>
                                 setSoundCloudTrackId(
                                    `https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/audiofiles/${session?.user.id}/${audiofile.name}`
                                 )
                              }
                              className={`p-3 ${
                                 audiofile.name === soundCloudTrackId?.split("/").slice(-1)[0] ? "opacity-50 pointer-events-none" : ""
                              }   rounded-md my-1 cursor-pointer w-full min-h-[48px] flex flex-row items-center justify-center whitespace-nowrap border-gray-300 border `}
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
                              <p className="text-gray-700 text-sm font-medium w-[200px] text-ellipsis overflow-hidden">{audiofile.name}</p>

                              <button
                                 onClick={async (e) => {
                                    e.stopPropagation();
                                    const { data, error } = await supabase.storage
                                       .from("audiofiles")
                                       .remove([`${session?.user?.id}/${audiofile.name}`]);

                                    await supabase.storage
                                       .from("audiofiles")
                                       .list(session?.user.id, {})
                                       .then((r) => {
                                          setAudiofiles(r);
                                       });
                                    if (!error) {
                                       toast.success("deleted file");
                                    }
                                 }}
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 ml-auto"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                 </svg>
                              </button>
                           </div>
                        );
                     })
                  ) : (
                     <>
                        <p className="text-gray-600 text-sm">no uploaded files :(</p>
                     </>
                  )}
               </div>
            </div>

            <p className=" font-medium mb-2 mt-6 text-gray-600">sample audio files</p>
            <div className=" flex flex-col overflow-scroll removeScrollBar h-full ">
               {sampleAudioFiles.data.length ? (
                  [...sampleAudioFiles.data]
                     .filter((file) => file.name !== soundCloudTrackId?.split("/").slice(-1)[0])
                     .reverse()
                     .map((audiofile) => {
                        return (
                           <div
                              onClick={() =>
                                 setSoundCloudTrackId(
                                    `https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/audiofiles/sample/${audiofile.name}`
                                 )
                              }
                              className={`p-3   rounded-md my-1 cursor-pointer w-full min-h-[48px] flex flex-row items-center justify-start whitespace-nowrap border-gray-300 border `}
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
                              <p className="text-gray-700 text-sm font-medium w-[200px] text-ellipsis overflow-hidden">{audiofile.name}</p>
                           </div>
                        );
                     })
               ) : (
                  <>
                     <p className="text-gray-600">no uploaded files :(</p>
                  </>
               )}
            </div>
         </div>

         <Toaster />
      </>
   );
};
