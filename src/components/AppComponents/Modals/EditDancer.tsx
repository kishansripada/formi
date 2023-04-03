import toast, { Toaster } from "react-hot-toast";
import { dancer, dancerPosition, formation } from "../../../types/types";
import { CirclePicker } from "react-color";
import { useState } from "react";

export const EditDancer: React.FC<{
   setEditingDancer: Function;
   editingDancer: string | null;
   dancers: dancer[];
   setDancers: Function;
   removeDancer: Function;
   pricingTier: string;
   setUpgradeIsOpen: Function;
   pushChange: Function;
}> = ({ setEditingDancer, editingDancer, dancers, setDancers, removeDancer, pricingTier, setUpgradeIsOpen, pushChange }) => {
   let height = convertToFeetAndInches(dancers.find((dancer) => dancer.id === editingDancer)?.height || 182.88);
   const [heightFeet, setHeightFeet] = useState<number>(height.feet);
   const [heightIn, setHeightIn] = useState<number>(height.inches);
   return (
      <div
         id="outside"
         className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
         onClick={(e: any) => {
            if (e.target.id === "outside") {
               setEditingDancer(null);
            }
            pushChange();
         }}
      >
         <div className="flex  flex-col rounded-xl bg-white pt-6 pb-6 ">
            <div className="flex flex-col mt-auto px-6">
               <p className="text-2xl">{dancers.find((dancer) => dancer.id === editingDancer)?.name}</p>

               <div className="flex flex-col items-start justify-center mt-5">
                  <div className="flex flex-col items-start mr-5">
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
                        className=" border-gray-300 border rounded-md focus:outline-none px-2 h-8  grow text-sm "
                        type="text"
                     />
                     <p className="text-xs text-gray-500  mt-2">For profile picture</p>
                  </div>

                  <div className="mt-10 text-gray-700 text-medium mb-3 flex flex-col items-center  w-full">
                     <div className="flex flex-row items-center justify-around w-full mt-5">
                        <div className="flex flex-row items-center">
                           <input
                              value={heightFeet}
                              onChange={(e) => {
                                 if (pricingTier === "basic") {
                                    setUpgradeIsOpen(true);
                                    return;
                                 }
                                 setHeightFeet(parseInt(e.target.value));
                                 if (heightFeet === null || heightFeet === undefined) return;
                                 setDancers((dancers: dancer[]) => {
                                    return dancers.map((dancer) => {
                                       if (dancer.id === editingDancer) {
                                          return { ...dancer, height: convertToCentimeters(parseInt(e.target.value), heightIn) };
                                       }
                                       return dancer;
                                    });
                                 });
                              }}
                              type="number"
                              className="w-[45px] p-1  border border-gray-200 rounded-md"
                           />
                           <p className="ml-2">ft</p>
                        </div>
                        <div className="flex flex-row items-center">
                           <input
                              value={heightIn}
                              onChange={(e) => {
                                 if (pricingTier === "basic") {
                                    setUpgradeIsOpen(true);
                                    return;
                                 }
                                 setHeightIn(parseInt(e.target.value));
                                 if (heightFeet === null || heightFeet === undefined) return;
                                 setDancers((dancers: dancer[]) => {
                                    return dancers.map((dancer) => {
                                       if (dancer.id === editingDancer) {
                                          return { ...dancer, height: convertToCentimeters(heightFeet, parseInt(e.target.value)) };
                                       }
                                       return dancer;
                                    });
                                 });
                              }}
                              type="number"
                              className="w-[45px] p-1  border border-gray-200 rounded-md"
                           />
                           <p className="ml-2">in</p>
                        </div>
                     </div>
                  </div>

                  <p className="mt-10 text-gray-700 text-medium mb-3">Color</p>
                  <div className=" grid place-items-center">
                     <CirclePicker
                        color={dancers.find((dancer) => dancer.id === editingDancer)?.color}
                        onChangeComplete={(color, event) => {
                           setDancers((dancers: dancer[]) => {
                              return dancers.map((dancer) => {
                                 if (dancer.id === editingDancer) {
                                    return { ...dancer, color: color.hex };
                                 }
                                 return dancer;
                              });
                           });
                        }}
                     />
                  </div>
               </div>

               <div className="flex flex-row justify-between mt-6">
                  <button
                     className="bg-red-600  flex flex-row mt-6 text-white px-3 py-1 rounded-md "
                     onClick={() => {
                        setEditingDancer(null);
                        removeDancer(editingDancer);
                     }}
                  >
                     Delete Dancer
                  </button>
               </div>
            </div>
         </div>
      </div>
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
