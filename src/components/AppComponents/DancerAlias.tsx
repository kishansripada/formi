import { dancer, dancerPosition, formation, stageDimensions } from "../../types/types";

export const DancerAlias: React.FC<{
   dancer: dancer;
   currentFormationIndex: number | null;
   percentThroughTransition: number;
   setDancers: Function;
   selectedFormation: number | null;
   formations: formation[];
   isPlaying: boolean;
   position: number | null;
   setFormations: Function;
   selectedDancers: string[];
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
   draggingDancerId: string | null;
   stageDimensions: any;
   userPositions: any;
   onlineUsers: any;
   zoom: number;
   setZoom: Function;
   localSettings: any;
   index: number;
}> = ({
   dancer,
   currentFormationIndex,
   percentThroughTransition,
   formations,
   setDancers,
   selectedFormation,
   isPlaying,
   position,
   setFormations,
   selectedDancers,
   coordsToPosition,
   draggingDancerId,
   stageDimensions,
   userPositions,
   onlineUsers,
   zoom,
   setZoom,
   localSettings,
   index,
}) => {
   let { dancerStyle } = localSettings;
   let initials = dancer.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

   // if the track is playing then  return with the animation function
   if (isPlaying && position !== null) {
      let myPosition = animate(formations, dancer.id, currentFormationIndex, percentThroughTransition, coordsToPosition, stageDimensions);

      // if the animation function returns null, the dancer is not on the stage
      if (myPosition === null) return <></>;
      let { left, top } = myPosition;
      return (
         <>
            <div
               className={`  rounded-full w-[38px] h-[38px] flex flex-row justify-center items-center absolute z-[40] mr-auto ml-auto cursor-default  `}
               style={{
                  // transform: `translate(-50%, -50%) translate(${left}px, ${top}px)`,
                  backgroundColor: dancer.color || "#db2777",
                  left,
                  top,
                  transform: "translate(-50%, -50%)",
               }}
            >
               {dancer.instagramUsername ? (
                  <img referrerPolicy="no-referrer" className="w-[32px] h-[32px] rounded-full select-none " src={dancer.instagramUsername} alt="" />
               ) : (
                  <div className="bg-white rounded-full w-[32px] h-[32px] grid place-items-center cursor-default  font-semibold  ">
                     {dancerStyle === "numbered" ? <>{index + 1}</> : <> {initials}</>}
                  </div>
               )}
               {dancerStyle === "numbered" ? (
                  <p className="absolute -bottom-6 text-center select-none pointer-events-none">{dancer.name.split(" ")[0]}</p>
               ) : null}
            </div>
         </>
      );
   }
   // if there is no formation selected and the track is not playing, then just return nothing
   if (selectedFormation === null) return <></>;

   let currentCoords = formations[selectedFormation]?.positions.find((dancerx: dancerPosition) => dancerx.id === dancer.id)?.position;

   // if the dancer does not have any coordinates right now, return nothing since it shouln't be displayed
   if (!currentCoords) return <></>;

   let { left, top } = coordsToPosition(currentCoords);

   // // since only one person should be selecting a single dancer, we just choose the first person that's selecting that dancer
   // let idSelectingMe = Object.keys(userPositions).filter(
   //    (id) => userPositions[id].selectedFormation === selectedFormation && userPositions[id].selectedDancers.includes(dancer.id)
   // )?.[0];

   // let color = onlineUsers?.[idSelectingMe]?.[0]?.color || dancer.color;
   // let name = onlineUsers?.[idSelectingMe]?.[0]?.name;

   // console.log(color);
   // let firstNamesOnThisFormation = idsOnThisFormation.map((id) => onlineUsers[id][0].name).map((name) => name.split(" ")[0]);
   // console.log(idSelectingMe);
   return (
      <>
         <div
            style={{
               left,
               top,
               // pointerEvents: idSelectingMe ? "none" : "auto",
               backgroundColor: dancer?.color || "#db2777",
               transition: !draggingDancerId ? "left 0.33s ease-in-out, top 0.33s ease-in-out" : "",
               width: selectedDancers.includes(dancer.id) ? 41 : 38,
               height: selectedDancers.includes(dancer.id) ? 41 : 38,
            }}
            id={dancer.id}
            data-type={"dancer"}
            className={`rounded-full lg:pointer-events-auto pointer-events-none flex -translate-y-1/2 -translate-x-1/2  flex-row justify-center items-center absolute z-[40] mr-auto ml-auto cursor-default `}
         >
            {/* <span className="animate-ping absolute  inline-flex w-[30px] h-[30px] rounded-full bg-sky-400 opacity-75"></span> */}

            {/* {idSelectingMe ? (
               <div
                  className="absolute h-4 text-xs text-white w-fit  px-1 bottom-[-14px]"
                  style={{
                     backgroundColor: color,
                  }}
               >
                  <p className="text-center">{name}</p>
               </div>
            ) : null} */}

            {dancer.instagramUsername ? (
               <img
                  referrerPolicy="no-referrer"
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
                  className="bg-white  rounded-full w-[32px] h-[32px] grid place-items-center select-none cursor-default "
               >
                  <p id={dancer.id} data-type={"dancer"} className="select-none font-semibold cursor-default  ">
                     {dancerStyle === "numbered" ? <>{index + 1}</> : <> {initials}</>}
                  </p>
               </div>
            )}
            {dancerStyle === "numbered" ? (
               <p className="absolute -bottom-6 text-center select-none pointer-events-none bg-white rounded-full px-1">
                  {dancer.name.split(" ")[0]}
               </p>
            ) : null}
         </div>
      </>
   );
};

