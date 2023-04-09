import { dancer, dancerPosition, formation, stageDimensions } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

import { Dancer } from "../Dancer";
import { CirclePicker } from "react-color";
export const Roster: React.FC<{
   setDancers: Function;
   dancers: dancer[];
   formations: formation[];
   selectedFormation: number | null;

   cloudSettings: any;
   setFormations: Function;
   addToStack: Function;
   pushChange: Function;
   selectedDancers: string[];
   removeDancer: Function;
   setSelectedDancers: Function;
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
}) => {
   let { stageDimensions } = cloudSettings;
   let height = convertToFeetAndInches(dancers.find((dancer) => dancer.id === selectedDancers[0])?.height || 182.88);
   const [heightFeet, setHeightFeet] = useState<number>(height.feet);
   const [heightIn, setHeightIn] = useState<number>(height.inches);
   const createNewDancer = () => {
      let id = crypto.randomUUID();
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
            for (let y = stageDimensions.height / 2 - 1; y >= -(stageDimensions.height / 2 - 1); y--) {
               let leftSide = formation.positions.find(
                  (position) => position.position.x === -(stageDimensions.width / 2 - 1) && position.position.y === y
               );
               if (!leftSide) {
                  position = { x: -(stageDimensions.width / 2 - 1), y };
                  break;
               }

               let rightSide = formation.positions.find(
                  (position) => position.position.x === stageDimensions.width / 2 - 1 && position.position.y === y
               );
               if (!rightSide) {
                  position = { x: stageDimensions.width / 2 - 1, y };
                  break;
               }
            }

            return { ...formation, positions: [...formation.positions, { id, position }] };
         });
      });

      pushChange();
   };
   return (
      <>
         <div className="lg:flex hidden w-[260px]  min-w-[260px] flex-col overflow-hidden  bg-white h-full ">
            <div className="flex-grow overflow-y-scroll">
               {dancers.slice().map((dancer, index) => (
                  <Dancer
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
                  />
               ))}
            </div>
            {/* <div className="bg-blue-200 flex-grow  overflow-y-auto"></div> */}

            <hr className="" />
            <div className=" min-h-[300px] h-[300px]  flex flex-col  ">
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

               <button onClick={createNewDancer} className=" mr-2 flex flex-row items-center text-sm justify-center py-2">
                  <p className="ml-auto mr-2">New Dancer</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
               </button>

               <hr />

               {selectedDancers.length ? (
                  <div className="px-3 mt-3">
                     <p className=" text-neutral-800  text-sm mb-2 font-medium">Height</p>
                     <div className="flex flex-row items-center  w-full ">
                        <div className="flex flex-row items-center border border-neutral-200">
                           <input
                              value={heightFeet}
                              type="number"
                              onChange={(e) => {
                                 // if (pricingTier === "basic") {
                                 //    setUpgradeIsOpen(true);
                                 //    return;
                                 // }
                                 setHeightFeet(parseInt(e.target.value));
                                 if (heightFeet === null || heightFeet === undefined) return;
                                 setDancers((dancers: dancer[]) => {
                                    return dancers.map((dancer) => {
                                       if (selectedDancers.includes(dancer.id)) {
                                          return { ...dancer, height: convertToCentimeters(parseInt(e.target.value), heightIn) };
                                       }
                                       return dancer;
                                    });
                                 });
                              }}
                              style={{
                                 borderRadius: 0,
                              }}
                              className="w-[45px] p-1 focus:outline-none rounded-none text-center  "
                           />
                           <p className="mx-1">ft</p>
                        </div>
                        <div className="flex flex-row items-center border border-neutral-200 ml-4">
                           <input
                              type="number"
                              value={heightIn}
                              onChange={(e) => {
                                 // if (pricingTier === "basic") {
                                 //    setUpgradeIsOpen(true);
                                 //    return;
                                 // }
                                 setHeightIn(parseInt(e.target.value));
                                 if (heightFeet === null || heightFeet === undefined) return;
                                 setDancers((dancers: dancer[]) => {
                                    return dancers.map((dancer) => {
                                       if (selectedDancers.includes(dancer.id)) {
                                          return { ...dancer, height: convertToCentimeters(heightFeet, parseInt(e.target.value)) };
                                       }
                                       return dancer;
                                    });
                                 });
                              }}
                              style={{
                                 borderRadius: 0,
                              }}
                              className="w-[45px] p-1 focus:outline-none rounded-none text-center  "
                           />
                           <p className="mx-1">in</p>
                        </div>
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
                        }}
                     />
                  </div>
               ) : (
                  <p className="h-full w-full grid place-items-center">No Dancers Selected</p>
               )}

               <div
                  onClick={() => {
                     selectedDancers.forEach((dancerId) => {
                        removeDancer(dancerId);
                     });
                     // console.log(selectedDancers);
                     pushChange();
                  }}
                  className="border-t border-neutral-200 mt-auto  w-full text-sm  cursor-pointer select-none  text-center  bg-opacity-80 py-2 bg-red-600 text-white  "
               >
                  Delete Dancer
               </div>
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
