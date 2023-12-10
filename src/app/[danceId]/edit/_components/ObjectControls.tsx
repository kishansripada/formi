import { dancer, dancerPosition, item, localSettings } from "../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { PopoverPicker } from "./ColorPicker";
import { useStore } from "../store";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "../../../../../@/components/ui/dropdown-menu";

import { Input } from "../../../../../@/components/ui/input";
import { VStack } from "../../../../../@/components/ui/stacks";
import PropertyAdd from "../../../../../@/components/PropertyAdd";
import { HDivider } from "../../../../../@/components/ui/hdivider";

const RemovePropertyButton = ({
   setSelectedPositionProperty,
   propertyKey,
   viewOnly,
}: {
   setSelectedPositionProperty: Function;
   propertyKey: string;
   viewOnly: boolean;
}) => {
   if (viewOnly) return <></>;
   return (
      <button
         onClick={() => {
            setSelectedPositionProperty(propertyKey, null);
         }}
         className="  md:text-xs text-[10px] hover:bg-neutral-800 p-1  cursor-default "
      >
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
         </svg>
      </button>
   );
};

export const ObjectControls: React.FC<{
   setLocalSettings: Function;
   dancers: dancer[];
   selectedDancers: string[];
   setAssetsOpen: Function;
   setMenuOpen: Function;
}> = ({ selectedDancers, dancers, setLocalSettings, setAssetsOpen, setMenuOpen }) => {
   const {
      formations,
      setFormations,
      viewOnly,
      items,
      selectedFormations,
      getFirstSelectedFormation,
      get,
      imageBlobs,
      cloudSettings,
      setSelectedPositionProperty,
      getSelectedPositionsProperty,
      newGroupOnSelectedFormation,
      pauseHistory,
      resumeHistory,
   } = useStore();

   const setCurved = () => {
      if (viewOnly) return;
      selectedFormations.forEach((selectedFormation: string) => {
         const formationIndex = formations.findIndex((formation) => formation.id === selectedFormation);
         // console.log({ formationIndex });
         selectedDancers.forEach((selectedDancer) => {
            let start = formations[formationIndex - 1]?.positions.find((dancerPosition) => dancerPosition.id === selectedDancer)?.position;

            let end = formations[formationIndex]?.positions.find((dancerPosition) => dancerPosition.id === selectedDancer)?.position;
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

            setFormations(
               get().formations.map((formation, index: number) => {
                  if (formation.id === selectedFormation) {
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
               })
            );
         });
      });
   };

   const pathSelectionDropdownValue = () => {
      if (!selectedFormations.length || !selectedDancers.length) return "";
      let dancers = getFirstSelectedFormation()?.positions.filter((position: dancerPosition) => selectedDancers.includes(position.id));
      if (!dancers?.length) return "";

      if (dancers.every((position: dancerPosition) => position.transitionType === "linear" || !position.transitionType)) {
         return "Straight";
      }
      if (dancers.every((position: dancerPosition) => position.transitionType === "teleport" || !position.transitionType)) {
         return "Teleport";
      }
      if (dancers.every((position: dancerPosition) => position.transitionType === "cubic")) {
         return "Curved";
      }
      return "Mixed";
   };

   const pos = getFirstSelectedFormation()?.positions.find((position) => position.id === selectedDancers[0])?.position;

   const getRealPosition = (pos, cloudSettings) => {
      if (!pos) return;
      const { stageBackground, gridSubdivisions, horizontalGridSubdivisions, verticalFineDivisions, horizontalFineDivisions, stageDimensions } =
         cloudSettings;
      let gridSizeX = 1;
      let gridSizeY = 1;

      if (stageBackground === "gridfluid" || stageBackground === "cheer9") {
         // Determine the total number of divisions along each axis.
         const totalVerticalDivisions = gridSubdivisions * verticalFineDivisions;
         const totalHorizontalDivisions = horizontalGridSubdivisions * horizontalFineDivisions;

         // Calculate the width and height of each grid cell.
         gridSizeX = stageDimensions.width / totalVerticalDivisions;
         gridSizeY = stageDimensions.height / totalHorizontalDivisions;
      } else {
         gridSizeX = 1;
         gridSizeY = 1;
      }

      return { x: Math.round(pos.x / gridSizeX), y: Math.round(pos.y / gridSizeY) };
   };

   // return groups.find((group) => group.id === properties[0])?.name || "Error";
   const dropdownGroup = getFirstSelectedFormation()?.groups?.find((group) => group.id === getSelectedPositionsProperty("groupId")) || {
      name: "Mixed",
      color: null,
   };

   if (!selectedDancers.length || !selectedFormations.length) return <></>;

   return (
      <VStack className="w-full  h-full bg-neutral-50 pb-2  dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
         <div className="  border-neutral-700 w-full p-2 flex flex-row items-center">
            <p className="md:text-sm text-[10px]  font-bold">
               {selectedDancers.length === dancers.length
                  ? "Everyone"
                  : formatNames(dancers.filter((dancer) => selectedDancers.includes(dancer.id)).map((dancer) => dancer.name))}
            </p>

            {selectedDancers.length === 1 ? (
               <p className="font-light text-neutral-400 text-sm ml-auto ">
                  ({getRealPosition(pos, cloudSettings)?.x}, {getRealPosition(pos, cloudSettings)?.y})
               </p>
            ) : null}
         </div>
         <HDivider />

         {selectedDancers.length === 2 && !viewOnly ? (
            <>
               <button
                  onClick={() => {
                     selectedFormations.forEach((selectedFormation: string) => {
                        const positions = selectedDancers.map((dancerId) => {
                           return formations
                              .find((formation) => formation.id === selectedFormation)
                              ?.positions.find((dancerPosition: dancerPosition) => dancerPosition.id === dancerId).position;
                        });

                        setFormations(
                           get().formations.map((formation, index: number) => {
                              if (formation.id === selectedFormation) {
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
                           })
                        );
                     });
                     // swap the positions of the two dancers
                  }}
                  className="flex flex-row justify-between dark:text-neutral-300 text-neutral-500 hover:text-black dark:hover:text-white transition items-center px-2 py-3  "
               >
                  <p className="text-xs font-semibold mr-3">Swap 2 Positions</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                     />
                  </svg>
               </button>
               <HDivider />
            </>
         ) : null}

         {!selectedFormations
            .map((selectedFormationId) => {
               return formations.findIndex((formation) => formation.id === selectedFormationId);
            })
            .includes(0) ? (
            <>
               <div className="flex flex-row justify-between items-center py-2 px-2 max-h-[44px] h-[44px] ">
                  <p className="text-xs  font-semibold">Path</p>
                  <DropdownMenu>
                     <DropdownMenuTrigger
                        disabled={viewOnly}
                        asChild
                        className="dark:hover:bg-neutral-600 hover:bg-neutral-200 cursor-pointer rounded-md border border-neutral-700 "
                     >
                        <div className=" py-1 px-3 h-[32px] w-38  flex flex-row items-center  ">
                           <p className=" text-xs ">{pathSelectionDropdownValue()}</p>
                        </div>
                     </DropdownMenuTrigger>

                     <DropdownMenuContent className=" dark:fill-white ">
                        <DropdownMenuItem>
                           <div
                              className="text-xs flex flex-row items-center"
                              onClick={() => setSelectedPositionProperty("transitionType", "linear")}
                           >
                              <svg className="w-5 h-5 mr-4  " xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                                 <path d="M170 666q-37.8 0-63.9-26.141t-26.1-64Q80 538 106.1 512t63.9-26q29.086 0 52.543 17T255 546h625v60H255q-9 26-32.457 43T170 666Z" />
                              </svg>
                              <p>Straight</p>
                           </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <div className="   text-xs   flex flex-row items-center" onClick={setCurved}>
                              <svg className="w-5 h-5 mr-4  " xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                                 <path d="M766 936q-41 0-71.5-24.5T656 852H443q-66 0-109.5-43.5T290 699q0-66 43.5-109.5T443 546h77q41 0 67-26t26-67q0-41-26-67t-67-26H304q-9 35-39 59.5T194 444q-48 0-81-33t-33-81q0-48 33-81t81-33q41 0 71 24.5t39 59.5h216q66 0 109.5 43.5T673 453q0 66-43.5 109.5T520 606h-77q-41 0-67 26t-26 67q0 41 26 67t67 26h213q9-35 39-59.5t71-24.5q48 0 81 33t33 81q0 48-33 81t-81 33ZM194 384q23 0 38.5-15.5T248 330q0-23-15.5-38.5T194 276q-23 0-38.5 15.5T140 330q0 23 15.5 38.5T194 384Z" />
                              </svg>
                              <p>Curved</p>
                           </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <div
                              className="  text-xs   flex flex-row items-center"
                              onClick={() => setSelectedPositionProperty("transitionType", "teleport")}
                           >
                              <svg className="w-5 h-5 mr-4 " xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                                 <path d="m794 922-42-42 73-74H620v-60h205l-73-74 42-42 146 146-146 146ZM340 686q51.397 0 92.699-24Q474 638 499 598q-34-26-74.215-39t-85-13Q295 546 255 559t-74 39q25 40 66.301 64 41.302 24 92.699 24Zm.089-200Q369 486 389.5 465.411q20.5-20.588 20.5-49.5Q410 387 389.411 366.5q-20.588-20.5-49.5-20.5Q311 346 290.5 366.589q-20.5 20.588-20.5 49.5Q270 445 290.589 465.5q20.588 20.5 49.5 20.5ZM340 897q133-121 196.5-219.5T600 504q0-117.79-75.292-192.895Q449.417 236 340 236t-184.708 75.105Q80 386.21 80 504q0 75 65 173.5T340 897Zm0 79Q179 839 99.5 721.5T20 504q0-150 96.5-239T340 176q127 0 223.5 89T660 504q0 100-79.5 217.5T340 976Zm0-410Z" />
                              </svg>
                              <p>Teleport</p>
                           </div>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
               <HDivider />
            </>
         ) : null}

         <PropertyAdd
            onAdd={() => {
               if (!items.length) {
                  setAssetsOpen({ type: "item" });
                  toast("Create your first prop");
                  return;
               }
               setSelectedPositionProperty("itemId", items[0].id);
            }}
            onSubtract={() => setSelectedPositionProperty("itemId", null)}
            canAdd={!getSelectedPositionsProperty("itemId") && !viewOnly}
            canSubtract={getSelectedPositionsProperty("itemId") !== null && !viewOnly}
            label="Prop"
            isOpen={getSelectedPositionsProperty("itemId") !== null}
         >
            <div className="flex flex-row items-center justify-between w-full px-2">
               <DropdownMenu>
                  <DropdownMenuTrigger
                     disabled={viewOnly}
                     asChild
                     className="dark:hover:bg-neutral-600 hover:bg-neutral-200 cursor-pointer rounded-md border border-neutral-700"
                  >
                     <div className=" py-1 px-3 h-[32px] w-38  flex flex-row items-center  ">
                        <p className=" text-xs">{getSelectedPositionsProperty("itemId")}</p>
                     </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className={`grid ${items.length > 10 ? "grid-cols-2 " : ""}`}>
                     {items.map((item: item) => {
                        return (
                           <DropdownMenuItem key={item.id} onClick={() => setSelectedPositionProperty("itemId", item.id)}>
                              <div className="text-xs flex flex-row items-center">
                                 <div className="w-7 h-7 mr-5 ">
                                    <img
                                       className="h-full w-full object-contain"
                                       src={imageBlobs[`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${item?.url}`]}
                                    />
                                 </div>

                                 <p>{item.name}</p>
                              </div>
                           </DropdownMenuItem>
                        );
                     })}
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </PropertyAdd>
         <HDivider />
         <PropertyAdd
            onAdd={() => setSelectedPositionProperty("level", 0)}
            onSubtract={() => setSelectedPositionProperty("level", null)}
            canAdd={!(getSelectedPositionsProperty("level") !== null) && !viewOnly}
            canSubtract={getSelectedPositionsProperty("level") !== null && !viewOnly}
            label="Level"
            isOpen={getSelectedPositionsProperty("level") !== null}
         >
            <div className="px-2">
               <Input
                  type="number"
                  className="w-[70px] h-8 dark:bg-neutral-900 text-xs"
                  size={1}
                  onChange={(e) => {
                     setLocalSettings((localSettings: localSettings) => {
                        return { ...localSettings, viewingThree: true, viewingTwo: false };
                     });
                     setSelectedPositionProperty("level", parseInt(e.target.value));
                  }}
                  value={getSelectedPositionsProperty("level")}
               />
            </div>
         </PropertyAdd>
         <HDivider />

         {selectedFormations.length === 1 ? (
            <div className="flex flex-col py-3 px-2  gap-3">
               <div className=" flex flex-row justify-between items-center h-6">
                  <p className="text-xs  font-semibold  ">Group</p>

                  <div className="flex flex-row items-center gap-2">
                     {getFirstSelectedFormation()?.groups?.length && !getSelectedPositionsProperty("groupId") ? (
                        <DropdownMenu>
                           <DropdownMenuTrigger disabled={viewOnly} asChild>
                              <button className="hover:bg-neutral-800 p-1">
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z" />
                                 </svg>
                              </button>
                           </DropdownMenuTrigger>

                           <DropdownMenuContent>
                              {(getFirstSelectedFormation().groups || []).map((group) => {
                                 return (
                                    <DropdownMenuItem
                                       key={group.id}
                                       onClick={() => {
                                          setSelectedPositionProperty("groupId", group.id);
                                       }}
                                    >
                                       <div
                                          style={{
                                             backgroundColor: group?.color,
                                          }}
                                          className="w-2 h-2 rounded-full mr-2"
                                       ></div>
                                       <p className="text-xs">{group.name}</p>
                                    </DropdownMenuItem>
                                 );
                              })}
                           </DropdownMenuContent>
                        </DropdownMenu>
                     ) : null}
                     {!viewOnly ? (
                        <button
                           // new group
                           onClick={() => {
                              pauseHistory();
                              const groupId = newGroupOnSelectedFormation();
                              setSelectedPositionProperty("groupId", groupId);
                              setMenuOpen("formations");
                              resumeHistory();
                           }}
                           className="hover:bg-neutral-800 p-1"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                           </svg>
                        </button>
                     ) : null}
                  </div>
               </div>

               {getSelectedPositionsProperty("groupId") ? (
                  <div className="flex flex-row items-center justify-between">
                     <>
                        <DropdownMenu>
                           <DropdownMenuTrigger disabled={viewOnly} asChild className="  rounded-md border border-neutral-700">
                              <div className=" py-1 px-3 h-[32px] w-38  flex flex-row items-center  ">
                                 {dropdownGroup?.color ? (
                                    <div
                                       style={{
                                          backgroundColor: dropdownGroup?.color,
                                       }}
                                       className="w-2 h-2 rounded-full mr-2"
                                    ></div>
                                 ) : null}

                                 <p className=" text-xs"> {dropdownGroup?.name}</p>
                              </div>
                           </DropdownMenuTrigger>

                           <DropdownMenuContent>
                              {(getFirstSelectedFormation().groups || []).map((group) => {
                                 return (
                                    <DropdownMenuItem
                                       key={group.id}
                                       onClick={() => {
                                          setSelectedPositionProperty("groupId", group.id);
                                          setMenuOpen("formations");
                                       }}
                                    >
                                       <div
                                          style={{
                                             backgroundColor: group?.color,
                                          }}
                                          className="w-2 h-2 rounded-full mr-2"
                                       ></div>
                                       <p className="text-xs">{group.name}</p>
                                    </DropdownMenuItem>
                                 );
                              })}
                              <DropdownMenuSeparator></DropdownMenuSeparator>
                              <DropdownMenuItem
                                 onClick={() => {
                                    pauseHistory();
                                    const groupId = newGroupOnSelectedFormation();
                                    setSelectedPositionProperty("groupId", groupId);
                                    setMenuOpen("formations");
                                    resumeHistory();
                                 }}
                              >
                                 <div className="   text-xs  w-full flex flex-row items-center">
                                    <p>New group</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-auto">
                                       <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                    </svg>
                                 </div>
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>

                        <RemovePropertyButton viewOnly={viewOnly} setSelectedPositionProperty={setSelectedPositionProperty} propertyKey="groupId" />
                     </>
                  </div>
               ) : null}
            </div>
         ) : null}
         <HDivider />

         <PropertyAdd
            onAdd={() => setSelectedPositionProperty("color", dancers.find((dancer) => dancer.id === selectedDancers[0])?.color || "#db2777")}
            onSubtract={() => setSelectedPositionProperty("color", null)}
            canAdd={!(getSelectedPositionsProperty("color") !== null) && !viewOnly}
            canSubtract={getSelectedPositionsProperty("color") !== null && !viewOnly}
            label="Color override"
            isOpen={getSelectedPositionsProperty("color") !== null}
         >
            <div className="flex flex-row items-center justify-between px-2">
               <PopoverPicker
                  dancers={dancers}
                  color={getSelectedPositionsProperty("color")}
                  setColor={(color: string) => setSelectedPositionProperty("color", color)}
                  position="bottom"
               ></PopoverPicker>
            </div>
         </PropertyAdd>
         <HDivider />
      </VStack>
   );
};

function formatNames(names: string[]): string {
   if (names.length === 0) return "";

   if (names.length === 1) return names[0];

   if (names.length === 2) return `${names[0]} & ${names[1]}`;

   return `${names[0]} & ${names.length - 1} others`;
}
