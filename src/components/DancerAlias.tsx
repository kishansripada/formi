import { useDrag } from "react-dnd";
import { dancer, dancerPosition, formation } from "../types/types";

export interface DancerAliasProps {
   name: string;
   id: string;
   setDancers: Function;
   selectedFormation: number | null;
   formations: formation[];
   isPlaying: boolean;
   position: number | null;
}

export const DancerAlias: React.FC<DancerAliasProps> = ({ name, id, formations, setDancers, selectedFormation, isPlaying, position }) => {
   let initials = name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

   // if the track is playing then early return with the animation function
   if (isPlaying) {
      let myPosition = animate(formations, position, id);
      console.log(myPosition);
      return (
         <>
            <div
               className={`w-8 h-8 bg-red-500 rounded-full flex flex-row justify-center items-center absolute z-[9999] mr-auto ml-auto pointer-events-none`}
               style={{
                  transform: "translate(-50%, -50%)",
                  left: myPosition.left,
                  top: myPosition.top,
               }}
            >
               <p className="">{initials}</p>
            </div>
         </>
      );
   }
   // if there is no formation selected and the track is not playing, then just return nothing
   if (selectedFormation === null) return <></>;

   let currentCoords = formations[selectedFormation]?.positions.find((dancer: dancerPosition) => dancer.id === id)?.position;

   // if the dancer does not have any coordinates right now, return nothing since it shouln't be displayed
   if (!currentCoords) return <></>;

   let { left, top } = coordsToPosition(currentCoords.x, currentCoords.y);

   const [{ isDragging }, drag] = useDrag(
      () => ({
         type: "dancerAlias",
         item: { id, left, top, formations, selectedFormation },
         collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
         }),
      }),
      [id, left, top, formations, selectedFormation]
   );

   return (
      <>
         <div
            ref={drag}
            className={`w-8 h-8 bg-red-500 rounded-full flex flex-row justify-center items-center absolute z-[9999] mr-auto ml-auto ${
               selectedFormation === null ? "pointer-events-none" : ""
            }`}
            style={{
               transform: "translate(-50%, -50%)",
               left: left,
               top: top,
               opacity: isDragging ? 0 : 1,
            }}
         >
            <p className="">{initials}</p>
         </div>
      </>
   );
};

const coordsToPosition = (x: number, y: number) => {
   return { left: 400 + 40 * x, top: 400 + 40 * -y };
};

const animate = (formations: formation[], position: number, id: string): { left: number; top: number } => {
   // get a list of the times that each formation ends
   let endTimes = formations.map((_, index) =>
      formations
         .slice(0, index + 1)
         .map((formation) => formation.durationSeconds + formation.transition.durationSeconds)
         .reduce((partialSum, a) => partialSum + a, 0)
   );

   // find the current formation that the times suggests
   let currentFormationIndex = formations.findIndex((_, index) => position < endTimes[index]);

   let isInTransition = position > endTimes[currentFormationIndex] - formations[currentFormationIndex].transition.durationSeconds;

   // if the dancer is not transitioning, just return the position of the formation its in
   if (!isInTransition) {
      let dancerPosition = formations[currentFormationIndex].positions.find((dancerPosition) => dancerPosition.id === id);

      return coordsToPosition(dancerPosition.position.x, dancerPosition.position.y);
   }

   let percentThroughTransition =
      (position - (endTimes[currentFormationIndex] - formations[currentFormationIndex].transition.durationSeconds)) /
      formations[currentFormationIndex].transition.durationSeconds;

   // if they are transitioning then run the animation
   let from = formations[currentFormationIndex].positions.find((dancerPosition) => dancerPosition.id === id).position;

   let isInNextFormation = formations[currentFormationIndex + 1].positions.find((dancerPosition) => dancerPosition.id === id);

   let to = isInNextFormation ? isInNextFormation.position : { x: 8, y: 0 };

   return coordsToPosition(from.x + (to.x - from.x) * percentThroughTransition, from.y + (to.y - from.y) * percentThroughTransition);

   //   return timeUpUntilEndOfCurrentFormation
};
