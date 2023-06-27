import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { formation, prop } from "../../../types/types";
import { v4 as uuidv4 } from "uuid";
export const Props: React.FC<{
   audioFiles: any;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
   setAudiofiles: Function;
   player: any;
   setIsPlaying: Function;
   setLocalSource: Function;
   setUpgradeIsOpen: Function;
   pricingTier: string;
   props: prop[];
   setFormations: Function;
   selectedFormation: number | null;
   propUploads: any;
   setProps: Function;
   selectedPropIds: string[];
   invalidatePropUploads: Function;
   setSelectedPropIds: Function;
   pushChange: Function;
   viewOnly: boolean;
   formations: formation[];
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
   props,
   setFormations,
   selectedFormation,
   propUploads,
   setProps,
   selectedPropIds,
   invalidatePropUploads,
   setSelectedPropIds,
   pushChange,
   viewOnly,
   formations,
}) => {
   const [file, setFile] = useState<File | null>();
   const router = useRouter();
   let session = useSession();

   const supabase = useSupabaseClient();

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

   return (
      <>
         <div className="lg:flex hidden  w-[260px]  min-w-[260px] h-full  flex-col   bg-white  overflow-scroll dark:bg-neutral-800 dark:text-white  pt-6 ">
            {!viewOnly && (
               <div className="flex flex-col mb-6  px-4 ">
                  <div className="text-xl font-medium   flex flex-row justify-between items-center">
                     <button className="text-sm w-30 font-normal relative cursor-pointer">
                        <input
                           accept="image/jpeg, image/png, image/webp, image/bmp, image/tiff"
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

                           <p className="relative cursor-pointer ">Upload Photo</p>
                        </div>
                     </button>
                  </div>
               </div>
            )}

            <p className=" font-medium mb-2   px-4 text-sm ">Props</p>

            <div
               style={{
                  pointerEvents: viewOnly ? "none" : "all",
               }}
               className=" flex flex-col overflow-scroll removeScrollBar  h-1/2 "
            >
               {props.length ? (
                  [...props].reverse().map((prop: prop) => {
                     return (
                        <div
                           key={prop.url}
                           onClick={() => {
                              setSelectedPropIds(prop.id);
                           }}
                           className={`  ${
                              selectedPropIds.includes(prop.id) ? "bg-pink-200 dark:bg-pink-600" : " hover:bg-neutral-100 dark:hover:bg-neutral-700"
                           }  w-full h-[55px] min-h-[55px] relative  group  px-2   flex flex-row items-center  whitespace-nowrap  `}
                        >
                           <img
                              className="h-[55px] w-[55px]  object-contain  cursor-pointer  z-10 "
                              src={`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${prop.user_id}/${prop.url}`}
                              alt=""
                           />

                           <select
                              onChange={(event) => {
                                 // if you make a prop static just place it in the middle of the stage
                                 if (event.target.value === "static") {
                                    setProps((props: prop[]) => {
                                       return props.map((propx) => {
                                          if (propx.id === prop.id) {
                                             return {
                                                ...propx,
                                                static: {
                                                   width: 5,
                                                   position: {
                                                      x: 0,
                                                      y: 0,
                                                   },
                                                },
                                             };
                                          }
                                          return propx;
                                       });
                                    });
                                 }

                                 setProps((props: prop[]) => {
                                    return props.map((propx) => {
                                       if (propx.id === prop.id) {
                                          return {
                                             ...propx,
                                             type: event.target.value,
                                          };
                                       }
                                       return propx;
                                    });
                                 });
                              }}
                              className="text-xs ml-auto bg-transparent"
                              value={prop.type}
                           >
                              <option value="dynamic">Dynamic</option>
                              <option value="static">Static</option>
                           </select>

                           {prop.type !== "static" ? (
                              <button
                                 onClick={() => {
                                    if (formations[selectedFormation].props?.find((p) => p.id === prop.id)) {
                                       setFormations((formations: formation[]) => {
                                          return formations.map((formation, i) => {
                                             if (i === selectedFormation) {
                                                return {
                                                   ...formation,
                                                   props: (formation.props || []).filter((propx) => propx.id !== prop.id),
                                                };
                                             }
                                             return formation;
                                          });
                                       });
                                    } else {
                                       setFormations((formations: formation[]) => {
                                          return formations.map((formation, i) => {
                                             if (i === selectedFormation) {
                                                return {
                                                   ...formation,
                                                   props: [...(formation.props || []), { id: prop.id, position: { x: 0, y: 0 }, width: 4 }],
                                                };
                                             }
                                             return formation;
                                          });
                                       });
                                    }

                                    pushChange();
                                 }}
                                 className="ml-4 mr-1"
                              >
                                 {!formations[selectedFormation].props?.find((p) => p.id === prop.id) ? (
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                       className="w-5 h-5 stroke-neutral-800 dark:stroke-neutral-200"
                                    >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                 ) : (
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                       className="w-5 h-5 stroke-neutral-800 dark:stroke-neutral-200"
                                    >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                    </svg>
                                 )}
                              </button>
                           ) : null}
                        </div>
                     );
                  })
               ) : (
                  <>
                     <p className=" px-4 text-sm">No Props</p>
                  </>
               )}
            </div>

            {!viewOnly && (
               <>
                  <p className=" font-medium mb-2 mt-6 px-4 text-sm ">Image Uploads</p>
                  <div className=" grid gap-2  grid-cols-2 px-4 overflow-scroll removeScrollBar ">
                     {propUploads.length ? (
                        [...propUploads].reverse().map((propUpload) => {
                           return (
                              <div
                                 key={propUpload.name}
                                 onClick={() => {
                                    let newId = uuidv4();
                                    if (!selectedPropIds.length) {
                                       setProps((props: prop[]) => {
                                          return [...props, { id: newId, user_id: session?.user.id, url: propUpload.name, type: "static" }];
                                       });
                                       setProps((props: prop[]) => {
                                          return props.map((propx) => {
                                             if (propx.id === newId) {
                                                return {
                                                   ...propx,
                                                   static: {
                                                      width: 5,
                                                      position: {
                                                         x: 0,
                                                         y: 0,
                                                      },
                                                   },
                                                };
                                             }
                                             return propx;
                                          });
                                       });
                                    } else {
                                       setProps((props: prop[]) => {
                                          return props.map((prop) => {
                                             if (selectedPropIds.includes(prop.id)) {
                                                return { ...prop, url: propUpload.name, user_id: session?.user.id };
                                             }
                                             return prop;
                                          });
                                       });
                                    }
                                    pushChange();
                                 }}
                                 className={` rounded-md  px-2 w-full h-[90px] relative  group  cursor-pointer   flex flex-row items-center  whitespace-nowrap  `}
                              >
                                 <img
                                    className="h-full w-full absolute object-contain left-0 top-0 z-10"
                                    src={`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${session?.user.id}/${propUpload.name}`}
                                    alt=""
                                 />
                                 <div className="w-full h-full absolute top-0 left-0 bg-black/50 opacity-0 group-hover:opacity-100 text-white   transition z-20 flex flex-row items-center justify-center flex-wrap ">
                                    {selectedPropIds.length ? (
                                       <p className="text-xs  text-center whitespace-pre-wrap ">Replace Prop Image</p>
                                    ) : (
                                       <p className="text-xs  text-center whitespace-pre-wrap ">New Prop From Image</p>
                                    )}
                                 </div>
                                 {/* <button
                                 className="ml-auto mr-2"
                                 onClick={async (e) => {
                                    e.stopPropagation();
                                    const { data, error } = await supabase.storage.from("props").remove([`${session?.user?.id}/${prop.name}`]);

                                    // await supabase.storage
                                    //    .from("props")
                                    //    .list(session?.user.id, {})
                                    //    .then((r) => {
                                    //       setAudiofiles(r);
                                    //    });
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
                              </button> */}
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
            )}
            <div className=" p-2">
               <div
                  style={{
                     opacity: selectedPropIds.length ? 1 : 0.5,
                     pointerEvents: selectedPropIds.length ? "all" : "none",
                  }}
                  onClick={(e) => {
                     // Remove prop
                     e.stopPropagation();
                     // remove prop from all formations
                     setFormations((formations: formation[]) => {
                        return formations.map((formation, i) => {
                           return {
                              ...formation,
                              props: formation.props?.filter((p) => !selectedPropIds.includes(p.id)),
                           };
                        });
                     });
                     // remove prop from props
                     setProps((props: prop[]) => {
                        return props.filter((p) => !selectedPropIds.includes(p.id));
                     });
                     setSelectedPropIds([]);
                     pushChange();
                  }}
                  className="  w-full text-sm shadow-sm cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-2 bg-red-500 dark:text-red-400 text-red-600  "
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
