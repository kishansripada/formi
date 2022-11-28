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
                     <p className="text-xl font-bold text-[#1A1B25]"> {soundCloudTrackId ? "change track" : "add your mix to get started"}</p>

                     <p className="text-[#414552] font-medium pt-3 text-[14px]">soundcloud url</p>
                     <div className="flex flex-row items-center  ">
                        <div className="flex flex-row items-center  w-full ">
                           <input
                              onChange={(e) => setNewUrl(e.target.value)}
                              className="input-sm	input w-full mr-3 mt-2"
                              type="text"
                              placeholder="https://soundcloud.com/..."
                           />
                        </div>
                     </div>

                     <p className=" my-6 text-[#414552] font-bold">OR</p>

                     <div className="  ">
                        <div className="mb-3 w-96">
                           <label htmlFor="formFile" className="form-label inline-block mb-2 text-gray-700 font-medium text-[14px]">
                              upload mp3 or wav file
                           </label>
                           <input
                              className="file-input w-full	"
                              type="file"
                              id="formFile"
                              accept=".mp3,.wav"
                              onChange={(event) => {
                                 if (event.target.files && event.target.files[0]) {
                                    const i = event.target.files[0];
                                    console.log(i);
                                    setFile(i);
                                 }
                              }}
                           />
                        </div>
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
                     className="mr-auto ml-auto btn btn-primary"
                  >
                     get started
                  </button>
                  <div className="flex flex-row justify-center mt-2">
                     <p>
                        or{" "}
                        <button
                           onClick={() => {
                              setSoundCloudTrackId("257461521");
                              toast.success("using example track");
                              setChangeSoundCloudIsOpen(false);
                           }}
                           className="text-pink-700"
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
