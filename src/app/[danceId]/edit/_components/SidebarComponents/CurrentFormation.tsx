import { comment, initials } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useStore } from "../../store";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";
import { HexColorPicker } from "react-colorful";
import { PopoverPicker } from "../ColorPicker";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DoubleClickInput } from "../../../../../../@/components/ui/double-click-input";
import { Button } from "../../../../../../@/components/ui/button";

export const CurrentFormation: React.FC<{}> = ({}) => {
   const {
      formations,
      setFormations,
      viewOnly,
      getFirstSelectedFormation,
      selectedFormations,
      selectedDancers,
      setSelectedDancers,
      deleteGroup,
      dancers,
      setHoveringDancerIds,
      shiftHeld,
      pauseHistory,
      resumeHistory,
   } = useStore();

   const thisFormation = getFirstSelectedFormation();

   return (
      <>
         <div className=" flex w-full   flex-col h-full   dark:text-neutral-200  ">
            {thisFormation ? (
               <>
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

                  {(thisFormation?.groups || []).length ? (
                     <div className="w-full py-1  border-neutral-700 px-2 flex flex-row items-center justify-between border-b">
                        <p className="text-xs font-semibold">Formation groups</p>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild className="  ">
                              <button className="transition hover:bg-neutral-700 p-1">
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                                 </svg>
                              </button>
                           </DropdownMenuTrigger>

                           <DropdownMenuContent>
                              <DropdownMenuItem
                                 onClick={() => {
                                    pauseHistory();
                                    thisFormation?.groups.forEach((group) => {
                                       deleteGroup(group.id);
                                    });
                                    resumeHistory();
                                 }}
                              >
                                 <div className="   text-xs  w-full flex flex-row items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
                                       <path
                                          fillRule="evenodd"
                                          d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                          clipRule="evenodd"
                                       />
                                    </svg>
                                    Delete all groups
                                 </div>
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  ) : null}

                  <div className="w-full overflow-y-scroll  pb-5  removeScrollBar flex flex-col  ">
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
                                    ...(thisFormation?.positions.filter((position) => position.groupId === group.id).map((position) => position.id) ||
                                       []),
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

                                    <DropdownMenu>
                                       <DropdownMenuTrigger disabled={viewOnly} asChild className="  ">
                                          <button className="transition hover:bg-neutral-700 p-1">
                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                                             </svg>
                                          </button>
                                       </DropdownMenuTrigger>

                                       <DropdownMenuContent>
                                          <DropdownMenuItem onClick={() => deleteGroup(group.id)}>
                                             <div className="   text-xs  w-full flex flex-row items-center">
                                                <svg
                                                   xmlns="http://www.w3.org/2000/svg"
                                                   viewBox="0 0 20 20"
                                                   fill="currentColor"
                                                   className="w-4 h-4 mr-2"
                                                >
                                                   <path
                                                      fillRule="evenodd"
                                                      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                                      clipRule="evenodd"
                                                   />
                                                </svg>
                                                Delete group
                                             </div>
                                          </DropdownMenuItem>
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </div>
                              </div>

                              <div className="flex flex-row items-center  relative w-full pb-1  ">
                                 <div className="text-xs  w-full flex-grow p-1 px-2 pointer-events-none opacity-0   ">
                                    <p className="h-full  min-h-[15px]">
                                       {thisFormation.groups?.find((groupx) => groupx.id === group.id)?.notes || ""}
                                    </p>
                                 </div>
                                 <textarea
                                    disabled={viewOnly}
                                    onChange={(e) => {
                                       setFormations(
                                          formations.map((formation) => {
                                             if (formation.id === thisFormation.id) {
                                                return {
                                                   ...formation,
                                                   groups: (formation.groups || []).map((groupx) => {
                                                      if (group.id === groupx.id) {
                                                         return { ...groupx, notes: e.target.value };
                                                      }
                                                      return groupx;
                                                   }),
                                                };
                                             }
                                             return formation;
                                          })
                                       );
                                    }}
                                    value={thisFormation.groups?.find((groupx) => groupx.id === group.id)?.notes || ""}
                                    className={`w-full cursor-default min-h-[15px] py-1 absolute   focus:outline-none  overflow-hidden rounded-none bg-neutral-900 resize-none h-full text-xs  bg-transparent ${
                                       dancerInThisGroupSelected ? "text-white" : "text-neutral-300"
                                    } `}
                                    spellCheck={false}
                                    autoCorrect={"false"}
                                    placeholder="Choregraphy notes..."
                                 ></textarea>
                              </div>
                           </div>
                        );
                     })}
                  </div>

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
               </>
            ) : (
               <>
                  <p className="text-center mt-16">No Formation Selected </p>
               </>
            )}
         </div>
         <Toaster></Toaster>
      </>
   );
};
