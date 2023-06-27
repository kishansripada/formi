import { dancer, dancerPosition, formation, formationGroup, localSettings } from "../../types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useRef } from "react";
export const Formation: React.FC<{
   formation: formation;
   amSelected: boolean;
   index: number;
   setFormations: Function;
   setSelectedFormation: Function;
   viewOnly: boolean;
   pixelsPerSecond: number;
   userPositions: any;
   onlineUsers: any;
   addToStack: Function;
   activeId: string | null;
   formationGroups: formationGroup[];
   localSettings: localSettings;
}> = ({
   formation,
   amSelected,
   index,
   setFormations,
   setSelectedFormation,
   viewOnly,
   pixelsPerSecond,
   userPositions,
   onlineUsers,
   addToStack,
   activeId,
   formationGroups,
   localSettings,
}) => {
   // console.log(onlineUsers);
   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: formation.id });
   const style = {
      transform: CSS.Translate.toString(transform),
      transition,
   };

   let idsOnThisFormation = Object.keys(userPositions).filter((id) => userPositions[id].selectedFormation === index);

   let colorsOnThisFormation = idsOnThisFormation.map((id) => onlineUsers?.[id]?.[0]?.color);
   colorsOnThisFormation = colorsOnThisFormation.filter((color) => color);
   let firstNamesOnThisFormation = idsOnThisFormation.map((id) => onlineUsers?.[id]?.[0]?.name).map((name) => name?.split(" ")[0]);

   // let listOfNames = ((list) => {
   //    if (!list.length) return null;
   //    if (list.length === 1) return list[0];
   //    if (list.length === 2) return `${list[0] & list[1]}`;
   //    return list.slice(0, -1).join(", ") + " & " + list[list.length - 1];
   // })(firstNamesOnThisFormation);
   // console.log(listOfNames);
   if (amSelected) {
      colorsOnThisFormation = [...colorsOnThisFormation, "#DB2777"];
   }
   let myWidth = ((index === 0 ? 0 : formation.transition.durationSeconds) + formation.durationSeconds) * pixelsPerSecond;
   return (
      <>
         <div
            duration={formation.durationSeconds}
            style={{
               ...style,
               zIndex: activeId === formation.id ? 999 : 0,
               width: myWidth,
               minWidth: myWidth,
               // borderColor: colorsOnThisFormation.length ? averageHex(colorsOnThisFormation) : "transparent",
               // marginLeft: 2 / pixelsPerSecond,
               // marginRight: 2 / pixelsPerSecond,
            }}
            className="relative  border-2 border-transparent  rounded-lg overflow-hidden group   "
            ref={setNodeRef}
         >
            {/* <div className=" absolute z-[50] bottom-[-30px] whitespace-nowrap text-xs -translate-x-1/2 left-1/2 group bg-neutral-800/90 p-1 rounded-md text-white">
               {formation.name}
            </div> */}

            {/* <div className=" absolute z-[50] top-[-40px] whitespace-nowrap text-xs -translate-x-1/2 left-1/2 group bg-neutral-800/90 p-1 rounded-md text-white">
                  {formation.name}
               </div> */}
            <style jsx>{`
               .group:hover::before {
                  // content: "${formation.name}";
                  // position: absolute;
                  // bottom: -30px;
                  // white-space: nowrap;
                  // font-size: 0.875rem; /* approx 14px */
                  // transform: translateX(-50%);
                  // left: 50%;
                  // background-color: #1f2937; /* match bg-neutral-800 */
                  // padding: 0.25rem; /* approx 4px */
                  // border-radius: 0.375rem; /* approx 6px */
                  // color: white;
                  // z-index: 99999;
               }
            `}</style>
            {/* <div
               style={{
                  backgroundColor: colorsOnThisFormation.length
                     ? averageHex(colorsOnThisFormation)
                     : localSettings.isDarkMode
                     ? "#a3a3a3"
                     : "#d4d4d4",
               }}
               
               className="h-[9px] w-full flex flex-col  border-x-[0.5px] border-neutral-400 justify-center items-center  "
            >
               <div className="h-[1px] rounded-full bg-neutral-800 w-[12px] mb-[1px]"></div>
               <div className="h-[1px] rounded-full bg-neutral-800 w-[12px] mt-[1px]"></div>
            </div> */}
            <div
               className={`  cursor-pointer    dark:bg-neutral-800  h-[50px]  dark:text-white  rounded-lg   overflow-hidden border-neutral-300 dark:border-neutral-600  border-2 flex flex-col  relative   `}
               style={{
                  borderColor: colorsOnThisFormation.length ? averageHex(colorsOnThisFormation) : "",
                  // borderBottomColor:
                  // formationGroups.find((formationGroup) => formationGroup.id === formation?.group)?.color ||
                  // (colorsOnThisFormation.length ? averageHex(colorsOnThisFormation) : localSettings.isDarkMode ? "#a3a3a3" : "#d4d4d4"),
                  // borderBottomColor: "#18191B",
                  // borderRightColor: "#db2777",
                  // borderLeftColor: "#db2777",
                  // borderTopColor: formationGroups.find((formationGroup) => formationGroup.id === formation?.group)?.color || "#18191B",
                  // subtract 4 to account for the mx-[2px]
               }}
            >
               <p className="text-[10px]  p-1 font-semibold  relative whitespace-nowrap">{formation.name}</p>
               {/* {firstNamesOnThisFormation.length && myWidth > 100 ? (
                     <div
                        // opacity-0 group-hover:opacity-100
                        className="absolute h-5 right-[0px] top-[-20px] z-10 w-fit px-2 text-xs text-white  transition duration-300 ease-in-out pointer-events-none "
                        style={{ backgroundColor: colorsOnThisFormation.length ? averageHex(colorsOnThisFormation) : "black" }}
                     >
                        <p>{formatNames(firstNamesOnThisFormation)}</p>
                     </div>
                  ) : null} */}

               {/* drag handle */}

               <div
                  data-type="drag-handle"
                  // onClick={() => {
                  //    addToStack();
                  // }}
                  style={{
                     pointerEvents: viewOnly ? "none" : "auto",
                  }}
                  id={formation.id}
                  {...attributes}
                  {...listeners}
                  className="w-full opacity-0 absolute top-[-12px] h-[12px]  cursor-move lg:pointer-events-auto pointer-events-none	z-[99999]"
               ></div>

               {/* 6 dots on drag handle */}
               {/* <div className=" absolute top-[-18px] -translate-x-1/2 left-1/2 h-[8px] select-none   cursor-move lg:pointer-events-auto pointer-events-none	z-[99999]">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className={`rotate-90 fill-white scale-90  pointer-events-none select-none`}
               >
                  <path fill="none" d="M0 0h24v24H0V0z" />
                  <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
               </svg>
            </div> */}

               <div
                  data-type="formation-resize"
                  id={formation.id}
                  className="h-1/2 top-0 absolute right-[0px] flex flex-row items-center bg-black/50 justify-between    opacity-0 group-hover:opacity-100 transition lg:pointer-events-auto pointer-events-none w-[7px] cursor-col-resize	z-[99]"
               >
                  <div className="relative flex flex-row item justify-between w-[5px] right-[-2px] pointer-events-none">
                     <div className="w-[2px] h-[15px] rounded-full bg-neutral-300 dark:bg-neutral-300"></div>
                  </div>
               </div>

               {/* <div
                  className={` h-[17px]  px-1  overflow-hidden text-ellipsis whitespace-nowrap   border-b border-neutral-200 dark:border-neutral-600`}
               >
                  <p className={`text-[11px] pointer-events-none select-none  font-medium text-ellipsis text-center`}>{formation.name}</p>
               </div> */}

               {/* formation group color bar */}
               {/* <div
                  style={{
                     backgroundColor: formationGroups.find((formationGroup) => formationGroup.id === formation?.group)?.color,
                  }}
                  className="absolute w-full h-[4px] bottom-[0px] rounded-full"
               ></div> */}

               <div
                  duration={formation.transition.durationSeconds}
                  className={` flex flex-row border-t dark:border-neutral-600  box-border h-1/2 mt-auto   `}
               >
                  {index !== 0 ? (
                     <div
                        style={{
                           width: formation.transition.durationSeconds * pixelsPerSecond,
                           minWidth: formation.transition.durationSeconds * pixelsPerSecond,
                        }}
                        className="  "
                     >
                        <div className="flex flex-row relative  dark:bg-pink-600 bg-pink-600    pointer-events-none h-full  ">
                           {/* <svg className="" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 10 20">
                                 <polygon className="fill-neutral-300 dark:fill-neutral-500" strokeWidth={0} points="0,0 0,20 10,10" />
                              </svg> */}
                           <div
                              data-type="transition-resize"
                              id={formation.id}
                              className="h-full absolute right-[7px]  flex flex-row items-center bg-black/50 justify-between  opacity-0 group-hover:opacity-100 transition lg:pointer-events-auto pointer-events-none w-[7px] cursor-col-resize	z-[99]"
                           >
                              <div className="relative flex flex-row item justify-between w-[5px] right-[-2px] pointer-events-none">
                                 <div className="w-[2px] h-[10px] rounded-full bg-neutral-300 dark:bg-neutral-300"></div>
                              </div>
                           </div>
                           {/* <svg
                                 className="w-1/2 relative h-full"
                                 preserveAspectRatio="none"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 108 122"
                              >
                                 <path
                                    stroke="#db2777"
                                    stroke-width="9"
                                    d="m101.75 64.0311-91.5 52.8279c-2.33334 1.347-5.25001-.337-5.25001-3.031L5 8.17246c0-2.69431 2.91668-4.37824 5.25-3.0311l91.5 52.82754c2.333 1.3472 2.333 4.715 0 6.0622Z"
                                 />
                              </svg>
                              <svg
                                 className="w-1/2 relative h-full rotate-180"
                                 preserveAspectRatio="none"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 108 122"
                              >
                                 <path
                                    stroke="#db2777"
                                    stroke-width="9"
                                    d="m101.75 64.0311-91.5 52.8279c-2.33334 1.347-5.25001-.337-5.25001-3.031L5 8.17246c0-2.69431 2.91668-4.37824 5.25-3.0311l91.5 52.82754c2.333 1.3472 2.333 4.715 0 6.0622Z"
                                 />
                              </svg> */}
                        </div>
                     </div>
                  ) : null}
                  {/* <div
                        style={{
                           width: formation.durationSeconds * pixelsPerSecond,
                        }}
                        className="relative bg-black  h-full"
                     >
                        {index !== 0 ? (
                           <div
                              id={formation.id}
                              data-type="transition-resize"
                              className="   w-[4px] bg-black h-full lg:pointer-events-auto pointer-events-none cursor-col-resize	 absolute left-[-5px] z-50 flex flex-row justify-between"
                           >
                              <div className="h-full w-[1px] bg-black pointer-events-none dark:bg-neutral-200"></div>
                           </div>
                        ) : null}
                     </div> */}
               </div>
            </div>
         </div>
      </>
   );
};

