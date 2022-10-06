import { dancer, dancerPosition, formation } from "../../types/types";

export interface DancerAliasProps {
   dancer: dancer;
   setDancers: Function;
   selectedFormation: number | null;
   formations: formation[];
   isPlaying: boolean;
   position: number | null;
   setFormations: Function;
   selectedDancers: string[];
}

export const DancerAlias: React.FC<DancerAliasProps> = ({
   dancer,
   formations,
   setDancers,
   selectedFormation,
   isPlaying,
   position,
   setFormations,
   selectedDancers,
}) => {
   let initials = dancer.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

   // if the track is playing then early return with the animation function
   if (isPlaying && position !== null) {
      let myPosition = animate(formations, position, dancer.id);

      return (
         <>
            <div
               className={`w-[38px] h-[38px]  rounded-full flex flex-row justify-center items-center absolute z-[40] mr-auto ml-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  pointer-events-none cursor-pointer`}
               style={{
                  transform: "translate(-50%, -50%)",
                  left: myPosition.left,
                  top: myPosition.top,
               }}
            >
               {dancer.instagramUsername ? (
                  <img className="w-[34px] h-[34px] rounded-full select-none " src={dancer.instagramUsername} alt="" />
               ) : (
                  <div className="bg-white rounded-full w-8 h-8 grid place-items-center cursor-pointer font-semibold  ">
                     <p className="cursor-pointer">{initials}</p>
                  </div>
               )}
            </div>
         </>
      );
   }
   // if there is no formation selected and the track is not playing, then just return nothing
   if (selectedFormation === null) return <></>;

   let currentCoords = formations[selectedFormation]?.positions.find((dancerx: dancerPosition) => dancerx.id === dancer.id)?.position;

   // if the dancer does not have any coordinates right now, return nothing since it shouln't be displayed
   if (!currentCoords) return <></>;

   let { left, top } = coordsToPosition(currentCoords.x, currentCoords.y);

   return (
      <>
         <div
            style={{ left, top, transform: "translate(-50%, -50%)" }}
            id={dancer.id}
            className={` ${
               selectedDancers.includes(dancer.id)
                  ? "bg-blue-500 w-[41px] h-[41px]"
                  : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-[38px] h-[38px]"
            }  rounded-full flex flex-row justify-center items-center absolute z-[40] mr-auto ml-auto  `}
         >
            {dancer.instagramUsername ? (
               <img
                  id={dancer.id}
                  draggable={false}
                  className="w-[34px] h-[34px] rounded-full select-none"
                  src={dancer.instagramUsername}
                  alt={dancer.name}
               />
            ) : (
               <div id={dancer.id} className="bg-white rounded-full w-[34px] h-[34px] grid place-items-center select-none">
                  <p id={dancer.id} className="select-none font-semibold ">
                     {initials}
                  </p>
               </div>
            )}
         </div>
      </>
   );
};

const coordsToPosition = (x: number, y: number) => {
   return { left: 400 + 40 * x, top: 400 + 40 * -y };
};

const animate = (formations: formation[], position: number, id: string): { left: number; top: number } => {
   let sum = 0;
   let currentFormationIndex = null;
   let isInTransition;
   let percentThroughTransition;
   for (let i = 0; i < formations.length; i++) {
      sum = sum + formations[i].durationSeconds + formations[i]?.transition.durationSeconds;
      if (position < sum) {
         currentFormationIndex = i;
         let durationThroughTransition = position - (sum - formations[i]?.transition?.durationSeconds);

         if (durationThroughTransition > 0) {
            isInTransition = true;
            percentThroughTransition = durationThroughTransition / formations[i]?.transition?.durationSeconds;
         } else {
            isInTransition = false;
         }
         break;
      }
   }

   // if the position is beyond all the formation, return off stage
   if (currentFormationIndex === null) {
      return coordsToPosition(10, 10);
   }

   const inThisFormation = formations?.[currentFormationIndex]?.positions.find((dancer) => dancer.id === id);

   let inNextFormation = formations[currentFormationIndex + 1]
      ? formations[currentFormationIndex + 1].positions.find((dancerPosition) => dancerPosition.id === id)
      : false;

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

   return coordsToPosition(from.x + (to.x - from.x) * percentThroughTransition, from.y + (to.y - from.y) * percentThroughTransition);
};
