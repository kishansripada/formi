import { cloudSettings, dancer, dancerPosition, formation, stageDimensions, PIXELS_PER_SQUARE, localSettings } from "../../types/types";

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
   cloudSettings: cloudSettings;
   userPositions: any;
   onlineUsers: any;
   zoom: number;
   setZoom: Function;
   localSettings: any;
   index: number;
   collisions: any;
   isChangingCollisionRadius: boolean;
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
   cloudSettings,
   userPositions,
   onlineUsers,
   zoom,
   setZoom,
   localSettings,
   collisions,
   index,
   isChangingCollisionRadius,
}) => {
   let { stageDimensions } = cloudSettings;
   let { dancerStyle, collisionRadius } = localSettings;
   let initials = dancer.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

   // let isInCollision = selectedFormation
   //    ? collisions
   //         ?.map((collision) => collision.dancers)
   //         .flat(Infinity)
   //         .includes(dancer.id)
   //    : false;

   let myPosition;
   // if the track is playing then  return with the animation function
   if (isPlaying && position !== null) {
      myPosition = animate(formations, dancer.id, currentFormationIndex, percentThroughTransition, coordsToPosition, stageDimensions);
   } else {
      myPosition = formations[selectedFormation]?.positions.find((dancerx: dancerPosition) => dancerx.id === dancer.id)?.position;
   }
   // if there is no formation selected and the track is not playing, then just return nothing
   if (selectedFormation === null) return <></>;
   // if the dancer does not have any coordinates right now, return nothing since it shouln't be displayed
   if (!myPosition) return <></>;

   let { left, top } = coordsToPosition(myPosition);

   // // since only one person should be selecting a single dancer, we just choose the first person that's selecting that dancer
   let idSelectingMe = Object.keys(userPositions).filter(
      (id) => userPositions[id].selectedFormation === selectedFormation && userPositions[id].selectedDancers.includes(dancer.id)
   )?.[0];

   // let color = onlineUsers?.[idSelectingMe]?.[0]?.color || dancer.color;
   let name = onlineUsers?.[idSelectingMe]?.[0]?.name;

   // console.log(color);
   // let firstNamesOnThisFormation = idsOnThisFormation.map((id) => onlineUsers[id][0].name).map((name) => name.split(" ")[0]);
   // console.log(idSelectingMe);
   return (
      <>
         <div
            style={{
               left: left,
               top: top,
               WebkitUserSelect: "none",
               MozUserSelect: "none",
               msUserSelect: "none",
               userSelect: "none",
               // borderRadius: dancer?.shape === "square" ? 0 : "50%",
               // pointerEvents: idSelectingMe ? "none" : "auto",
               // transform: `scale(${(1 / zoom) * 0.66}) translate(-${50 * zoom * (1 / 0.6)}%, -${50 * zoom * (1 / 0.66)}%)`,
               // transformOrigin: "center",
               pointerEvents: isPlaying ? "none" : "auto",
               // backgroundColor:
               //    selectedDancers.includes(dancer.id) && !isPlaying
               //       ? localSettings.isDarkMode
               //          ? "white"
               //          : "#404040"
               //       : hexToRGBA(dancer?.color || "#db2777", 0.5),
               transition: !draggingDancerId && !isPlaying ? "left 0.33s ease-in-out, top 0.33s ease-in-out" : "",
               // width: selectedDancers.includes(dancer.id) && !isPlaying ? 41 : 38,
               // height: selectedDancers.includes(dancer.id) && !isPlaying ? 41 : 38,
            }}
            onMouseDown={(e) => e.preventDefault()}
            id={dancer.id}
            data-type={"dancer"}
            className={` w-[35px] h-[35px]  group select-none  lg:pointer-events-auto pointer-events-none flex  -translate-y-1/2 -translate-x-1/2 flex-row justify-center items-center absolute z-[30] mr-auto ml-auto cursor-default `}
         >
            {dancer.shape === "square" ? (
               <svg
                  id={dancer.id}
                  data-type={"dancer"}
                  className={` w-full h-full select-none  lg:pointer-events-auto pointer-events-none flex  flex-row justify-center items-center absolute z-[40] mr-auto ml-auto cursor-default `}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  style={{
                     pointerEvents: isPlaying ? "none" : "auto",
                  }}
                  viewBox="0 0 140 140"
               >
                  <path
                     className="group-hover:stroke-[20px]"
                     id={dancer.id}
                     data-type={"dancer"}
                     fill={dancer?.color || "#db2777"}
                     stroke={
                        selectedDancers.includes(dancer.id) && !isPlaying
                           ? localSettings.isDarkMode
                              ? "white"
                              : "#404040"
                           : hexToRGBA(dancer?.color || "#db2777", 0.5)
                     }
                     // stroke-width="8"
                     d="M3.5 3.5h133v133H3.5z"
                  />
               </svg>
            ) : dancer.shape === "triangle" ? (
               <svg
                  id={dancer.id}
                  data-type={"dancer"}
                  className={` w-full h-full select-none  lg:pointer-events-auto pointer-events-none flex  flex-row justify-center items-center absolute z-[40] mr-auto ml-auto cursor-default `}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 134 116"
                  style={{
                     pointerEvents: isPlaying ? "none" : "auto",
                  }}
               >
                  <path
                     className="group-hover:stroke-[20px]"
                     id={dancer.id}
                     data-type={"dancer"}
                     fill={dancer?.color || "#db2777"}
                     stroke={
                        selectedDancers.includes(dancer.id) && !isPlaying
                           ? localSettings.isDarkMode
                              ? "white"
                              : "#404040"
                           : hexToRGBA(dancer?.color || "#db2777", 0.5)
                     }
                     stroke-width="8"
                     d="M8.9763 110.5L67 10L125.024 110.5H8.9763Z"
                  />
               </svg>
            ) : (
               <svg
                  id={dancer.id}
                  data-type={"dancer"}
                  className={` w-full h-full select-none  lg:pointer-events-auto pointer-events-none flex  flex-row justify-center items-center absolute z-[40] mr-auto ml-auto cursor-default `}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 154 154"
                  style={{
                     pointerEvents: isPlaying ? "none" : "auto",
                  }}
               >
                  <circle
                     cx="77"
                     cy="77"
                     r="65"
                     className="group-hover:stroke-[20px]"
                     id={dancer.id}
                     data-type={"dancer"}
                     fill={dancer?.color || "#db2777"}
                     stroke={
                        selectedDancers.includes(dancer.id) && !isPlaying
                           ? localSettings.isDarkMode
                              ? "white"
                              : "#404040"
                           : hexToRGBA(dancer?.color || "#db2777", 0.5)
                     }
                     stroke-width="8"
                  />
               </svg>
            )}

            {dancerStyle !== "initials" ? (
               <p className="absolute -bottom-6 text-center select-none pointer-events-none dark:text-white  rounded-full px-1">
                  {dancer.name.split(" ")[0]}
               </p>
            ) : null}
            <p className="select-none font-semibold cursor-default  relative  pointer-events-none text-white z-50 ">
               {dancerStyle === "numbered" ? <>{index + 1}</> : dancerStyle === "initials" ? <> {initials}</> : <></>}
            </p>

            {/* <p id={dancer.id} data-type={"dancer"} className="select-none font-semibold cursor-default  ">
               {dancerStyle === "numbered" ? <>{index + 1}</> : dancerStyle === "initials" ? <> {initials}</> : <></>}
            </p> */}
            {/* {isChangingCollisionRadius ? (
               <div
                  style={{
                     width: PIXELS_PER_SQUARE * collisionRadius * 2,
                     height: PIXELS_PER_SQUARE * collisionRadius * 2,
                  }}
                  className=" border-red-600 border-2 rounded-full absolute"
               ></div>
            ) : null}

            <div
               id={dancer.id}
               data-type={"dancer"}
               style={{
                  backgroundColor: dancer.color || "#db2777",
                  borderRadius: dancer?.shape === "square" ? 0 : "50%",
               }}
               className={` w-[29px] h-[29px] grid place-items-center select-none text-white cursor-default `}
            >
               <p id={dancer.id} data-type={"dancer"} className="select-none font-semibold cursor-default  ">
                  {dancerStyle === "numbered" ? <>{index + 1}</> : dancerStyle === "initials" ? <> {initials}</> : <></>}
               </p>
            </div>

            {dancerStyle !== "initials" ? (
               <p className="absolute -bottom-6 text-center select-none pointer-events-none dark:text-white  rounded-full px-1">
                  {dancer.name.split(" ")[0]}
               </p>
            ) : null} */}
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
): { x: number; y: number } | null => {
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
         }
      }
   } else {
      if (inThisFormation) {
         // return position from this formation
         return inThisFormation.position;
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

   if (inThisFormation?.transitionType === "teleport") {
      return null;
   }
   if (inThisFormation?.transitionType === "cubic" && inThisFormation?.controlPointStart?.y && inThisFormation?.controlPointStart?.x) {
      return {
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
      };
   }
   return { x: from.x + (to.x - from.x) * percentThroughTransition, y: from.y + (to.y - from.y) * percentThroughTransition };
};

function hexToRGBA(hex: string, alpha: number) {
   const r = parseInt(hex.slice(1, 3), 16);
   const g = parseInt(hex.slice(3, 5), 16);
   const b = parseInt(hex.slice(5, 7), 16);

   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
