import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { fromPairs } from "lodash";

export const CurrentFormation: React.FC<{
   selectedFormation: number | null;
   formations: formation[];
   setFormations: Function;
   dancers: dancer[];
   setSelectedFormation: Function;
}> = ({ formations, selectedFormation, setFormations, dancers, setSelectedFormation }) => {
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
         <div className=" flex flex-col  w-1/4 mr-3 border-black rounded-xl border-1 mb-6 px-3 bg-white">
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
                  <hr className="mx-[-12px]" />
                  <ul className="mt-4 flex flex-col">
                     <li className=" mt-2 flex flex-row justify-between font-semibold">
                        <p className="">Name</p>
                        <p className="flex flex-row items-center ">
                           Enter from:
                           <button className="peer ml-2">
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
                           {/* <div className="peer-hover:opacity-100 absolute right-[160px] text-wrap w-96 z-50 py-2 px-3 text-sm  text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 pointer-events-none">
                              <p>
                                 available to dancers who are not in the previous formation and must enter the stage during the previous formation's
                                 transition
                              </p>

                              <p>choose which side of the stage they enter from</p>
                           </div> */}
                        </p>
                        <p className="flex flex-row items-center">
                           Exit to:
                           <button className="peer ml-2">
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
                           {/* <div className="peer-hover:opacity-100 absolute right-[50px] text-wrap w-96 z-50 py-2 px-3 text-sm  text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 pointer-events-none">
                              <p>available to dancers who are not in the next formation and must exit the stage during this formation's transition</p>

                              <p>choose which side of the stage they exit towards</p>
                           </div> */}
                        </p>
                     </li>
                     <hr />
                     {dancersInThisFormation?.map((dancer) => {
                        return (
                           <>
                              <li className=" my-2 flex flex-row items-center">
                                 <p className="w-1/3">{dancer.name}</p>

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
                                    className={`w-1/3 mx-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500   py-[5px] px-[5px] ${
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
                                    className={`w-1/3 mx-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500   py-[5px] px-[5px] ${
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
                           </>
                        );
                     })}
                  </ul>

                  {/* <div className="h-full flex flex-col">
                     <div className="h-1/2 flex flex-col">
                        <div className="flex flex-row justify-between items-center">
                           <p className="text-xl">Enter From:</p>
                           <button className="peer">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-5 h-5"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                 />
                              </svg>
                           </button>
                           <div className="peer-hover:opacity-100 absolute right-[50px] text-wrap w-96 z-50 py-2 px-3 text-sm  text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 pointer-events-none">
                              <p>
                                 dancers who are not in the previous formation and must enter the stage during the previous formation's transition
                              </p>

                              <p>choose which side of the stage they enter from</p>
                           </div>
                        </div>

                        <div
                           className={`${
                              dancersWhoAreNotInPreviousFormation?.length ? "border-pink-500" : "border-gray-500"
                           } border-[2px] rounded-md px-3 py-2 mb-2 grow`}
                        >
                           {dancersWhoAreNotInPreviousFormation?.map((dancer: dancerPosition, i: number) => (
                              <div className="flex flex-row justify-between w-full" key={i}>
                                 {dancers.find((dancerx) => dancerx.id === dancer.id)?.name}
                                 <select
                                    className=" focus:outline-none outline-1 outline-gray-300"
                                    defaultValue={
                                       formations[selectedFormation]?.positions.find((dancerPosition) => dancerPosition.id === dancer.id)
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
                                 >
                                    <option value="closest"></option>
                                    <option value="left">left</option>
                                    <option value="right">right</option>
                                 </select>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="h-1/2 flex flex-col">
                        <div className="flex flex-row justify-between items-center">
                           <p className="text-xl">Exit Towards:</p>
                           <button className="peer">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-5 h-5"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                 />
                              </svg>
                           </button>
                           <div className="peer-hover:opacity-100 absolute right-[50px] text-wrap w-96 z-50 py-2 px-3 text-sm  text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 pointer-events-none">
                              <p>dancers who are not in the next formation and must exit the stage during this formation's transition</p>

                              <p>choose which side of the stage they exit towards</p>
                           </div>
                        </div>

                        <div
                           className={`${
                              dancersWhoAreNotInNextFormation?.length ? "border-pink-500" : "border-gray-500"
                           } border-[2px] rounded-md px-3 py-2 mb-2 grow`}
                        >
                           {dancersWhoAreNotInNextFormation?.map((dancer: dancerPosition, i) => (
                              <div className="flex flex-row justify-between w-full" key={i}>
                                 {dancers.find((dancerx) => dancerx.id === dancer.id)?.name}
                                 <select
                                    className=" focus:outline-none outline-1 outline-gray-300"
                                    defaultValue={
                                       formations[selectedFormation]?.positions.find((dancerPosition) => dancerPosition.id === dancer.id)
                                          ?.exitStrategy
                                    }
                                    onChange={(e) =>
                                       setFormations((formations: formation[]) => {
                                          return formations.map((formation, index: number) => {
                                             if (index === selectedFormation) {
                                                return {
                                                   ...formation,
                                                   positions: formation.positions.map((dancerPosition) => {
                                                      if (dancerPosition.id === dancer.id) {
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
                                 >
                                    <option value="closest"></option>
                                    <option value="left">left</option>
                                    <option value="right">right</option>
                                 </select>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div> */}

                  <div className="flex flex-row  mt-auto">
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
