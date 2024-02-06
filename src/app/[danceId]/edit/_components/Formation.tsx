import { COLORS, dancer, dancerPosition, formation, formationGroup, localSettings } from "../../../../types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { useGesture } from "@use-gesture/react";
import { roundToHundredth } from "../../../../utls";
import {
   ContextMenu,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuTrigger,
   ContextMenuSeparator,
   ContextMenuShortcut,
} from "@/components/ui/context-menu";

export const Formation: React.FC<{
   formation: formation;
   index: number;
   setSelectedFormation: Function;
   pixelsPerSecond: number;
   activeId: string | null;
   shiftHeld: boolean;
   setHasClickedOnTimeline: Function;
}> = ({ formation, index, pixelsPerSecond, activeId, shiftHeld, setHasClickedOnTimeline }) => {
   const {
      viewOnly,
      selectedFormations,
      setFormations,
      formations,
      isMobileView,
      get,
      deleteSelectedFormations,
      copySelectedPositions,
      pasteCopiedPositions,
      splitSelectedFormations,
   } = useStore();

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
   const preventScrollRef = useRef<boolean>(false);
   function usePreventScroll(preventScrollRef: React.RefObject<boolean>) {
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
                        durationSeconds: roundToHundredth(formation.durationSeconds - state.delta[0] / pixelsPerSecond),
                        transition: {
                           ...formation.transition,
                           durationSeconds: roundToHundredth(formation.transition.durationSeconds + state.delta[0] / pixelsPerSecond),
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

            setHasClickedOnTimeline(true);
            setFormations(
               get().formations.map((formation, i) => {
                  if (formation.id === state.target.id) {
                     // console.log(formation);
                     if (formation.durationSeconds + state.delta[0] / pixelsPerSecond >= 0) {
                        return { ...formation, durationSeconds: roundToHundredth(formation.durationSeconds + state.delta[0] / pixelsPerSecond) };
                     } else {
                        // transition should be longer than 0.5 seconds
                        if (formation.transition.durationSeconds + state.delta[0] / pixelsPerSecond > MIN_TRANSITION_DURATION) {
                           return {
                              ...formation,
                              durationSeconds: 0,
                              transition: {
                                 ...formation.transition,
                                 durationSeconds: roundToHundredth(formation.transition.durationSeconds + state.delta[0] / pixelsPerSecond),
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
                  // if shift held, then ripple the change to all formations
                  if (!shiftHeld) return formation;

                  if (i === formations.findIndex((f) => f.id === state.target.id) + 1) {
                     if (
                        formation.durationSeconds - state.delta[0] / pixelsPerSecond >= 0 &&
                        !(formations[i - 1]?.transition.durationSeconds === MIN_TRANSITION_DURATION && formations[i - 1]?.durationSeconds === 0)
                     ) {
                        return {
                           ...formation,
                           durationSeconds: roundToHundredth(formation.durationSeconds - state.delta[0] / pixelsPerSecond),
                        };
                     } else {
                        //   when dragging a formation to the right (state.delta[0] > 0), collapse the transition of the formation to the right once you hit it
                        if (formation.transition.durationSeconds - state.delta[0] / pixelsPerSecond > MIN_TRANSITION_DURATION && state.delta[0] > 0) {
                           return {
                              ...formation,
                              transition: {
                                 ...formation.transition,
                                 durationSeconds: formation.transition.durationSeconds - state.delta[0] / pixelsPerSecond,
                              },
                           };
                        }
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
      <ContextMenu>
         <ContextMenuContent className=" ">
            <ContextMenuItem
               onClick={() => {
                  splitSelectedFormations();
               }}
               className="text-sm py-1 "
            >
               Duplicate
            </ContextMenuItem>
            <ContextMenuItem
               onClick={() => {
                  setFormations(
                     formations.map((formation, index) => {
                        if (selectedFormations.includes(formation.id)) {
                           return {
                              ...formation,
                              positions: formations[index === 0 ? 0 : index - 1].positions,
                           };
                        }
                        return formation;
                     })
                  );
               }}
               className="text-sm py-1 "
            >
               Reset to previous formation
            </ContextMenuItem>
            <ContextMenuSeparator className="bg-neutral-300 h-[1px] my-1" />
            <ContextMenuItem
               onClick={() => {
                  copySelectedPositions();
               }}
               className="text-sm py-1  "
            >
               Copy positions <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem
               onClick={() => {
                  pasteCopiedPositions();
               }}
               className="text-sm py-1 "
            >
               Paste positions<ContextMenuShortcut>⌘V</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator className="bg-neutral-300 h-[1px] my-1" />
            <ContextMenuItem
               onClick={() => {
                  deleteSelectedFormations();
               }}
               className="text-sm py-1 flex flex-row items-center hover:bg-neutral-200 "
            >
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                  <path
                     fillRule="evenodd"
                     d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                     clipRule="evenodd"
                  />
               </svg>
               Delete
            </ContextMenuItem>
         </ContextMenuContent>
         <ContextMenuTrigger>
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
                  borderWidth: myWidth > 4 ? 2 : 0,
                  // touchAction: changingFormation ? "none" : "pan-x",
               }}
               className="relative   border-transparent  overflow-hidden group  bg-neutral-50 dark:bg-neutral-800  "
               ref={setNodeRef}
            >
               <style jsx>{``}</style>

               <div
                  className={`cursor-default  rounded-sm  dark:bg-neutral-900  md:h-[45ppx] h-[40px]  dark:text-white    overflow-hidden border-neutral-300 dark:border-neutral-600  border-2 flex flex-col  relative   `}
                  style={{
                     borderColor: selectedFormations.includes(formation.id)
                        ? "#db2777"
                        : othersOnThisFormation.length
                        ? COLORS[othersOnThisFormation[0]?.connectionId % COLORS.length]
                        : "",
                     // borderRadius: 8,
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
                     <p
                        {...attributes}
                        {...listeners}
                        className="text-[10px] select-none px-1 my-auto bg-transparent  cursor-default  font-semibold   relative whitespace-nowrap  focus:outline-none  "
                     >
                        {formation.name || ""}
                     </p>
                  ) : null}

                  {!viewOnly ? (
                     <>
                        {isMobileView ? (
                           <div
                              data-type="formation-resize"
                              id={formation.id}
                              ref={formationResize}
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.preventDefault()}
                              className={`h-full  ml-auto  grid place-items-center bg-pink-200 justify-between  w-[25px] transition rounded-md  cursor-col-resize	z-[99]`}
                           ></div>
                        ) : (
                           <div
                              data-type="formation-resize"
                              id={formation.id}
                              ref={formationResize}
                              onClick={(e) => e.stopPropagation()}
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
                              className="flex flex-row relative  dark:bg-pink-600/80 bg-pink-600   h-full  "
                           >
                              {!viewOnly ? (
                                 <>
                                    {isMobileView ? (
                                       <div
                                          data-type="transition-resize"
                                          id={formation.id}
                                          ref={transitionResize}
                                          onClick={(e) => e.stopPropagation()}
                                          onMouseDown={(e) => e.preventDefault()}
                                          className={`h-full  ml-auto  grid place-items-center bg-pink-200 justify-between  w-[25px] rounded-sm transition   cursor-col-resize	z-[99]`}
                                       ></div>
                                    ) : (
                                       <div
                                          data-type="transition-resize"
                                          id={formation.id}
                                          ref={transitionResize}
                                          onClick={(e) => e.stopPropagation()}
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
         </ContextMenuTrigger>
      </ContextMenu>
   );
};
