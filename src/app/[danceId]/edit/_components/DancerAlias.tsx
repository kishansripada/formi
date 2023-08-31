import { useGesture } from "@use-gesture/react";
import {
   cloudSettings,
   dancer,
   dancerPosition,
   formation,
   stageDimensions,
   PIXELS_PER_SQUARE,
   localSettings,
   item,
   COLORS,
} from "../../../../types/types";
import { useStore } from "../store";
import { useEffect, useRef } from "react";
import { useIsDesktop } from "../../../../hooks";

export const DancerAlias: React.FC<{
   dancer: dancer;
   currentFormationIndex: number | null;
   percentThroughTransition: number;
   isPlaying: boolean;
   position: number | null;

   selectedDancers: string[];
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
   draggingDancerId: string | null;

   zoom: number;
   setZoom: Function;
   localSettings: any;
   index: number;
   collisions: any;
   isChangingCollisionRadius: boolean;
   roundPositions: Function;
}> = ({
   dancer,
   currentFormationIndex,
   percentThroughTransition,
   isPlaying,
   position,

   selectedDancers,
   coordsToPosition,
   draggingDancerId,
   zoom,
   setZoom,
   localSettings,
   collisions,
   index,
   isChangingCollisionRadius,
   // items,
   roundPositions,
}) => {
   let { formations, items, cloudSettings, selectedFormations, getFirstSelectedFormation, setFormations, get, isMobileView } = useStore();
   const container = useRef<HTMLDivElement>();
   const stageFlippedFactor = localSettings.stageFlipped ? -1 : 1;
   const horizontalScalar = (1 / PIXELS_PER_SQUARE) * (1 / zoom) * stageFlippedFactor;
   const verticalScalar = (1 / PIXELS_PER_SQUARE) * (1 / zoom) * stageFlippedFactor;
   // useEffect(() => {
   //    // const handler = (e: Event) => e.preventDefault();

   //    document.addEventListener("gestureend", () => {
   //       console.log("gesture end");
   //       roundPositions();
   //    });
   //    return () => {
   //       document.removeEventListener("gestureend", () => {
   //          console.log("gesture end");
   //          roundPositions();
   //       });
   //    };
   // }, []);

   // const isDesktop = useIsDesktop();
   useGesture(
      {
         onDrag: (state) => {
            setFormations(
               get().formations.map((formation) => {
                  if (get().selectedFormations.includes(formation.id)) {
                     return {
                        ...formation,
                        positions: formation.positions.map((position) => {
                           if (get().selectedDancers.includes(position.id)) {
                              console.log(position.position.x + state.delta[0] * horizontalScalar, position.position.x);
                              return {
                                 ...position,
                                 position: {
                                    x: position.position.x + state.delta[0] * horizontalScalar,
                                    y: position.position.y - state.delta[1] * verticalScalar,
                                 },
                              };
                           }
                           return position;
                        }),
                     };
                  }
                  return formation;
               })
            );
            // console.log(getFirstSelectedFormation()?.positions.find((position) => position.id === dancer.id)?.position.x);
         },
         onDragEnd: () => {
            roundPositions();
         },
      },
      {
         eventOptions: { passive: false },
         target: container.current,
         enabled: isMobileView,
      }
      // config
   );

   const others = useStore((state) => state.liveblocks.others);
   // const thisOne = getCurrentFormation();

   const othersOnThisFormation = others.filter((other) => other.presence?.selectedFormations?.includes(getFirstSelectedFormation()?.id));
   const othersOnThisDancer = othersOnThisFormation.filter((other) => other.presence.selectedDancers.includes(dancer.id));
   let { stageDimensions } = cloudSettings;
   let { dancerStyle, collisionRadius, stageFlipped } = localSettings;
   let initials = dancer.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();
   if (stageFlipped) {
      formations = formations.map((formation: formation) => {
         let flippedPositions = formation.positions.map((position) => {
            if (position.controlPointEnd && position.controlPointStart) {
               return {
                  ...position,
                  position: { x: -position.position.x, y: -position.position.y },
                  controlPointEnd: { x: -position.controlPointEnd.x, y: -position.controlPointEnd.y },
                  controlPointStart: { x: -position.controlPointStart.x, y: -position.controlPointStart.y },
               };
            } else {
               return {
                  ...position,
                  position: { x: -position.position.x, y: -position.position.y },
               };
            }
         });

         return { ...formation, positions: flippedPositions };
      });
   }

   if (!selectedFormations.length) return <></>;
   let dancerPos = getFirstSelectedFormation(formations)?.positions.find((dancerx: dancerPosition) => dancerx.id === dancer.id);

   if (!dancerPos) return <></>;

   let myPosition;
   // if the track is playing then  return with the animation function
   if (isPlaying && position !== null) {
      myPosition = animate(formations, dancer.id, currentFormationIndex, percentThroughTransition, coordsToPosition, stageDimensions);
   } else {
      myPosition = dancerPos?.position;
   }
   // if there is no formation selected and the track is not playing, then just return nothing

   // if the dancer does not have any coordinates right now, return nothing since it shouln't be displayed
   if (!myPosition) return <></>;

   let { left, top } = coordsToPosition(myPosition);

   const thisItem = items.find((item) => item.id === dancerPos?.itemId) || null;

   const HUMAN_WIDTH_FEET = 1.5;
   return (
      <>
         {/* {othersOnThisDancer.length && !isPlaying ? (
            <div
               style={{
                  transform: `scale(${(1 / zoom) * 0.8}) `,
                  transformOrigin: "bottom right",
                  // left: left - PIXELS_PER_SQUARE * HUMAN_WIDTH_FEET * 1.3,
                  left,
                  top: top - PIXELS_PER_SQUARE * HUMAN_WIDTH_FEET * 0.8,
                  transition: !draggingDancerId && !isPlaying ? "left 0.33s ease-in-out, top 0.33s ease-in-out" : "",
               }}
               className="absolute z-[99]  pointer-events-none  "
            >
               <p
                  className="px-2 py-1 rounded-full text-white font-bold text-xs whitespace-nowrap "
                  style={{
                     // transform: `scale(${(1 / zoom) * 0.8}) translate(0%, -${100 * zoom * (1 / 0.8)}%)`,
                     // transform: `translateX(${-PIXELS_PER_SQUARE / 2}px)`,
                     background: COLORS[othersOnThisDancer[0]?.connectionId % COLORS.length],
                  }}
               >
                  {toHumanReadableList(othersOnThisDancer.map((person) => person.presence.nameOrEmail || "kishansripada@gmail.com"))}
               </p>
            </div>
         ) : null} */}
         <style jsx>{`
            .text-outline {
               color: white;
               text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
            }
         `}</style>
         <div
            style={{
               left: left,
               top: top,
               // transform: `translate(${left}px, ${top}px)`,
               WebkitUserSelect: "none",
               MozUserSelect: "none",
               msUserSelect: "none",
               userSelect: "none",
               width: PIXELS_PER_SQUARE * HUMAN_WIDTH_FEET,
               height: PIXELS_PER_SQUARE * HUMAN_WIDTH_FEET,
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
               transition: !draggingDancerId && !isPlaying ? "left 0.33s ease-in-out, top 0.33s ease-in-out, transform 0.33s ease-in-out" : "",
               transform: `translate(-50%, -50%) scale(${draggingDancerId === dancer.id ? (isMobileView ? 1.5 : 1.2) : 1})`,

               // width: selectedDancers.includes(dancer.id) && !isPlaying ? 41 : 38,
               transformOrigin: "center",
               // height: selectedDancers.includes(dancer.id) && !isPlaying ? 41 : 38,
               touchAction: "none",
            }}
            ref={container}
            // onMouseDown={(e) => e.preventDefault()}
            id={dancer.id}
            // {...bind()}
            data-type={"dancer"}
            className={`   group   lg:pointer-events-auto  flex   flex-row justify-center items-center absolute z-[30] mr-auto ml-auto cursor-default `}
         >
            {thisItem && (
               <div
                  style={{
                     transform:
                        thisItem.side === "bottom"
                           ? "translateY(50%)"
                           : thisItem.side === "right"
                           ? "translateY(0%) translateX(50%)"
                           : thisItem.side === "left"
                           ? "translateY(0%) translateX(-50%)"
                           : "translateY(-50%)",
                     width: PIXELS_PER_SQUARE * (thisItem.width || 1),
                  }}
                  className="absolute z-[99]  pointer-events-none  "
               >
                  <img
                     style={{
                        transform:
                           thisItem.side === "bottom"
                              ? `translateY(${PIXELS_PER_SQUARE / 2}px)`
                              : thisItem.side === "right"
                              ? `translateX(${PIXELS_PER_SQUARE / 2}px)`
                              : thisItem.side === "left"
                              ? `translateX(${-PIXELS_PER_SQUARE / 2}px)`
                              : `translateY(${-PIXELS_PER_SQUARE / 2}px)`,
                     }}
                     className="w-full h-full"
                     src={`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${thisItem?.url}`}
                     alt=""
                  />
               </div>
            )}
            {othersOnThisDancer.length && !isPlaying ? (
               <div
                  style={{
                     // // transform: `scale(${(1 / zoom) * 0.8})`,
                     // // transformOrigin: "bottom right",
                     // transform: `scale(${(1 / zoom) * 0.8}) translate(0%, -${100 * zoom * (1 / 0.8)}%)`,
                     // transformOrigin: "bottom right",
                     // // left: left - PIXELS_PER_SQUARE * HUMAN_WIDTH_FEET * 1.3,
                     // // left,
                     // // top: top - PIXELS_PER_SQUARE * HUMAN_WIDTH_FEET * 0.8,
                     // left: 0,
                     // top: 0,

                     // transform: `scale(${(1 / zoom) * 0.8})`,
                     transformOrigin: "bottom right",
                     left: 0,
                     top: 0,
                     transform: `translate(calc(-50% - ${(PIXELS_PER_SQUARE * HUMAN_WIDTH_FEET) / 2}px), -100%)`,
                     transition: !draggingDancerId && !isPlaying ? "left 0.33s ease-in-out, top 0.33s ease-in-out" : "",
                  }}
                  className="relative z-[99]  pointer-events-none    -translate-y-full"
               >
                  <p
                     className="px-2 py-1 rounded-full text-white font-bold text-xs whitespace-nowrap "
                     style={{
                        // transform: "translate(-100%, 0%) ",

                        // transform: `scale(${(1 / zoom) * 0.8}) translate(0%, -${100 * zoom * (1 / 0.8)}%)`,
                        // transform: `translateX(${-PIXELS_PER_SQUARE / 2}px)`,
                        background: COLORS[othersOnThisDancer[0]?.connectionId % COLORS.length],
                     }}
                  >
                     {toHumanReadableList(othersOnThisDancer.map((person) => person.presence.nameOrEmail || "Anonymous"))}
                  </p>
               </div>
            ) : null}

            {dancer.shape === "square" ? (
               <svg
                  className={` w-full h-full select-none   pointer-events-none flex  flex-row justify-center items-center absolute z-[40] mr-auto ml-auto cursor-default `}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 140 140"
               >
                  <path
                     style={{
                        transition: "fill 0.5s ease",
                     }}
                     className="group-hover:stroke-[20px]"
                     fill={dancerPos?.color || dancer?.color || "#db2777"}
                     stroke={
                        selectedDancers.includes(dancer.id) && !isPlaying
                           ? localSettings.isDarkMode
                              ? "white"
                              : "#404040"
                           : hexToRGBA(dancerPos?.color || dancer?.color || "#db2777", 0.5)
                     }
                     strokeWidth={selectedDancers.includes(dancer.id) ? 20 : 8}
                     d="M3.5 3.5h133v133H3.5z"
                  />
               </svg>
            ) : dancer.shape === "triangle" ? (
               <svg
                  className={` w-full h-full select-none  pointer-events-none relative bottom-2 flex  flex-row justify-center items-center  z-[40] mr-auto ml-auto cursor-default `}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 134 116"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 366 317">
                     <path
                        style={{
                           transition: "fill 0.5s ease",
                        }}
                        className="group-hover:stroke-[20px] "
                        fill={dancerPos?.color || dancer?.color || "#db2777"}
                        stroke={
                           selectedDancers.includes(dancer.id) && !isPlaying
                              ? localSettings.isDarkMode
                                 ? "white"
                                 : "#404040"
                              : hexToRGBA(dancerPos?.color || dancer?.color || "#db2777", 0.5)
                        }
                        strokeWidth={selectedDancers.includes(dancer.id) ? 20 : 8}
                        d="M191.66 35 183 20l-8.66 15L26.2494 291.5l-8.6603 15H348.411l-8.66-15L191.66 35Z"
                     />
                  </svg>
               </svg>
            ) : (
               <svg
                  className={` w-full h-full select-none  pointer-events-none flex  flex-row justify-center items-center absolute z-[40] mr-auto ml-auto cursor-default `}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 190 190"
               >
                  <circle
                     cx="95"
                     cy="95"
                     r="80"
                     style={{
                        transition: "fill 0.5s ease",
                     }}
                     className="group-hover:stroke-[20px] "
                     fill={dancerPos?.color || dancer?.color || "#db2777"}
                     stroke={
                        selectedDancers.includes(dancer.id) && !isPlaying
                           ? localSettings.isDarkMode
                              ? "white"
                              : "#404040"
                           : hexToRGBA(dancerPos?.color || dancer?.color || "#db2777", 0.5)
                     }
                     strokeWidth="8"
                  />
               </svg>
            )}

            {dancerStyle !== "initials" ? (
               <p
                  style={{
                     bottom: thisItem?.side === "bottom" ? null : -24,
                     top: thisItem?.side === "bottom" ? -24 : null,
                  }}
                  className="absolute  text-center select-none pointer-events-none dark:text-white  rounded-full px-1"
               >
                  {dancer.name.split(" ")[0]}
               </p>
            ) : null}
            <div className="select-none w-full h-full font-semibold cursor-default text-center absolute top-0 left-0 grid place-items-center  pointer-events-none text-white z-50 ">
               <p className="text-2xl ">
                  {dancerStyle === "numbered" ? index + 1 : dancerStyle === "initials" || dancerStyle === "initialsAndName" ? initials : <></>}
               </p>
            </div>

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

   if (!inThisFormation) return null;
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

function toHumanReadableList(names: string[]): string {
   // Extract first names from the list
   const firstNames = names.map((name) => name.split(" ")[0]);

   // Depending on the length of the names, format the string differently
   switch (firstNames.length) {
      case 0:
         return "";
      case 1:
         return firstNames[0];
      case 2:
         return `${firstNames[0]} & ${firstNames[1]}`;
      default:
         return `${firstNames.slice(0, -1).join(", ")} & ${firstNames[firstNames.length - 1]}`;
   }
}
