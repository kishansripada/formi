import { dancer, dancerPosition, formation, formationGroup, initials, item } from "../../../../../types/types";
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
   dropDownToggle: boolean;
   viewOnly: boolean;
   items: item[];
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
   viewOnly,
   items,
}) => {
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

   return (
      <>
         <div
            className=" lg:flex hidden  w-[260px] bg-white  min-w-[260px] flex-col h-full  dark:bg-neutral-800 dark:text-neutral-100  "
            style={{
               pointerEvents: viewOnly ? "none" : "auto",
            }}
         >
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
                        className="font-medium w-full bg rounded-md  h-6 text-xl dark:bg-neutral-800 dark:text-white   text-neutral-800  outline-none cursor-pointer "
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
                                    <p className=" text-neutral-500 dark:text-neutral-300 text-xs font-medium">{comment.user.name}</p>
                                    <p className="mr-2 mt-1 w-full text-xs ">{comment.content}</p>
                                 </div>
                                 <button
                                    onClick={() => {
                                       // addToStack();
                                       deleteComment(comment.id);
                                       pushChange();
                                    }}
                                    className="ml-auto mt-auto mb-auto p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition duration-300 rounded-xl group-hover:opacity-100 opacity-0"
                                 >
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                       className="w-5 h-5 stroke-neutral-600 dark:stroke-neutral-300 shrink-0  "
                                    >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                 </button>
                              </div>
                           </>
                        );
                     })}
                  </div>

                  <div className="w-full pb-3 px-3  ">
                     <textarea
                        value={formations[selectedFormation]?.notes || ""}
                        onChange={(e) => {
                           setFormations((formations: formation[]) => {
                              return formations.map((formation, i) => {
                                 if (i === selectedFormation) {
                                    return {
                                       ...formation,
                                       notes: e.target.value,
                                    };
                                 }
                                 return formation;
                              });
                           });
                        }}
                        className="dark:bg-neutral-700 transition bg-neutral-100  w-full focus:outline-none p-3 text-sm border-2 border-neutral-300 focus:border-pink-300 dark:border-neutral-600 dark:focus:border-pink-600 resize-none rounded-md"
                        cols={30}
                        rows={13}
                        placeholder="Formation notes..."
                     ></textarea>
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