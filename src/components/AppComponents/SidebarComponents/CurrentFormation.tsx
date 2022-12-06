import { dancer, dancerPosition, formation } from "../../../types/types";
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
}) => {
   useEffect(() => {
      if (selectedDancers.length === 1) {
         const element = document.getElementById(`scroll-${selectedDancers[0]}`);

         if (!element) return;
         element.scrollIntoView({ behavior: "smooth" });
      }
   }, [selectedDancers]);

   return (
      <>
         <div className=" flex flex-col  w-[23%]  bg-white border-r border-r-gray-300 ">
            {selectedFormation !== null && formations[selectedFormation]?.name !== null ? (
               <div className="h-full  flex flex-col ">
                  <div className="flex flex-row items-center mb-3 px-6 pt-6 ">
                     <p className="text-2xl text-gray-500 mr-2 ">#{selectedFormation + 1}</p>
                     <input
                        className="font-medium w-full px-2 rounded-md  h-6 text-2xl  py-4 transition duration-300 hover:bg-gray-100 text-gray-600 focus:bg-gray-100 outline-none cursor-pointer "
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
                  <div className="flex flex-row items-center justify-between w-full px-6 ">
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
                  <hr className=" " />
                  <div className="p-4">
                     <textarea
                        onKeyDown={(e) =>
                           e.key === "Enter"
                              ? setFormations((formations: formation[]) => {
                                   return formations.map((formation, i) => {
                                      if (i === selectedFormation) {
                                         return {
                                            ...formation,
                                            notes: e.target.value,
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
                                       notes: e.target.value,
                                    };
                                 }

                                 return formation;
                              });
                           });
                        }}
                        key={formations[selectedFormation]?.notes}
                        defaultValue={formations[selectedFormation]?.notes || ""}
                        placeholder="formation notes..."
                        className="resize-none w-full p-2 text-gray-800 h-full border border-gray-400 focus:outline-none rounded-md"
                        rows={15}
                     ></textarea>
                  </div>
                  {/* <div className=" px-4 overflow-y-scroll removeScrollBar pt-4 ">
                     <div className="rounded-md border border-gray-300  text-sm flex flex-col items-center justify-center ,t-3">
                        <div className="bg-blue-200 h-6 w-full text-black rounded-t-md px-3 flex flex-col justify-center">
                           <p>Kishan Sripada</p>
                        </div>
                        <p className="p-3 w-full">
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit,{" "}
                           <span className="text-blue-700 font-semibold cursor-pointer">@Kishan Sripada</span> sed do eiusmod tempor incididunt ut
                           labore et dolore magna aliqua.
                        </p>
                     </div>
                     <div className="rounded-md border border-gray-300  text-sm flex flex-col items-center justify-center mt-3">
                        <div className="bg-red-200 h-6 w-full text-black rounded-t-md px-3 flex flex-col justify-center">
                           <p>Nandan Sripada</p>
                        </div>
                        <p className="p-3 w-full">Lorem ipsum dolor sit amet</p>
                     </div>
                     <div className="rounded-md border border-gray-300  text-sm flex flex-col items-center justify-center mt-3">
                        <div className="bg-green-200 h-6 w-full text-black rounded-t-md px-3 flex flex-col justify-center">
                           <p>Sasha Shrestha</p>
                        </div>
                        <p className="p-3 w-full">
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                     </div>
                     <div className="rounded-md border border-gray-300  text-sm flex flex-col items-center justify-center mt-3">
                        <div className="bg-orange-200 h-6 w-full text-black rounded-t-md px-3 flex flex-row justify-between">
                           <p>Kishan Sripada</p>
                           <div>{new Date().toDateString()}</div>
                        </div>
                        <p className="p-3 w-full">
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                     </div>
                  </div> */}

                  <hr className="mt-auto" />
                  <div className="px-6 mt-2 mb-4">
                     <div className="flex flex-row items-end justify-center ">
                        <p className="font-medium text-xl mr-auto">
                           {selectedDancers.length === 0
                              ? "no dancers selected"
                              : selectedDancers.length === 1
                              ? dancers.find((dancer) => dancer.id === selectedDancers[0])?.name
                              : "multiple dancers selected"}
                        </p>

                        {selectedDancers.length &&
                        formations[selectedFormation]?.positions
                           .filter((dancer) => {
                              return selectedDancers.includes(dancer.id);
                           })
                           .map((dancer) => dancer.position.x > -(stageDimensions.width / 2 - 2))
                           .every((value) => value) ? (
                           <p className="italic text-xs text-gray-600">on stage</p>
                        ) : (
                           <p className="italic text-xs text-gray-600">off stage</p>
                        )}
                     </div>
                     <p className="font-medium mt-5 mb-2">path to this formation</p>
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
                           }}
                        >
                           {selectedDancers.length &&
                           formations[selectedFormation - 1]?.positions
                              .filter((dancer) => {
                                 return selectedDancers.includes(dancer.id);
                              })
                              .map((dancer) => dancer.transitionType)
                              .every((item) => item === "linear") ? (
                              <div className="rounded-full h-4 w-4 border-blue-400 border mr-3 grid place-items-center">
                                 <div className="rounded-full h-2 w-2 bg-blue-400"></div>
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
                                    <div className="rounded-full h-4 w-4 border-blue-400 border mr-3 grid place-items-center">
                                       <div className="rounded-full h-2 w-2 bg-blue-400"></div>
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

                  <ul className="mt-1 flex flex-col overflow-y-scroll pr-3 text-sm">
                     <hr />
                  </ul>

                  {/* <div className="flex flex-row mt-auto pb-3  pt-3 justify-center items-center ">
                     <button
                        className="btn btn-error btn-sm  mx-2 w-1/2 "
                        onClick={() => {
                           if (selectedFormation === formations.length - 1) {
                              setSelectedFormation((selectedFormation: number) => selectedFormation - 1);
                           }

                           setFormations((formations: formation[]) => {
                              return formations.filter((_, index) => {
                                 return index !== selectedFormation;
                              });
                           });
                           toast.success("formation deleted");
                        }}
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className=" w-5 h-5 mr-2">
                           <path
                              fillRule="evenodd"
                              d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                              clipRule="evenodd"
                           />
                        </svg>
                        <p className=""> delete</p>
                     </button>
                  </div> */}
               </div>
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
