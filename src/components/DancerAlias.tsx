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
   if (isPlaying && position !== null) {
      let myPosition = animate(formations, position, id);
      // console.log(myPosition);
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
   const endTimes = formations.map((_, index) =>
      formations
         .slice(0, index + 1)
         .map((formation) => formation.durationSeconds + formation.transition.durationSeconds)
         .reduce((partialSum, a) => partialSum + a, 0)
   );

   // find the current formation that the times suggest
   const currentFormationIndex = formations.findIndex((_, index) => position < endTimes[index]);

   // if the position is beyond all the formation, return off stage
   if (!formations[currentFormationIndex]) {
      return coordsToPosition(10, 10);
   }

   const inThisFormation = formations[currentFormationIndex].positions.find((dancer) => dancer.id === id);

   let inNextFormation = formations[currentFormationIndex + 1]
      ? formations[currentFormationIndex + 1].positions.find((dancerPosition) => dancerPosition.id === id)
      : false;

   let isInTransition = position > endTimes[currentFormationIndex] - formations[currentFormationIndex].transition.durationSeconds;

   let from;
   let to;

   if (isInTransition) {
      if (inThisFormation) {
         if (inNextFormation) {
            // transition between current and next
            // requires animation don't return yet
            from = inThisFormation.position;
            to = inNextFormation.position;
         } else {
            // transition between current and exit strategy specified in current
            // requires animation don't return yet
            from = inThisFormation.position;
            to = (() => {
               if (inThisFormation.exitStrategy === "closest") {
                  if (from.x >= 0) return { x: 11, y: from.y };
                  if (from.x < 0) return { x: -11, y: from.y };
               }
               if (inThisFormation.exitStrategy === "right") {
                  return { x: 11, y: from.y };
               }
               if (inThisFormation.exitStrategy === "left") {
                  return { x: -11, y: from.y };
               }
            })();
         }
      } else {
         if (inNextFormation) {
            // transition between enter strategy specified in next and position in next
            // requires animation don't return yet
            to = inNextFormation.position;

            from = (() => {
               if (inNextFormation.enterStrategy === "closest") {
                  if (to.x >= 0) return { x: 11, y: to.y };
                  if (to.x < 0) return { x: -11, y: to.y };
               }
               if (inNextFormation.enterStrategy === "right") {
                  return { x: 11, y: to.y };
               }
               if (inNextFormation.enterStrategy === "left") {
                  return { x: -11, y: to.y };
               }
            })();
         } else {
            // return off stage
            return coordsToPosition(10, 10);
         }
      }
   } else {
      if (inThisFormation) {
         // return position from this formation
         return coordsToPosition(inThisFormation.position.x, inThisFormation.position.y);
      } else {
         // return off stage
         return coordsToPosition(10, 10);
      }
   }

   let percentThroughTransition =
      (position - (endTimes[currentFormationIndex] - formations[currentFormationIndex].transition.durationSeconds)) /
      formations[currentFormationIndex].transition.durationSeconds;

   return coordsToPosition(from.x + (to.x - from.x) * percentThroughTransition, from.y + (to.y - from.y) * percentThroughTransition);
};
