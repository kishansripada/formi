import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { formation, item, prop } from "../../../types/types";
import { v4 as uuidv4 } from "uuid";
export const Items: React.FC<{
   audioFiles: any;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
   setAudiofiles: Function;
   player: any;
   setIsPlaying: Function;
   setLocalSource: Function;
   setUpgradeIsOpen: Function;
   pricingTier: string;
   items: item[];
   setFormations: Function;
   selectedFormation: number | null;
   propUploads: any;
   setItems: Function;
   selectedPropIds: string[];
   invalidatePropUploads: Function;
   setSelectedPropIds: Function;
   pushChange: Function;
   viewOnly: boolean;
   formations: formation[];
   setHelpUrl: Function;
}> = ({
   audioFiles,
   setSoundCloudTrackId,
   soundCloudTrackId,
   setAudiofiles,
   setIsPlaying,
   player,
   setLocalSource,
   setUpgradeIsOpen,
   pricingTier,
   items,
   setFormations,
   selectedFormation,
   propUploads,
   setItems,
   selectedPropIds,
   invalidatePropUploads,
   setSelectedPropIds,
   pushChange,
   viewOnly,
   formations,
   setHelpUrl,
}) => {
   const [file, setFile] = useState<File | null>();
   const router = useRouter();
   let session = useSession();
   const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
   const supabase = useSupabaseClient();
   //    const selectedPropIds = [];
   useEffect(() => {
      if (!file?.name) return;
      if (!isValidKey(file.name)) {
         toast.error("Remove special characters from file name");
         setFile(null);
         return;
      }

      const body = new FormData();

      const reader = new FileReader();

      reader.readAsDataURL(file);

      body.append("file", file);

      let userId = session?.user?.id;
      // ?q=${Math.floor(Math.random() * 10000)}
      toast
         .promise(
            supabase.storage.from("props").upload(`${userId}/${file.name}`, body, {
               cacheControl: "no-cache",
               upsert: true,
            }),
            {
               loading: "Uploading file...",
               success: <b>File uploaded!</b>,
               error: <b>Could not upload file.</b>,
            }
         )
         .then((data) => {
            invalidatePropUploads();
         });
   }, [file]);
   //    console.log(propUploads);

   return (
      <>
         <div className="lg:flex hidden  w-[260px]  min-w-[260px] h-full  flex-col   bg-white  overflow-scroll dark:bg-neutral-800 dark:text-white  pt-6 ">
            <div className=" font-medium mb-2 flex flex-row  items-center  px-4 text-sm ">
               <p>Handheld props</p>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 ml-1  cursor-pointer"
                  onClick={() => {
                     setHelpUrl("https://www.youtube.com/shorts/DF_TWIDcVDk");
                  }}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
               </svg>

               {/* <span className="ml-2 relative group">
                  <p className="cursor-pointer">ℹ︎</p>
                  <div className="bg-black/70 pointer-events-none absolute opacity-0 group-hover:opacity-100 transition text-white text-xs p-2 rounded-xl font-normal z-50 w-[200px]  -translate-x-20">
                     Props are small, portable items assignable to performers in various formations. Props can be assigned to performers in the
                     formation tab.
                  </div>
               </span> */}
               <button
                  onClick={() => {
                     let newId = uuidv4();
                     setItems((items: item[]) => {
                        return [...items, { id: newId, name: "New prop" }];
                     });

                     setSelectedItemId(newId);
                  }}
                  className="ml-auto text-xs flex flex-row items-center"
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                     className="w-6 h-6 mr-1"
                  >
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                  New prop
               </button>
            </div>

            <div
               style={{
                  pointerEvents: viewOnly ? "none" : "all",
               }}
               className=" flex flex-col overflow-scroll removeScrollBar  h-1/2 "
            >
               {items.length ? (
                  [...items].reverse().map((item: item) => {
                     return (
                        <div
                           key={item.url}
                           onClick={() => {
                              setSelectedItemId(item.id);
                           }}
                           //    selectedPropIds.includes(item.id)
                           className={`  ${
                              selectedItemId === item.id ? "bg-pink-200 dark:bg-pink-600" : " hover:bg-neutral-100 dark:hover:bg-neutral-700"
                           }  w-full h-[55px] min-h-[55px] relative  group cursor-pointer  px-4   flex flex-row items-center  whitespace-nowrap  `}
                        >
                           <input
                              className="text-sm px-1 focus:outline-none bg-transparent"
                              onChange={(e) => {
                                 setItems((items: item[]) => {
                                    return items.map((itemx) => {
                                       if (itemx.id === item.id) {
                                          return {
                                             ...itemx,
                                             name: e.target.value,
                                          };
                                       }
                                       return itemx;
                                    });
                                 });
                              }}
                              value={item.name}
                              type="text"
                           />
                           {item.url ? (
                              <img
                                 className="h-[55px] w-[55px] ml-auto  object-contain  cursor-pointer  z-10 "
                                 src={`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${item.url}`}
                                 alt=""
                              />
                           ) : null}
                        </div>
                     );
                  })
               ) : (
                  <>
                     <p className=" px-4 text-sm">No props</p>
                  </>
               )}
            </div>

            {!viewOnly ? (
               <>
                  <div className=" font-medium mb-2 mt-6 px-4 text-sm flex flex-row  justify-between ">
                     <p>Image Uploads</p>{" "}
                     {!viewOnly && (
                        <div className="flex flex-row items-center cursor-pointer justify-between">
                           <div className="flex flex-col  cursor-pointer  ">
                              <div className="text-xl font-medium  cursor-pointer flex flex-row justify-between items-center">
                                 <button className="text-xs w-30 font-normal relative cursor-pointer">
                                    <input
                                       accept="image/jpeg, image/png, image/webp, image/bmp, image/tiff"
                                       type="file"
                                       autoComplete="off"
                                       tabIndex={-1}
                                       className="cursor-pointer  absolute w-32 left-0 opacity-0 z-50"
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

                                       <p className="relative cursor-pointer ">Upload</p>
                                    </div>
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
                  <div className=" grid gap-2  grid-cols-2 px-4 overflow-scroll removeScrollBar ">
                     {propUploads.length ? (
                        [...propUploads].reverse().map((propUpload) => {
                           return (
                              <div
                                 style={{
                                    opacity: selectedItemId ? 1 : 0.5,
                                    pointerEvents: selectedItemId ? "all" : "none",
                                 }}
                                 key={propUpload.name}
                                 onClick={() => {
                                    let newId = uuidv4();
                                    // if (selectedItemId) {
                                    setItems((items: item[]) => {
                                       return items.map((item: item) => {
                                          if (item.id === selectedItemId) {
                                             return {
                                                ...item,
                                                url: `${session?.user.id}/${propUpload.name}`,
                                             };
                                          }
                                          return item;
                                       });
                                    });
                                    // } else {
                                    // setItems((items: item[]) => {
                                    //    return [...items, { id: newId, user_id: session?.user.id, url: propUpload.name, name: "New prop" }];
                                    // });
                                    // }

                                    pushChange();
                                 }}
                                 className={` rounded-md  px-2 w-full h-[90px] relative  group  cursor-pointer   flex flex-row items-center  whitespace-nowrap  `}
                              >
                                 <img
                                    className="h-full w-full absolute object-contain left-0 top-0 z-10"
                                    src={`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${session?.user.id}/${propUpload.name}`}
                                    alt=""
                                 />
                                 {selectedItemId ? (
                                    <div className="w-full h-full absolute top-0 left-0 bg-black/50 opacity-0 group-hover:opacity-100 text-white   transition z-20 flex flex-row items-center justify-center flex-wrap ">
                                       <p className="text-xs  text-center whitespace-pre-wrap ">Set prop image</p>
                                       {/* ) : ( */}
                                       {/* <p className="text-xs  text-center whitespace-pre-wrap ">New Prop From Image</p> */}
                                       {/* )} */}
                                    </div>
                                 ) : null}
                              </div>
                           );
                        })
                     ) : (
                        <>
                           <p className=" text-sm">No Uploaded Images</p>
                        </>
                     )}
                  </div>
               </>
            ) : null}
            <div className=" p-2 mt-auto">
               <div
                  style={{
                     opacity: selectedItemId ? 1 : 0.5,
                     pointerEvents: selectedItemId ? "all" : "none",
                  }}
                  onClick={(e) => {
                     // Remove prop
                     e.stopPropagation();
                     // remove prop from all formations
                     setFormations((formations: formation[]) => {
                        return formations.map((formation, i) => {
                           return {
                              ...formation,
                              positions: formation.positions.map((position) => {
                                 return {
                                    ...position,
                                    itemId: position.itemId === selectedItemId ? null : position.itemId,
                                 };
                              }),
                           };
                        });
                     });
                     //  // remove prop from props
                     setItems((items: item[]) => {
                        return items.filter((p) => p.id !== selectedItemId);
                     });
                     setSelectedItemId(null);
                     pushChange();
                  }}
                  className="  w-full text-sm shadow-sm cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-2 bg-red-500 dark:text-red-400 text-red-600   "
               >
                  Delete Prop
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
