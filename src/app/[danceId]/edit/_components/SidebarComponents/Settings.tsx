import { cloudSettings, dancer, dancerPosition, formation, localSettings, stageDimensions } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
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
   setAssetsOpen: Function;
}> = ({ setLocalSettings, localSettings, dropDownToggle, pushChange, cloudSettings, setCloudSettings, setFormations, setHelpUrl, setAssetsOpen }) => {
   let { previousFormationView, gridSnap, dancerStyle } = localSettings;
   let { stageBackground, stageDimensions } = cloudSettings;
   const [newWidth, setNewWidth] = useState(stageDimensions.width.toString());
   const [newHeight, setNewHeight] = useState(stageDimensions.height.toString());

   useEffect(() => {
      setNewWidth(stageDimensions.width.toString());
      setNewHeight(stageDimensions.height.toString());
   }, [stageDimensions]);

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

   const setStageBackground = (val: string) => {
      if (val === "cheer9") {
         setCloudSettings((s: cloudSettings) => {
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
         <style jsx>
            {`
               input::-webkit-outer-spin-button,
               input::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
               }
            `}
         </style>
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
               <div className=" flex flex-row w-min items-center border border-neutral-200 dark:border-neutral-700 mt-2  ">
                  <button className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300" onClick={() => changeWidth(-1)}>
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
                  <input
                     value={newWidth}
                     className="px-4 py-1 h-full text-neutral-700 dark:text-neutral-200 w-24 bg-transparent transition focus:outline-none border-2 border-transparent focus:border-pink-600 rounded-sm text-center"
                     type="number"
                     step="1"
                     onChange={(e) => {
                        setNewWidth(e.target.value);
                        if (parseFloat(e.target.value) > 5) {
                           setCloudSettings((cloudSettings: cloudSettings) => {
                              return { ...cloudSettings, stageDimensions: { ...stageDimensions, width: parseFloat(e.target.value) } };
                           });
                        }
                     }}
                     onBlur={() => {
                        const newValue = parseFloat(newWidth);
                        if (newValue < 5 || !newValue) {
                           toast.error("Stage width must be at least 5 feet");
                           setNewWidth(stageDimensions.width.toString());
                           return;
                        }
                        setCloudSettings((cloudSettings: cloudSettings) => {
                           return { ...cloudSettings, stageDimensions: { ...stageDimensions, width: newValue } };
                        });
                     }}
                  />

                  <button className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300" onClick={() => changeWidth(1)}>
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
               <div className=" flex flex-row w-min items-center border border-neutral-200 dark:border-neutral-700  mt-2">
                  <button className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300" onClick={() => changeHeight(-1)}>
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

                  <input
                     value={newHeight}
                     className="px-4 py-1 h-full text-neutral-700 dark:text-neutral-200 w-24 bg-transparent transition focus:outline-none border-2 border-transparent focus:border-pink-600 rounded-sm text-center"
                     type="number"
                     step="1"
                     onChange={(e) => {
                        setNewHeight(e.target.value);
                        if (parseFloat(e.target.value) > 5) {
                           setCloudSettings((cloudSettings: cloudSettings) => {
                              return { ...cloudSettings, stageDimensions: { ...stageDimensions, height: parseFloat(e.target.value) } };
                           });
                        }
                     }}
                     onBlur={() => {
                        const newValue = parseFloat(newHeight);
                        if (newValue < 5 || !newValue) {
                           toast.error("Stage width must be at least 5 feet");
                           setNewHeight(stageDimensions.height.toString());
                           return;
                        }
                        setCloudSettings((cloudSettings: cloudSettings) => {
                           return { ...cloudSettings, stageDimensions: { ...stageDimensions, height: newValue } };
                        });
                     }}
                  />

                  <button className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300" onClick={() => changeHeight(1)}>
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
         </div>
      </>
   );
};
