import { dancer, dancerPosition, formation, localSettings, stageDimensions } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Dancer } from "../Dancer";
import dynamic from "next/dynamic";
const CirclePicker = dynamic(() => import("react-color").then((module) => module.CirclePicker), {
   loading: () => <p>Loading color picker...</p>,
});

import { v4 as uuidv4 } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const Roster: React.FC<{
   setDancers: Function;
   dancers: dancer[];
   formations: formation[];
   selectedFormation: number | null;
   viewOnly: boolean;
   cloudSettings: any;
   setFormations: Function;
   addToStack: Function;
   pushChange: Function;
   selectedDancers: string[];
   removeDancer: Function;
   setSelectedDancers: Function;
   localSettings: localSettings;
}> = ({
   setDancers,
   dancers,
   formations,
   selectedFormation,
   cloudSettings,
   setFormations,
   pushChange,
   addToStack,
   selectedDancers,
   removeDancer,
   setSelectedDancers,
   viewOnly,
   localSettings,
}) => {
   let { stageDimensions } = cloudSettings;
   const [uniqueDancers, setUniqueDancers] = useState<string[]>([]);
   const supabase = createClientComponentClient();
   const session = useSession();
   // useEffect(() => {
   //    if (!session) return;
   //    supabase
   //       .rpc("unique_dancers", {
   //          p_user_id: session?.user?.id,
   //       })
   //       .then((r) => {
   //          if (!r?.data?.length) return;
   //          setUniqueDancers(r.data?.map((dancer: any) => dancer.dancer_name));
   //       });
   // }, []);
   let height = convertToFeetAndInches(dancers.find((dancer) => dancer.id === selectedDancers[0])?.height || 182.88);

   const [isSavingRoster, setIsSavingRoster] = useState(false);
   const [rosterName, setRosterName] = useState("");

   const createNewRoster = async () => {
      const response = await supabase.from("rosters").insert([
         {
            name: rosterName,
            user_id: session?.user?.id,
            roster: JSON.parse(JSON.stringify(dancers)).map((dancer: any) => {
               delete dancer.id;
               return dancer;
            }),
         },
      ]);

      if (!response.error) {
         toast.success("Roster saved");
      }
   };

   const createNewDancer = () => {
      let id = uuidv4();
      setDancers((dancers: dancer[]) => {
         return [
            ...dancers,
            {
               name: "New dancer",
               id,
               instagramUsername: null,
            },
         ];
      });

      setFormations((formations: formation[]) => {
         return formations.map((formation, index) => {
            let position = { x: 0, y: 0 };
            for (let y = Math.floor(stageDimensions.height / 2) - 1; y >= -(Math.floor(stageDimensions.height / 2) - 1); y--) {
               let leftSide = formation.positions.find(
                  (position) => position.position.x === -(Math.floor(stageDimensions.width / 2) - 1) && position.position.y === y
               );
               if (!leftSide) {
                  position = { x: -(Math.floor(stageDimensions.width / 2) - 1), y };
                  break;
               }

               let rightSide = formation.positions.find(
                  (position) => position.position.x === Math.floor(stageDimensions.width / 2) - 1 && position.position.y === y
               );
               if (!rightSide) {
                  position = { x: Math.floor(stageDimensions.width / 2) - 1, y };
                  break;
               }
            }

            return { ...formation, positions: [...formation.positions, { id, position }] };
         });
      });

      pushChange();
   };

   const setDancerShape = (shape: string) => {
      setDancers((dancers: dancer[]) => {
         return dancers.map((dancer) => {
            if (selectedDancers.includes(dancer.id)) {
               return { ...dancer, shape: shape };
            }
            return dancer;
         });
      });
   };
   return (
      <>
         {isSavingRoster ? (
            <>
               <Toaster></Toaster>
               <div
                  className="fixed top-0 left-0 z-[70] flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
                  id="outside"
                  onClick={(e) => {
                     if (e.target.id === "outside") {
                        setIsSavingRoster(false);
                     }
                  }}
               >
                  <div className="flex  w-[500px] flex-col   bg-neutral-800/90 border border-neutral-500  rounded-xl  text-sm ">
                     <div className="flex flex-col rounded-xl px-10 pt-5 pb-6 h-full">
                        <p className="text-white text-lg mb-2 font-semibold">Name your roster</p>
                        <p className="mb-4 text-xs text-neutral-400">
                           Save your roster to easily create new performances with an existing roster. Performer height, color, and shape will all be
                           saved
                        </p>
                        <div className="flex flex-row justify-between items-stretch border-neutral-500 overflow-hidden bg-neutral-700 border rounded-md ">
                           <input
                              value={rosterName}
                              onChange={(e) => {
                                 setRosterName(e.target.value);
                              }}
                              className=" bg-transparent   w-full mr-2 h-8 py-4   text-neutral-200 text-sm  px-2 focus:outline-none"
                              type="text"
                              placeholder="Roster name"
                           />
                           <button
                              onClick={async (e) => {
                                 createNewRoster();
                                 setIsSavingRoster(false);
                              }}
                              className="text-sm bg-neutral-600 text-neutral-200 w-14 grid place-items-center  "
                           >
                              Save
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </>
         ) : null}
         <div className="lg:flex hidden w-[260px]  min-w-[260px] flex-col overflow-hidden  bg-white dark:bg-neutral-800 dark:text-white h-full ">
            <div className="flex-grow overflow-y-scroll">
               {dancers.slice().map((dancer, index) => (
                  <Dancer
                     viewOnly={viewOnly}
                     uniqueDancers={uniqueDancers}
                     pushChange={pushChange}
                     setSelectedDancers={setSelectedDancers}
                     selectedDancers={selectedDancers}
                     setFormations={setFormations}
                     formations={formations}
                     selectedFormation={selectedFormation}
                     setDancers={setDancers}
                     dancer={dancer}
                     key={dancer.id}
                     dancers={dancers}
                     index={index}
                     localSettings={localSettings}
                  />
               ))}
            </div>
            {/* <div className="bg-blue-200 flex-grow  overflow-y-auto"></div> */}

            <div className=" min-h-[350px] h-[350px]  flex flex-col   ">
               {/* <div className="flex flex-col items-start mr-5">
                           <input
                              defaultValue={dancers.find((dancer) => dancer.id === editingDancer)?.instagramUsername || ""}
                              onBlur={(e) => {
                                 setDancers((dancers: dancer[]) => {
                                    return dancers.map((dancer) => {
                                       if (dancer.id === editingDancer) {
                                          return { ...dancer, instagramUsername: e.target.value };
                                       }
                                       return dancer;
                                    });
                                 });
                              }}
                              placeholder="Image URL"
                              className=" border-neutral-300 border rounded-md focus:outline-none px-2 h-8  grow text-sm "
                              type="text"
                           />
                           <p className="text-xs text-neutral-500  mt-2">For profile picture</p>
                        </div> */}

               {!viewOnly ? (
                  <>
                     <div className="flex flex-row items-center text-xs justify-between py-2 border-y border-neutral-200 dark:border-neutral-700 px-2">
                        <button onClick={() => setIsSavingRoster(true)} className=" flex flex-row items-center ">
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
                        </button>
                        <button onClick={createNewDancer} className=" flex flex-row items-center ">
                           <p className="ml-auto mr-2">New Dancer</p>
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
               ) : null}

               {selectedDancers.length ? (
                  <div
                     className="px-3 mt-3"
                     style={{
                        pointerEvents: viewOnly ? "none" : "auto",
                     }}
                  >
                     <p className="   text-sm mb-2 font-medium">Height</p>
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
                     </div>
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
                        color={dancers.find((dancer) => dancer.id === selectedDancers[0])?.color}
                        onChangeComplete={(color, event) => {
                           setDancers((dancers: dancer[]) => {
                              return dancers.map((dancer) => {
                                 if (selectedDancers.includes(dancer.id)) {
                                    return { ...dancer, color: color.hex };
                                 }
                                 return dancer;
                              });
                           });
                           pushChange();
                        }}
                     />
                  </div>
               ) : (
                  <p className="h-full w-full grid place-items-center">No Dancers Selected</p>
               )}
               {!viewOnly ? (
                  // <div
                  //    onClick={() => {
                  //       selectedDancers.forEach((dancerId) => {
                  //          removeDancer(dancerId);
                  //       });
                  //       setSelectedDancers([]);
                  //       // console.log(selectedDancers);
                  //       pushChange();
                  //    }}
                  //    className=" mt-auto  w-full text-sm  cursor-pointer select-none  text-center  bg-opacity-80 py-2 bg-red-600 text-white  "
                  // >
                  //    Delete Dancer
                  // </div>

                  <div className="mt-auto p-2">
                     <div
                        style={{
                           opacity: selectedDancers.length ? 1 : 0.5,
                           pointerEvents: selectedDancers.length ? "all" : "none",
                        }}
                        onClick={() => {
                           setSelectedDancers([]);
                           selectedDancers.forEach((dancerId) => {
                              removeDancer(dancerId);
                           });
                           // setSelectedDancers([]);
                           // setSelectedDancers([dancers[dancers.length - 1]?.id || ""]);
                           // console.log(selectedDancers);
                           pushChange();
                        }}
                        className="  w-full text-sm shadow-sm cursor-pointer select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 py-2 bg-red-500 dark:text-red-400 text-red-600  "
                     >
                        Delete Dancer
                     </div>
                  </div>
               ) : null}
            </div>
         </div>
      </>
   );
};

function convertToCentimeters(feet: number, inches: number): number {
   const inchesToCentimeters = inches * 2.54;
   const feetToCentimeters = feet * 12 * 2.54;
   const totalCentimeters = inchesToCentimeters + feetToCentimeters;
   return Math.round(totalCentimeters * 10) / 10;
}

function convertToFeetAndInches(centimeters: number): { feet: number; inches: number } {
   const inchesToCentimeters = 2.54;
   const inches = Math.round(centimeters / inchesToCentimeters);
   const feet = Math.floor(inches / 12);
   return { feet, inches: inches % 12 };
}