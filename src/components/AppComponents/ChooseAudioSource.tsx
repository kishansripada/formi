import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

export const ChooseAudioSource: React.FC<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
   setSelectedFormation: Function;
   setFormations: Function;
   setChangeSoundCloudIsOpen: Function;
}> = ({
   setPosition,
   setIsPlaying,
   setSongDuration,
   songDuration,
   soundCloudTrackId,
   setSoundCloudTrackId,
   setFormations,
   setSelectedFormation,
   setChangeSoundCloudIsOpen,
}) => {
   const [newUrl, setNewUrl] = useState("");
   const [file, setFile] = useState("");
   const router = useRouter();
   let session = useSession();
   const supabase = useSupabaseClient();
   return (
      <>
         <div
            className="fixed top-0 left-0 z-[70] flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
            id="outside"
            onClick={(e) => {
               if (e.target.id === "outside") {
                  setChangeSoundCloudIsOpen(false);
               }
            }}
         >
            <div className="flex  w-[700px] flex-col rounded-xl bg-white">
               <div className="flex flex-col rounded-xl px-10 py-10 h-full">
                  <div className="flex flex-col mt-auto">
                     <p className="text-xl text-gray-500">Add your mix to get started</p>

                     <div className="flex flex-row items-center pt-3 ">
                        <div className="flex flex-row items-center  w-full border-2 rounded-md border-black">
                           <input
                              onChange={(e) => setNewUrl(e.target.value)}
                              className="  rounded-md focus:outline-none px-2 h-8  grow mr-3"
                              type="text"
                              placeholder="paste soundcloud url here"
                           />
                           <img src="https://static.cdnlogo.com/logos/s/19/soundcloud.svg" className="w-12 mr-2" alt="" />
                        </div>
                     </div>

                     <p className="mr-auto ml-auto my-6">-or-</p>
                     <div className="flex justify-center items-center w-full">
                        <label
                           htmlFor="dropzone-file"
                           className="flex flex-col justify-center items-center w-full h-36 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer "
                        >
                           <div className="flex flex-col justify-center items-center pt-5 pb-6">
                              <svg
                                 aria-hidden="true"
                                 className="mb-3 w-10 h-10 text-gray-400"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                 ></path>
                              </svg>
                              <p>{file?.name}</p>
                              <p className="mb-2 text-sm text-gray-500 ">
                                 <span className="font-semibold">Click to upload</span>
                              </p>
                              <p className="text-xs text-gray-500 "> MP3 OR WAV</p>
                           </div>
                           <input
                              accept=".mp3,.wav"
                              onChange={(event) => {
                                 if (event.target.files && event.target.files[0]) {
                                    const i = event.target.files[0];
                                    setFile(i);
                                 }
                              }}
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                           />
                        </label>
                     </div>
                  </div>

                  <button
                     onClick={async () => {
                        if (newUrl.length) {
                           await fetch(`/api/getSoundCloudTrackId?url=${newUrl}`)
                              .then((r) => r.json())
                              .then((r) => {
                                 toast.success("successfully added SoundCloud track");
                                 // console.log(r.trackId);
                                 setSoundCloudTrackId(r.trackId);
                              })
                              .catch((r) => {
                                 toast.error("invalid SoundCloud url");
                              });
                           setChangeSoundCloudIsOpen(false);
                           return;
                        }

                        if (file) {
                           const body = new FormData();
                           body.append("file", file);

                           let userId = session?.user?.id;

                           const { data, error } = await toast.promise(
                              supabase.storage
                                 .from("audiofiles")
                                 .upload(`${userId}/${router.query.danceId}.mp3?q=${Math.floor(Math.random() * 10000)}`, body, {
                                    cacheControl: "no-cache",
                                    upsert: true,
                                 }),
                              {
                                 loading: "Uploading file...",
                                 success: <b>File uploaded!</b>,
                                 error: <b>Could not upload file.</b>,
                              }
                           );

                           if (data?.path) {
                              setSoundCloudTrackId(`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/audiofiles/${data.path}`);
                              setChangeSoundCloudIsOpen(false);
                           }
                        }
                     }}
                     className="mr-auto ml-auto bg-pink-600 hover:bg-pink-700 rounded-md text-white px-3 py-1 mt-6 w-32"
                  >
                     Get Started
                  </button>
                  <div className="flex flex-row justify-center mt-10">
                     <p>
                        or{" "}
                        <button
                           onClick={() => {
                              setSoundCloudTrackId("257461521");
                              toast.success("using example track");
                              setChangeSoundCloudIsOpen(false);
                           }}
                           className="text-pink-600"
                        >
                           use example soundcloud track
                        </button>
                     </p>
                  </div>
               </div>
            </div>
         </div>
         <Toaster />
      </>
   );
};
