import { dancer, dancerPosition, formation, localSettings, segment, stageDimensions } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Dancer } from "../Dancer";
import dynamic from "next/dynamic";

import { v4 as uuidv4 } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthSession } from "@supabase/supabase-js";
import { PopoverPicker } from "../ColorPicker";

export const Segments: React.FC<{
   segments: segment[];
   setSegments: Function;
   viewOnly: boolean;
   pushChange: Function;
}> = ({ segments, setSegments, viewOnly, pushChange }) => {
   const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
   return (
      <>
         <div className="lg:flex hidden w-[260px]  min-w-[260px] flex-col overflow-hidden  bg-white dark:bg-neutral-800 dark:text-white h-full ">
            <div className="flex-grow overflow-y-scroll">
               {segments.slice().map((segment, index) => (
                  //   <Dancer
                  //      viewOnly={viewOnly}
                  //      // uniqueDancers={uniqueDancers}
                  //      pushChange={pushChange}
                  //      setSelectedDancers={setSelectedDancers}
                  //      selectedDancers={selectedDancers}
                  //      setFormations={setFormations}
                  //      formations={formations}
                  //      selectedFormation={selectedFormation}
                  //      setDancers={setDancers}
                  //      dancer={dancer}
                  //      key={dancer.id}
                  //      dancers={dancers}
                  //      index={index}
                  //      localSettings={localSettings}
                  //   />
                  //   <div className="flex flex-row items-center justify-between h-10 px-3">
                  //      <input
                  //         onChange={(e) => {
                  //            setSegments((segments: segment[]) => {
                  //               return segments.map((seg, i) => {
                  //                  if (seg.id === segment.id) {
                  //                     return {
                  //                        ...seg,
                  //                        name: e.target.value,
                  //                     };
                  //                  }
                  //                  return seg;
                  //               });
                  //            });
                  //         }}
                  //         className="bg-transparent"
                  //         type="text"
                  //         value={segment.name}
                  //      />

                  //      <p>{segment.duration}s</p>
                  //   </div>
                  <div
                     style={
                        {
                           // backgroundColor: amSelected ? (isDarkMode ? "#db2777" : "#fbcfe8") : "transparent",
                        }
                     }
                     onClick={() => {
                        setSelectedSegment(segment.id);
                     }}
                     className={`flex flex-row items-center px-5 box-border ${
                        selectedSegment === segment.id ? "bg-pink-200 dark:bg-pink-600" : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                     }  group  select-none   min-h-[40px] `}
                  >
                     <p className="font-semibold   text-sm "> {index + 1}</p>
                     <div className="relative">
                        <input
                           style={{
                              backgroundColor: selectedSegment === segment.id ? (true ? "#db2777" : "#fbcfe8") : "transparent",
                           }}
                           className="h-6 w-full    px-2 py-4  text-sm rounded-md  ml-2    outline-none cursor-default"
                           value={segment.name}
                           //   onBlur={pushChange}
                           //   disabled={viewOnly}
                           onChange={(e) => {
                              setSegments((segments: segment[]) => {
                                 return segments.map((seg, i) => {
                                    if (seg.id === segment.id) {
                                       return {
                                          ...seg,
                                          name: e.target.value,
                                       };
                                    }
                                    return seg;
                                 });
                              });
                           }}
                        />
                        {/* <p className="absolute z-[50] left-[16px] top-[6.5px] text-neutral-500 text-sm">{suggestedDancer}</p> */}
                     </div>

                     <p className="ml-auto text-xs">{Math.round(segment.duration)}s</p>
                  </div>
               ))}
            </div>
            {/* <div className="bg-blue-200 flex-grow  overflow-y-auto"></div> */}

            <div className=" min-h-[200px] h-[200px]  flex flex-col   ">
               {/* {!viewOnly ? ( */}
               <>
                  <div className="flex flex-row items-center text-xs justify-between py-2 border-y border-neutral-200 dark:border-neutral-700 px-2">
                     {/* <button onClick={() => setIsSavingRoster(true)} className=" flex flex-row items-center ">
                           <p className="ml-auto mr-2">Save Roster</p>
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
                                 d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                              />
                           </svg>
                        </button> */}
                     <button
                        style={{
                           pointerEvents: viewOnly ? "none" : "all",
                        }}
                        onClick={() => {
                           setSegments((segments: segment[]) => {
                              return [
                                 ...segments,
                                 {
                                    name: "New segment",
                                    duration: 10,
                                    color: "#db2777",
                                    id: uuidv4(),
                                 },
                              ];
                           });
                        }}
                        className=" flex flex-row items-center "
                     >
                        <p className="ml-auto mr-2">New Segment</p>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-5 h-5"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                     </button>
                  </div>
               </>
               {/* ) : null} */}

               {selectedSegment ? (
                  <div
                     className="px-3 mt-3"
                     style={{
                        pointerEvents: viewOnly ? "none" : "auto",
                     }}
                  >
                     <p className=" dark:text-neutral-300 text-neutral-800  text-sm mb-2 mt-2 font-medium">Color</p>

                     <PopoverPicker
                        dancers={segments}
                        color={segments.find((segment) => segment.id === selectedSegment)?.color || "#db2777"}
                        setColor={(color: string) => {
                           setSegments((segments: segment[]) => {
                              return segments.map((segment) => {
                                 if (segment.id === selectedSegment) {
                                    return { ...segment, color: color };
                                 }
                                 return segment;
                              });
                           });
                           pushChange();
                        }}
                        position="top"
                     ></PopoverPicker>
                  </div>
               ) : (
                  <p className="h-full w-full grid place-items-center">No Segment Selected</p>
               )}
               {/* {!viewOnly ? ( */}
               <div className="mt-auto p-2">
                  <div
                     style={{
                        opacity: selectedSegment ? 1 : 0.5,
                        pointerEvents: selectedSegment ? "all" : "none",
                     }}
                     onClick={() => {
                        setSelectedSegment(null);
                        setSegments(segments.filter((segment) => segment.id !== selectedSegment));
                        //    selectedDancers.forEach((dancerId) => {
                        //       removeDancer(dancerId);
                        //    });

                        //    pushChange();
                     }}
                     className="  w-full text-sm shadow-sm cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-2 bg-red-500 dark:text-red-400 text-red-600  "
                  >
                     Delete Segment
                  </div>
               </div>
               {/* //    ) : null} */}
            </div>
         </div>
      </>
   );
};
