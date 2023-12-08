import { cloudSettings, dancer, PIXELS_PER_SQUARE, COLORS, item, initials, dancerPosition } from "../../../../types/types";
import { useStore } from "../store";
import { useMemo, useRef } from "react";

import {
   ContextMenu,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuTrigger,
   ContextMenuSeparator,
   ContextMenuShortcut,
} from "@/components/ui/context-menu";

import { ContextMenuLabel, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "../../../../../@/components/ui/context-menu";
import { HexColorPicker } from "react-colorful";
import { cubic, linear } from "../animationFunctions";
export const DancerAlias: React.FC<{
   dancer: dancer;
   currentFormationIndex: number | null;
   percentThroughTransition: number;

   selectedDancers: string[];
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
   draggingDancerId: string | null;
   zoom: number;
   localSettings: any;
   index: number;
   collisions: any;
}> = ({
   dancer,
   currentFormationIndex,
   percentThroughTransition,

   position,
   selectedDancers,
   coordsToPosition,
   draggingDancerId,
   zoom,
   localSettings,
   collisions,
   index,
}) => {
   let {
      formations,
      items,
      cloudSettings,
      selectedFormations,
      getFirstSelectedFormation,
      setFormations,
      get,
      isMobileView,
      viewOnly,
      imageBlobs,
      dancers,
      setDancers,
      hoveringDancerIds,
      isPlaying,
   } = useStore();

   const container = useRef<HTMLDivElement>();

   const others = useStore((state) => state.liveblocks.others);
   const othersOnThisFormation = others.filter((other) => other.presence?.selectedFormations?.includes(getFirstSelectedFormation()?.id));
   const othersOnThisDancer = othersOnThisFormation.filter((other) => other.presence.selectedDancers.includes(dancer.id));

   let { dancerStyle, collisionRadius, stageFlipped } = localSettings;
   const stageFlippedFactor = stageFlipped ? -1 : 1;

   const dancerPos = getFirstSelectedFormation()?.positions.find((dancerPos) => dancerPos.id === dancer.id) || null;

   const myPosition = useMemo(() => {
      // console.log("had to recalculate positoin");
      if (!isPlaying && selectedFormations.length === 0) return null;
      if (currentFormationIndex === null) return null;

      const thisFormationPosition = getFirstSelectedFormation()?.positions.find((dancerPos) => dancerPos.id === dancer.id);
      if (!thisFormationPosition) {
         console.error("ERROR: no formation position");
         return null;
      }

      if (!isPlaying || !percentThroughTransition || (isPlaying && currentFormationIndex === 0)) {
         return thisFormationPosition.position;
      }

      // worst case animate
      const previousFormationPosition = formations[currentFormationIndex - 1]?.positions.find((dancerPos) => dancerPos.id === dancer.id);
      if (!previousFormationPosition) {
         console.error("ERROR: no previous formation position");
         return null;
      }

      if (thisFormationPosition.transitionType === "cubic" && thisFormationPosition.controlPointStart && thisFormationPosition.controlPointEnd) {
         return cubic(
            previousFormationPosition.position,
            thisFormationPosition.position,
            percentThroughTransition,
            thisFormationPosition.controlPointStart,
            thisFormationPosition.controlPointEnd
         );
      } else if (thisFormationPosition.transitionType === "teleport") {
         return linear(previousFormationPosition.position, thisFormationPosition.position, percentThroughTransition);
      } else {
         return linear(previousFormationPosition.position, thisFormationPosition.position, percentThroughTransition);
      }
   }, [isPlaying ? percentThroughTransition : null, formations, currentFormationIndex, isPlaying, selectedFormations]);
   // ,
   if (!myPosition) return <></>;

   let { left, top } = coordsToPosition({ x: myPosition.x * stageFlippedFactor, y: myPosition.y * stageFlippedFactor });

   const thisItem = items.find((item) => item.id === dancerPos?.itemId) || null;

   const HUMAN_WIDTH_FEET = 1.5;

   // const changeShape = (shape: "circle" | "triangle" | "square") => {
   //    setDancers(
   //       dancers.map((dancer) => {
   //          if (selectedDancers.includes(dancer.id)) {
   //             return { ...dancer, shape };
   //          }
   //          return dancer;
   //       })
   //    );
   // };
   const setDancerItem = (itemId: string | null) => {
      if (viewOnly) return;
      setFormations(
         formations.map((formation, index: number) => {
            if (selectedFormations.includes(formation.id)) {
               return {
                  ...formation,
                  positions: formation.positions.map((dancerPosition) => {
                     if (selectedDancers.includes(dancerPosition.id)) {
                        return {
                           ...dancerPosition,
                           itemId: itemId || null,
                        };
                     }
                     return dancerPosition;
                  }),
               };
            }
            return formation;
         })
      );
      // pushChange();
   };

   const dancerInSameSpot = formations
      .find((formation) => formation.id === getFirstSelectedFormation().id)
      ?.positions.find((position: dancerPosition) => {
         return position.position.x === dancerPos.position.x && position.position.y === dancerPos.position.y && dancerPos.id !== position.id;
      });

   const dancerGroup = (getFirstSelectedFormation()?.groups || []).find((group) => group.id === dancerPos?.groupId);

   const dancerColor = dancerPos?.color || dancerGroup?.color || dancer?.color || "#db2777";

   return (
      <>
         <ContextMenu>
            <ContextMenuContent className="">
               <ContextMenuLabel className="py-1" inset>
                  {formatNames(selectedDancers.map((selectedDancer) => dancers.find((dancer) => dancer.id === selectedDancer)?.name))}
               </ContextMenuLabel>
               {/* <ContextMenuSeparator className="bg-neutral-300 h-[1px] my-1" />
               <ContextMenuSub>
                  <ContextMenuSubTrigger className="py-1 hover:bg-neutral-200" inset>
                     Shape
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className="w-48">
                     <ContextMenuItem onClick={() => changeShape("circle")} className="py-1 hover:bg-neutral-200">
                        Circle
                     </ContextMenuItem>
                     <ContextMenuItem onClick={() => changeShape("square")} className="py-1 hover:bg-neutral-200">
                        Square
                     </ContextMenuItem>
                     <ContextMenuItem onClick={() => changeShape("triangle")} className="py-1 hover:bg-neutral-200">
                        Triangle
                     </ContextMenuItem>
                  </ContextMenuSubContent>
               </ContextMenuSub>
               <ContextMenuSub>
                  <ContextMenuSubTrigger className="py-1 hover:bg-neutral-200" inset>
                     Color
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className="w-48 h-48"></ContextMenuSubContent>
               </ContextMenuSub>
               <ContextMenuSeparator className="bg-neutral-300 h-[1px] my-1" /> */}
               {/* <ContextMenuLabel className="py-1" inset>
                  This formation
               </ContextMenuLabel> */}
               <ContextMenuSeparator className="bg-neutral-300 h-[1px] my-1" />
               <ContextMenuSub>
                  <ContextMenuSubTrigger className="py-1 hover:bg-neutral-200" inset>
                     Path
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className="">
                     <ContextMenuItem className="py-1">Linear</ContextMenuItem>
                     <ContextMenuItem className="py-1">Curved</ContextMenuItem>
                     <ContextMenuItem className="py-1">Teleport</ContextMenuItem>
                  </ContextMenuSubContent>
               </ContextMenuSub>
               <ContextMenuSub>
                  <ContextMenuSubTrigger className="py-1 hover:bg-neutral-200" inset>
                     Prop
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className="">
                     {items.map((item: item) => {
                        return (
                           <ContextMenuItem key={item.id} onClick={() => setDancerItem(item.id)} className="w-full  hover:bg-neutral-200">
                              <div className="  py-1  text-xs   flex flex-row items-center">
                                 <div className="w-6 h-6 mr-2">
                                    <img
                                       className="h-full w-full object-contain"
                                       src={imageBlobs[`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${item?.url}`]}
                                       alt=""
                                    />
                                 </div>

                                 <p>{item.name}</p>
                              </div>
                           </ContextMenuItem>
                        );
                     })}
                     <ContextMenuItem onClick={() => setDancerItem(null)} className="w-full  hover:bg-neutral-200">
                        <div className="  py-1  text-xs   flex flex-row items-center">
                           <p>No prop</p>
                        </div>
                     </ContextMenuItem>
                  </ContextMenuSubContent>
               </ContextMenuSub>
               <ContextMenuSub>
                  <ContextMenuSubTrigger className="py-1 hover:bg-neutral-200" inset>
                     Color
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className=" p-4">
                     <div>
                        <HexColorPicker />

                        <div className="picker__swatches bg-neutral-800 overflow-hidden rounded-md">
                           {/* {text ? <p className="text-xs text-neutral-300 py-2">{text}</p> : null}
                           {colors.map((presetColor) => (
                              <button
                                 key={presetColor}
                                 className="picker__swatch"
                                 style={{ background: presetColor }}
                                 onClick={() => setColor(presetColor)}
                              />
                           ))} */}
                        </div>
                     </div>
                  </ContextMenuSubContent>
               </ContextMenuSub>
            </ContextMenuContent>
            <ContextMenuTrigger>
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
                     border: hoveringDancerIds.includes(dancer.id) && !isPlaying ? `${2 / zoom}px solid #db2777` : `${2 / zoom}px solid transparent`,
                  }}
                  ref={container}
                  // onMouseDown={(e) => e.preventDefault()}
                  id={dancer.id}
                  // {...bind()}
                  data-type={"dancer"}
                  className={`   group  rounded-md lg:pointer-events-auto  flex   flex-row justify-center items-center absolute z-[30] mr-auto ml-auto cursor-default `}
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
                           src={imageBlobs[`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${thisItem?.url}`]}
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
                           // className="group-hover:stroke-[30px]"
                           fill={dancerColor}
                           stroke={
                              selectedDancers.includes(dancer.id) && !isPlaying
                                 ? localSettings.isDarkMode
                                    ? "white"
                                    : "#404040"
                                 : hexToRGBA(dancerColor, 0.5)
                           }
                           strokeWidth={15 / zoom}
                           d="M3.5 3.5h133v133H3.5z"
                        />
                     </svg>
                  ) : dancer.shape === "triangle" ? (
                     <svg
                        className={` w-full h-full select-none  pointer-events-none relative  flex  flex-row justify-center items-center  z-[40] mr-auto ml-auto cursor-default `}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 134 116"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 366 317">
                           <path
                              style={{
                                 transition: "fill 0.5s ease",
                              }}
                              // className="group-hover:stroke-[30px] "
                              fill={dancerColor}
                              stroke={
                                 selectedDancers.includes(dancer.id) && !isPlaying
                                    ? localSettings.isDarkMode
                                       ? "white"
                                       : "#404040"
                                    : hexToRGBA(dancerColor, 0.5)
                              }
                              strokeWidth={15 / zoom}
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
                           // className="group-hover:stroke-[30px] "
                           fill={dancerColor}
                           stroke={
                              selectedDancers.includes(dancer.id) && !isPlaying
                                 ? localSettings.isDarkMode
                                    ? "white"
                                    : "#404040"
                                 : hexToRGBA(dancerColor, 0.5)
                           }
                           strokeWidth={15 / zoom}
                        />
                     </svg>
                  )}

                  {dancerStyle !== "initials" ? (
                     <p
                        style={{
                           bottom: thisItem?.side === "bottom" ? null : 0,
                           top: thisItem?.side === "bottom" ? 0 : null,
                           // bottom: 0,
                           opacity: zoom < 0.2 ? 0 : 1,
                           // transform: `scale(${(1 / zoom) * 0.8}) translate(0%, 100%)`,
                           transform: `scale(${(1 / zoom) * 0.7}) translate(0%, ${100 * (thisItem?.side === "bottom" ? -1 : 1) * zoom * (1 / 0.7)}%)`,
                           transformOrigin: `${thisItem?.side === "bottom" ? "bottom" : "top"} center`,
                        }}
                        className="absolute  text-center select-none pointer-events-none dark:text-white  whitespace-nowrap  rounded-full px-1"
                     >
                        {dancerInSameSpot ? (
                           <>
                              {dancers.findIndex((item) => item.id === dancerPos.id) >
                              dancers.findIndex((item) => item.id === dancerInSameSpot.id) ? (
                                 <>
                                    {`${dancers.find((dancer) => dancerInSameSpot.id === dancer.id)?.name.split(" ")[0]} &
                                       ${dancer.name.split(" ")[0]}`}
                                 </>
                              ) : null}
                           </>
                        ) : (
                           <>{dancer.name.split(" ")[0]}</>
                        )}
                     </p>
                  ) : null}
                  <div className="select-none w-full h-full font-semibold cursor-default text-center absolute top-0 left-0 grid place-items-center  pointer-events-none text-white z-50 ">
                     <p className="text-2xl ">
                        {dancerStyle === "numbered" ? (
                           index + 1
                        ) : dancerStyle === "initials" || dancerStyle === "initialsAndName" ? (
                           initials(dancer.name)
                        ) : (
                           <></>
                        )}
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
            </ContextMenuTrigger>
         </ContextMenu>
      </>
   );
};

function hexToRGBA(hex: string, alpha: number) {
   const r = parseInt(hex.slice(1, 3), 16);
   const g = parseInt(hex.slice(3, 5), 16);
   const b = parseInt(hex.slice(5, 7), 16);

   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function toHumanReadableList(names: string[]): string {
   // Extract first names from the list
   const firstNames = names.map((name) => name?.split(" ")[0]);

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

function formatNames(names: string[]): string {
   if (names.length === 0) return "";

   if (names.length === 1) return names[0];

   if (names.length === 2) return `${names[0]} & ${names[1]}`;

   if (names.length === 3) return `${names[0]}, ${names[1]} & ${names[2]}`;

   return `${names[0]}, ${names[1]}, ${names[2]} & ${names.length - 3} others`;
}
