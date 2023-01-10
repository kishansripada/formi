import { dancer, dancerPosition, formation, initials } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

export const CurrentFormation: React.FC<{
   selectedFormation: number | null;
   formations: formation[];
   setFormations: Function;
   dancers: dancer[];
   setSelectedFormation: Function;
   selectedDancers: string[];
   setSelectedDancers: Function;
   stageDimensions: any;
   pricingTier: string;
   addToStack: Function;
   pushChange: Function;
   isCommenting: boolean;
   setIsCommenting: Function;
}> = ({
   formations,
   selectedFormation,
   setFormations,
   dancers,
   setSelectedFormation,
   selectedDancers,
   setSelectedDancers,
   stageDimensions,
   pricingTier,
   addToStack,
   pushChange,
   isCommenting,
   setIsCommenting,
}) => {
   useEffect(() => {
      if (selectedDancers.length === 1) {
         const element = document.getElementById(`scroll-${selectedDancers[0]}`);

         if (!element) return;
         element.scrollIntoView({ behavior: "smooth" });
      }
   }, [selectedDancers]);

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
         <div className=" lg:flex hidden  min-w-[350px] w-[23%] flex-col h-full  bg-white border-r border-r-gray-300 ">
            {selectedFormation !== null && formations[selectedFormation]?.name !== null ? (
               <>
                  <div className="flex flex-row items-center mb-3 px-6 pt-5 ">
                     <input
                        className="font-medium w-full px-2 rounded-md  h-6 text-2xl  py-4 transition duration-300 hover:bg-gray-100 text-gray-800 focus:bg-gray-100 outline-none cursor-pointer "
                        onKeyDown={(e) =>
                           e.key === "Enter"
                              ? setFormations((formations: formation[]) => {
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
                              : null
                        }
                        onBlur={(e) => {
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
                           });
                        }}
                        type="text"
                        key={formations[selectedFormation]?.name}
                        defaultValue={formations[selectedFormation]?.name || ""}
                     />
                  </div>

                  <div className="flex flex-row items-center justify-between w-full px-6  ">
                     <p className="text-lg text-gray-500">
                        {Math.round(
                           (formations[selectedFormation]?.durationSeconds + formations[selectedFormation]?.transition.durationSeconds) * 10
                        ) / 10}
                        s
                     </p>
                     <div className="flex flex-row items-center justify-center">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-4 h-4 mr-1 stroke-gray-500"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                           />
                        </svg>
                        <p className="text-lg text-gray-500 ">
                           {
                              formations[selectedFormation]?.positions.filter((dancer) => {
                                 return dancer.position.x > -(stageDimensions.width / 2 - 2) && dancer.position.x < stageDimensions.width / 2 - 2;
                              }).length
                           }
                        </p>
                     </div>
                  </div>
                  <hr className="mt-3 " />

                  <div className="px-6 flex flex-col ">
                     <div className=" mt-6 mb-4 min-h-[130px]">
                        <div className="flex flex-row  justify-between items-start  ">
                           <div className="flex flex-col ">
                              <p
                                 className="font-medium text-xl mr-auto z-10"
                                 // style={{
                                 //    textDecoration: selectedDancers.length === 1 ? "underline" : "none",
                                 //    textDecorationColor: dancers.find((dancer) => dancer.id === selectedDancers[0])?.color,
                                 //    textDecorationWidth: 100,
                                 //    textDecorationThickness: 4,
                                 // }}
                              >
                                 {selectedDancers.length === 0
                                    ? "no dancers selected"
                                    : selectedDancers.length === 1
                                    ? dancers.find((dancer) => dancer.id === selectedDancers[0])?.name
                                    : "multiple dancers selected"}
                              </p>

                              {/* <div
                                 className="w-full h-2 relative "
                                 style={{
                                    backgroundColor: dancers.find((dancer) => dancer.id === selectedDancers[0])?.color,
                                    opacity: 0.7,
                                    bottom: 5,
                                 }}
                              ></div> */}
                           </div>

                           {selectedDancers.length === 1 ? (
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
                           ) : null}
                        </div>
                        <p className=" mt-5 mb-2 font-medium text-gray-700">path</p>
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
                                          if (index === selectedFormation - 1) {
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
                              formations[selectedFormation - 1]?.positions
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

                              <p>straight</p>
                           </div>

                           <div
                              className={`p-4 flex flex-row items-center `}
                              onClick={() => {
                                 if (pricingTier === "basic") {
                                    toast("that's a premium feature", {
                                       icon: "😛",
                                    });
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

                                       const getMidpoint = (x1, y1, x2, y2) => ({ x: (x1 + x2) / 2, y: (y1 + y2) / 2 });
                                       const getSlope = (x1, y1, x2, y2) => {
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
                                          if (index === selectedFormation - 1) {
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
                                    formations[selectedFormation - 1]?.positions
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

                              <p className={`${pricingTier === "basic" ? "opacity-40" : ""}`}>curved</p>
                           </div>
                        </div>
                     </div>
                  </div>

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
                                    onClick={() => deleteComment(comment.id)}
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
                        onClick={() =>
                           setIsCommenting((isCommenting: boolean) => {
                              return !isCommenting;
                           })
                        }
                        className="border border-gray-200  rounded-xl w-full text-sm shadow-sm cursor-pointer select-none  mt-auto grid place-items-center text-gray-700 py-4  "
                     >
                        {isCommenting ? "cancel" : "add comment"}
                     </div>
                  </div>
               </>
            ) : (
               <>
                  <p className="text-center mt-16">no formation selected </p>
               </>
            )}
         </div>
         <Toaster></Toaster>
      </>
   );
};
