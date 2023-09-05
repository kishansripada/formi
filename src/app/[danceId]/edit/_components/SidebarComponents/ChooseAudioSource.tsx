import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthSession } from "@supabase/supabase-js";
import { useStore } from "../../store";

export const ChooseAudioSource: React.FC<{
   audioFiles: any;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
   setAudiofiles: Function;
   player: any;
   setIsPlaying: Function;
   setLocalSource: Function;
   setPlayer: Function;
   session: AuthSession | null;
}> = ({ audioFiles, setSoundCloudTrackId, soundCloudTrackId, setAudiofiles, setIsPlaying, player, setLocalSource, setPlayer, session }) => {
   const { viewOnly } = useStore();
   const [file, setFile] = useState<File | null>();

   const supabase = createClientComponentClient();

   useEffect(() => {
      if (!file?.name) return;
      if (!isValidKey(file.name)) {
         toast.error("Remove special characters from file name");
         setFile(null);
         return;
      }

      const body = new FormData();

      const reader = new FileReader();

      reader.onloadend = () => {
         setLocalSource(reader.result);
      };
      reader.readAsDataURL(file);

      body.append("file", file);

      let userId = session?.user?.id;
      // ?q=${Math.floor(Math.random() * 10000)}
      toast
         .promise(
            supabase.storage.from("audiofiles").upload(`${userId}/${file.name}`, body, {
               cacheControl: "3600",
               upsert: true,
            }),
            {
               loading: "Uploading file...",
               success: <b>File uploaded!</b>,
               error: <b>Could not upload file.</b>,
            }
         )
         .then((data) => {
            supabase.storage
               .from("audiofiles")
               .list(session?.user.id, {})
               .then((r) => {
                  setAudiofiles(r);
                  setSoundCloudTrackId(`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/audiofiles/${data.data.path}`);
               });
         });
   }, [file]);

   return (
      <>
         <div className="flex  overflow-y-scroll w-[260px]  min-w-[260px] h-full  flex-col   bg-white   dark:bg-neutral-800 dark:text-white  px-4 py-6 overflow-hidden">
            <div className="flex flex-col ">
               <div className="text-xl font-medium   flex flex-row justify-between items-center">
                  <button onClick={(e) => {}} className="text-sm w-30 font-normal relative cursor-pointer">
                     <input
                        accept="audio/mp3, audio/wav, video/mp4, video/avi"
                        type="file"
                        autoComplete="off"
                        tabIndex={-1}
                        className="cursor-pointer absolute w-32 left-0 opacity-0 z-50"
                        onChange={(event) => {
                           if (event.target.files && event.target.files[0]) {
                              const i = event.target.files[0];
                              setFile(i);
                           }
                        }}
                     />
                     <div className="flex flex-row items-center cursor-pointer">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-4 h-4 mr-2"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                           />
                        </svg>

                        <p className="relative cursor-pointer ">Upload Media</p>
                     </div>
                  </button>
               </div>
            </div>

            <div>
               <p className=" font-medium mb-2 mt-4 text-sm ">Selected File</p>
               <div className="px-2 py-2  rounded-md my-1 cursor-pointer w-full flex flex-row items-center justify-center whitespace-nowrap bg-pink-100 ">
                  {soundCloudTrackId ? (
                     <>
                        <p className=" text-xs font-medium w-full text-ellipsis text-black overflow-hidden">
                           {soundCloudTrackId?.split("/").slice(-1)[0]}
                        </p>

                        <button
                           onClick={async (e) => {
                              e.stopPropagation();

                              setSoundCloudTrackId(null);
                              setLocalSource(null);
                              setPlayer(null);

                              toast.success("Deselected Track");
                           }}
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 ml-auto text-black"
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
                        <p className=" text-xs text-black">No File Selected</p>
                     </>
                  )}
               </div>
            </div>

            <p className=" font-medium mb-2 mt-6 px-2 text-sm ">Uploaded Media</p>
            <div className="h-[300px]">
               <div className=" flex flex-col overflow-scroll removeScrollBar ">
                  {audioFiles?.data?.length ? (
                     [...audioFiles.data].reverse().map((audiofile) => {
                        return (
                           <div
                              key={audiofile.name}
                              onClick={() => {
                                 if (viewOnly) return;
                                 try {
                                    player ? player.pause() : null;
                                 } catch {
                                    console.log("player not found");
                                 }
                                 setIsPlaying(false);
                                 setSoundCloudTrackId(
                                    `https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/audiofiles/${session?.user.id}/${audiofile.name}`
                                 );
                                 setLocalSource(null);
                              }}
                              className={` ${
                                 audiofile.name === soundCloudTrackId?.split("/").slice(-1)[0] ? "opacity-50 pointer-events-none" : ""
                              }   rounded-md my-1 px-2 group hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer w-full min-h-[40px] flex flex-row items-center  whitespace-nowrap  `}
                           >
                              <p className=" text-xs  text-left text-ellipsis overflow-hidden">{audiofile.name}</p>

                              <button
                                 className="ml-auto mr-2"
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
                                    className="w-5 h-5 group-hover:opacity-100 opacity-0 "
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
                        <p className=" text-sm">No Uploaded Files</p>
                     </>
                  )}
               </div>
            </div>
         </div>
         <Toaster />
      </>
   );
};

function isValidKey(key: string): boolean {
   // only allow s3 safe characters and characters which require special handling for now
   // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
   return /^(\w|\/|!|-|\.|\*|'|\(|\)| |&|\$|@|=|;|:|\+|,|\?)*$/.test(key);
}

function getExtension(filename: string) {
   var parts = filename.split(".");
   return parts[parts.length - 1];
}
function isVideo(filename: string) {
   if (!filename) return false;
   var ext = getExtension(filename);
   switch (ext.toLowerCase()) {
      case "m4v":
      case "avi":
      case "mpg":
      case "mp4":
         // etc
         return true;
   }
   return false;
}
