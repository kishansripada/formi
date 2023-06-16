import { dancer, dancerPosition, formation } from "../../types/types";

export const PathEditor: React.FC<{
   selectedFormation: number | null;
   formations: formation[];
   selectedDancers: string[];
   isPlaying: boolean;
   currentFormationIndex: number | null;
   dancers: dancer[];
   localSettings: any;
   collisions: any;
   coordsToPosition: (coords: { x: number; y: number } | null | undefined) => { left: number; top: number } | null;
   zoom: number;
}> = ({
   selectedFormation,
   formations,
   selectedDancers,
   isPlaying,
   currentFormationIndex,
   coordsToPosition,
   dancers,
   localSettings,
   collisions,
   zoom,
}) => {
   if (isPlaying || selectedFormation === null) return;
   let { previousFormationView } = localSettings;
   // let dancersToRender = previousFormationView === "ghostDancersAndPaths" ? formations?.[selectedFormation - 1]?.positions
   return (
      <>
         <svg className="absolute pointer-events-none w-full h-full z-40 overflow-visible" xmlns="http://www.w3.org/2000/svg">
            {formations?.[selectedFormation]?.positions
               .filter((position) => {
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
                     formations?.[selectedFormation - 1]?.positions?.find((dancerPosition2) => dancerPosition2.id === dancerPosition.id)?.position
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
                              stroke-dasharray={"10, 10"}
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
                              stroke-dasharray={"10, 10"}
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
function cubicBezierSlope(
   p0: { left: number; top: number },
   p1: { left: number; top: number },
   p2: { left: number; top: number },
   p3: { left: number; top: number },
   t: number
): number {
   // Calculate the derivative of the curve at the point
   const dx = 3 * (1 - t) ** 2 * (p1.left - p0.left) + 6 * (1 - t) * t * (p2.left - p1.left) + 3 * t ** 2 * (p3.left - p2.left);
   const dy = 3 * (1 - t) ** 2 * (p1.top - p0.top) + 6 * (1 - t) * t * (p2.top - p1.top) + 3 * t ** 2 * (p3.top - p2.top);

   // Calculate the slope of the point on the curve
   return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function cubicBezierMidpoint(
   start: { top: number; left: number },
   end: { top: number; left: number },
   control1: { top: number; left: number },
   control2: { top: number; left: number }
): { top: number; left: number } {
   const mid1 = [(start.left + control1.left) / 2, (start.top + control1.top) / 2];
   const mid2 = [(control1.left + control2.left) / 2, (control1.top + control2.top) / 2];
   const mid3 = [(control2.left + end.left) / 2, (control2.top + end.top) / 2];
   const mid4 = [(mid1[0] + mid2[0]) / 2, (mid1[1] + mid2[1]) / 2];
   const mid5 = [(mid2[0] + mid3[0]) / 2, (mid2[1] + mid3[1]) / 2];
   return { left: (mid4[0] + mid5[0]) / 2, top: (mid4[1] + mid5[1]) / 2 };
}

function lineAngle(point1: { left: number; top: number }, point2: { left: number; top: number }): number {
   const dx = point2.left - point1.left;
   const dy = point2.top - point1.top;
   return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function findPoint(startingPoint: { left: number; top: number }, angle: number, distance: number): { left: number; top: number } {
   const theta = (Math.PI / 180) * angle;
   const dx = Math.cos(theta) * distance;
   const dy = Math.sin(theta) * distance;
   return { left: startingPoint.left + dx, top: startingPoint.top + dy };
}
