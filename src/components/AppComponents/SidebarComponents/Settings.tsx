import { cloudSettings, dancer, dancerPosition, formation, localSettings, stageDimensions } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import Dropdown from "../Dropdown";
export const Settings: React.FC<{
   setLocalSettings: Function;
   localSettings: any;
   dropDownToggle: boolean;
   pushChange: Function;
   formations: formation[];
   cloudSettings: cloudSettings;
   setCloudSettings: Function;
   setFormations: Function;

   setHelpUrl: Function;
}> = ({ setLocalSettings, localSettings, dropDownToggle, pushChange, cloudSettings, setCloudSettings, setFormations, setHelpUrl }) => {
   let { previousFormationView, gridSnap, dancerStyle } = localSettings;

   const setPreviousFormationView = (val: string) => {
      setLocalSettings((settings: localSettings) => {
         return { ...settings, previousFormationView: val };
      });
   };

   const setGridSnap = (val: number) => {
      setLocalSettings((settings: localSettings) => {
         return { ...settings, gridSnap: val };
      });
   };
   const setDancerStyle = (val: string) => {
      setLocalSettings((settings: localSettings) => {
         return { ...settings, dancerStyle: val };
      });
   };

   let { stageBackground, stageDimensions } = cloudSettings;

   const changeWidth = (amount: number) => {
      // for (let i = 0; i < formations.length; i++) {
      //    for (let j = 0; j < formations[i].positions.length; j++) {
      //       if (
      //          (formations[i].positions[j]?.position.x === stageDimensions.width / 2 - 3 ||
      //             formations[i].positions[j]?.position.x === -stageDimensions.width / 2 + 3) &&
      //          amount < 0
      //       ) {
      //          toast.error("Dancers are too close to the edge");
      //          return;
      //       }
      //    }
      // }

      // move dancers that are too close to the edge
      // setFormations((formations: formation[]) => {
      //    return formations.map((formation, i) => {
      //       return {
      //          ...formation,
      //          positions: formation.positions.map((position) => {
      //             if (position.position.x < -(stageDimensions.width / 2 - 3)) {
      //                return { ...position, position: { ...position.position, x: position.position.x - amount / 2 } };
      //             }
      //             if (position.position.x > stageDimensions.width / 2 - 3) {
      //                return { ...position, position: { ...position.position, x: position.position.x + amount / 2 } };
      //             }
      //             return position;
      //          }),
      //       };
      //    });
      // });

      setCloudSettings((cloudSettings: cloudSettings) => {
         return { ...cloudSettings, stageDimensions: { ...stageDimensions, width: cloudSettings.stageDimensions.width + amount } };
      });

      pushChange();
   };

   const changeHeight = (amount: number) => {
      // check to make sure dancers won't fall off the stage
      // for (let i = 0; i < formations.length; i++) {
      //    for (let j = 0; j < formations[i].positions.length; j++) {
      //       if (
      //          (formations[i].positions[j]?.position.y === stageDimensions.height / 2 - 1 ||
      //             formations[i].positions[j]?.position.y === -stageDimensions.height / 2 + 1) &&
      //          amount < 0
      //       ) {
      //          toast.error("dancers will fall off the stage");
      //          return;
      //       }
      //    }
      // }

      setCloudSettings((cloudSettings: cloudSettings) => {
         return { ...cloudSettings, stageDimensions: { ...stageDimensions, height: cloudSettings.stageDimensions.height + amount } };
      });
      pushChange();
   };

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

   const setStageBackground = (val: string) => {
      if (val === "cheer9") {
         setCloudSettings((s) => {
            return { ...s, stageDimensions: { width: 36, height: 28 } };
         });
      }
      setCloudSettings((cloudSettings: cloudSettings) => {
         return {
            ...cloudSettings,
            stageBackground: val,
         };
      });
   };

   return (
      <>
         <Toaster></Toaster>
         <div className=" w-[260px]  min-w-[260px] hidden lg:block bg-white dark:bg-neutral-800 dark:text-white h-full  py-4 overflow-y-scroll pl-1">
            <p className=" pl-3  font-medium mb-1 text-sm flex flex-row justify-between">
               Previous Formation's Avatars{" "}
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2  cursor-pointer"
                  onClick={(e) => {
                     setHelpUrl({ url: "https://www.youtube.com/shorts/pY0IUM1ebHE", event: e });
                  }}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
               </svg>
            </p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={
                  previousFormationView === "none" ? "None" : previousFormationView === "ghostDancers" ? "Ghost Dancers" : "Ghost Dancers + Paths"
               }
               actions={[
                  () => setPreviousFormationView("none"),
                  () => setPreviousFormationView("ghostDancers"),
                  () => setPreviousFormationView("ghostDancersAndPaths"),
               ]}
               options={["None", "Ghost Dancers", "Ghost Dancers + Paths"]}
            ></Dropdown>

            {/* <hr className="my-2" /> */}

            <p className="pl-3 font-medium mb-1 text-sm mt-4">Grid Snap</p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={gridSnap === 100 ? "None" : gridSnap === 1 ? "Whole Square" : "Half Square"}
               actions={[() => setGridSnap(100), () => setGridSnap(2), () => setGridSnap(1)]}
               options={["None", "Half Square", "Whole Square"]}
            ></Dropdown>

            {/* <hr className="my-2" /> */}

            <p className="  pl-3 font-medium mb-1 text-sm mt-4">Dancer Style</p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={dancerStyle === "initials" ? "Initials" : dancerStyle === "numbered" ? "Numbered" : "Solid"}
               actions={[() => setDancerStyle("initials"), () => setDancerStyle("numbered"), () => setDancerStyle("solid")]}
               options={["Initials", "Numbered", "Solid"]}
            ></Dropdown>
            <div className="p-4">
               <p className="text-neutral-800 font-medium text-sm dark:text-neutral-200">
                  Width <span className="text-xs text-neutral-700 dark:text-neutral-400">(feet)</span>
               </p>
               <div className=" flex flex-row w-min items-center border border-neutral-200  ">
                  <button className="p-2  hover:bg-neutral-100 transition duration-300" onClick={() => changeWidth(-2)}>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                     </svg>
                  </button>

                  <p className=" px-4 border-x border-neutral-200 h-full text-neutral-700 dark:text-neutral-200 ">{stageDimensions.width}</p>

                  <button className="p-2  hover:bg-neutral-100 transition duration-300" onClick={() => changeWidth(2)}>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                     </svg>
                  </button>
               </div>

               <p className="text-neutral-800 dark:text-neutral-200 font-medium text-sm mt-6">
                  Height <span className="text-xs text-neutral-700 dark:text-neutral-400">(feet)</span>
               </p>
               <div className=" flex flex-row w-min items-center border border-neutral-200  ">
                  <button className="p-2  hover:bg-neutral-100 transition duration-300" onClick={() => changeHeight(-2)}>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                     </svg>
                  </button>

                  <p className=" px-4 border-x border-neutral-200 h-full text-neutral-700 dark:text-neutral-200">{stageDimensions.height}</p>

                  <button className="p-2  hover:bg-neutral-100 transition duration-300" onClick={() => changeHeight(2)}>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                     </svg>
                  </button>
               </div>
            </div>
            <hr />
            <div className="p-4">
               <p className="text-neutral-800 dark:text-neutral-200 font-medium text-sm mb-2">Stage Background</p>
               <Dropdown
                  dropDownToggle={dropDownToggle}
                  value={
                     cloudSettings.stageBackground === "none"
                        ? "None"
                        : cloudSettings.stageBackground === "grid"
                        ? "Grid"
                        : cloudSettings.stageBackground === "cheer9"
                        ? "Cheer Floor (9 Rolls)"
                        : "Custom"
                  }
                  options={["None", "Grid", "Cheer (9 rolls)", "Custom"]}
                  actions={[
                     () => setStageBackground("none"),
                     () => setStageBackground("grid"),
                     () => setStageBackground("cheer9"),
                     () => setStageBackground("custom"),
                  ]}
               ></Dropdown>
            </div>

            <div className="relative  text-left p-4  ">
               {stageBackground === "grid" ? (
                  <>
                     <p className="text-neutral-800 font-medium text-sm dark:text-neutral-200 mb-3">Grid Subdivisions</p>
                     <div className=" flex flex-row w-min items-center border border-neutral-200  ">
                        <button
                           className="p-2  hover:bg-neutral-100 transition duration-300"
                           onClick={() => {
                              if (cloudSettings.gridSubdivisions === 1) return;
                              setCloudSettings((cloudSettings: cloudSettings) => {
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
                              className="w-5 h-5"
                           >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                           </svg>
                        </button>

                        <p className=" px-4 border-x border-neutral-200 h-full text-neutral-700 dark:text-neutral-200">
                           {cloudSettings.gridSubdivisions}
                        </p>

                        <button
                           className="p-2  hover:bg-neutral-100 transition duration-300"
                           onClick={() => {
                              if (cloudSettings.gridSubdivisions === 15) return;
                              setCloudSettings((cloudSettings: cloudSettings) => {
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
                              className="w-5 h-5"
                           >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                           </svg>
                        </button>
                     </div>
                  </>
               ) : null}
            </div>

            {cloudSettings.stageBackground === "custom" ? (
               <div className="px-3">
                  <button className="relative border border-dashed border-neutral-300 h-24 w-full rounded-xl bg-transparent mt-4 pointer-events-none ">
                     <input
                        accept="image/png, image/gif, image/jpeg"
                        type="file"
                        autoComplete="off"
                        tabIndex={-1}
                        className="cursor-pointer relative block opacity-0 w-full h-full p-20 z-0 pointer-events-auto"
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
               </div>
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
