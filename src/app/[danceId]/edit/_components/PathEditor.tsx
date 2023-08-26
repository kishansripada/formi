import { dancer, dancerPosition, formation, localSettings } from "../../../../types/types";
import { useStore } from "../store";

export const PathEditor: React.FC<{
   // selectedFormation: number | null;
   // formations: formation[];
   selectedDancers: string[];
   isPlaying: boolean;
   currentFormationIndex: number | null;
   dancers: dancer[];
   localSettings: localSettings;
   collisions: any;
   coordsToPosition: (coords: { x: number; y: number } | null | undefined) => { left: number; top: number } | null;
   zoom: number;
}> = ({
   // selectedFormation,
   // formations,
   selectedDancers,
   isPlaying,
   currentFormationIndex,
   coordsToPosition,
   dancers,
   localSettings,
   collisions,
   zoom,
}) => {
   let { formations, getFirstSelectedFormation, getPreviousFormation, selectedFormations } = useStore();
   if (isPlaying || selectedFormations.length !== 1) return;
   let { previousFormationView, stageFlipped } = localSettings;
   // let dancersToRender = previousFormationView === "ghostDancersAndPaths" ? formations?.[selectedFormation - 1]?.positions
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

   return (
      <>
         <svg className="absolute pointer-events-none w-full h-full z-40 overflow-visible" xmlns="http://www.w3.org/2000/svg">
            {getFirstSelectedFormation()
               ?.positions.filter((position) => {
                  if (previousFormationView === "ghostDancersAndPaths") {
                     return true;
                  } else {
                     return (
                        selectedDancers.includes(position.id) ||
                        collisions
                           ?.map((collision) => collision.dancers)
                           .flat(Infinity)
                           .includes(position.id)
                     );
                  }
               })
               .map((dancerPosition) => {
                  let dancer = dancers.find((dancer) => dancer.id === dancerPosition.id);
                  // global start and end coords
                  let endCoords = coordsToPosition(dancerPosition.position);
                  let startCoords = coordsToPosition(
                     getPreviousFormation()?.positions?.find((dancerPosition2) => dancerPosition2.id === dancerPosition.id)?.position
                  );
                  if (!endCoords || !startCoords) return;

                  if (dancerPosition.transitionType === "linear" || !dancerPosition.transitionType || dancerPosition.transitionType === "teleport") {
                     return (
                        <>
                           <path
                              key={dancerPosition.id + "path"}
                              d={`M ${startCoords.left} ${startCoords.top} L ${endCoords.left} ${endCoords.top}`}
                              // className=" stroke-red-700 "
                              fill="transparent"
                              stroke-linecap="round"
                              strokeDasharray={"10, 10"}
                              stroke={dancer?.color || "#db2777"}
                              strokeWidth={selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? 3 : 0.5}
                           >
                              {selectedDancers.includes(dancerPosition.id) && (
                                 <animate attributeName="stroke-dashoffset" to="0" from="20" dur="1s" repeatCount="indefinite" />
                              )}
                           </path>
                        </>
                     );
                  }

                  if (dancerPosition.transitionType === "cubic") {
                     let { controlPointStart, controlPointEnd } = dancerPosition;
                     if (!controlPointStart || !controlPointEnd) return;
                     let controlPointStartCoords = coordsToPosition(controlPointStart);
                     let controlPointEndCoords = coordsToPosition(controlPointEnd);

                     if (!controlPointStartCoords || !controlPointEndCoords) return;

                     return (
                        <>
                           <path
                              key={dancerPosition.id + "path"}
                              d={`M ${startCoords.left} ${startCoords.top} C ${controlPointStartCoords.left} ${controlPointStartCoords.top},  ${controlPointEndCoords.left} ${controlPointEndCoords.top}, ${endCoords.left} ${endCoords.top}`}
                              stroke={dancer?.color || "#db2777"}
                              fill="transparent"
                              stroke-linecap="round"
                              strokeDasharray={"10, 10"}
                              strokeWidth={selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? 2 : 1}
                           >
                              {selectedDancers.includes(dancerPosition.id) && (
                                 <animate attributeName="stroke-dashoffset" to="0" from="20" dur="1s" repeatCount="indefinite" />
                              )}
                           </path>

                           {selectedDancers[0] === dancerPosition.id ? (
                              <>
                                 <path
                                    key={dancerPosition.id + "startControlPoint"}
                                    d={`M ${startCoords.left} ${startCoords.top} L ${controlPointStartCoords.left} ${controlPointStartCoords.top}`}
                                    fill="transparent"
                                    className="z-[60] stroke-black dark:stroke-neutral-100"
                                 />
                                 <path
                                    key={dancerPosition.id + "endControlPoint"}
                                    d={`M ${endCoords.left} ${endCoords.top} L ${controlPointEndCoords.left} ${controlPointEndCoords.top}`}
                                    fill="transparent"
                                    className="z-[60] stroke-black dark:stroke-neutral-100"
                                 />

                                 <svg key={dancerPosition.id + "controlPointStart"} className="rotate-90 z-[40] relative overflow-visible ">
                                    <rect
                                       style={{
                                          // translate x and y by half the width
                                          transform: `translate(${-16 / zoom / 2}px, ${-16 / zoom / 2}px)`,
                                       }}
                                       id={dancerPosition.id}
                                       data-type={"controlPointStart"}
                                       x={controlPointStartCoords.left}
                                       y={controlPointStartCoords.top}
                                       width={16 / zoom}
                                       height={16 / zoom}
                                       className="pointer-events-auto z-[60] fill-pink-700  "
                                    />
                                    <rect
                                       style={{
                                          // translate x and y by half the width
                                          transform: `translate(${-10 / zoom / 2}px, ${-10 / zoom / 2}px)`,
                                       }}
                                       id={dancerPosition.id}
                                       data-type={"controlPointStart"}
                                       x={controlPointStartCoords.left}
                                       y={controlPointStartCoords.top}
                                       width={10 / zoom}
                                       height={10 / zoom}
                                       className="pointer-events-auto z-[60] fill-white dark:fill-neutral-700  "
                                    />
                                 </svg>
                                 <svg key={dancerPosition.id + "controlPointEnd"} className="rotate-90 z-[40] relative overflow-visible ">
                                    <rect
                                       style={{
                                          // translate x and y by half the width
                                          transform: `translate(${-16 / zoom / 2}px, ${-16 / zoom / 2}px)`,
                                       }}
                                       id={dancerPosition.id}
                                       data-type={"controlPointEnd"}
                                       x={controlPointEndCoords.left}
                                       y={controlPointEndCoords.top}
                                       width={16 / zoom}
                                       height={16 / zoom}
                                       className="pointer-events-auto z-[60] fill-pink-700  "
                                    />
                                    <rect
                                       style={{
                                          // translate x and y by half the width
                                          transform: `translate(${-10 / zoom / 2}px, ${-10 / zoom / 2}px)`,
                                       }}
                                       id={dancerPosition.id}
                                       data-type={"controlPointEnd"}
                                       x={controlPointEndCoords.left}
                                       y={controlPointEndCoords.top}
                                       width={10 / zoom}
                                       height={10 / zoom}
                                       className="pointer-events-auto z-[60] fill-white dark:fill-neutral-700  "
                                    />
                                 </svg>
                              </>
                           ) : null}
                        </>
                     );
                  }
               })}
         </svg>
      </>
   );
};
