import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { cloudSettings, item, prop } from "../../../../../types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthSession } from "@supabase/supabase-js";
import { useStore } from "../../store";
import { v4 as uuidv4 } from "uuid";
export const Assets: React.FC<{
   setAssetsOpen: Function;
   propUploads: any[];
   invalidatePropUploads: Function;
   pushChange: Function;
   assetsOpen: false | string;
   menuOpen: string;
   session: AuthSession | null;
}> = ({ setAssetsOpen, propUploads, invalidatePropUploads, pushChange, assetsOpen, menuOpen, session }) => {
   const { setProps, props, setItems, items, setCloudSettings, cloudSettings } = useStore();
   const [file, setFile] = useState<File | null>();
   const [selectedAsset, setSelectedAsset] = useState(null);
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

      reader.readAsDataURL(file);

      body.append("file", file);

      let userId = session?.user?.id;
      // ?q=${Math.floor(Math.random() * 10000)}
      toast
         .promise(
            supabase.storage.from("props").upload(`${userId}/${file.name}`, body, {
               // cacheControl: "no-cache",
               upsert: true,
            }),
            {
               loading: "Uploading file...",
               success: <b>File uploaded!</b>,
               error: <b>Could not upload file.</b>,
            }
         )
         .then((data) => {
            // invalidatePropUploads();
            // setSelectedAsset(file.name);
            assignAsset("dummy", file.name);
            invalidatePropUploads();
         });
   }, [file]);

   const deleteAsset = async () => {
      if (!selectedAsset) return;
      const { data, error } = await supabase.storage.from("props").remove([`${session?.user?.id}/${selectedAsset}`]);
      if (!error) {
         toast.success("Deleted file");
         // setAssetsOpen(false);
      }
      invalidatePropUploads();
   };

   const assignAsset = (e, id) => {
      if (assetsOpen === "stagebackground") {
         setCloudSettings({
            ...cloudSettings,
            backgroundUrl: `https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${session?.user.id}/${id || selectedAsset}`,
         });

         // https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/f30197ba-cf06-4234-bcdb-5d40d83c7999/9f329a54be612ce08547a650ddb05424651c24f4-5102x2487.webp
         // https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/stagebackgrounds/f30197ba-cf06-4234-bcdb-5d40d83c7999/demoFigma.png
      }

      if (menuOpen === "props") {
         if (!session?.user.id) return;
         if (assetsOpen === "newProp") {
            setProps([
               ...props,
               {
                  id: uuidv4(),
                  type: "static",
                  url: `${id || selectedAsset}`,
                  user_id: session?.user?.id,
                  static: {
                     width: 5,
                     position: {
                        x: 0,
                        y: 0,
                     },
                  },
               },
            ]);
         } else {
            setProps(
               props.map((prop: prop) => {
                  if (prop.id === assetsOpen) {
                     return {
                        ...prop,
                        url: `${id || selectedAsset}`,
                        user_id: session?.user.id,
                     };
                  }
                  return prop;
               })
            );
         }
      }

      if (menuOpen === "items") {
         if (assetsOpen === "newItem") {
            setItems([...items, { id: uuidv4(), name: "New prop", url: `${session?.user.id}/${id || selectedAsset}` }]);
         } else {
            setItems(
               items.map((item: item) => {
                  if (item.id === assetsOpen) {
                     return {
                        ...item,
                        url: `${session?.user.id}/${id || selectedAsset}`,
                     };
                  }
                  return item;
               })
            );
         }
      }

      pushChange();
      setAssetsOpen(false);
   };
   return (
      <>
         <Toaster></Toaster>
         <div
            onClick={(e) => {
               if (e.target.id === "outside") {
                  setAssetsOpen(false);
               }
            }}
            id="outside"
            className="fixed top-0 left-0 z-[70] flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
         >
            <div className="w-2/3 h-[560px] bg-neutral-800/90 border border-neutral-500  rounded-xl  text-sm  text-white  flex flex-col  items-center">
               <div className="w-full h-12 border-b border-b-neutral-500 flex flex-row items-center px-6">
                  <p className="font-semibold"> My assets</p>
               </div>

               <div className="flex flex-row items-center cursor-pointer justify-between mr-auto p-6">
                  <div className="flex flex-col  cursor-pointer  ">
                     <div className="text-xl font-medium  cursor-pointer flex flex-row justify-between items-center">
                        <button className="text-sm w-30 font-normal relative cursor-pointer">
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

               <div className=" grid gap-2  grid-cols-8 p-4 overflow-scroll w-full removeScrollBar ">
                  {propUploads.length ? (
                     [...propUploads].reverse().map((propUpload) => {
                        return (
                           <div
                              style={{
                                 borderColor: selectedAsset === propUpload.name ? "#db2777" : "transparent",
                              }}
                              onDoubleClick={assignAsset}
                              key={propUpload.name}
                              onClick={() => {
                                 setSelectedAsset(propUpload.name);
                                 //  let newId = uuidv4();
                                 //  if (!selectedPropIds.length) {
                                 //     setProps((props: prop[]) => {
                                 //        return [...props, { id: newId, url: `${propUpload.name}`, user_id: session?.user.id, type: "static" }];
                                 //     });
                                 //     setProps((props: prop[]) => {
                                 //        return props.map((propx) => {
                                 //           if (propx.id === newId) {
                                 //              return {
                                 //                 ...propx,
                                 //                 static: {
                                 //                    width: 5,
                                 //                    position: {
                                 //                       x: 0,
                                 //                       y: 0,
                                 //                    },
                                 //                 },
                                 //              };
                                 //           }
                                 //           return propx;
                                 //        });
                                 //     });
                                 //  } else {
                                 //     setProps((props: prop[]) => {
                                 //        return props.map((prop) => {
                                 //           if (selectedPropIds.includes(prop.id)) {
                                 //              return { ...prop, url: `${propUpload.name}`, user_id: session?.user.id };
                                 //           }
                                 //           return prop;
                                 //        });
                                 //     });
                                 //  }
                                 //  pushChange();
                              }}
                              className={` rounded-md border-2   px-2 w-full h-[90px] relative  group  cursor-pointer   flex flex-row items-center  whitespace-nowrap  `}
                           >
                              <img
                                 className="h-full w-full absolute object-contain left-0 top-0 z-10"
                                 src={`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${session?.user.id}/${propUpload.name}`}
                                 alt=""
                              />

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
                        <p className=" text-sm ">No Uploaded Images</p>
                     </>
                  )}
               </div>
               <div className="w-full border-t border-neutral-500 mt-auto h-12 flex flex-row items-center px-4">
                  <div
                     style={{
                        opacity: selectedAsset ? 1 : 0.7,
                        pointerEvents: selectedAsset ? "auto" : "none",
                     }}
                     className="w-full flex flex-row"
                  >
                     <button onClick={deleteAsset} className="bg-pink-600 px-3 py-2 text-white rounded-md text-sm">
                        Delete image
                     </button>
                     <button onClick={assignAsset} className="bg-pink-600 px-3 ml-auto py-2 text-white rounded-md text-sm">
                        Use image
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

function isValidKey(key: string): boolean {
   // only allow s3 safe characters and characters which require special handling for now
   // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
   return /^(\w|\/|!|-|\.|\*|'|\(|\)| |&|\$|@|=|;|:|\+|,|\?)*$/.test(key);
}