const animate = (
   formations: formation[],
   id: string,
   currentFormationIndex: number | null,
   percentThroughTransition: number | undefined,
   coordsToPosition: Function,
   stageDimensions: stageDimensions
): { left: number; top: number } | null => {
   // if the position is beyond all the formation, return off stage
   if (currentFormationIndex === null) return null;
   let inPreviousFormation = formations[currentFormationIndex - 1]
      ? formations[currentFormationIndex - 1].positions.find((dancerPosition) => dancerPosition.id === id)
      : false;

   const inThisFormation = formations?.[currentFormationIndex]?.positions.find((dancer) => dancer.id === id);

   let from;
   let to;

   if (percentThroughTransition != undefined) {
      if (inThisFormation) {
         if (inPreviousFormation) {
            // transition between current and next
            // requires animation don't return yet
            from = inPreviousFormation.position;
            to = inThisFormation.position;
         } else {
            // transition between current and exit strategy specified in current
            // requires animation don't return yet
            from = inThisFormation.position;
            to = inThisFormation.position;
            // to = (() => {
            //    // if (inThisFormation.exitStrategy === "closest") {
            //    if (from.x >= 0) return { x: stageDimensions.width / 2 + 1, y: from.y };
            //    if (from.x < 0) return { x: -(stageDimensions.width / 2 + 1), y: from.y };
            //    // }
            //    // if (inThisFormation.exitStrategy === "right") {
            //    //    return { x: stageDimensions.width / 2 + 1, y: from.y };
            //    // }
            //    // if (inThisFormation.exitStrategy === "left") {
            //    //    return { x: -(stageDimensions.width / 2 + 1), y: from.y };
            //    // }
            // })();
         }
      }

      // else {
      //    if (inNextFormation) {
      //       // transition between enter strategy specified in next and position in next
      //       // requires animation don't return yet
      //       to = inNextFormation.position;

      //       from = (() => {
      //          return { x: stageDimensions.width / 2 + 1, y: to.y };
      //          // if (inNextFormation.enterStrategy === "closest") {
      //          //    if (to.x >= 0) return { x: stageDimensions.width / 2 + 1, y: to.y };
      //          //    if (to.x < 0) return { x: -(stageDimensions.width / 2 + 1), y: to.y };
      //          // }
      //          // if (inNextFormation.enterStrategy === "right") {
      //          //    return { x: stageDimensions.width / 2 + 1, y: to.y };
      //          // }
      //          // if (inNextFormation.enterStrategy === "left") {
      //          //    return { x: -(stageDimensions.width / 2 + 1), y: to.y };
      //          // }
      //       })();
      //    } else {
      //       // return off stage
      //       return null;
      //    }
      // }
   } else {
      if (inThisFormation) {
         // return position from this formation
         return coordsToPosition(inThisFormation.position);
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
   function easeOutBounce(x: number): number {
      const n1 = 7.5625;
      const d1 = 2.75;

      if (x < 1 / d1) {
         return n1 * x * x;
      } else if (x < 2 / d1) {
         return n1 * (x -= 1.5 / d1) * x + 0.75;
      } else if (x < 2.5 / d1) {
         return n1 * (x -= 2.25 / d1) * x + 0.9375;
      } else {
         return n1 * (x -= 2.625 / d1) * x + 0.984375;
      }
   }
   function easeInOutQuad(x: number): number {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
   }
   function easeInOutExpo(x: number): number {
      return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
   }
   function easeOutQuart(x: number): number {
      return 1 - Math.pow(1 - x, 4);
   }

   percentThroughTransition = easeInOutQuad(percentThroughTransition);

   if (inThisFormation?.transitionType === "cubic" && inThisFormation?.controlPointStart?.y && inThisFormation?.controlPointStart?.x) {
      return coordsToPosition({
         x:
            (1 - percentThroughTransition) ** 3 * from.x +
            3 * (1 - percentThroughTransition) ** 2 * percentThroughTransition * inThisFormation.controlPointStart.x +
            3 * (1 - percentThroughTransition) * percentThroughTransition ** 2 * inThisFormation.controlPointEnd.x +
            percentThroughTransition ** 3 * to.x,
         y:
            (1 - percentThroughTransition) ** 3 * from.y +
            3 * (1 - percentThroughTransition) ** 2 * percentThroughTransition * inThisFormation.controlPointStart.y +
            3 * (1 - percentThroughTransition) * percentThroughTransition ** 2 * inThisFormation.controlPointEnd.y +
            percentThroughTransition ** 3 * to.y,
      });
   }
   return coordsToPosition({ x: from.x + (to.x - from.x) * percentThroughTransition, y: from.y + (to.y - from.y) * percentThroughTransition });
};
