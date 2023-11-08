import {
   cloudSettings,
   dancer,
   dancerPosition,
   formation,
   stageDimensions,
   PIXELS_PER_SQUARE,
   localSettings,
   prop,
   propPosition,
} from "../../../../types/types";
import { useStore } from "../store";

export const Prop: React.FC<{
   prop: prop;
   currentFormationIndex: number | null;
   percentThroughTransition: number;
   isPlaying: boolean;
   position: number | null;

   selectedDancers: string[];
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
   draggingDancerId: string | null;
   cloudSettings: cloudSettings;

   zoom: number;
   setZoom: Function;
   localSettings: localSettings;
   index: number;
   collisions: any;

   selectedPropIds: string[];
   setResizingPropId: Function;
   dropDownToggle: boolean;

   pushChange: Function;
}> = ({ prop, currentFormationIndex, percentThroughTransition, isPlaying, position, coordsToPosition, zoom, localSettings, selectedPropIds }) => {
   let { formations, selectedFormations, getFirstSelectedFormation } = useStore();
   const { stageFlipped } = localSettings;

   if (!selectedFormations.length) return <></>;

   let myPosition;
   // if the track is playing then  return with the animation function
   let propPosition =
      prop.type === "static"
         ? prop.static
         : (getFirstSelectedFormation()?.props || [])?.find((propPosition: propPosition) => propPosition.id === prop.id);

   if (!propPosition) return <></>;
   if (stageFlipped) {
      propPosition = { ...propPosition, position: { x: -propPosition?.position.x, y: -propPosition?.position.y } };
   }

   if (prop.type === "static") {
      myPosition = propPosition.position;
   } else if (isPlaying && position !== null) {
      myPosition = animate(formations, prop.id, currentFormationIndex, percentThroughTransition);
      if (!myPosition) return null;
      myPosition = { x: (stageFlipped ? -1 : 1) * myPosition.x, y: (stageFlipped ? -1 : 1) * myPosition.y };
   } else {
      if (!propPosition) return <></>;
      myPosition = { x: propPosition?.position.x, y: propPosition?.position.y };
   }
   // if there is no formation selected and the track is not playing, then just return nothing

   // if the dancer does not have any coordinates right now, return nothing since it shouln't be displayed
   if (!myPosition) return <></>;

   let { left, top } = coordsToPosition(myPosition);

   // const session = useSession();

   return (
      <>
         <div
            style={{
               left,
               top,
               width: PIXELS_PER_SQUARE * (prop?.static?.width || 5),
               //    height: PIXELS_PER_SQUARE * prop.width,
               borderWidth: selectedPropIds.includes(prop.id) && !isPlaying ? 4 / zoom : 0,
               transition: isPlaying ? "width 0.2s ease-in-out" : "",
               // opacity: isPlaying ? 1 : 0.5,
            }}
            data-type="prop"
            id={prop.id}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute z-20  -translate-x-1/2 -translate-y-1/2 box-content  h-auto   border-pink-600 "
         >
            {selectedPropIds.includes(prop.id) && !isPlaying && (
               <>
                  <div
                     style={{
                        width: 12 / zoom,
                        height: 12 / zoom,
                     }}
                     id={prop.id}
                     data-type="prop-resize-top-left"
                     className=" bg-black dark:bg-white rounded-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 border border-neutral-400"
                  ></div>
                  <div
                     style={{
                        width: 12 / zoom,
                        height: 12 / zoom,
                     }}
                     id={prop.id}
                     data-type="prop-resize-top-right"
                     className=" bg-black dark:bg-white rounded-full absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 border border-neutral-400"
                  ></div>
                  <div
                     style={{
                        width: 12 / zoom,
                        height: 12 / zoom,
                     }}
                     id={prop.id}
                     data-type="prop-resize-bottom-left"
                     className=" bg-black dark:bg-white rounded-full absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 border border-neutral-400"
                  ></div>
                  <div
                     style={{
                        width: 12 / zoom,
                        height: 12 / zoom,
                     }}
                     id={prop.id}
                     data-type="prop-resize-bottom-right"
                     className=" bg-black dark:bg-white rounded-full absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 border border-neutral-400"
                  ></div>
               </>
            )}
            <img
               className=" pointer-events-none select-none w-full h-auto "
               src={`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${prop.user_id}/${prop?.url}`}
               alt=""
            />
            {/* {isDropdownOpen && (
               <div
                  id="dropdown-menu"
                  style={{
                     transform: `scale(${1 / zoom})`,
                  }}
                  className="absolute  z-10 border border-neutral-700  top-1/2 mt-2 w-[200px] py-1 bg-neutral-800  shadow-lg  ring-1 ring-black ring-opacity-5"
               >
                  {prop.type !== "static" && (
                     <div
                        onClick={() => {
                           setFormations(
                              formations.map((formation, i) => {
                                 if (i === selectedFormation) {
                                    return {
                                       ...formation,
                                       props: (formation.props || []).filter((propx) => propx.id !== prop.id),
                                    };
                                 }
                                 return formation;
                              })
                           );
                           pushChange();
                        }}
                        className=" px-4 py-1  text-xs text-white hover:bg-pink-600   flex flex-row items-center"
                     >
                        Delete from formation
                     </div>
                  )}
                  <div
                     onClick={() => {
                        if (prop?.type === "dynamic" || !prop.type) {
                           // add this prop to every single formation in the position it is in this formation, defined in propPosition, replace existing prop positions where the id of that prop is the same as the prop we are moving
                           setProps(
                              props.map((propx: prop) => {
                                 if (propx.id === prop.id) {
                                    return {
                                       ...propx,
                                       static: {
                                          position: propPosition.position,
                                          width: propPosition.width,
                                       },
                                    };
                                 }
                                 return propx;
                              })
                           );
                        }
                        setProps(
                           props.map((propx: prop) => {
                              if (propx.id === prop.id) {
                                 return {
                                    ...propx,
                                    type: propx.type === "static" ? "dynamic" : "static",
                                 };
                              }
                              return propx;
                           })
                        );
                     }}
                     className=" px-4 py-1  text-xs text-white hover:bg-pink-600   flex flex-row items-center"
                  >
                     {props.find((propx: prop) => propx.id === prop.id).type === "static" ? "Make dynamic" : "Make static"}
                  </div>
               </div>
            )} */}
         </div>
      </>
   );
};

const animate = (
   formations: formation[],
   id: string,
   currentFormationIndex: number | null,
   percentThroughTransition: number | undefined
): { x: number; y: number } | null => {
   // if the position is beyond all the formation, return off stage
   if (currentFormationIndex === null) return null;
   let inPreviousFormation = formations[currentFormationIndex - 1]
      ? (formations[currentFormationIndex - 1]?.props || []).find((prop) => prop.id === id)
      : false;

   const inThisFormation = (formations?.[currentFormationIndex]?.props || []).find((prop) => prop.id === id);

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
