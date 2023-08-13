import { cloudSettings, dancer, dancerPosition, formation, localSettings, stageDimensions } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
export const StageSettings: React.FC<{
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
   let { stageBackground, stageDimensions } = cloudSettings;
   const [newWidth, setNewWidth] = useState(stageDimensions.width.toString());
   const [newHeight, setNewHeight] = useState(stageDimensions.height.toString());

   useEffect(() => {
      setNewWidth(stageDimensions.width.toString());
      setNewHeight(stageDimensions.height.toString());
   }, [stageDimensions]);

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
            return { ...s, stageDimensions: { width: 36, height: 28 }, gridSubdivisions: 9 };
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
         <div className=" w-[260px]  min-w-[260px] hidden lg:block bg-white dark:bg-neutral-800 dark:text-white h-full  py-4 overflow-y-scroll overflow-x-hidden">
            <div className=" px-4">
               <p className="text-sm font-medium">Stage Dimensions (feet)</p>
               <div className="flex flex-col   ">
                  {/* <p className="text-neutral-800 font-medium text-sm dark:text-neutral-200">Width</p> */}
                  <div className=" flex flex-row  items-center border border-neutral-200 dark:border-neutral-700 mt-2  w-min">
                     <p className="p-2 text-xs">Width</p>
                     <button className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300" onClick={() => changeWidth(-1)}>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-4 h-4"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                        </svg>
                     </button>
                     <input
                        value={newWidth}
                        className="py-1 h-full text-xs w-7 text-neutral-700 dark:text-neutral-200 bg-transparent transition focus:outline-none border-2 border-transparent focus:border-pink-600 rounded-sm text-center"
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
                           className="w-4 h-4"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                     </button>
                  </div>

                  <div className=" flex flex-row items-center border border-neutral-200 dark:border-neutral-700  mt-2 w-min">
                     <p className="p-2 text-xs">Height</p>
                     <button
                        className="p-2  hover:bg-neutral-100  dark:hover:bg-neutral-700 transition duration-300"
                        onClick={() => changeHeight(-1)}
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-4 h-4"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                        </svg>
                     </button>

                     <input
                        value={newHeight}
                        className=" py-1 h-full text-xs w-7 text-neutral-700 dark:text-neutral-200 bg-transparent transition focus:outline-none border-2 border-transparent focus:border-pink-600 rounded-sm text-center"
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
                           className="w-4 h-4"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                     </button>
                  </div>
               </div>

               <p className="text-neutral-800 dark:text-neutral-200 font-medium text-sm mb-2 mt-3">Stage Background</p>
               <Dropdown
                  dropDownToggle={dropDownToggle}
                  value={
                     cloudSettings.stageBackground === "none"
                        ? "None"
                        : cloudSettings.stageBackground === "grid"
                        ? "Grid"
                        : cloudSettings.stageBackground === "cheer9"
                        ? "Cheer (9 Rolls)"
                        : cloudSettings.stageBackground === "gridfluid"
                        ? "Fluid Grid"
                        : "Custom"
                  }
                  options={["None", "Grid", "Cheer (9 rolls)", "Custom", "Fluid Grid"]}
                  actions={[
                     () => setStageBackground("none"),
                     () => setStageBackground("grid"),
                     () => setStageBackground("cheer9"),
                     () => setStageBackground("custom"),
                     () => setStageBackground("gridfluid"),
                  ]}
               ></Dropdown>
               <div className="mb-3"></div>
            </div>

            <hr className=" border-neutral-700" />

            {stageBackground === "gridfluid" || stageBackground === "cheer9" ? (
               <>
                  <>
                     <div className="relative  text-left  p-4">
                        <p className=" font-medium text-sm mb-3">Stage Lines</p>

                        <div className=" flex flex-row  items-center border border-neutral-200 dark:border-neutral-700 mt-2  w-min ">
                           <p className="p-2 text-xs">Vertical</p>
                           <button
                              className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300"
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
                                 className="w-4 h-4"
                              >
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                              </svg>
                           </button>
                           <p className=" px-4 text-xs  h-full text-neutral-700 dark:text-neutral-200">{cloudSettings.gridSubdivisions}</p>

                           <button
                              className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300"
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
                                 className="w-4 h-4"
                              >
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                           </button>
                        </div>

                        <div className=" flex flex-row  items-center border border-neutral-200 dark:border-neutral-700 mt-2  w-min ">
                           <p className="p-2 text-xs">Horizontal</p>
                           <button
                              className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300"
                              onClick={() => {
                                 if (cloudSettings.horizontalGridSubdivisions === 1) return;
                                 setCloudSettings((cloudSettings: cloudSettings) => {
                                    return { ...cloudSettings, horizontalGridSubdivisions: cloudSettings.horizontalGridSubdivisions - 1 };
                                 });
                              }}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-4 h-4"
                              >
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                              </svg>
                           </button>
                           <p className=" px-4 text-xs  h-full text-neutral-700 dark:text-neutral-200">{cloudSettings.horizontalGridSubdivisions}</p>

                           <button
                              className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300"
                              onClick={() => {
                                 if (cloudSettings.gridSubdivisions === 15) return;
                                 setCloudSettings((cloudSettings: cloudSettings) => {
                                    return { ...cloudSettings, horizontalGridSubdivisions: cloudSettings.horizontalGridSubdivisions + 1 };
                                 });
                              }}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-4 h-4"
                              >
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                           </button>
                        </div>

                        <p className="text-sm font-medium mb-3 mt-3">Subdivisions (grid snap)</p>

                        <div className=" flex flex-row  items-center border border-neutral-200 dark:border-neutral-700 mt-2  w-min ">
                           <p className="p-2 text-xs">Vertical</p>
                           <button
                              className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300"
                              onClick={() => {
                                 if (cloudSettings.verticalFineDivisions === 1) return;
                                 setCloudSettings((cloudSettings: cloudSettings) => {
                                    return { ...cloudSettings, verticalFineDivisions: cloudSettings.verticalFineDivisions - 1 };
                                 });
                              }}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-4 h-4"
                              >
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                              </svg>
                           </button>
                           <p className=" px-4 text-xs  h-full text-neutral-700 dark:text-neutral-200">{cloudSettings.verticalFineDivisions}</p>

                           <button
                              className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300"
                              onClick={() => {
                                 if (cloudSettings.verticalFineDivisions === 15) return;
                                 setCloudSettings((cloudSettings: cloudSettings) => {
                                    return { ...cloudSettings, verticalFineDivisions: cloudSettings.verticalFineDivisions + 1 };
                                 });
                              }}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-4 h-4"
                              >
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                           </button>
                        </div>

                        <div className=" flex flex-row  items-center border border-neutral-200 dark:border-neutral-700 mt-2  w-min ">
                           <p className="p-2 text-xs">Horizontal</p>
                           <button
                              className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300"
                              onClick={() => {
                                 if (cloudSettings.horizontalFineDivisions === 1) return;
                                 setCloudSettings((cloudSettings: cloudSettings) => {
                                    return { ...cloudSettings, horizontalFineDivisions: cloudSettings.horizontalFineDivisions - 1 };
                                 });
                              }}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-4 h-4"
                              >
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                              </svg>
                           </button>
                           <p className=" px-4 text-xs  h-full text-neutral-700 dark:text-neutral-200">{cloudSettings.horizontalFineDivisions}</p>

                           <button
                              className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300"
                              onClick={() => {
                                 if (cloudSettings.horizontalFineDivisions === 15) return;
                                 setCloudSettings((cloudSettings: cloudSettings) => {
                                    return { ...cloudSettings, horizontalFineDivisions: cloudSettings.horizontalFineDivisions + 1 };
                                 });
                              }}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-4 h-4"
                              >
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                           </button>
                        </div>
                     </div>
                  </>
               </>
            ) : null}

            {stageBackground === "grid" ? (
               <>
                  <div className=" flex flex-row  items-center border border-neutral-200 dark:border-neutral-700 mt-2 ml-4 w-min ">
                     <p className="p-2 text-xs">Subdivisions</p>
                     <button
                        className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300"
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
                           className="w-4 h-4"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                        </svg>
                     </button>
                     <p className=" px-4 text-xs  h-full text-neutral-700 dark:text-neutral-200">{cloudSettings.gridSubdivisions}</p>

                     <button
                        className="p-2  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-300"
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
                           className="w-4 h-4"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                     </button>
                  </div>
               </>
            ) : null}

            {cloudSettings.stageBackground === "custom" ? (
               <>
                  {cloudSettings.backgroundUrl ? (
                     <div className=" mx-auto border  border-solid   relative">
                        <div
                           onClick={() => {
                              setAssetsOpen("stagebackground");
                           }}
                           className="opacity-0  hover:opacity-100  cursor-pointer transition left-0 top-0 absolute h-full w-full bg-black/40 grid place-items-center"
                        >
                           Replace
                        </div>
                        <img className="w-full " src={cloudSettings.backgroundUrl} alt="" />
                     </div>
                  ) : (
                     <div className="grid place-items-center">
                        <button
                           onClick={() => {
                              setAssetsOpen("stagebackground");
                           }}
                        >
                           Upload image
                        </button>
                     </div>
                  )}
               </>
            ) : null}
         </div>
      </>
   );
};
