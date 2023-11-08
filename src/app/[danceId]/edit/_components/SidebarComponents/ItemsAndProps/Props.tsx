import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { formation, prop } from "../../../../../../types/types";
// import { v4 as uuidv4 } from "uuid";
import { useStore } from "../../../store";
export const Props: React.FC<{
   audioFiles: any;

   setAudiofiles: Function;
   player: any;
   setIsPlaying: Function;
   setLocalSource: Function;
   selectedPropIds: string[];
   invalidatePropUploads: Function;
   setSelectedPropIds: Function;
   pushChange: Function;
   setHelpUrl: Function;
   setAssetsOpen: Function;
}> = ({ selectedPropIds, setSelectedPropIds, pushChange, setHelpUrl, setAssetsOpen }) => {
   const { formations, setFormations, viewOnly, props, setProps, get } = useStore();

   return (
      <>
         <div className="flex w-full h-full  flex-col overflow-scroll  dark:text-white  ">
            <div className=" font-medium mb-2 flex flex-row  items-center  px-2 text-sm ">
               <p>Set pieces</p>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 ml-1  cursor-pointer"
                  onClick={(e) => {
                     setHelpUrl({ url: "https://www.youtube.com/shorts/rhGn486vJJc", event: e });
                  }}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
               </svg>

               {!viewOnly ? (
                  <button
                     onClick={() => {
                        if (viewOnly) return;
                        setAssetsOpen({ type: "prop" });
                     }}
                     className="ml-auto text-xs flex flex-row items-center"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mr-1"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                     </svg>
                     New set piece
                  </button>
               ) : null}
            </div>

            <div className=" flex flex-col overflow-scroll removeScrollBar  h-full ">
               {props.length ? (
                  [...props].reverse().map((prop: prop) => {
                     return (
                        <div
                           key={prop.url}
                           onClick={() => {
                              setSelectedPropIds([prop.id]);
                              // setAssetsOpen({ type: "prop", id: prop.id });
                           }}
                           className={`  ${
                              selectedPropIds.includes(prop.id)
                                 ? "bg-pink-200 dark:bg-dark-secondary"
                                 : " hover:bg-neutral-100 dark:hover:bg-neutral-700"
                           }  w-full h-[55px] min-h-[55px] relative  group cursor-pointer  px-2   flex flex-row items-center  whitespace-nowrap  `}
                        >
                           <img
                              onClick={() => {
                                 if (viewOnly) return;
                                 setAssetsOpen({ type: "prop", id: prop.id });
                              }}
                              className="h-[55px] w-[55px]  object-contain  cursor-pointer  z-10 "
                              src={`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${prop.user_id}/${prop.url}`}
                              alt=""
                           />

                           <select
                              onChange={(event) => {
                                 if (viewOnly) return;
                                 // if you make a prop static just place it in the middle of the stage
                                 if (event.target.value === "static") {
                                    setProps(
                                       props.map((propx) => {
                                          if (propx.id === prop.id) {
                                             return {
                                                ...propx,
                                                static: {
                                                   width: 5,
                                                   position: {
                                                      x: 0,
                                                      y: 0,
                                                   },
                                                },
                                             };
                                          }
                                          return propx;
                                       })
                                    );
                                 } else {
                                    setFormations(
                                       formations.map((formation) => {
                                          const hasProp = (formation.props || []).find((propx) => propx.id === prop.id);

                                          return {
                                             ...formation,
                                             props: hasProp
                                                ? formation.props
                                                : [...(formation.props || []), { id: prop.id, position: { x: 0, y: 0 } }],
                                          };
                                       })
                                    );
                                 }

                                 const selectedValue = event.target.value;
                                 if (selectedValue === "static" || selectedValue === "dynamic") {
                                    setProps(
                                       props.map((propx) => {
                                          if (propx.id === prop.id) {
                                             return {
                                                ...propx,
                                                type: selectedValue, // Use the selectedValue here
                                             };
                                          }
                                          return propx;
                                       })
                                    );
                                 }
                              }}
                              className="text-xs ml-auto bg-transparent"
                              value={prop.type}
                           >
                              <option value="dynamic">Dynamic</option>
                              <option value="static">Static</option>
                           </select>

                           {/* {prop.type !== "static" ? (
                              <button
                                 onClick={() => {
                                    if ((formations[selectedFormation].props || [])?.find((p) => p.id === prop.id)) {
                                       setFormations((formations: formation[]) => {
                                          return formations.map((formation, i) => {
                                             if (i === selectedFormation) {
                                                return {
                                                   ...formation,
                                                   props: (formation.props || []).filter((propx) => propx.id !== prop.id),
                                                };
                                             }
                                             return formation;
                                          });
                                       });
                                    } else {
                                       setFormations((formations: formation[]) => {
                                          return formations.map((formation, i) => {
                                             if (i === selectedFormation) {
                                                return {
                                                   ...formation,
                                                   props: [...(formation.props || []), { id: prop.id, position: { x: 0, y: 0 }, width: 4 }],
                                                };
                                             }
                                             return formation;
                                          });
                                       });
                                    }

                                    pushChange();
                                 }}
                                 className="ml-4 mr-1"
                              >
                                 {!formations[selectedFormation]?.props?.find((p) => p.id === prop.id) ? (
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                       className="w-5 h-5 stroke-neutral-800 dark:stroke-neutral-200"
                                    >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                 ) : (
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                       className="w-5 h-5 stroke-neutral-800 dark:stroke-neutral-200"
                                    >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                    </svg>
                                 )}
                              </button>
                           ) : null} */}
                        </div>
                     );
                  })
               ) : (
                  <>
                     <p className=" px-4 text-sm">No set pieces</p>
                  </>
               )}
            </div>

            {!viewOnly ? (
               <div className=" p-2 mt-auto">
                  <div
                     style={{
                        opacity: selectedPropIds.length ? 1 : 0.5,
                        pointerEvents: selectedPropIds.length ? "all" : "none",
                     }}
                     onClick={(e) => {
                        if (viewOnly) return;
                        // Remove prop
                        e.stopPropagation();
                        // remove prop from all formations
                        setFormations(
                           formations.map((formation, i) => {
                              return {
                                 ...formation,
                                 props: formation.props?.filter((p) => !selectedPropIds.includes(p.id)),
                              };
                           })
                        );
                        // remove prop from props
                        setProps(props.filter((p) => !selectedPropIds.includes(p.id)));
                        setSelectedPropIds([]);
                        pushChange();
                     }}
                     className="  w-full text-sm shadow-sm cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-2 bg-red-500 dark:text-red-400 text-red-600   "
                  >
                     Delete Set Piece
                  </div>
               </div>
            ) : null}
         </div>

         <Toaster />
      </>
   );
};
