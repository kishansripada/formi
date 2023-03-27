import { dancer, dancerPosition, formation, formationGroup, initials } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { SyntheticEvent, useEffect, useState } from "react";

export const CurrentFormation: React.FC<{
   selectedFormation: number | null;
   formations: formation[];
   setFormations: Function;
   dancers: dancer[];
   setSelectedFormation: Function;
   selectedDancers: string[];
   setSelectedDancers: Function;
   cloudSettings: any;
   pricingTier: string;
   addToStack: Function;
   pushChange: Function;
   isCommenting: boolean;
   setIsCommenting: Function;
   setUpgradeIsOpen: Function;
   formationGroups: formationGroup[];
   setIsEditingFormationGroup: Function;
   setFormationGroups: Function;
}> = ({
   formations,
   selectedFormation,
   setFormations,
   dancers,
   setSelectedFormation,
   selectedDancers,
   setSelectedDancers,
   cloudSettings,
   pricingTier,
   addToStack,
   pushChange,
   isCommenting,
   setIsCommenting,
   setUpgradeIsOpen,
   formationGroups,
   setIsEditingFormationGroup,
   setFormationGroups,
}) => {
   let { stageDimensions, stageBackground } = cloudSettings;
   const [backgroundDropdownIsOpen, setBackgroundDropdownIsOpen] = useState<boolean>();
   const deleteComment = (id: string) => {
      setFormations((formations: formation[]) => {
         return formations.map((formation, i) => {
            if (i === selectedFormation) {
               return {
                  ...formation,
                  comments: formation.comments?.filter((comment) => comment.id !== id),
               };
            }
            return formation;
         });
      });
   };

   const closeWindow = (e: MouseEvent) => {
      if (e?.target?.id === "menu-item") return;
      setBackgroundDropdownIsOpen(false);
   };

   useEffect(() => {
      window.addEventListener("mousedown", closeWindow);
      return () => {
         window.removeEventListener("mousedown", closeWindow);
      };
   }, [backgroundDropdownIsOpen]);

   return (
      <>
         <div className=" lg:flex hidden  min-w-[350px] w-[23%] flex-col h-full  bg-white border-r border-r-gray-300 ">
            {selectedFormation !== null && formations[selectedFormation] ? (
               <>
                  <div className="flex flex-row items-center mb-3 px-6 pt-5 ">
                     <input
                        className="font-medium w-full focus:px-2 hover:px-2 transition-[padding] rounded-md  h-6 text-2xl  py-4 transition duration-100 hover:bg-gray-100 text-gray-800 focus:bg-gray-100 outline-none cursor-pointer "
                        onChange={(e) =>
                           setFormations((formations: formation[]) => {
                              return formations.map((formation, i) => {
                                 if (i === selectedFormation) {
                                    return {
                                       ...formation,
                                       name: e.target.value,
                                    };
                                 }

                                 return formation;
                              });
                           })
                        }
                        value={formations[selectedFormation]?.name || ""}
                     />
                  </div>

                  <div className="flex flex-row items-center justify-between w-full px-6  ">
                     <p className="text-lg text-gray-500">
                        {Math.round(
                           ((formations[selectedFormation]?.durationSeconds || 0) +
                              (formations[selectedFormation]?.transition.durationSeconds || 0)) *
                              10
                        ) / 10}
                        s
                     </p>
                     <div className="flex flex-row items-center justify-center">
                        <div className="relative  text-left  ">
                           <div onClick={() => setBackgroundDropdownIsOpen((x) => !x)}>
                              <button
                                 className="inline-flex w-full justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                                 id="menu-button"
                              >
                                 {formationGroups.find((group) => group.id === formations[selectedFormation]?.group) ? (
                                    <>
                                       <div
                                          style={{
                                             backgroundColor: formationGroups.find((group) => group.id === formations[selectedFormation]?.group)
                                                ?.color,
                                          }}
                                          className="w-5 h-5 rounded-full mr-2 "
                                       ></div>
                                       <p> {formationGroups.find((group) => group.id === formations[selectedFormation]?.group)?.name}</p>
                                    </>
                                 ) : (
                                    "Category"
                                 )}
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
                                 backgroundDropdownIsOpen
                                    ? " opacity-100 scale-100 pointer-events-auto"
                                    : "transform opacity-0 scale-95 pointer-events-none "
                              } right-0 z-20 mt-2 w-[200px] transform transition ease-out  duration-100 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                           >
                              <div className="py-1" role="none">
                                 {formationGroups.map((formationGroup) => {
                                    return (
                                       <a
                                          key={formationGroup.id}
                                          onClick={() => {
                                             setFormations((formations: formation[]) => {
                                                return formations.map((formation, i) => {
                                                   if (i === selectedFormation) {
                                                      return { ...formation, group: formationGroup.id };
                                                   }
                                                   return formation;
                                                });
                                             });
                                          }}
                                          className={`${
                                             formationGroup.id === formations[selectedFormation]?.group ? "text-gray-900 bg-gray-100 " : ""
                                          } text-gray-700  block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
                                          id="menu-item"
                                       >
                                          <div id="menu-item" className="flex flex-row items-center  w-full">
                                             <div
                                                id="menu-item"
                                                style={{
                                                   backgroundColor: formationGroup.color,
                                                }}
                                                className="min-w-[20px] min-h-[20px] rounded-full mr-2 "
                                             ></div>
                                             <p id="menu-item"> {formationGroup.name}</p>
                                             <button
                                                id="menu-item"
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   setIsEditingFormationGroup(formationGroup.id);
                                                }}
                                                className="text-sm ml-auto "
                                             >
                                                Edit
                                             </button>
                                          </div>
                                       </a>
                                    );
                                 })}

                                 <a
                                    id="menu-item"
                                    onClick={() => {
                                       setFormations((formations: formation[]) => {
                                          return formations.map((formation, i) => {
                                             if (i === selectedFormation) {
                                                return { ...formation, group: null };
                                             }
                                             return formation;
                                          });
                                       });
                                    }}
                                    className={`${
                                       !formations[selectedFormation]?.group ? "text-gray-900 bg-gray-100 " : ""
                                    } text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
                                 >
                                    None
                                 </a>
                                 <a
                                    id="menu-item"
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       if (pricingTier === "basic") {
                                          setUpgradeIsOpen(true);
                                          return;
                                       }
                                       let id = crypto.randomUUID();
                                       setFormationGroups((formationGroups: formationGroup[]) => {
                                          return [...formationGroups, { id, name: "New Group", color: "#db2777" }];
                                       });
                                       setIsEditingFormationGroup(id);
                                    }}
                                    className={` text-gray-700 block px-4 py-2 text-sm  hover:bg-gray-100 hover:text-gray-900`}
                                 >
                                    <div id="menu-item" className="flex flex-row items-center">
                                       <svg
                                          id="menu-item"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="w-5 h-5 mr-1"
                                       >
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                       </svg>
                                       <p id="menu-item">New</p>
                                    </div>
                                 </a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <hr className="mt-3 " />

                  <div className="px-6 flex flex-col ">
                     <div className=" mt-6 mb-4 min-h-[130px]">
                        <div className="flex flex-row  justify-between items-start  ">
                           <div className="flex flex-col ">
                              <p className="font-medium text-xl mr-auto z-10">
                                 {selectedDancers.length === 0
                                    ? "No Dancers Selected"
                                    : selectedDancers.length === 1
                                    ? dancers.find((dancer) => dancer.id === selectedDancers[0])?.name
                                    : "Multiple Dancers Selected"}
                              </p>
                           </div>

                           {/* {selectedDancers.length === 1 ? (
                              formations[selectedFormation]?.positions
                                 .filter((dancer) => {
                                    return selectedDancers.includes(dancer.id);
                                 })
                                 .map((dancer) => dancer.position.x > -(stageDimensions.width / 2 - 2))
                                 .every((value) => value) ? (
                                 <p className="font-semibold text-xs text-green-800 bg-green-200 px-2 py-1 rounded-full">on stage</p>
                              ) : (
                                 <p className="font-semibold text-xs text-red-800 bg-red-200 px-2 py-1 rounded-full">off stage</p>
                              )
                           ) : null} */}
                        </div>
                        <p className=" mt-5 mb-2 font-medium text-gray-700">Path</p>
                        <div
                           style={{
                              opacity: selectedDancers.length && selectedFormation !== 0 ? 1 : 0.4,
                              pointerEvents: selectedDancers.length && selectedFormation !== 0 ? "auto" : "none",
                           }}
                           className="border select-none  border-gray-200 flex flex-row justify-around rounded-xl w-full text-sm shadow-sm cursor-pointer "
                        >
                           <div
                              className="p-4 flex flex-row items-center"
                              onClick={() => {
                                 addToStack();
                                 selectedDancers.forEach((selectedDancer) => {
                                    setFormations((formations: formation[]) => {
                                       return formations.map((formation, index: number) => {
                                          if (index === selectedFormation) {
                                             return {
                                                ...formation,
                                                positions: formation.positions.map((dancerPosition) => {
                                                   if (dancerPosition.id === selectedDancer) {
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
                                 });
                                 pushChange();
                              }}
                           >
                              {selectedDancers.length &&
                              formations[selectedFormation]?.positions
                                 .filter((dancer) => {
                                    return selectedDancers.includes(dancer.id);
                                 })
                                 .map((dancer) => dancer.transitionType)
                                 .every((item) => item === "linear" || !item) ? (
                                 <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                                    <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                                 </div>
                              ) : (
                                 <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                              )}

                              <p>Straight</p>
                           </div>

                           <div
                              className={`p-4 flex flex-row items-center `}
                              onClick={() => {
                                 if (pricingTier === "basic") {
                                    setUpgradeIsOpen(true);
                                    return;
                                 }
                                 addToStack();
                                 selectedDancers.forEach((selectedDancer) => {
                                    setFormations((formations: formation[]) => {
                                       let start = formations[selectedFormation - 1]?.positions.find(
                                          (dancerPosition) => dancerPosition.id === selectedDancer
                                       )?.position;

                                       let end = formations[selectedFormation]?.positions.find(
                                          (dancerPosition) => dancerPosition.id === selectedDancer
                                       )?.position;
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
                              }}
                           >
                              {pricingTier === "basic" ? (
                                 <p className="mr-3 text-[18px]">⚡️</p>
                              ) : (
                                 <>
                                    {selectedDancers.length &&
                                    formations[selectedFormation]?.positions
                                       .filter((dancer) => {
                                          return selectedDancers.includes(dancer.id);
                                       })
                                       .map((dancer) => dancer.transitionType)
                                       .every((item) => item === "cubic") ? (
                                       <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                                          <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                                       </div>
                                    ) : (
                                       <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                                    )}
                                 </>
                              )}

                              <p>Curved</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* <div className="px-6">
                     <p className=" mt-5 mb-2 font-medium text-gray-700">Rotation</p>
                     <p>
                        from:{" "}
                        {selectedDancers.length && selectedFormation
                           ? formations[selectedFormation - 1]?.positions.find((position) => position.id === selectedDancers[0]).rotation.angle
                           : null}
                     </p>
                     <p>
                        to:{" "}
                        {selectedDancers.length && selectedFormation
                           ? formations[selectedFormation]?.positions.find((position) => position.id === selectedDancers[0]).rotation.angle
                           : null}
                     </p>
                     <div
                        style={{
                           opacity: selectedDancers.length && selectedFormation !== 0 ? 1 : 0.4,
                           pointerEvents: selectedDancers.length && selectedFormation !== 0 ? "auto" : "none",
                        }}
                        className="border select-none  border-gray-200 flex flex-row justify-around rounded-xl w-full text-sm shadow-sm cursor-pointer "
                     >
                        <div
                           className="p-4 flex flex-row items-center"
                           onClick={() => {
                              addToStack();
                              selectedDancers.forEach((selectedDancer) => {
                                 setFormations((formations: formation[]) => {
                                    return formations.map((formation, index: number) => {
                                       if (index === selectedFormation) {
                                          return {
                                             ...formation,

                                             positions: formation.positions.map((dancerPosition) => {
                                                if (dancerPosition.id === selectedDancer) {
                                                   return {
                                                      ...dancerPosition,
                                                      rotation: { ...dancerPosition.rotation, direction: "clockwise" },
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
                           }}
                        >
                           {selectedDancers.length &&
                           formations[selectedFormation]?.positions
                              .filter((dancer) => {
                                 return selectedDancers.includes(dancer.id);
                              })
                              .map((dancer) => dancer?.rotation?.direction || null)
                              .every((item) => item === "clockwise") ? (
                              <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                                 <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                              </div>
                           ) : (
                              <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                           )}

                           <p>Clockwise</p>
                        </div>

                        <div
                           className={`p-4 flex flex-row items-center `}
                           onClick={() => {
                              addToStack();
                              selectedDancers.forEach((selectedDancer) => {
                                 setFormations((formations: formation[]) => {
                                    return formations.map((formation, index: number) => {
                                       if (index === selectedFormation) {
                                          return {
                                             ...formation,

                                             positions: formation.positions.map((dancerPosition) => {
                                                if (dancerPosition.id === selectedDancer) {
                                                   return {
                                                      ...dancerPosition,
                                                      rotation: { ...dancerPosition.rotation, direction: "Counterclockwise" },
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
                           }}
                        >
                           <>
                              {selectedDancers.length &&
                              formations[selectedFormation]?.positions
                                 .filter((dancer) => {
                                    return selectedDancers.includes(dancer.id);
                                 })
                                 .map((dancer) => dancer?.rotation?.direction || null)
                                 .every((item) => item === "Counterclockwise") ? (
                                 <div className="rounded-full h-4 w-4 border-pink-400 border mr-3 grid place-items-center">
                                    <div className="rounded-full h-2 w-2 bg-pink-400"></div>
                                 </div>
                              ) : (
                                 <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                              )}
                           </>

                           <p>Counterclockwise</p>
                        </div>
                     </div>
                  </div> */}

                  <div className="overflow-y-scroll overflow-x-hidden h-full px-6 mt-5">
                     {formations[selectedFormation]?.comments?.map((comment) => {
                        return (
                           <>
                              <div key={comment.id} className="flex flex-row items-start w-full  mb-6">
                                 {comment.user.avatar_url ? (
                                    <img
                                       referrerPolicy="no-referrer"
                                       //   id={dancer.id}
                                       //   data-type={"dancer"}
                                       className="w-[32px] h-[32px] rounded-full select-none pointer-events-none mr-3"
                                       src={comment.user.avatar_url}
                                    />
                                 ) : (
                                    <div className="bg-purple-500 text-white mr-3  rounded-full  min-w-[32px] font-semibold min-h-[32px] grid place-items-center select-none cursor-default pointer-events-none  ">
                                       {initials(comment.user.name)}
                                    </div>
                                 )}
                                 <div className=" overflow-hidden">
                                    <p className=" text-gray-500 text-xs font-medium">{comment.user.name}</p>
                                    <p className="mr-2 mt-2 w-full ">{comment.content}</p>
                                 </div>
                                 <button
                                    onClick={() => {
                                       addToStack();
                                       deleteComment(comment.id);
                                       pushChange();
                                    }}
                                    className="ml-auto mt-auto mb-auto p-2 hover:bg-gray-100 transition duration-300 rounded-xl"
                                 >
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                       className="w-5 h-5 stroke-gray-600 shrink-0  "
                                    >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                 </button>
                              </div>
                           </>
                        );
                     })}
                  </div>

                  <div className="px-6 pb-6 pt-3">
                     <div
                        onClick={() => {
                           if (pricingTier === "basic") {
                              setUpgradeIsOpen(true);
                              return;
                           }
                           setIsCommenting((isCommenting: boolean) => {
                              return !isCommenting;
                           });
                        }}
                        className="border border-gray-200  rounded-xl w-full text-sm shadow-sm cursor-pointer select-none  mt-auto grid place-items-center text-gray-700 py-4  "
                     >
                        {isCommenting ? "Cancel" : pricingTier === "basic" ? "⚡️ Add Comment" : "Add Comment"}
                     </div>
                  </div>
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
