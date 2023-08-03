import { cloudSettings, dancer, dancerPosition, formation, item, localSettings, PIXELS_PER_SECOND } from "../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Dropdown from "./Dropdown";
export const ObjectControls: React.FC<{
   soundCloudTrackId: string | null;
   setSelectedFormation: Function;
   player: any;
   isPlaying: boolean;
   setIsPlaying: Function;
   formations: formation[];
   position: number | null;
   setFormations: Function;
   songDuration: number | null;
   selectedFormation: number | null;
   viewOnly: boolean;
   addToStack: Function;
   pushChange: Function;
   setPixelsPerSecond: Function;
   pixelsPerSecond: number;
   localSource: string | null;
   setPlaybackRate: Function;
   localSettings: localSettings;
   setLocalSettings: Function;
   isChangingZoom: boolean;
   setIsChangingZoom: Function;
   zoom: number;
   selectedDancers: string[];
   cloudSettings: cloudSettings;
   dropDownToggle: boolean;
   items: item[];
   dancers: dancer[];
   viewOnlyInitial: boolean;
}> = ({
   soundCloudTrackId,
   setSelectedFormation,
   player,
   isPlaying,
   setIsPlaying,
   formations,
   position,
   setFormations,
   songDuration,
   selectedFormation,
   viewOnly,
   addToStack,
   pushChange,
   setPixelsPerSecond,
   pixelsPerSecond,
   localSource,
   setPlaybackRate,
   localSettings,
   setLocalSettings,
   isChangingZoom,
   setIsChangingZoom,
   zoom,
   selectedDancers,
   cloudSettings,
   dropDownToggle,
   items,
   dancers,
   viewOnlyInitial,
}) => {
   const setLinear = () => {
      setFormations((formations: formation[]) => {
         return formations.map((formation, index: number) => {
            if (index === selectedFormation) {
               return {
                  ...formation,
                  positions: formation.positions.map((dancerPosition) => {
                     if (selectedDancers.includes(dancerPosition.id)) {
                        return {
                           ...dancerPosition,
                           transitionType: "linear",
                        };
                     }
                     return dancerPosition;
                  }),
               };
            }
            return formation;
         });
      });
      pushChange();
   };

   const setTeleport = () => {
      setFormations((formations: formation[]) => {
         return formations.map((formation, index: number) => {
            if (index === selectedFormation) {
               return {
                  ...formation,
                  positions: formation.positions.map((dancerPosition) => {
                     if (selectedDancers.includes(dancerPosition.id)) {
                        return {
                           ...dancerPosition,
                           transitionType: "teleport",
                        };
                     }
                     return dancerPosition;
                  }),
               };
            }
            return formation;
         });
      });
      pushChange();
   };

   const setCurved = () => {
      selectedDancers.forEach((selectedDancer) => {
         setFormations((formations: formation[]) => {
            let start = formations[selectedFormation - 1]?.positions.find((dancerPosition) => dancerPosition.id === selectedDancer)?.position;

            let end = formations[selectedFormation]?.positions.find((dancerPosition) => dancerPosition.id === selectedDancer)?.position;
            if (!start || !end) return;

            const getMidpoint = (x1: number, y1: number, x2: number, y2: number) => ({
               x: (x1 + x2) / 2,
               y: (y1 + y2) / 2,
            });
            const getSlope = (x1: number, y1: number, x2: number, y2: number) => {
               if (x2 === x1) {
                  return undefined;
               }
               if (y2 === y1) {
                  return 0;
               }
               return (y2 - y1) / (x2 - x1);
            };

            let midpoint = getMidpoint(start.x, start.y, end.x, end.y);
            let slope = getSlope(start.x, start.y, end.x, end.y);
            let controlPointStart = (() => {
               if (slope === undefined) {
                  return { x: midpoint.x + 0.25, y: midpoint.y };
               }
               if (slope === 0) {
                  return { x: midpoint.x, y: midpoint.y + 0.25 };
               }
               return { x: midpoint.x + slope / 4, y: midpoint.y + 1 / slope / 4 };
            })();
            let controlPointEnd = (() => {
               if (slope === undefined) {
                  return { x: midpoint.x - 0.25, y: midpoint.y };
               }
               if (slope === 0) {
                  return { x: midpoint.x, y: midpoint.y - 0.25 };
               }
               return { x: midpoint.x - slope / 4, y: midpoint.y - 1 / slope / 4 };
            })();

            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
                  return {
                     ...formation,

                     positions: formation.positions.map((dancerPosition) => {
                        if (dancerPosition.id === selectedDancer) {
                           return {
                              ...dancerPosition,
                              transitionType: "cubic",
                              controlPointStart,
                              controlPointEnd,
                           };
                        }
                        return dancerPosition;
                     }),
                  };
               }
               return formation;
            });
         });
      });
      pushChange();
   };
   let { stageDimensions, stageBackground } = cloudSettings;
   const pathSelectionDropdownValue = () => {
      if (selectedFormation === null || !selectedDancers.length) return "";
      let dancers = formations[selectedFormation]?.positions.filter((position) => selectedDancers.includes(position.id));
      if (!dancers?.length) return "";

      if (dancers.every((position) => position.transitionType === "linear" || !position.transitionType)) {
         return "Straight";
      }
      if (dancers.every((position) => position.transitionType === "teleport" || !position.transitionType)) {
         return "Teleport";
      }
      if (dancers.every((position) => position.transitionType === "cubic")) {
         return "Curved";
      }
      return "Mixed";
   };

   const itemSelectionDropdownValue = () => {
      if (selectedFormation === null || !selectedDancers.length) return "";
      let dancers = formations[selectedFormation]?.positions.filter((position) => selectedDancers.includes(position.id));
      if (!dancers?.length) return "";
      if (dancers.every((dancer) => !dancer.itemId)) {
         return "No prop";
      }
      if (dancers.every((dancer) => dancer.itemId === dancers[0].itemId)) {
         return items.find((item) => item.id === dancers[0].itemId)?.name || "";
      }
      return "Mixed";
   };

   const setDancerItem = (itemId: string | null) => {
      setFormations((formations: formation[]) => {
         return formations.map((formation, index: number) => {
            if (index === selectedFormation) {
               return {
                  ...formation,
                  positions: formation.positions.map((dancerPosition) => {
                     if (selectedDancers.includes(dancerPosition.id)) {
                        return {
                           ...dancerPosition,
                           itemId: itemId || null,
                        };
                     }
                     return dancerPosition;
                  }),
               };
            }
            return formation;
         });
      });
      pushChange();
   };

   return (
      <>
         <div
            style={{
               pointerEvents: viewOnlyInitial ? "none" : "auto",
            }}
            className="w-full h-[40px] min-h-[40px] max-h-[40px] border-b-neutral-300 border-b bg-white flex flex-row items-center  px-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
         >
            <p className="text-sm mr-auto font-bold">
               {selectedDancers.length === 1
                  ? dancers.find((dancer) => dancer.id === selectedDancers[0])?.name
                  : selectedDancers.length === 0
                  ? ""
                  : "Multiple dancers selected"}
            </p>
            {selectedDancers.length && selectedFormation !== null ? (
               <>
                  {selectedDancers.length === 2 ? (
                     <button
                        onClick={() => {
                           // swap the positions of the two dancers
                           const positions = selectedDancers.map((dancerId) => {
                              return formations[selectedFormation]?.positions.find((dancerPosition: dancerPosition) => dancerPosition.id === dancerId)
                                 .position;
                           });

                           setFormations((formations: formation[]) => {
                              return formations.map((formation, index: number) => {
                                 if (index === selectedFormation) {
                                    return {
                                       ...formation,
                                       positions: formation.positions.map((dancerPosition) => {
                                          if (selectedDancers.includes(dancerPosition.id)) {
                                             return {
                                                ...dancerPosition,
                                                position: positions[0] === dancerPosition.position ? positions[1] : positions[0],
                                             };
                                          }
                                          return dancerPosition;
                                       }),
                                    };
                                 }
                                 return formation;
                              });
                           });
                        }}
                        className="flex flex-row justify-between dark:text-neutral-300 text-neutral-500 hover:text-black dark:hover:text-white transition items-center px-5"
                     >
                        <p className="text-xs font-semibold mr-3">Swap 2 Positions</p>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-5 h-5"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                           />
                        </svg>
                     </button>
                  ) : null}
                  <div
                     style={{
                        pointerEvents: selectedFormation === 0 ? "none" : "auto",
                        opacity: selectedFormation === 0 ? 0.5 : 1,
                     }}
                     className="flex flex-row justify-between items-center px-5"
                  >
                     <p className="text-xs font-semibold mr-3">Path</p>
                     <Dropdown
                        dropDownToggle={dropDownToggle}
                        icon={`<svg xmlns="http://www.w3.org/2000/svg"   viewBox="0 96 960 960">
                              <path fill="black" d="M766 936q-41 0-71.5-24.5T656 852H443q-66 0-109.5-43.5T290 699q0-66 43.5-109.5T443 546h77q41 0 67-26t26-67q0-41-26-67t-67-26H304q-9 35-39 59.5T194 444q-48 0-81-33t-33-81q0-48 33-81t81-33q41 0 71 24.5t39 59.5h216q66 0 109.5 43.5T673 453q0 66-43.5 109.5T520 606h-77q-41 0-67 26t-26 67q0 41 26 67t67 26h213q9-35 39-59.5t71-24.5q48 0 81 33t33 81q0 48-33 81t-81 33ZM194 384q23 0 38.5-15.5T248 330q0-23-15.5-38.5T194 276q-23 0-38.5 15.5T140 330q0 23 15.5 38.5T194 384Z"/>
                            </svg>`}
                        value={pathSelectionDropdownValue()}
                        icons={[
                           `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
               <path fill="white" d="M170 666q-37.8 0-63.9-26.141t-26.1-64Q80 538 106.1 512t63.9-26q29.086 0 52.543 17T255 546h625v60H255q-9 26-32.457 43T170 666Z"/>
               </svg>`,
                           `<svg xmlns="http://www.w3.org/2000/svg"   viewBox="0 96 960 960">
  <path fill="white" d="M766 936q-41 0-71.5-24.5T656 852H443q-66 0-109.5-43.5T290 699q0-66 43.5-109.5T443 546h77q41 0 67-26t26-67q0-41-26-67t-67-26H304q-9 35-39 59.5T194 444q-48 0-81-33t-33-81q0-48 33-81t81-33q41 0 71 24.5t39 59.5h216q66 0 109.5 43.5T673 453q0 66-43.5 109.5T520 606h-77q-41 0-67 26t-26 67q0 41 26 67t67 26h213q9-35 39-59.5t71-24.5q48 0 81 33t33 81q0 48-33 81t-81 33ZM194 384q23 0 38.5-15.5T248 330q0-23-15.5-38.5T194 276q-23 0-38.5 15.5T140 330q0 23 15.5 38.5T194 384Z"/>
</svg>`,
                           `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
<path fill="white" d="m794 922-42-42 73-74H620v-60h205l-73-74 42-42 146 146-146 146ZM340 686q51.397 0 92.699-24Q474 638 499 598q-34-26-74.215-39t-85-13Q295 546 255 559t-74 39q25 40 66.301 64 41.302 24 92.699 24Zm.089-200Q369 486 389.5 465.411q20.5-20.588 20.5-49.5Q410 387 389.411 366.5q-20.588-20.5-49.5-20.5Q311 346 290.5 366.589q-20.5 20.588-20.5 49.5Q270 445 290.589 465.5q20.588 20.5 49.5 20.5ZM340 897q133-121 196.5-219.5T600 504q0-117.79-75.292-192.895Q449.417 236 340 236t-184.708 75.105Q80 386.21 80 504q0 75 65 173.5T340 897Zm0 79Q179 839 99.5 721.5T20 504q0-150 96.5-239T340 176q127 0 223.5 89T660 504q0 100-79.5 217.5T340 976Zm0-410Z"/>
</svg>`,
                        ]}
                        options={["Straight", "Curved", "Teleport"]}
                        actions={[setLinear, setCurved, setTeleport]}
                     ></Dropdown>
                  </div>
                  <div
                     style={
                        {
                           // pointerEvents: selectedFormation === 0 ? "none" : "auto",
                           // opacity: selectedFormation === 0 ? 0.5 : 1,
                        }
                     }
                     className="flex flex-row justify-between items-center px-5 "
                  >
                     <p className="text-xs font-semibold mr-3">Prop</p>
                     {/* <select onChange={(e) => {}} value={itemSelectionDropdownValue()} className=" focus:outline-none text-sm mr-3">
                                 {items.map((item: item) => {
                                    return <option value={item.id}>{item.name}</option>;
                                 })}
                                 <option value={"no prop"}>No prop</option>
                                 <option value={"mixed"}>Mixed</option>
                              </select> */}
                     <Dropdown
                        dropDownToggle={dropDownToggle}
                        icon={`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                 <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                               </svg>
                               `}
                        value={itemSelectionDropdownValue()}
                        //                                  icons={[
                        //                                     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                        //                <path fill="white" d="M170 666q-37.8 0-63.9-26.141t-26.1-64Q80 538 106.1 512t63.9-26q29.086 0 52.543 17T255 546h625v60H255q-9 26-32.457 43T170 666Z"/>
                        //                </svg>`,
                        //                                     `<svg xmlns="http://www.w3.org/2000/svg"   viewBox="0 96 960 960">
                        //   <path fill="white" d="M766 936q-41 0-71.5-24.5T656 852H443q-66 0-109.5-43.5T290 699q0-66 43.5-109.5T443 546h77q41 0 67-26t26-67q0-41-26-67t-67-26H304q-9 35-39 59.5T194 444q-48 0-81-33t-33-81q0-48 33-81t81-33q41 0 71 24.5t39 59.5h216q66 0 109.5 43.5T673 453q0 66-43.5 109.5T520 606h-77q-41 0-67 26t-26 67q0 41 26 67t67 26h213q9-35 39-59.5t71-24.5q48 0 81 33t33 81q0 48-33 81t-81 33ZM194 384q23 0 38.5-15.5T248 330q0-23-15.5-38.5T194 276q-23 0-38.5 15.5T140 330q0 23 15.5 38.5T194 384Z"/>
                        // </svg>`,
                        //                                     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                        // <path fill="white" d="m794 922-42-42 73-74H620v-60h205l-73-74 42-42 146 146-146 146ZM340 686q51.397 0 92.699-24Q474 638 499 598q-34-26-74.215-39t-85-13Q295 546 255 559t-74 39q25 40 66.301 64 41.302 24 92.699 24Zm.089-200Q369 486 389.5 465.411q20.5-20.588 20.5-49.5Q410 387 389.411 366.5q-20.588-20.5-49.5-20.5Q311 346 290.5 366.589q-20.5 20.588-20.5 49.5Q270 445 290.589 465.5q20.588 20.5 49.5 20.5ZM340 897q133-121 196.5-219.5T600 504q0-117.79-75.292-192.895Q449.417 236 340 236t-184.708 75.105Q80 386.21 80 504q0 75 65 173.5T340 897Zm0 79Q179 839 99.5 721.5T20 504q0-150 96.5-239T340 176q127 0 223.5 89T660 504q0 100-79.5 217.5T340 976Zm0-410Z"/>
                        // </svg>`,
                        //                                  ]}
                        options={[...items.map((item) => item.name), "No prop"]}
                        actions={[...items.map((item: item) => () => setDancerItem(item.id)), () => setDancerItem(null)]}
                     ></Dropdown>
                  </div>
               </>
            ) : null}

            {/* {!viewOnly ? <div className="mt-auto p-2"></div> : null} */}
         </div>
      </>
   );
};
