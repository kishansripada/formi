import { comment, dancer, dancerPosition, formation, formationGroup, initials, item } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { SyntheticEvent, useEffect, useState } from "react";
import { useStore } from "../../store";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Comment as LiveComment, Timestamp } from "@liveblocks/react-comments/primitives";
// import { createThread } from "@liveblocks/react-comments/primatives";
export const CurrentFormation: React.FC<{
   // selectedFormation: number | null;
   // formations: formation[];
   // setFormations: Function;
   dancers: dancer[];
   setSelectedFormation: Function;
   selectedDancers: string[];
   setSelectedDancers: Function;
   cloudSettings: any;

   addToStack: Function;
   pushChange: Function;
   isCommenting: boolean;
   setIsCommenting: Function;

   formationGroups: formationGroup[];
   setFormationGroups: Function;
   dropDownToggle: boolean;

   // items: item[];
}> = ({
   // formations,
   // selectedFormation,
   // setFormations,
   dancers,
   setSelectedFormation,
   selectedDancers,
   setSelectedDancers,
   cloudSettings,

   addToStack,
   pushChange,
   isCommenting,
   setIsCommenting,

   formationGroups,

   setFormationGroups,
   dropDownToggle,

   // items,
}) => {
   const { formations, setFormations, viewOnly, getFirstSelectedFormation, selectedFormations } = useStore();
   const deleteComment = (id: string) => {
      setFormations(
         formations.map((formation) => {
            if (selectedFormations.includes(formation.id)) {
               return {
                  ...formation,
                  comments: formation.comments?.filter((comment) => comment.id !== id),
               };
            }
            return formation;
         })
      );
   };

   return (
      <>
         <div className=" flex w-full   flex-col h-full   dark:text-neutral-100  ">
            {selectedFormations.length && getFirstSelectedFormation() ? (
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
                  <div className="flex flex-row items-center border-b dark:border-neutral-700  border-neutral-300  h-[40px]  ">
                     <input
                        // onBlur={pushChange}
                        className="font-medium w-full  h-full px-2 bg-transparent  focus:border-pink-600 border-transparent border  transition text-lg   outline-none  "
                        onChange={(e) =>
                           setFormations(
                              formations.map((formation, i) => {
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
                        value={getFirstSelectedFormation().name || ""}
                     />
                  </div>
                  <div className="overflow-y-scroll   px-3 mt-4 flex-grow">
                     {getFirstSelectedFormation()?.comments?.map((comment: comment) => {
                        return (
                           <div key={comment.id} className="flex flex-row group items-start w-full  mb-6">
                              {comment.user.avatar_url ? (
                                 <img
                                    referrerPolicy="no-referrer"
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
                              {!viewOnly ? (
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
                              ) : null}
                           </div>
                        );
                     })}
                  </div>
                  {/* <Accordion type="single" collapsible className="w-full overflow-y-scroll">
                     <AccordionItem className="px-2 text-xs border-neutral-700" value="item-1">
                        <AccordionTrigger className=" ">
                           <div className="flex flex-row items-center gap-3">
                              <div
                                 style={{
                                    backgroundColor: "green",
                                 }}
                                 className="rounded-full w-3 h-3"
                              ></div>{" "}
                              <p>Jumps down</p>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                     </AccordionItem>
                     <AccordionItem className="px-2 text-xs border-neutral-700" value="item-2">
                        <AccordionTrigger>Jumps up</AccordionTrigger>
                        <AccordionContent>Yes. It comes with default styles that matches the other components&apos; aesthetic.</AccordionContent>
                     </AccordionItem>
                  </Accordion> */}

                  {/* <div
                     style={{
                        touchAction: "none",
                     }}
                     className="w-full    "
                  > */}
                  <textarea
                     value={getFirstSelectedFormation()?.notes || ""}
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
                        minHeight: 180,
                     }}
                     className="dark:bg-neutral-900 transition bg-neutral-50 mt-auto w-full focus:outline-none p-3 text-sm border-t border-neutral-300 focus:border-pink-300 dark:border-neutral-600 dark:focus:border-pink-600 resize-none "
                     cols={30}
                     rows={9}
                     placeholder="Formation notes..."
                  ></textarea>
                  {/* </div> */}
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
