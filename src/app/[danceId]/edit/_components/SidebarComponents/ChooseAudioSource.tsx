import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthSession } from "@supabase/supabase-js";
import { useStore } from "../../store";
import PropertyAdd from "../../../../../../@/components/PropertyAdd";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HStack, VStack } from "../../../../../../@/components/ui/stacks";
import { HDivider } from "../../../../../../@/components/ui/hdivider";
import { PopoverPicker } from "../ColorPicker";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../../@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
export const ChooseAudioSource: React.FC<{
   audioFiles: any;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
   invalidateAudioFiles: Function;
   setLocalSource: Function;
   session: AuthSession | null;
}> = ({ audioFiles, setSoundCloudTrackId, soundCloudTrackId, invalidateAudioFiles, setLocalSource, session }) => {
   const { viewOnly, setPlayer, player, setIsPlaying, segments, setSegments, newSegment, updateSegmentProperty } = useStore();
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
            invalidateAudioFiles();
            setSoundCloudTrackId(`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/audiofiles/${data.data.path}`);
         });
   }, [file]);

   const upload = useRef(null);

   return (
      <VStack className="overflow-hidden w-full h-full">
         <HStack className="justify-between items-center text-xl px-2 py-2 font-medium">
            <button onClick={(e) => {}} className="text-sm w-30 font-normal relative cursor-pointer">
               <input
                  ref={upload}
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
         </HStack>
         <HDivider />
         <VStack className="gap-2 py-2">
            <div className="flex flex-row items-center justify-between px-2">
               <p className=" font-medium text-xs">Audio track</p>
               <div className="flex flex-row items-center gap-2">
                  {Boolean(soundCloudTrackId) ? (
                     <button
                        onClick={() => {
                           setSoundCloudTrackId(null);
                           setLocalSource(null);
                           setPlayer(null);
                        }}
                        className="  md:text-xs text-[10px] hover:bg-neutral-800 p-1  cursor-default "
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                           <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                        </svg>
                     </button>
                  ) : null}

                  {!soundCloudTrackId ? (
                     <DropdownMenu>
                        <DropdownMenuTrigger>
                           <button className="hover:bg-neutral-800 p-1 cursor-default pointer-events-auto">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                 <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                              </svg>
                           </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                           <DropdownMenuLabel>Uploads</DropdownMenuLabel>
                           <DropdownMenuSeparator />

                           {[...audioFiles].reverse().map((audiofile) => {
                              return (
                                 <DropdownMenuItem className="">
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
                                       }    `}
                                    >
                                       {audiofile.name}
                                    </div>
                                 </DropdownMenuItem>
                              );
                           })}

                           <DropdownMenuItem
                              onClick={() => {
                                 upload.current.click();
                              }}
                           >
                              <HStack className="items-center gap-2">
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                 </svg>
                                 <p> Upload your first file</p>
                              </HStack>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  ) : null}
               </div>
            </div>

            {Boolean(soundCloudTrackId) ? <p className="px-2 text-xs">{soundCloudTrackId?.split("/").slice(-1)[0]}</p> : null}
         </VStack>
         <HDivider />

         <PropertyAdd
            canAdd={true}
            canSubtract={segments.length > 0}
            isOpen={segments.length > 0}
            onAdd={() => {
               newSegment();
            }}
            onSubtract={() => {
               setSegments([]);
            }}
            label="Audio segments"
         >
            <VStack>
               {segments.map((segment, index) => (
                  <div
                     onClick={() => {
                        // setSelectedSegment(segment.id);
                     }}
                     key={segment.id}
                     className={`flex flex-row items-center px-2  box-border over:bg-neutral-100 dark:hover:bg-neutral-700  group  select-none w-full  min-h-[35px] `}
                  >
                     <p className="font-semibold   text-xs w-7 "> {index + 1}</p>

                     <Popover>
                        <PopoverTrigger>
                           <div
                              style={{
                                 backgroundColor: segment?.color,
                              }}
                              className={`h-5 w-5 rounded-sm ${!segment.color ? "border border-white" : ""}`}
                           ></div>
                        </PopoverTrigger>
                        <PopoverContent side="right" className="p-0 w-min flex flex-col items-center justify-center gap-3 p-2">
                           <HexColorPicker
                              onChange={(color) => {
                                 updateSegmentProperty(segment.id, "color", color);
                              }}
                              color={segment?.color}
                           ></HexColorPicker>
                        </PopoverContent>
                     </Popover>
                     <input
                        className="h-6 w-full  bg-transparent   px-2 py-4  text-xs rounded-md    outline-none cursor-default"
                        value={segment.name}
                        spellCheck={false}
                        autoCorrect="off"
                        onChange={(e) => {
                           updateSegmentProperty(segment.id, "name", e.target.value);
                        }}
                        readOnly={viewOnly}
                     />

                     <button
                        onClick={() => setSegments(segments.filter((s) => s.id !== segment.id))}
                        className="  md:text-xs text-[10px] hover:bg-neutral-800 p-1  cursor-default "
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                           <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                        </svg>
                     </button>
                  </div>
               ))}
            </VStack>
         </PropertyAdd>
         <HDivider />
      </VStack>
   );
};

function isValidKey(key: string): boolean {
   // only allow s3 safe characters and characters which require special handling for now
   // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
   return /^(\w|\/|!|-|\.|\*|'|\(|\)| |&|\$|@|=|;|:|\+|,|\?)*$/.test(key);
}