function averageHex(colors) {
   if (colors.length === 1) {
      return colors[0];
   }
   // transform all hex codes to integer arrays, e.g. [[R, G, B], [R,G,B], ...]
   let numbers = colors.map(function (hex) {
      // split in seperate R, G and B
      let split = hex.match(/[\da-z]{2}/gi);

      // transform to integer values
      return split.map(function (toInt) {
         return parseInt(toInt, 16);
      });
   });

   // reduce the array by averaging all values, resulting in an average [R, G, B]
   let averages = numbers.reduce(function (total, amount, index, array) {
      return total.map(function (subtotal, subindex) {
         // if we reached the last color, average it out and return the hex value
         if (index == array.length - 1) {
            let result = Math.round((subtotal + amount[subindex]) / array.length).toString(16);

            // add a leading 0 if it is only one character
            return result.length == 2 ? "" + result : "0" + result;
         } else {
            return subtotal + amount[subindex];
         }
      });
   });

   // return them as a single hex string
   return "#" + averages.join("");
}

function formatNames(names: string[]): string {
   const length = names.length;

   if (length === 1) {
      return names[0];
   } else if (length === 2) {
      return `${names[0]} & ${names[1]}`;
   } else if (length > 2) {
      const allButLast = names.slice(0, length - 1).join(", ");
      return `${allButLast} & ${names[length - 1]}`;
   }

   return "";
}
