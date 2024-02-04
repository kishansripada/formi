import { PIXELS_PER_SQUARE, dancer, dancerPosition, formation, stageDimensions } from "../../../../types/types";
import { useStore } from "../store";

export const ReflectedDancers: React.FC<{
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
}> = ({ coordsToPosition }) => {
   // if there is no formation selected and the track is not playing, then just return nothing
   const selectedDancers = useStore((store) => store.selectedDancers);
   const dancers = useStore((store) => store.dancers);
   const getFirstSelectedFormation = useStore((store) => store.getFirstSelectedFormation);
   const HUMAN_WIDTH_FEET = 1.5;
   return (
      <>
         {selectedDancers.map((selectedDancerId: string) => {
            const selectedDancerPosition = getFirstSelectedFormation()?.positions?.find((position) => position?.id === selectedDancerId);
            if (!selectedDancerPosition) return null;
            const dancer = dancers.find((dancer) => dancer.id === selectedDancerId);
            if (selectedDancerPosition && dancer) {
               const { left, top } = coordsToPosition({ x: -selectedDancerPosition.position.x, y: selectedDancerPosition.position.y });
               return (
                  <div
                     key={selectedDancerId}
                     style={{
                        left: left,
                        top: top,
                        opacity: 0.5,
                        backgroundColor: dancer.color || "#db2777",
                        width: PIXELS_PER_SQUARE * HUMAN_WIDTH_FEET,
                        height: PIXELS_PER_SQUARE * HUMAN_WIDTH_FEET,
                     }}
                     className={`rounded-full   select-none pointer-events-none flex  -translate-y-1/2 -translate-x-1/2 flex-row  absolute z-[40]  cursor-default   `}
                  ></div>
               );
            }
         })}
      </>
   );
};
