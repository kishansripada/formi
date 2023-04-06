import { dancer, dancerPosition, formation, formationGroup, initials } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { SyntheticEvent, useEffect, useState } from "react";
import Dropdown from "../Dropdown";
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
   dropDownToggle: boolean;
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
   dropDownToggle,
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

   const pathSelectionDropdownValue = () => {
      if (selectedFormation === null || !selectedDancers.length) return "";
      let dancers = formations[selectedFormation]?.positions.filter((position) => selectedDancers.includes(position.id));
      if (!dancers?.length) return "";

      if (dancers.every((position) => position.transitionType === "linear")) {
         return "Straight";
      }
      if (dancers.every((position) => position.transitionType === "cubic")) {
         return "Curved";
      }
      return "Mixed";
   };

   return (
      <>
         <div className=" lg:flex hidden  w-[250px]  min-w-[250px] flex-col h-full  bg-white  ">
            {selectedFormation !== null && formations[selectedFormation] ? (
               <>
                  {/* <div className="px-6">
                     <p className=" mt-5 mb-2 font-medium text-neutral-700">Rotation</p>
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
                        className="border select-none  border-neutral-200 flex flex-row justify-around rounded-xl w-full text-sm shadow-sm cursor-pointer "
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
                              <div className="rounded-full h-4 w-4 border-neutral-500 border mr-3"></div>
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
                                 <div className="rounded-full h-4 w-4 border-neutral-500 border mr-3"></div>
                              )}
                           </>

                           <p>Counterclockwise</p>
                        </div>
                     </div>
                  </div> */}
                  <div className="flex flex-row items-center  px-3 pt-4 ">
                     <input
                        onClick={(e) => {
                           e.target.select();
                        }}
                        onBlur={pushChange}
                        className="font-medium w-full  rounded-md  h-6 text-xl    text-neutral-800  outline-none cursor-pointer "
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
                  <div className="overflow-y-scroll  px-3 mt-4 flex-grow">
                     {formations[selectedFormation]?.comments?.map((comment) => {
                        return (
                           <>
                              <div key={comment.id} className="flex flex-row group items-start w-full  mb-6">
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
                                    <p className=" text-neutral-500 text-xs font-medium">{comment.user.name}</p>
                                    <p className="mr-2 mt-1 w-full text-xs ">{comment.content}</p>
                                 </div>
                                 <button
                                    onClick={() => {
                                       // addToStack();
                                       deleteComment(comment.id);
                                       pushChange();
                                    }}
                                    className="ml-auto mt-auto mb-auto p-1 hover:bg-neutral-100 transition duration-300 rounded-xl group-hover:opacity-100 opacity-0"
                                 >
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                       className="w-5 h-5 stroke-neutral-600 shrink-0  "
                                    >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                 </button>
                              </div>
                           </>
                        );
                     })}
                  </div>

                  {/* <div className="px-6 pb-6 pt-3">
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
                        className="border border-neutral-200  rounded-xl w-full text-sm shadow-sm cursor-pointer select-none  mt-auto grid place-items-center text-neutral-700 py-4  "
                     >
                        {isCommenting ? "Cancel" : pricingTier === "basic" ? "⚡️ Add Comment" : "Add Comment"}
                     </div>
                  </div> */}

                  <div className="h-[300px] min-h-[300px]  flex flex-col ">
                     <hr />
                     {selectedDancers.length ? (
                        <div className="">
                           <div
                              style={{
                                 pointerEvents: selectedFormation === 0 ? "none" : "auto",
                                 opacity: selectedFormation === 0 ? 0.5 : 1,
                              }}
                              className="flex flex-row justify-between items-center px-5 py-2"
                           >
                              <p className="text-sm font-semibold">Path</p>
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
                                 ]}
                                 options={["Straight", "Curved"]}
                                 actions={[setLinear, setCurved]}
                              ></Dropdown>
                           </div>
                           <hr />
                        </div>
                     ) : null}

                     <div
                        onClick={() => {
                           if (selectedFormation === null) return;

                           if (formations.length === 1) {
                              toast.error("you must have at least one formation");
                              return;
                           }
                           // addToStack();
                           if (selectedFormation === formations.length - 1) {
                              setSelectedFormation(selectedFormation - 1);
                           }

                           setFormations((formations: formation[]) => {
                              return formations.filter((formation, index) => {
                                 return index !== selectedFormation;
                              });
                           });

                           pushChange();
                        }}
                        className="border-t border-neutral-200   w-full text-sm shadow-sm cursor-pointer select-none  mt-auto grid place-items-center  bg-opacity-80 py-2 bg-red-600 text-white  "
                     >
                        Delete Formation
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
