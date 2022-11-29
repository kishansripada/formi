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

                  <p className="text-[#414552] font-medium pt-3 text-[14px]">soundcloud url</p>
                  <div className="flex flex-row items-center  ">
                     <div className="flex flex-row items-center   ">
                        <input
                           onChange={(e) => setNewUrl(e.target.value)}
                           className="input-sm	input  mr-3 mt-2"
                           type="text"
                           placeholder="https://soundcloud.com/..."
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

         <Toaster />
      </>
   );
};
