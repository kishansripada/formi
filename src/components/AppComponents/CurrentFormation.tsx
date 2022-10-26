import { dancer, dancerPosition, formation } from "../../types/types";
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
}> = ({ formations, selectedFormation, setFormations, dancers, setSelectedFormation, selectedDancers, setSelectedDancers }) => {
   useEffect(() => {
      if (selectedDancers.length === 1) {
         const element = document.getElementById(`scroll-${selectedDancers[0]}`);

         if (!element) return;
         element.scrollIntoView({ behavior: "smooth" });
      }
   }, [selectedDancers]);

   let dancersWhoAreNotInNextFormation =
      selectedFormation !== null
         ? formations?.[selectedFormation]?.positions.filter((dancerPosition: dancerPosition) => {
              return !formations[selectedFormation + 1]?.positions.find((dancer) => dancer.id === dancerPosition.id);
           })
         : [];

   let dancersInThisFormation =
      selectedFormation !== null
         ? dancers.filter((dancer) => {
              return formations?.[selectedFormation]?.positions.find((dancerPosition) => dancerPosition.id === dancer.id);
           })
         : [];

   let dancersWhoAreNotInPreviousFormation =
      selectedFormation === 0 || selectedFormation === null
         ? []
         : formations[selectedFormation]?.positions.filter((dancerPosition: dancerPosition) => {
              return !formations[selectedFormation - 1]?.positions.find((dancer) => dancer.id === dancerPosition.id);
           });

   return (
      <>
         <div className=" flex flex-col  w-[50%] mr-3 border-black rounded-xl border-1 mb-6 px-3 bg-white">
            {selectedFormation !== null && formations[selectedFormation]?.name !== null ? (
               <div className="h-full  flex flex-col">
                  <input
                     className="font-semibold w-full text-center h-6 text-2xl focus:outline-pink-600 rounded-sm  hover:outline-gray-400 focus:outline-2  hover:outline-2 focus:outline hover:outline mt-4 py-4 mb-2"
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
                  <hr className="mx-[-12px] " />
                  <li className=" mt-2 flex flex-row justify-between items-end font-semibold pr-3 ">
                     <p className="w-[40%] text-sm mx-1 ">name</p>
                     <p className="w-[20%]  text-sm text-center mx-1">path to here</p>
                     <div className="flex flex-col items-center w-[20%] justify-center mx-1">
                        <button className="peer">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                              />
                           </svg>
                        </button>
                        <p className=" text-sm text-center ">enter from:</p>
                        <div className="peer-hover:opacity-100 absolute right-[160px]  text-wrap w-96 z-50 py-2 px-3 text-sm  text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 pointer-events-none">
                           <p>
                              available to dancers who are not in the previous formation and must enter the stage during the previous formation's
                              transition
                           </p>

                           <p>choose which side of the stage they enter from</p>
                        </div>
                     </div>
                     <div className="flex flex-col items-center w-[20%] justify-center mx-1">
                        <button className="peer">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                              />
                           </svg>
                        </button>
                        <p className=" text-sm text-center ">exit to:</p>

                        <div className="peer-hover:opacity-100 absolute right-[80px]  w-96 z-50 py-2 px-3 text-sm  text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition duration-300 pointer-events-none">
                           <div>
                              available to dancers who are not in the next formation and must exit the stage during this formation's transition
                           </div>

                           <div>choose which side of the stage they exit towards</div>
                        </div>
                     </div>
                  </li>

                  <ul className="mt-1 flex flex-col overflow-y-scroll pr-3 text-sm">
                     <hr />
                     {dancersInThisFormation?.map((dancer) => {
                        return (
                           <div className="" key={dancer.id} id={`scroll-${dancer.id}`}>
                              <li
                                 onClick={() => setSelectedDancers([dancer.id])}
                                 className={` py-2 rounded-md px-2 flex flex-row items-center my-1 cursor-pointer  ${
                                    selectedDancers.includes(dancer.id) ? "bg-pink-200" : ""
                                 }`}
                              >
                                 <p className="w-[40%]">{dancer.name}</p>
                                 <select
                                    value={
                                       formations[selectedFormation - 1]?.positions.find((dancerPosition) => dancer.id === dancerPosition.id)
                                          ?.transitionType
                                    }
                                    onChange={(e) =>
                                       setFormations((formations: formation[]) => {
                                          let start = formations[selectedFormation - 1]?.positions.find(
                                             (dancerPosition) => dancerPosition.id === dancer.id
                                          )?.position;

                                          let end = formations[selectedFormation]?.positions.find(
                                             (dancerPosition) => dancerPosition.id === dancer.id
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
                                                      if (dancerPosition.id === dancer.id) {
                                                         return {
                                                            ...dancerPosition,
                                                            transitionType: e.target.value,
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
                                       })
                                    }
                                    className={`w-[20%] ${
                                       selectedFormation === 0 ? "opacity-30 pointer-events-none" : ""
                                    } mx-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500   py-[5px]`}
                                 >
                                    <option value="linear">linear</option>
                                    <option value="cubic">cubic</option>
                                 </select>
                                 <select
                                    value={
                                       formations[selectedFormation]?.positions.find((dancerPosition) => dancer.id === dancerPosition.id)
                                          ?.enterStrategy
                                    }
                                    onChange={(e) =>
                                       setFormations((formations: formation[]) => {
                                          return formations.map((formation, index: number) => {
                                             if (index === selectedFormation) {
                                                return {
                                                   ...formation,
                                                   positions: formation.positions.map((dancerPosition) => {
                                                      if (dancerPosition.id === dancer.id) {
                                                         return { ...dancerPosition, enterStrategy: e.target.value };
                                                      }
                                                      return dancerPosition;
                                                   }),
                                                };
                                             }
                                             return formation;
                                          });
                                       })
                                    }
                                    className={`w-[20%] mx-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500   py-[5px] ${
                                       dancersWhoAreNotInPreviousFormation?.find((dancerPosition) => dancerPosition.id === dancer.id)
                                          ? ""
                                          : "opacity-30 pointer-events-none"
                                    }`}
                                 >
                                    <option value="closest"></option>
                                    <option value="left">left</option>
                                    <option value="right">right</option>
                                 </select>
                                 <select
                                    value={
                                       formations[selectedFormation]?.positions.find((dancerPosition) => dancer.id === dancerPosition.id)
                                          ?.exitStrategy
                                    }
                                    onChange={(e) =>
                                       setFormations((formations: formation[]) => {
                                          return formations.map((formation, index: number) => {
                                             if (index === selectedFormation) {
                                                return {
                                                   ...formation,
                                                   positions: formation.positions.map((dancerPosition) => {
                                                      if (dancer.id === dancerPosition.id) {
                                                         return { ...dancerPosition, exitStrategy: e.target.value };
                                                      }
                                                      return dancerPosition;
                                                   }),
                                                };
                                             }
                                             return formation;
                                          });
                                       })
                                    }
                                    className={`w-[20%] mx-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500   py-[5px]  ${
                                       dancersWhoAreNotInNextFormation?.find((dancerPosition) => dancer.id === dancerPosition.id)
                                          ? ""
                                          : "opacity-30 pointer-events-none"
                                    }`}
                                 >
                                    <option value="closest"></option>
                                    <option value="left">left</option>
                                    <option value="right">right</option>
                                 </select>
                              </li>
                              <hr />
                           </div>
                        );
                     })}
                  </ul>
                  <hr />
                  <div>
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
                        placeholder="notes..."
                        className="resize-none w-full px-1 py-1"
                        name=""
                        id=""
                        rows={3}
                     ></textarea>
                  </div>
                  <div className="flex flex-row  mt-auto pt-3">
                     <button
                        className="text-white bg-red-600 px-2 py-1 rounded-md mb-2  flex flex-row items-center justify-center w-1/2 mx-2"
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className=" fill-white w-5 h-5 mr-2">
                           <path
                              fillRule="evenodd"
                              d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                              clipRule="evenodd"
                           />
                        </svg>
                        delete
                     </button>
                     <button
                        className="text-white bg-blue-600 px-2 py-1 rounded-md mb-2  flex flex-row items-center justify-center w-1/2 mx-2"
                        onClick={() => {
                           setFormations((formations: formation[]) => {
                              return formations.map((formation, index) => {
                                 if (index === selectedFormation) {
                                    return { ...formation, positions: [] };
                                 }
                                 return formation;
                              });
                           });
                        }}
                     >
                        clear dancers
                     </button>
                  </div>
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
