import { cloudSettings, dancer, dancerPosition, formation, stageDimensions } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

export const StageSettings: React.FC<{
   setFormations: Function;
   pricingTier: string;
   formations: formation[];
   cloudSettings: any;
   setCloudSettings: Function;
   setUpgradeIsOpen: Function;
   pushChange: Function;
}> = ({ setFormations, pricingTier, formations, setCloudSettings, cloudSettings, setUpgradeIsOpen, pushChange }) => {
   const [backgroundDropdownIsOpen, setBackgroundDropdownIsOpen] = useState<boolean>();
   let { stageBackground, stageDimensions } = cloudSettings;
   const closeWindow = (e) => {
      console.log(e.target.id);
      if (e.target.id === "menu-item") return;
      setBackgroundDropdownIsOpen(false);
   };

   useEffect(() => {
      window.addEventListener("mousedown", closeWindow);
      return () => {
         window.removeEventListener("mousedown", closeWindow);
      };
   }, [backgroundDropdownIsOpen]);

   const [file, setFile] = useState<File | null>();
   const router = useRouter();
   let session = useSession();

   const supabase = useSupabaseClient();

   useEffect(() => {
      if (!file?.name) return;
      if (!isValidKey(file.name)) {
         toast.error("remove special characters from file name");
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
            supabase.storage.from("stagebackgrounds").upload(`${userId}/${file.name}`, body, {
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
            // setAudiofiles(r);
            setCloudSettings((cloudSettings: cloudSettings) => {
               return {
                  ...cloudSettings,
                  backgroundUrl: `https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/stagebackgrounds/${data.data.path}`,
               };
            });
         });
   }, [file]);

   return (
      <>
         <Toaster></Toaster>
         <div className=" w-[23%]  min-w-[350px] hidden lg:block bg-white border-r border-r-gray-300 px-6 py-6 overflow-y-scroll">
            <h1 className="h-12 font-medium text-xl">Stage Settings</h1>

            <p className="font-medium h-10">Stage Dimensions</p>

            <p className="text-gray-500 font-medium text-sm">Width</p>
            <div className="my-6 flex flex-row justify-center items-center">
               <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                  onClick={() => {
                     for (let i = 0; i < formations.length; i++) {
                        for (let j = 0; j < formations[i].positions.length; j++) {
                           if (
                              formations[i].positions[j]?.position.x === stageDimensions.width / 2 - 3 ||
                              formations[i].positions[j]?.position.x === -stageDimensions.width / 2 + 3
                           ) {
                              toast.error("dancers will fall off the stage");
                              return;
                           }
                        }
                     }

                     setFormations((formations: formation[]) => {
                        return formations.map((formation, i) => {
                           return {
                              ...formation,
                              positions: formation.positions.map((position) => {
                                 if (position.position.x < -(stageDimensions.width / 2 - 3)) {
                                    return { ...position, position: { ...position.position, x: position.position.x + 1 } };
                                 }
                                 if (position.position.x > stageDimensions.width / 2 - 3) {
                                    return { ...position, position: { ...position.position, x: position.position.x - 1 } };
                                 }
                                 return position;
                              }),
                           };
                        });
                     });
                     setCloudSettings((cloudSettings: cloudSettings) => {
                        return { ...cloudSettings, stageDimensions: { ...stageDimensions, width: cloudSettings.stageDimensions.width - 2 } };
                     });
                     pushChange();
                  }}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                  </svg>
               </button>
               <div className="flex flex-col justify-center items-center">
                  <p className="mx-6 text-2xl text-gray-700">{stageDimensions.width}</p>
                  <p className="text-gray-400 text-xs">Squares</p>
               </div>
               <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                  onClick={() => {
                     setFormations((formations: formation[]) => {
                        return formations.map((formation, i) => {
                           return {
                              ...formation,
                              positions: formation.positions.map((position) => {
                                 if (position.position.x < -(stageDimensions.width / 2 - 3)) {
                                    return { ...position, position: { ...position.position, x: position.position.x - 1 } };
                                 }
                                 if (position.position.x > stageDimensions.width / 2 - 3) {
                                    return { ...position, position: { ...position.position, x: position.position.x + 1 } };
                                 }
                                 return position;
                              }),
                           };
                        });
                     });
                     setCloudSettings((cloudSettings: cloudSettings) => {
                        return { ...cloudSettings, stageDimensions: { ...stageDimensions, width: cloudSettings.stageDimensions.width + 2 } };
                     });
                     pushChange();
                  }}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
               </button>
            </div>

            <p className="text-gray-500 font-medium text-sm">Height</p>
            <div className="my-6 flex flex-row justify-center items-center">
               <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                  onClick={() => {
                     for (let i = 0; i < formations.length; i++) {
                        for (let j = 0; j < formations[i].positions.length; j++) {
                           if (
                              formations[i].positions[j]?.position.y === stageDimensions.height / 2 - 1 ||
                              formations[i].positions[j]?.position.y === -stageDimensions.height / 2 + 1
                           ) {
                              toast.error("dancers will fall off the stage");
                              return;
                           }
                        }
                     }

                     setCloudSettings((cloudSettings) => {
                        return { ...cloudSettings, stageDimensions: { ...stageDimensions, height: cloudSettings.stageDimensions.height - 2 } };
                     });
                     pushChange();
                  }}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                  </svg>
               </button>
               <div className="flex flex-col justify-center items-center">
                  <p className="mx-6 text-2xl text-gray-700">{stageDimensions.height}</p>
                  <p className="text-gray-400 text-xs">Squares</p>
               </div>
               <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                  onClick={() => {
                     setCloudSettings((cloudSettings) => {
                        return { ...cloudSettings, stageDimensions: { ...stageDimensions, height: cloudSettings.stageDimensions.height + 2 } };
                     });
                     pushChange();
                  }}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
               </button>
            </div>

            <div className="relative mt-16 text-left  ">
               <div onClick={() => setBackgroundDropdownIsOpen((x) => !x)}>
                  <button
                     type="button"
                     className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                     id="menu-button"
                     aria-expanded="true"
                     aria-haspopup="true"
                  >
                     Stage Background
                     <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                     >
                        <path
                           fillRule="evenodd"
                           d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                           clipRule="evenodd"
                        />
                     </svg>
                  </button>
               </div>

               <div
                  className={`absolute ${
                     backgroundDropdownIsOpen ? " opacity-100 scale-100" : "transform opacity-0 scale-95 pointer-events-none "
                  } right-0 z-20 mt-2 w-full transform transition ease-out duration-100 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex={-1}
               >
                  <div className="py-1" role="none">
                     <a
                        onClick={() => {
                           if (pricingTier === "basic") {
                              setUpgradeIsOpen(true);
                              return;
                           }
                           setCloudSettings((s) => {
                              return { ...s, stageBackground: "none" };
                           });
                        }}
                        href="#"
                        className={`${
                           stageBackground === "none" ? "text-gray-900 bg-gray-100 " : ""
                        } text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
                        role="menuitem"
                        tabIndex={-1}
                        id="menu-item"
                     >
                        None
                     </a>

                     <a
                        onClick={() => {
                           setCloudSettings((s) => {
                              return { ...s, stageBackground: "grid" };
                           });
                        }}
                        href="#"
                        className={`${
                           stageBackground === "grid" ? "text-gray-900 bg-gray-100 " : ""
                        } text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
                        role="menuitem"
                        tabIndex={-1}
                        id="menu-item"
                     >
                        Grid
                     </a>
                     <a
                        onClick={() => {
                           if (pricingTier === "basic") {
                              setUpgradeIsOpen(true);
                              return;
                           }
                           setCloudSettings((s) => {
                              return { ...s, stageDimensions: { width: 36, height: 28 } };
                           });
                           setCloudSettings((s) => {
                              return { ...s, stageBackground: "cheer9" };
                           });
                        }}
                        href="#"
                        className={`${
                           stageBackground === "cheer9" ? "text-gray-900 bg-gray-100 " : ""
                        } text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
                        role="menuitem"
                        tabIndex={-1}
                        id="menu-item"
                     >
                        Cheer Floor (9 Rolls)
                     </a>
                     <a
                        onClick={() => {
                           if (pricingTier === "basic") {
                              setUpgradeIsOpen(true);
                              return;
                           }
                           setCloudSettings((s) => {
                              return { ...s, stageBackground: "custom" };
                           });
                        }}
                        href="#"
                        className={`${
                           stageBackground === "custom" ? "text-gray-900 bg-gray-100 " : ""
                        } text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
                        role="menuitem"
                        tabIndex={-1}
                        id="menu-item"
                     >
                        Custom Image Upload
                     </a>
                  </div>
               </div>

               {stageBackground === "grid" ? (
                  <>
                     {/* <grid subdivisions> */}
                     <p className="text-gray-500 font-medium text-sm mt-6">Grid Subdivisions</p>
                     <div className="my-6 flex flex-row justify-center items-center">
                        <button
                           className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                           onClick={() => {
                              if (pricingTier === "basic") {
                                 setUpgradeIsOpen(true);
                                 return;
                              }
                              if (cloudSettings.gridSubdivisions === 1) return;
                              setCloudSettings((cloudSettings) => {
                                 return { ...cloudSettings, gridSubdivisions: cloudSettings.gridSubdivisions - 1 };
                              });
                           }}
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                           >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                           </svg>
                        </button>
                        <div className="flex flex-col justify-center items-center">
                           <p className="mx-6 text-2xl text-gray-700">{cloudSettings.gridSubdivisions}</p>
                           <p className="text-gray-400 text-xs">Squares</p>
                        </div>
                        <button
                           className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                           onClick={() => {
                              if (pricingTier === "basic") {
                                 setUpgradeIsOpen(true);
                                 return;
                              }
                              if (cloudSettings.gridSubdivisions === 15) return;
                              setCloudSettings((cloudSettings) => {
                                 return { ...cloudSettings, gridSubdivisions: cloudSettings.gridSubdivisions + 1 };
                              });
                           }}
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                           >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                           </svg>
                        </button>
                     </div>
                  </>
               ) : null}
            </div>

            {cloudSettings.stageBackground === "custom" ? (
               <button className="relative border border-dashed border-gray-300 h-24 w-full rounded-xl bg-gray-50 mt-4 ">
                  <input
                     accept="image/png, image/gif, image/jpeg"
                     type="file"
                     autoComplete="off"
                     tabIndex={-1}
                     className="cursor-pointer relative block opacity-0 w-full h-full p-20 z-10"
                     onChange={(event) => {
                        if (event.target.files && event.target.files[0]) {
                           const i = event.target.files[0];

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
                     <p className="text-sm">Upload A Stage Background</p>
                  </div>
               </button>
            ) : null}
         </div>
      </>
   );
};

function isValidKey(key: string): boolean {
   // only allow s3 safe characters and characters which require special handling for now
   // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
   return /^(\w|\/|!|-|\.|\*|'|\(|\)| |&|\$|@|=|;|:|\+|,|\?)*$/.test(key);
}
