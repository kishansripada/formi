import { COLORS, dancer, dancerPosition, formation, formationGroup, localSettings } from "../../../../types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { useGesture } from "@use-gesture/react";
export const Formation: React.FC<{
   formation: formation;
   amSelected: boolean;
   index: number;
   setSelectedFormation: Function;
   pixelsPerSecond: number;
   addToStack: Function;
   activeId: string | null;
   localSettings: localSettings;
   shiftHeld: boolean;
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
   // bind,
   shiftHeld,
}) => {
   const { viewOnly, selectedFormations, setFormations, formations, isMobileView, get } = useStore();
   const transitionResize = useRef();
   const formationResize = useRef();
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

   const MIN_TRANSITION_DURATION = 0.3;
   // const [changingFormation, setChangingFormation] = useState(false);
   const preventScrollRef = useRef();
   function usePreventScroll(preventScrollRef) {
      useEffect(() => {
         const preventScrolling = (e) => {
            if (preventScrollRef.current) {
               e.preventDefault();
            }
         };

         document.addEventListener("touchmove", preventScrolling, {
            passive: false,
         });
         return () => document.removeEventListener("touchmove", preventScrolling);
      }, []);
   }
   usePreventScroll(preventScrollRef);

   useGesture(
      {
         onDrag: (state) => {
            if (state.touches > 1) state.cancel();
            if (state.down) {
               preventScrollRef.current = true;
            } else {
               preventScrollRef.current = false;
            }
            setFormations(
               get().formations.map((formation) => {
                  if (
                     formation.id === state.target.id &&
                     // transition should be longer than 0.5 seconds
                     formation.transition.durationSeconds + state.delta[0] / pixelsPerSecond > MIN_TRANSITION_DURATION &&
                     // formation should be longer than 0 seconds
                     formation.durationSeconds - state.delta[0] / pixelsPerSecond >= 0
                  ) {
                     return {
                        ...formation,
                        durationSeconds: formation.durationSeconds - state.delta[0] / pixelsPerSecond,
                        transition: {
                           ...formation.transition,
                           durationSeconds: formation.transition.durationSeconds + state.delta[0] / pixelsPerSecond,
                        },
                     };
                  }
                  return formation;
               })
            );
         },
      },
      {
         eventOptions: { passive: false },
         drag: { preventDefault: true },
         target: transitionResize.current,
         enabled: !viewOnly,
      }
   );

   useGesture(
      {
         onDrag: (state) => {
            if (state.touches > 1) state.cancel();
            if (state.down) {
               preventScrollRef.current = true;
            } else {
               preventScrollRef.current = false;
            }
            setFormations(
               get().formations.map((formation, i) => {
                  if (formation.id === state.target.id) {
                     // console.log(formation);
                     if (formation.durationSeconds + state.delta[0] / pixelsPerSecond >= 0) {
                        return { ...formation, durationSeconds: formation.durationSeconds + state.delta[0] / pixelsPerSecond };
                     } else {
                        // transition should be longer than 0.5 seconds
                        if (formation.transition.durationSeconds + state.delta[0] / pixelsPerSecond > MIN_TRANSITION_DURATION) {
                           return {
                              ...formation,
                              durationSeconds: 0,
                              transition: {
                                 ...formation.transition,
                                 durationSeconds: formation.transition.durationSeconds + state.delta[0] / pixelsPerSecond,
                              },
                           };
                        } else {
                           return {
                              ...formation,
                              durationSeconds: 0,
                              transition: {
                                 ...formation.transition,
                                 durationSeconds: MIN_TRANSITION_DURATION,
                              },
                           };
                        }
                     }
                  }
                  if (shiftHeld) return formation;
                  if (i === formations.findIndex((f) => f.id === state.target.id) + 1) {
                     if (
                        formation.durationSeconds - state.delta[0] / pixelsPerSecond >= 0 &&
                        !(formations[i - 1]?.transition.durationSeconds === MIN_TRANSITION_DURATION && formations[i - 1]?.durationSeconds === 0)
                     ) {
                        return { ...formation, durationSeconds: formation.durationSeconds - state.delta[0] / pixelsPerSecond };
                     } else {
                        return formation;
                        // transition should be longer than 0.5 seconds
                        // if (formation.transition.durationSeconds + e.movementX / pixelsPerSecond > 0.5) {
                        //    return {
                        //       ...formation,
                        //       transition: {
                        //          ...formation.transition,
                        //          durationSeconds: formation.transition.durationSeconds + e.movementX / pixelsPerSecond,
                        //       },
                        //    };
                        // }
                     }
                  }

                  return formation;
               })
            );
         },
      },
      {
         eventOptions: { passive: false },
         drag: { preventDefault: true },
         target: formationResize.current,
         enabled: !viewOnly,
      }
   );

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
               borderRadius: 8,
               // touchAction: changingFormation ? "none" : "pan-x",
            }}
            // onTouchMove={(e) => {
            //    e.preventDefault();
            //    // if (changingFormation) {
            //    //    e.preventDefault();
            //    // } else {
            //    //    return;
            //    // }
            // }}

            className="relative  border-2 border-transparent  overflow-hidden group  bg-neutral-100 dark:bg-neutral-800  "
            ref={setNodeRef}
         >
            <style jsx>{``}</style>

            <div
               className={`  cursor-pointer    dark:bg-black  md:h-[50px] h-[40px]  dark:text-white    overflow-hidden border-neutral-300 dark:border-neutral-600  border-2 flex flex-col  relative   `}
               style={{
                  borderColor: selectedFormations.includes(formation.id)
                     ? "#db2777"
                     : othersOnThisFormation.length
                     ? COLORS[othersOnThisFormation[0]?.connectionId % COLORS.length]
                     : "",
                  borderRadius: 8,
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
               {!isMobileView ? (
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
                     className="text-[10px] select-none bg-transparent cursor-pointer p-1 font-semibold   relative whitespace-nowrap  focus:outline-none  "
                  />
               ) : null}

               {!viewOnly ? (
                  <>
                     {isMobileView ? (
                        <div
                           data-type="formation-resize"
                           id={formation.id}
                           ref={formationResize}
                           onMouseDown={(e) => e.preventDefault()}
                           className={`h-full  ml-auto  grid place-items-center bg-pink-200 justify-between  w-[25px] transition rounded-md  cursor-col-resize	z-[99]`}
                        ></div>
                     ) : (
                        <div
                           data-type="formation-resize"
                           id={formation.id}
                           ref={formationResize}
                           onMouseDown={(e) => e.preventDefault()}
                           className={` top-0 absolute right-[0px] flex flex-row items-center bg-black/50 justify-between    ${
                              isMobileView ? "h-full" : "opacity-0 h-[60%]"
                           } group-hover:opacity-100 transition  w-[7px] cursor-col-resize	z-[99]`}
                        >
                           <div className="relative flex flex-row item justify-between w-[5px] right-[-2px] pointer-events-none ">
                              <div className="w-[2px] h-[15px] rounded-full bg-neutral-300 dark:bg-neutral-300 pointer-events-none"></div>
                           </div>
                        </div>
                     )}
                  </>
               ) : null}

               <div
                  duration={formation.transition.durationSeconds}
                  className={` flex flex-row border-t dark:border-neutral-600  box-border  mt-auto   `}
                  style={{
                           height: isMobileView ? "100%" : "50%",
                  }}
               >
                  {index !== 0 ? (
                     <div
                        style={{
                           width: formation.transition.durationSeconds * pixelsPerSecond,
                           minWidth: formation.transition.durationSeconds * pixelsPerSecond,
                           borderRadius: 8,
                        }}
                        className="  "
                     >
                        <div
                           style={
                              {
                                 // borderTopRightRadius: isMobileView ? 99 : 0,
                                 // borderBottomRightRadius: isMobileView ? 99 : 0,
                              }
                           }
                           className="flex flex-row relative  dark:bg-pink-600 bg-pink-600   h-full  "
                        >
                           {!viewOnly ? (
                              <>
                                 {isMobileView ? (
                                    <div
                                       data-type="transition-resize"
                                       id={formation.id}
                                       ref={transitionResize}
                                       onMouseDown={(e) => e.preventDefault()}
                                       className={`h-full  ml-auto  grid place-items-center bg-pink-200 justify-between  w-[25px] rounded-md transition   cursor-col-resize	z-[99]`}
                                    ></div>
                                 ) : (
                                    <div
                                       data-type="transition-resize"
                                       id={formation.id}
                                       ref={transitionResize}
                                       onMouseDown={(e) => e.preventDefault()}
                                       className={`h-full absolute right-[7px]  flex flex-row items-center bg-black/50 justify-between  ${"opacity-0 w-[7px]"} group-hover:opacity-100 transition   cursor-col-resize	z-[99]`}
                                    >
                                       <div className="relative flex flex-row item justify-between w-[5px] right-[-2px] pointer-events-none ">
                                          <div className="w-[2px] h-[10px] rounded-full bg-neutral-300 dark:bg-neutral-300 pointer-events-none"></div>
                                       </div>
                                    </div>
                                 )}
                              </>
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
