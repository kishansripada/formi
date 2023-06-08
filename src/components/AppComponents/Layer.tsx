import { ReactEventHandler } from "react";
import { Formation } from "./Formation";
import { useCallback, useEffect, useState } from "react";
import { dancer, dancerPosition, formation, formationGroup, localSettings } from "../../types/types";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

export const Layer: React.FC<{
   formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   setFormations: Function;
   songDuration: number | null;
   position: number | null;
   isPlaying: boolean;
   viewOnly: boolean;
   pixelsPerSecond: number;
   setSelectedDancers: Function;
   userPositions: any;
   onlineUsers: any;
   addToStack: Function;
   pushChange: Function;
   formationGroups: formationGroup;
   player: any;
   localSettings: localSettings;
   setPosition: Function;
}> = ({
   formations,
   selectedFormation,
   setSelectedFormation,
   setFormations,
   songDuration,
   position,
   isPlaying,
   viewOnly,
   pixelsPerSecond,
   setSelectedDancers,
   userPositions,
   onlineUsers,
   pushChange,
   addToStack,
   formationGroups,
   player,
   setPosition,
   localSettings,
}) => {
   const [activeId, setActiveId] = useState(null);

   const clickOutsideFormations = (e: any) => {
      if (e.target.id !== "outside") return;
      e.stopPropagation();
      setSelectedFormation(null);
   };

   const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
         coordinateGetter: sortableKeyboardCoordinates,
      })
   );
   function handleDragStart(event) {
      // addToStack();
      setActiveId(event.active.id);
   }

   function handleDragEnd(event) {
      const { active, over } = event;

      if (!over?.id) return;
      if (active.id !== over?.id) {
         setFormations((formations: formation[]) => {
            const oldIndex = formations.findIndex((formation) => formation.id === active.id);
            const newIndex = formations.findIndex((formation) => formation.id === over.id);

            return arrayMove(formations, oldIndex, newIndex);
         });
      }
      pushChange();
      setActiveId(null);
   }

   return (
      <>
         <div
            className=" flex flex-row  items-center w-full bg-neutral-100 dark:bg-neutral-800 border-y border-neutral-300 dark:border-neutral-600 py-1 "
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
                           if (selectedFormation !== index) {
                              setSelectedDancers([]);
                           }
                           // if (isPlaying) {
                           let position = formations
                              .map((formation, i) => formation.durationSeconds + (i === 0 ? 0 : formation.transition.durationSeconds))
                              .slice(0, index)
                              .reduce((a, b) => a + b, 0);
                           // console.log(position);
                           setPosition(position);
                           setSelectedFormation(index);
                           if (!(songDuration && player)) return;

                           player.seekTo(position / (songDuration / 1000));

                           // } else {

                           // }
                        }}
                     >
                        <Formation
                           userPositions={userPositions}
                           onlineUsers={onlineUsers}
                           viewOnly={viewOnly}
                           setSelectedFormation={setSelectedFormation}
                           setFormations={setFormations}
                           formation={formation}
                           index={index}
                           amSelected={index === selectedFormation}
                           pixelsPerSecond={pixelsPerSecond}
                           addToStack={addToStack}
                           activeId={activeId}
                           formationGroups={formationGroups}
                           localSettings={localSettings}
                        />
                     </div>
                  ))}
               </SortableContext>
            </DndContext>
         </div>
      </>
   );
};
