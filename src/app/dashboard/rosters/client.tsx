"use client";
import { dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
// import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { ProjectPreview } from "../myperformances/ProjectPreview";
import { PerformancePreview } from "../_components/PerformancePreview";
import { DndContext, useDroppable, MouseSensor, useSensors, useSensor } from "@dnd-kit/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function PageClient({ rosters }) {
   const router = useRouter();
   const [selectedRosterId, setSelectedRosterId] = useState(rosters[0]?.id || null);
   const selectedRoster = selectedRosterId ? rosters.find((roster) => roster.id === selectedRosterId) : null;
   const supabase = createClientComponentClient();
   return (
      <div className="flex flex-row items-center justify-center w-full h-full pb-10 overflow-hidden">
         <Toaster></Toaster>
         <div className=" w-[250px] mr-6 min-w-[250px] h-full  overflow-hidden text-sm">
            {rosters.length ? (
               <>
                  {rosters.map((roster) => {
                     return (
                        <button
                           onClick={() => {
                              setSelectedRosterId(roster.id);
                           }}
                           className={`flex rounded-xl mb-1 w-full flex-row items-center h-10 min-h-10 px-3 ${
                              selectedRosterId === roster.id ? "bg-neutral-800" : ""
                           }`}
                           key={roster.id}
                        >
                           <p>{roster.name}</p>
                        </button>
                     );
                  })}
               </>
            ) : (
               <>
                  <div>
                     <p>No rosters yet, save one in the roster tab of a performance</p>
                  </div>
               </>
            )}
         </div>

         <div className=" w-full h-full  border border-neutral-700 rounded-xl overflow-hidden ">
            {selectedRoster ? (
               <div className="w-full   flex flex-col h-full  ">
                  <div className="w-full h-10 border-b border-b-neutral-700 py-3 flex flex-row items-center px-3  ">
                     <input
                        className="bg-transparent focus:outline-none focus:border-pink-600 transition border border-transparent rounded-md px-2"
                        defaultValue={selectedRoster.name}
                        onBlur={async (e) => {
                           if (e.target.value === selectedRoster.name) return;
                           const data = await supabase.from("rosters").update({ name: e.target.value }).eq("id", selectedRoster.id);
                           if (!data.error) {
                              router.refresh();
                              toast.success("Roster name updated");
                           }
                        }}
                        type="text"
                     />
                     <p className=" text-xl ml-auto ">
                        {selectedRoster.roster.length} <span className="text-xs text-neutral-300">members</span>
                     </p>
                  </div>
                  <div className="overflow-scroll">
                     {selectedRoster.roster.map((dancer, index) => {
                        return (
                           <div key={dancer.id} className="flex flex-row items-center w-full h-16  min-h-[64px] px-6">
                              <p className="mr-4 text-xl font-bold">{index + 1}</p>
                              <div
                                 style={{
                                    backgroundColor: dancer.color || "#db2777",
                                 }}
                                 className=" rounded-full w-6 h-6 mr-4"
                              ></div>
                              <p>{dancer.name}</p>
                              <div className="ml-auto  mr-4 ">
                                 <p className="text-xl inline">{convertToFeetAndInches(dancer.height || 182.88).feet}</p>{" "}
                                 <span className="text-xs mr-3">feet</span>
                                 <p className="text-xl inline">{convertToFeetAndInches(dancer.height || 182.88).inches}</p>{" "}
                                 <span className="text-xs">inches</span>
                              </div>
                              <div className="">
                                 {dancer.shape === "square" ? (
                                    <svg className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                       <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z" />
                                    </svg>
                                 ) : dancer.shape === "triangle" ? (
                                    <svg className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                       <path d="m80-160 401-640 399 640H80Zm107-60h586L481-685 187-220Zm293-233Z" />
                                    </svg>
                                 ) : (
                                    <svg className="w-8 h-8 fill-white  " xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                       <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
                                    </svg>
                                 )}
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  <div className="w-full h-10 border-t border-t-neutral-700 flex flex-row items-center px-3 mt-auto py-2 ">
                     <button
                        onClick={async () => {
                           // delete roster
                           const data = await supabase.from("rosters").delete().eq("id", selectedRoster.id);

                           if (!data.error) {
                              router.refresh();
                              setSelectedRosterId(rosters[0].id);
                              toast.success("Roster deleted");
                           }
                        }}
                        className="ml-auto  px-3 text-sm shadow-sm cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-2 bg-red-500 text-red-400  "
                     >
                        Delete Roster
                     </button>
                  </div>
               </div>
            ) : null}
         </div>
      </div>
   );
}

function convertToFeetAndInches(centimeters: number): { feet: number; inches: number } {
   const inchesToCentimeters = 2.54;
   const inches = Math.round(centimeters / inchesToCentimeters);
   const feet = Math.floor(inches / 12);
   return { feet, inches: inches % 12 };
}
