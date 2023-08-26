import { COLORS, dancer, dancerPosition, formation, formationGroup, localSettings } from "../../../../types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useRef, useState } from "react";
import { useStore } from "../store";
export const Formation: React.FC<{
   formation: formation;
   amSelected: boolean;
   index: number;
   setSelectedFormation: Function;
   pixelsPerSecond: number;
   addToStack: Function;
   activeId: string | null;
   localSettings: localSettings;
}> = ({
   formation,
   amSelected,
   index,
   setSelectedFormation,
   // viewOnly,
   pixelsPerSecond,
   addToStack,
   activeId,
   localSettings,
}) => {
   const { viewOnly, selectedFormations, setFormations, formations } = useStore();

   const others = useStore((state) => state.liveblocks.others);

   const othersOnThisFormation = others.filter((other) => other.presence?.selectedFormations?.includes(formation.id));
   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: formation.id,
      attributes: { tabIndex: -1 },
      disabled: viewOnly,
   });
   const style = {
      transform: CSS.Translate.toString(transform),
      transition,
   };

   const [editingName, setEditingName] = useState(false);
   let myWidth = ((index === 0 ? 0 : formation.transition.durationSeconds) + formation.durationSeconds) * pixelsPerSecond;
   return (
      <>
         <div
            duration={formation.durationSeconds}
            style={{
               ...style,
               zIndex: activeId === formation.id ? 10 : 0,
               width: myWidth,
               minWidth: myWidth,
               // borderColor: colorsOnThisFormation.length ? averageHex(colorsOnThisFormation) : "transparent",
               // marginLeft: 2 / pixelsPerSecond,
               // marginRight: 2 / pixelsPerSecond,
            }}
            className="relative  border-2 border-transparent  rounded-lg overflow-hidden group  bg-neutral-100 dark:bg-neutral-800  "
            ref={setNodeRef}
         >
            {/* <div className=" absolute z-[50] bottom-[-30px] whitespace-nowrap text-xs -translate-x-1/2 left-1/2 group bg-neutral-800/90 p-1 rounded-md text-white">
               {formation.name}
            </div> */}

            {/* <div className=" absolute z-[50] top-[-40px] whitespace-nowrap text-xs -translate-x-1/2 left-1/2 group bg-neutral-800/90 p-1 rounded-md text-white">
                  {formation.name}
               </div> */}
            <style jsx>{``}</style>
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
               className={`  cursor-pointer    dark:bg-black  h-[50px]  dark:text-white  rounded-lg   overflow-hidden border-neutral-300 dark:border-neutral-600  border-2 flex flex-col  relative   `}
               style={{
                  borderColor: selectedFormations.includes(formation.id)
                     ? "#db2777"
                     : othersOnThisFormation.length
                     ? COLORS[othersOnThisFormation[0]?.connectionId % COLORS.length]
                     : "",
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
               <input
                  id="drag-handle"
                  {...attributes}
                  // onKeyDown={(e) => {
                  //    if (e.key === " ") {
                  //       e.preventDefault();
                  //    }
                  // }}
                  {...listeners}
                  readOnly={!editingName}
                  onBlur={(e) => {
                     setEditingName(false);
                  }}
                  onClick={(e) => {
                     e.preventDefault();
                     // e.stopPropagation();
                  }}
                  onDoubleClick={(e) => {
                     if (viewOnly) return;
                     setEditingName(true);
                  }}
                  onFocus={(e) => {
                     if (!editingName) {
                        e.target.blur();
                     }
                  }}
                  value={formation.name || ""}
                  onChange={(e) => {
                     setFormations(
                        formations.map((f: formation) => {
                           if (f.id === formation.id) {
                              return { ...f, name: e.target.value };
                           }
                           return f;
                        })
                     );
                  }}
                  className="text-[10px] select-none bg-transparent cursor-pointer p-1 font-semibold  relative whitespace-nowrap  focus:outline-none  "
               />

               {!viewOnly ? (
                  <div
                     data-type="formation-resize"
                     id={formation.id}
                     onMouseDown={(e) => e.preventDefault()}
                     className="h-[60%] top-0 absolute right-[0px] flex flex-row items-center bg-black/50 justify-between    opacity-0 group-hover:opacity-100 transition lg:pointer-events-auto pointer-events-none w-[7px] cursor-col-resize	z-[99]"
                  >
                     <div className="relative flex flex-row item justify-between w-[5px] right-[-2px] pointer-events-none">
                        <div className="w-[2px] h-[15px] rounded-full bg-neutral-300 dark:bg-neutral-300"></div>
                     </div>
                  </div>
               ) : null}

               <div
                  duration={formation.transition.durationSeconds}
                  className={` flex flex-row border-t dark:border-neutral-600  box-border h-[40%] mt-auto   `}
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
                           {!viewOnly ? (
                              <div
                                 data-type="transition-resize"
                                 id={formation.id}
                                 onMouseDown={(e) => e.preventDefault()}
                                 className="h-full absolute right-[7px]  flex flex-row items-center bg-black/50 justify-between  opacity-0 group-hover:opacity-100 transition lg:pointer-events-auto pointer-events-none w-[7px] cursor-col-resize	z-[99]"
                              >
                                 <div className="relative flex flex-row item justify-between w-[5px] right-[-2px] pointer-events-none">
                                    <div className="w-[2px] h-[10px] rounded-full bg-neutral-300 dark:bg-neutral-300"></div>
                                 </div>
                              </div>
                           ) : null}
                        </div>
                     </div>
                  ) : null}
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
