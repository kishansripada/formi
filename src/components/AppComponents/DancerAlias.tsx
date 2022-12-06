import { dancer, dancerPosition, formation, GRID_WIDTH } from "../../types/types";

export const DancerAlias: React.FC<{
   dancer: dancer;
   setDancers: Function;
   selectedFormation: number | null;
   formations: formation[];
   isPlaying: boolean;
   position: number | null;
   setFormations: Function;
   selectedDancers: string[];
   coordsToPosition: Function;
   draggingDancerId: string | null;
}> = ({
   dancer,
   formations,
   setDancers,
   selectedFormation,
   isPlaying,
   position,
   setFormations,
   selectedDancers,
   coordsToPosition,
   draggingDancerId,
}) => {
   let initials = dancer.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

   const whereInFormation = (formations: formation[], position: number) => {
      let sum = 0;
      let currentFormationIndex = null;

      let percentThroughTransition;
      for (let i = 0; i < formations.length; i++) {
         sum = sum + formations[i].durationSeconds + formations[i]?.transition.durationSeconds;
         if (position < sum) {
            currentFormationIndex = i;
            let durationThroughTransition = position - (sum - formations[i]?.transition?.durationSeconds);

            if (durationThroughTransition > 0) {
               percentThroughTransition = durationThroughTransition / formations[i]?.transition?.durationSeconds;
            }
            break;
         }
      }
      return { currentFormationIndex, percentThroughTransition };
   };

   let { currentFormationIndex, percentThroughTransition } = whereInFormation(formations, position);

   // if the track is playing then  return with the animation function
   if (isPlaying && position !== null) {
      let myPosition = animate(formations, dancer.id, currentFormationIndex, percentThroughTransition, coordsToPosition);

      // if the animation function returns null, the dancer is not on the stage
      if (myPosition === null) return <></>;
      let { left, top } = myPosition;
      return (
         <>
            <div
               className={` ${
                  dancer.color === "#FFFFFF" || !dancer.color ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" : ""
               } rounded-full w-[38px] h-[38px] flex flex-row justify-center items-center absolute z-[40] mr-auto ml-auto cursor-default  `}
               style={{
                  // transform: `translate(-50%, -50%) translate(${left}px, ${top}px)`,
                  backgroundColor: dancer.color || "",
                  left,
                  top,
                  transform: "translate(-50%, -50%)",
               }}
            >
               {dancer.instagramUsername ? (
                  <img className="w-[32px] h-[32px] rounded-full select-none " src={dancer.instagramUsername} alt="" />
               ) : (
                  <div className="bg-white rounded-full w-[32px] h-[32px] grid place-items-center cursor-default  font-semibold  ">
                     <p className="cursor-default ">{initials}</p>
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
            style={{
               left,
               top,
               transform: "translate(-50%, -50%)",
               // transform: `translate(-50%, -50%) translate(${left}px, ${top}px)`,
               backgroundColor: selectedDancers.includes(dancer.id) ? "black" : dancer.color || "",
               transition: !draggingDancerId ? "left 0.33s ease-in-out, top 0.33s ease-in-out" : "",
            }}
            id={dancer.id}
            data-type={"dancer"}
            className={` 
              rounded-full flex flex-row justify-center items-center absolute z-[40] mr-auto ml-auto cursor-default  ${
                 selectedDancers.includes(dancer.id)
                    ? "w-[41px] h-[41px]"
                    : ` w-[38px] h-[38px] ${
                         dancer.color === "#FFFFFF" || !dancer.color ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" : ""
                      }`
              } `}
         >
            {dancer.instagramUsername ? (
               <img
                  id={dancer.id}
                  data-type={"dancer"}
                  draggable={false}
                  className="w-[32px] h-[32px] rounded-full select-none"
                  src={dancer.instagramUsername}
                  alt={dancer.name}
               />
            ) : (
               <div
                  id={dancer.id}
                  data-type={"dancer"}
                  className="bg-white rounded-full w-[32px] h-[32px] grid place-items-center select-none cursor-default "
               >
                  <p id={dancer.id} data-type={"dancer"} className="select-none font-semibold cursor-default  ">
                     {initials}
                  </p>
               </div>
            )}
         </div>
      </>
   );
};

const animate = (
   formations: formation[],
   id: string,
   currentFormationIndex: number | null,
   percentThroughTransition: number | undefined,
   coordsToPosition: Function
): { left: number; top: number } | null => {
   // if the position is beyond all the formation, return off stage
   if (currentFormationIndex === null) return null;

   const inThisFormation = formations?.[currentFormationIndex]?.positions.find((dancer) => dancer.id === id);

   let inNextFormation = formations[currentFormationIndex + 1]
      ? formations[currentFormationIndex + 1].positions.find((dancerPosition) => dancerPosition.id === id)
      : false;

   let from;
   let to;

   if (percentThroughTransition != undefined) {
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
                  if (from.x >= 0) return { x: GRID_WIDTH / 2 + 1, y: from.y };
                  if (from.x < 0) return { x: -(GRID_WIDTH / 2 + 1), y: from.y };
               }
               if (inThisFormation.exitStrategy === "right") {
                  return { x: GRID_WIDTH / 2 + 1, y: from.y };
               }
               if (inThisFormation.exitStrategy === "left") {
                  return { x: -(GRID_WIDTH / 2 + 1), y: from.y };
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
                  if (to.x >= 0) return { x: GRID_WIDTH / 2 + 1, y: to.y };
                  if (to.x < 0) return { x: -(GRID_WIDTH / 2 + 1), y: to.y };
               }
               if (inNextFormation.enterStrategy === "right") {
                  return { x: GRID_WIDTH / 2 + 1, y: to.y };
               }
               if (inNextFormation.enterStrategy === "left") {
                  return { x: -(GRID_WIDTH / 2 + 1), y: to.y };
               }
            })();
         } else {
            // return off stage
            return null;
         }
      }
   } else {
      if (inThisFormation) {
         // return position from this formation
         return coordsToPosition(inThisFormation.position.x, inThisFormation.position.y);
      } else {
         // return off stage
         return null;
      }
   }

   function easeInOutSine(x: number): number {
      return -(Math.cos(Math.PI * x) - 1) / 2;
   }

   function easeInOutElastic(x: number): number {
      const c5 = (2 * Math.PI) / 4.5;

      return x === 0
         ? 0
         : x === 1
         ? 1
         : x < 0.5
         ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
         : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
   }
   function easeInOutQuad(x: number): number {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
   }
   percentThroughTransition = easeInOutQuad(percentThroughTransition);

   if (inThisFormation?.transitionType === "cubic" && inThisFormation?.controlPointStart?.y && inThisFormation?.controlPointStart?.x) {
      return coordsToPosition(
         (1 - percentThroughTransition) ** 3 * from.x +
            3 * (1 - percentThroughTransition) ** 2 * percentThroughTransition * inThisFormation.controlPointStart.x +
            3 * (1 - percentThroughTransition) * percentThroughTransition ** 2 * inThisFormation.controlPointEnd.x +
            percentThroughTransition ** 3 * to.x,
         (1 - percentThroughTransition) ** 3 * from.y +
            3 * (1 - percentThroughTransition) ** 2 * percentThroughTransition * inThisFormation.controlPointStart.y +
            3 * (1 - percentThroughTransition) * percentThroughTransition ** 2 * inThisFormation.controlPointEnd.y +
            percentThroughTransition ** 3 * to.y
      );
   }
   return coordsToPosition(from.x + (to.x - from.x) * percentThroughTransition, from.y + (to.y - from.y) * percentThroughTransition);
};
