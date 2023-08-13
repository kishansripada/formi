import { dancer, dancerPosition, formation, localSettings, segment, stageDimensions } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Dancer } from "../Dancer";
import dynamic from "next/dynamic";
const CirclePicker = dynamic(() => import("react-color").then((module) => module.CirclePicker), {
   loading: () => <p>Loading color picker...</p>,
});
import { v4 as uuidv4 } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthSession } from "@supabase/supabase-js";

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

            <div className=" min-h-[350px] h-[350px]  flex flex-col   ">
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
                     {/* <p className="   text-sm mb-2 font-medium">Height</p>
                     <div className="flex flex-row items-center  w-full ">
                        <div className="flex flex-row items-center border border-neutral-200 dark:border-neutral-700">
                           <input
                              onBlur={pushChange}
                              value={height.feet}
                              type="number"
                              onChange={(e) => {
                                 // setHeightFeet(parseInt(e.target.value));
                                 if (height.feet === null || height.feet === undefined) return;
                                 setDancers((dancers: dancer[]) => {
                                    return dancers.map((dancer) => {
                                       if (selectedDancers.includes(dancer.id)) {
                                          return { ...dancer, height: convertToCentimeters(parseInt(e.target.value), height.inches) };
                                       }
                                       return dancer;
                                    });
                                 });
                              }}
                              style={{
                                 borderRadius: 0,
                              }}
                              className="w-[45px] p-1 focus:outline-none rounded-none text-center dark:bg-neutral-800  "
                           />
                           <p className="mx-1">ft</p>
                        </div>
                        <div className="flex flex-row items-center border border-neutral-200 ml-4 dark:border-neutral-700">
                           <input
                              onBlur={pushChange}
                              type="number"
                              value={height.inches}
                              onChange={(e) => {
                                 // setHeightIn(parseInt(e.target.value));
                                 if (height.inches === null || height.inches === undefined) return;
                                 setDancers((dancers: dancer[]) => {
                                    return dancers.map((dancer) => {
                                       if (selectedDancers.includes(dancer.id)) {
                                          return { ...dancer, height: convertToCentimeters(height.feet, parseInt(e.target.value)) };
                                       }
                                       return dancer;
                                    });
                                 });
                              }}
                              style={{
                                 borderRadius: 0,
                              }}
                              className="w-[45px] p-1 focus:outline-none rounded-none text-center  dark:bg-neutral-800"
                           />
                           <p className="mx-1">in</p>
                        </div>
                     </div>
                     <p className=" text-neutral-800 dark:text-white  text-sm mb-2 mt-2 font-medium">Shape</p>

                     <div className="w-full flex flex-row items-center child:mr-2">
                        <button
                           onClick={() => {
                              setDancerShape("circle");
                           }}
                        >
                           <svg className="w-8 h-8 dark:fill-white  " xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                              <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
                           </svg>
                        </button>

                        <button
                           onClick={() => {
                              setDancerShape("square");
                           }}
                        >
                           <svg className="w-8 h-8 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                              <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z" />
                           </svg>
                        </button>
                        <button
                           onClick={() => {
                              setDancerShape("triangle");
                           }}
                        >
                           <svg className="w-8 h-8 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                              <path d="m80-160 401-640 399 640H80Zm107-60h586L481-685 187-220Zm293-233Z" />
                           </svg>
                        </button>
                     </div> */}
                     <p className=" text-neutral-800  text-sm mb-2 mt-2 font-medium">Color</p>

                     <CirclePicker
                        colors={[
                           "#0074D9", // bright blue
                           "#FF4136", // bright red
                           "#2ECC40", // bright green
                           "#FF851B", // bright orange
                           "#7FDBFF", // sky blue
                           "#B10DC9", // bright purple
                           "#FFDC00", // bright yellow
                           "#001f3f", // navy blue
                           "#DB2777", // pink
                           "#3D9970", // muted green
                        ]}
                        color={segments.find((segment) => segment.id === selectedSegment)?.color || "#db2777"}
                        onChangeComplete={(color, event) => {
                           // setDancers((dancers: dancer[]) => {
                           //    return dancers.map((dancer) => {
                           //       if (selectedDancers.includes(dancer.id)) {
                           //          return { ...dancer, color: color.hex };
                           //       }
                           //       return dancer;
                           //    });
                           // });
                           setSegments((segments: segment[]) => {
                              return segments.map((segment) => {
                                 if (segment.id === selectedSegment) {
                                    return { ...segment, color: color.hex };
                                 }
                                 return segment;
                              });
                           });
                           pushChange();
                        }}
                     />
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
