import { comment, initials } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useStore } from "../../store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DoubleClickInput } from "../../../../../../@/components/ui/double-click-input";
import { Button } from "../../../../../../@/components/ui/button";
import { AutoGrowTextArea } from "../../../../../../@/components/ui/auto-grow-text-area";
import { HDivider } from "../../../../../../@/components/ui/hdivider";
import { VStack } from "../../../../../../@/components/ui/stacks";

export const CurrentFormation: React.FC<{}> = ({}) => {
   const { formations, setFormations, viewOnly, selectedFormations, isUsingPenTool } = useStore();

   const thisFormation = useStore((state) => state.getFirstSelectedFormation());

   if (!thisFormation) return <></>;
   return (
      <div className=" flex    flex-col h-full w-full  justify-between  dark:text-neutral-200  ">
         <VStack>
            <div className="flex flex-row items-center border-b dark:border-neutral-700  border-neutral-300  h-[40px]  ">
               <input
                  style={{
                     minHeight: 39,
                  }}
                  className="font-medium w-full   h-full px-2  focus:border-pink-600 border-transparent border  transition text-lg dark:bg-transparent  outline-none  "
                  onChange={(e) =>
                     setFormations(
                        formations.map((formation) => {
                           if (selectedFormations.includes(formation.id)) {
                              return {
                                 ...formation,
                                 name: e.target.value,
                              };
                           }
                           return formation;
                        })
                     )
                  }
                  disabled={viewOnly}
                  value={thisFormation.name || ""}
               />
            </div>

            {/* {(thisFormation?.groups || []).length ? (
               <div className="w-full py-1  border-neutral-700 px-2 flex flex-row items-center justify-between border-b">
                  <p className="text-xs font-semibold">Formation groups</p>
                  <button
                     onClick={() => {
                        pauseHistory();
                        thisFormation?.groups.forEach((group) => {
                           deleteGroup(group.id);
                        });
                        resumeHistory();
                     }}
                     className=" border border-transparent  md:text-xs text-[10px] hover:bg-neutral-800 p-1  cursor-default "
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                     </svg>
                  </button>
               </div>
            ) : null} */}

            {/* <div className="w-full overflow-y-scroll  pb-5  removeScrollBar flex flex-col  ">
               {(thisFormation?.groups || []).map((group) => {
                  const dancerInThisGroupSelected = (
                     thisFormation?.positions.filter((position) => position.groupId === group.id).map((position) => position.id) || []
                  ).some((dancerId) => selectedDancers.includes(dancerId));

                  return (
                     <div
                        key={group.id}
                        onPointerEnter={() => {
                           setHoveringDancerIds(
                              thisFormation?.positions.filter((position) => position.groupId === group.id).map((position) => position.id)
                           );
                        }}
                        onPointerLeave={() => {
                           setHoveringDancerIds([]);
                        }}
                        onClick={() => {
                           setSelectedDancers([
                              ...(shiftHeld ? selectedDancers : []),
                              ...(thisFormation?.positions.filter((position) => position.groupId === group.id).map((position) => position.id) || []),
                           ]);
                        }}
                        className={`border box-content  border-transparent  px-2 ${
                           dancerInThisGroupSelected ? "bg-dark-secondary border-dark-secondary" : "hover:border-pink-600"
                        }`}
                        style={{
                           opacity: thisFormation.positions.map((position) => position.groupId).includes(group.id) ? 1 : 0.5,
                        }}
                     >
                        <div className=" py-2  ">
                           <div className="flex flex-row items-center  hover:no-underline gap-1 ">
                              <Popover>
                                 <PopoverTrigger>
                                    <div
                                       style={{
                                          backgroundColor: group?.color,
                                       }}
                                       className={`h-5 w-5 rounded-sm ${!group.color ? "border border-white" : ""}`}
                                    ></div>
                                 </PopoverTrigger>
                                 <PopoverContent side="right" className="p-0 w-min flex flex-col items-center justify-center gap-3 p-2">
                                    <HexColorPicker
                                       onChange={(color) => {
                                          setFormations(
                                             formations.map((formation) => {
                                                if (formation.id === thisFormation.id) {
                                                   return {
                                                      ...formation,
                                                      groups: (formation.groups || []).map((groupx) => {
                                                         if (group.id === groupx.id) {
                                                            return { ...groupx, color };
                                                         }
                                                         return groupx;
                                                      }),
                                                   };
                                                }
                                                return formation;
                                             })
                                          );
                                       }}
                                       color={group?.color}
                                    ></HexColorPicker>

                                    <Button
                                       onClick={() => {
                                          setFormations(
                                             formations.map((formation) => {
                                                if (formation.id === thisFormation.id) {
                                                   return {
                                                      ...formation,
                                                      groups: (formation.groups || []).map((groupx) => {
                                                         if (group.id === groupx.id) {
                                                            return { ...groupx, color: "" };
                                                         }
                                                         return groupx;
                                                      }),
                                                   };
                                                }
                                                return formation;
                                             })
                                          );
                                       }}
                                       size={"sm"}
                                    >
                                       Set no color on group
                                    </Button>
                                 </PopoverContent>
                              </Popover>

                              <DoubleClickInput
                                 className="text-xs text-white dark:bg-transparent  font-medium h-5 mx-1 rounded-none border-transparent border-2  px-2  outline-none w-full dark:focus:bg-neutral-900 "
                                 onChange={(e) => {
                                    setFormations(
                                       formations.map((formation) => {
                                          if (formation.id === thisFormation.id) {
                                             return {
                                                ...formation,
                                                groups: (formation.groups || []).map((groupx) => {
                                                   if (group.id === groupx.id) {
                                                      return { ...groupx, name: e.target.value };
                                                   }
                                                   return groupx;
                                                }),
                                             };
                                          }
                                          return formation;
                                       })
                                    );
                                 }}
                                 value={(thisFormation.groups || [])?.find((groupx) => groupx.id === group?.id)?.name || ""}
                                 disabled={viewOnly}
                              />
                              <button
                                 onClick={() => deleteGroup(group.id)}
                                 className="  md:text-xs text-[10px] hover:bg-neutral-800 p-1  cursor-default "
                              >
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path
                                       fillRule="evenodd"
                                       d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                              </button>
                           </div>
                        </div>
                        <div className="py-1">
                           <AutoGrowTextArea
                              readOnly={viewOnly}
                              onChange={(e) => {
                                 setFormations(
                                    formations.map((formation) => {
                                       if (formation.id === thisFormation.id) {
                                          return {
                                             ...formation,
                                             groups: (formation.groups || []).map((groupx) => {
                                                if (group.id === groupx.id) return { ...groupx, notes: e.target.value };
                                                return groupx;
                                             }),
                                          };
                                       }
                                       return formation;
                                    })
                                 );
                              }}
                              value={thisFormation.groups?.find((groupx) => groupx.id === group.id)?.notes}
                              className={`${dancerInThisGroupSelected ? "text-white" : "text-neutral-300"} `}
                              placeholder="Choregraphy notes..."
                           />
                        </div>
                     </div>
                  );
               })}
            </div> */}
         </VStack>

         {(thisFormation.stageMarkers || []).length ? (
            <div className=" flex flex-col gap-2 py-2 min-h-[44px] justify-center mb-auto ">
               <div className="flex flex-row items-center justify-between px-2">
                  <p className=" font-medium text-xs">Formation Sketch</p>
                  <div className="flex flex-row items-center gap-2">
                     <button
                        onClick={() => {
                           setFormations(
                              formations.map((formation) => {
                                 if (selectedFormations.includes(formation.id)) {
                                    return {
                                       ...formation,
                                       stageMarkers: [],
                                    };
                                 }
                                 return formation;
                              })
                           );
                        }}
                        className={"hover:bg-neutral-800 p-1  cursor-default"}
                     >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 873 873">
                           <circle cx="436.5" cy="436.5" r="405.5" stroke="white" stroke-width="62" />
                           <path stroke="white" stroke-width="62" d="m54.82 247.825 751.663 368.686" />
                        </svg>
                     </button>
                  </div>
               </div>
            </div>
         ) : null}

         <div>
            {/* <HDivider /> */}
            <textarea
               value={thisFormation?.notes || ""}
               onChange={(e) => {
                  setFormations(
                     formations.map((formation) => {
                        if (selectedFormations.includes(formation.id)) {
                           return {
                              ...formation,
                              notes: e.target.value,
                           };
                        }
                        return formation;
                     })
                  );
               }}
               readOnly={viewOnly}
               style={{
                  minHeight: 200,
                  height: 200,
               }}
               className="dark:bg-neutral-900 transition bg-neutral-50 mt-auto w-full focus:outline-none p-3 text-sm border-t border-neutral-300 focus:border-pink-300 dark:border-neutral-600 dark:focus:border-pink-600 resize-none "
               cols={30}
               rows={9}
               placeholder="Formation notes..."
            ></textarea>
         </div>
      </div>
   );
};
