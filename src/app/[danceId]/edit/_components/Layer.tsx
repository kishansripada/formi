import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "../../../../../@/components/ui/dropdown-menu";
import { Formation } from "./Formation";
import { useCallback, useEffect, useState } from "react";
import { dancer, dancerPosition, formation, formationGroup, localSettings } from "../../../../types/types";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, MouseSensor } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "../store";

export const Layer: React.FC<{
   // formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   // setFormations: Function;

   position: number | null;
   isPlaying: boolean;

   pixelsPerSecond: number;
   setSelectedDancers: Function;
   addToStack: Function;
   pushChange: Function;

   localSettings: localSettings;
   setPosition: Function;
   shiftHeld: boolean;
}> = ({
   selectedFormation,

   pixelsPerSecond,

   pushChange,
   addToStack,

   setPosition,
   localSettings,
   shiftHeld,
}) => {
   const { formations, setFormations, selectedFormations, setSelectedFormations, commandHeld, newFormationFromLast, goToFormation, viewOnly } =
      useStore();
   const [activeId, setActiveId] = useState(null);
   // const keyboardCodes = {
   //    start: ["$"],
   //    cancel: ["Escape"],
   //    end: ["$"],
   // };

   const clickOutsideFormations = (e: any) => {
      if (e.target.id !== "outside") return;
      e.stopPropagation();
      setSelectedFormations([]);
   };
   const mouseSensor = useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
         distance: 10,
      },
   });
   const sensors = useSensors(mouseSensor);
   // const sensors = useSensors(
   //    useSensor(PointerSensor)
   //    // useSensor(KeyboardSensor, {
   //    //    coordinateGetter: sortableKeyboardCoordinates,
   //    // })
   // );
   function handleDragStart(event) {
      const index = event?.active?.data?.current?.sortable?.index || 0;
      // setSelectedFormation();

      // if (selectedFormation !== index) {
      //    setSelectedDancers([]);
      // }

      // if (isPlaying) {
      // let position = formations
      //    .map((formation, i) => formation.durationSeconds + (i === 0 ? 0 : formation.transition.durationSeconds))
      //    .slice(0, index)
      //    .reduce((a, b) => a + b, 0);

      // if (songDuration && player) {
      //    console.log(position / (songDuration / 1000));
      // }
      // position = position + formations[index]?.transition.durationSeconds;
      // console.log(position);
      // setPosition(position);
      // setSelectedFormation(index);
      // if (!(songDuration && player)) return;

      // player.seekTo(position / (songDuration / 1000));
      // setActiveId(event.active.id);
   }

   function handleDragEnd(event) {
      const { active, over } = event;

      if (!over?.id) return;
      if (active.id !== over?.id) {
         const oldIndex = formations.findIndex((formation) => formation.id === active.id);
         const newIndex = formations.findIndex((formation) => formation.id === over.id);

         setFormations(arrayMove(formations, oldIndex, newIndex));
      }
      pushChange();
      setActiveId(null);
   }

   // const newFormation = () => {
   //    let id = uuidv4();
   //    setFormations([
   //       ...formations,
   //       {
   //          ...formations[formations.length - 1],
   //          id,
   //          name: `Untitled ${formations.length + 1}`,
   //          positions: formations[formations.length - 1]?.positions.map((dancer: dancerPosition) => {
   //             return {
   //                ...dancer,
   //                transitionType: "linear",
   //             };
   //          }),
   //       },
   //    ]);
   //    setSelectedFormation(formations.length);
   //    pushChange();
   // };
   return (
      <>
         <div
            className=" flex flex-row  items-center w-full bg-neutral-50 dark:bg-neutral-900  dark:border-neutral-600  "
            id="outside"
            onClick={clickOutsideFormations}
         >
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
               <SortableContext items={formations} strategy={horizontalListSortingStrategy}>
                  {formations.map((formation, index) => (
                     <div
                        key={formation.id}
                        id={formation.id}
                        onClick={(e: any) => {
                           if (shiftHeld) {
                              if (selectedFormations.includes(formation.id)) {
                                 // click on a selection formation, then unselect it
                                 setSelectedFormations(selectedFormations.filter((id) => id !== formation.id));
                              } else {
                                 // click on a formation that is not already selected
                                 if (selectedFormations.length) {
                                    // find the first selected formation
                                    const firstSelectedFormation = Math.min(
                                       ...selectedFormations.map((id) => formations.findIndex((formation) => formation.id === id))
                                    );
                                    const numbersToSelect = numbersBetweenInclusive(firstSelectedFormation, index);
                                    // const idsToSelect = numbersToSelect.map((i) => formations[i]?.id);

                                    const idsToSelect = numbersToSelect
                                       .map((i) => formations[i]?.id)
                                       .filter((id): id is string => typeof id === "string");

                                    setSelectedFormations(idsToSelect);
                                 } else {
                                    setSelectedFormations([formation.id]);
                                 }
                              }
                           } else if (commandHeld) {
                              if (selectedFormations.includes(formation.id)) {
                                 setSelectedFormations(selectedFormations.filter((id) => id !== formation.id));
                              } else {
                                 setSelectedFormations([...selectedFormations, formation.id]);
                              }
                           } else {
                              goToFormation(formation.id);
                           }
                        }}
                     >
                        <Formation
                           formation={formation}
                           index={index}
                           amSelected={index === selectedFormation}
                           pixelsPerSecond={pixelsPerSecond}
                           addToStack={addToStack}
                           activeId={activeId}
                           localSettings={localSettings}
                           shiftHeld={shiftHeld}
                        />
                     </div>
                  ))}
                  {!viewOnly ? (
                     <div className="w-28 h-[43px] border dark:text-white rounded-md overflow-hidden border-neutral-400 ml-2 flex flex-row items-center justify-between">
                        <button
                           onClick={() => newFormationFromLast(true)}
                           className="grid place-items-center w-full hover:bg-neutral-700 transition h-full"
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                           >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                           </svg>
                        </button>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <button className="border-l w-10 hover:bg-neutral-700 transition h-full border-neutral-500 grid place-items-center">
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                                 </svg>
                              </button>
                           </DropdownMenuTrigger>

                           <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => newFormationFromLast(false)} className="hover:bg-neutral-700 transition">
                                 New formation and no groups
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => newFormationFromLast(true)} className="hover:bg-neutral-700 transition">
                                 New formation with same groups
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  ) : null}
               </SortableContext>
            </DndContext>
         </div>
      </>
   );
};

function numbersBetweenInclusive(a: number, b: number): number[] {
   const start = Math.min(a, b);
   const end = Math.max(a, b);

   const result: number[] = [];

   for (let i = start; i <= end; i++) {
      result.push(i);
   }

   return result;
}
