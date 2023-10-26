import { ReactEventHandler } from "react";
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
   songDuration: number | null;
   position: number | null;
   isPlaying: boolean;

   pixelsPerSecond: number;
   setSelectedDancers: Function;
   addToStack: Function;
   pushChange: Function;
   player: any;
   localSettings: localSettings;
   setPosition: Function;
   shiftHeld: boolean;
   // setSelectedFormations: Function;
   // selectedFormations: number[];
}> = ({
   // formations,
   selectedFormation,
   setSelectedFormation,
   // setFormations,
   songDuration,
   position,
   isPlaying,

   pixelsPerSecond,
   setSelectedDancers,
   pushChange,
   addToStack,
   player,
   setPosition,
   localSettings,
   shiftHeld,
   // setSelectedFormations,
   // selectedFormations,
}) => {
   const { formations, setFormations, viewOnly, selectedFormations, setSelectedFormations, commandHeld } = useStore();
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
            className=" flex flex-row  items-center w-full bg-neutral-100 dark:bg-black  dark:border-neutral-600  "
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
                              setSelectedFormations([formation.id]);
                           }

                           let position = formations
                              .map((formation, i) => formation.durationSeconds + (i === 0 ? 0 : formation.transition.durationSeconds))
                              .slice(0, index)
                              .reduce((a, b) => a + b, 0);

                           setPosition(position);

                           if (!(songDuration && player)) return;

                           player.seekTo(Math.min(Math.max(0, position / (songDuration / 1000)), 1));
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
                  {/* <button
                     onClick={newFormation}
                     className="w-20 h-[47px] dark:text-white rounded-md dark:bg-neutral-600 bg-neutral-200 ml-2 grid place-items-center"
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
                  </button> */}
               </SortableContext>
            </DndContext>
         </div>
      </>
   );
};

function numbersBetween(a: number, b: number): number[] {
   const start = Math.min(a, b);
   const end = Math.max(a, b);

   const result: number[] = [];

   for (let i = start; i <= end; i++) {
      result.push(i);
   }

   return result;
}
