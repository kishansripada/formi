import { dancer, dancerPosition, formation } from "../../types/types";

export const PathEditor: React.FC<{
   selectedFormation: number | null;
   formations: formation[];
   selectedDancers: string[];
   previousFormationView: "none" | "ghostDancers" | "ghostDancersAndPaths";
   isPlaying: boolean;
   currentFormationIndex: number | null;
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
}> = ({ selectedFormation, formations, selectedDancers, previousFormationView, isPlaying, currentFormationIndex, coordsToPosition }) => {
   if (isPlaying || selectedFormation === null) return;
   return (
      <>
         <svg className="absolute pointer-events-none w-full h-full z-10" xmlns="http://www.w3.org/2000/svg">
            {formations?.[selectedFormation - 1]?.positions.map((dancerPosition) => {
               let startCoords = coordsToPosition(dancerPosition.position);
               let endCoords = coordsToPosition(
                  formations?.[selectedFormation]?.positions?.find((dancerPosition2) => dancerPosition2.id === dancerPosition.id)?.position
               );
               if (!endCoords) return <></>;

               let midpoint = {
                  left: (startCoords.left + endCoords.left) / 2,
                  top: (startCoords.top + endCoords.top) / 2,
               };

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

               let rightTail = findPoint(midpoint, lineAngle(startCoords, endCoords) + 140, 20);
               let leftTail = findPoint(midpoint, lineAngle(startCoords, endCoords) - 140, 20);

               if (dancerPosition.transitionType === "linear" || !dancerPosition.transitionType) {
                  // either previousFormationView is true or the dancer is selected to show their linear path
                  if (selectedDancers.includes(dancerPosition.id) || previousFormationView === "ghostDancersAndPaths") {
                     return (
                        <>
                           <path
                              d={`M ${startCoords.left} ${startCoords.top} L ${endCoords.left} ${endCoords.top}`}
                              stroke="red"
                              fill="transparent"
                              strokeWidth={selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? 2 : 1}
                           />
                           <path
                              d={`M ${midpoint.left} ${midpoint.top} L ${rightTail.left} ${rightTail.top}`}
                              stroke="red"
                              fill="transparent"
                              strokeWidth={selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? 2 : 1}
                           />
                           <path
                              d={`M ${midpoint.left} ${midpoint.top} L ${leftTail.left} ${leftTail.top}`}
                              stroke="red"
                              fill="transparent"
                              strokeWidth={selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? 2 : 1}
                           />
                        </>
                     );
                  }
               }

               if (dancerPosition.transitionType === "cubic") {
                  let { controlPointStart, controlPointEnd } = dancerPosition;
                  if (controlPointStart === undefined || controlPointEnd === undefined) return;
                  let controlPointStartCoords = coordsToPosition(controlPointStart);
                  let controlPointEndCoords = coordsToPosition(controlPointEnd);
                  let startCoords = coordsToPosition(dancerPosition.position);
                  let endCoords = coordsToPosition(
                     formations?.[selectedFormation]?.positions?.find((dancerPosition2) => dancerPosition2.id === dancerPosition.id)?.position
                  );

                  // function cubicBezierMidpoint(
                  //    start: { top: number; left: number },
                  //    end: { top: number; left: number },
                  //    control1: { top: number; left: number },
                  //    control2: { top: number; left: number }
                  // ): { top: number; left: number } {
                  //    const mid1 = [(start.left + control1.left) / 2, (start.top + control1.top) / 2];
                  //    const mid2 = [(control1.left + control2.left) / 2, (control1.top + control2.top) / 2];
                  //    const mid3 = [(control2.left + end.left) / 2, (control2.top + end.top) / 2];
                  //    const mid4 = [(mid1[0] + mid2[0]) / 2, (mid1[1] + mid2[1]) / 2];
                  //    const mid5 = [(mid2[0] + mid3[0]) / 2, (mid2[1] + mid3[1]) / 2];
                  //    return { left: (mid4[0] + mid5[0]) / 2, top: (mid4[1] + mid5[1]) / 2 };
                  // }
                  // let midpoint = cubicBezierMidpoint(startCoords, endCoords, controlPointStartCoords, controlPointEndCoords);

                  // let rightTail = findPoint(
                  //    midpoint,
                  //    cubicBezierMidpointTangentSlope(startCoords, endCoords, controlPointStartCoords, controlPointEndCoords) + 45,
                  //    20
                  // );

                  // let leftTail = findPoint(
                  //    midpoint,
                  //    cubicBezierMidpointTangentSlope(startCoords, endCoords, controlPointStartCoords, controlPointEndCoords) + 135,
                  //    20
                  // );
                  // console.log(cubicBezierMidpointTangentSlope(startCoords, endCoords, controlPointStartCoords, controlPointEndCoords));
                  if (!endCoords) return <></>;
                  if (selectedDancers.includes(dancerPosition.id) || previousFormationView === "ghostDancersAndPaths") {
                     return (
                        <>
                           <path
                              d={`M ${startCoords.left} ${startCoords.top} C ${controlPointStartCoords.left} ${controlPointStartCoords.top},  ${controlPointEndCoords.left} ${controlPointEndCoords.top}, ${endCoords.left} ${endCoords.top}`}
                              stroke="red"
                              fill="transparent"
                              strokeWidth={selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? 2 : 1}
                           />

                           {selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? (
                              <>
                                 {/* <path
                                    d={`M ${midpoint.left} ${midpoint.top} L ${rightTail.left} ${rightTail.top}`}
                                    stroke="black"
                                    fill="transparent"
                                    strokeWidth={selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? 2 : 1}
                                 />
                                 <path
                                    d={`M ${midpoint.left} ${midpoint.top} L ${leftTail.left} ${leftTail.top}`}
                                    stroke="black"
                                    fill="transparent"
                                    strokeWidth={selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? 2 : 1}
                                 /> */}
                                 <path
                                    d={`M ${startCoords.left} ${startCoords.top} L ${controlPointStartCoords.left} ${controlPointStartCoords.top}`}
                                    stroke="black"
                                    fill="transparent"
                                    className="z-[60]"
                                 />
                                 <path
                                    d={`M ${endCoords.left} ${endCoords.top} L ${controlPointEndCoords.left} ${controlPointEndCoords.top}`}
                                    stroke="black"
                                    fill="transparent"
                                    className="z-[60]"
                                 />
                                 <circle
                                    id={dancerPosition.id}
                                    data-type={"controlPointStart"}
                                    cx={controlPointStartCoords.left}
                                    cy={controlPointStartCoords.top}
                                    r="7"
                                    className="hover:fill-blue-500 pointer-events-auto z-[60]"
                                 />
                                 <circle
                                    id={dancerPosition.id}
                                    data-type={"controlPointEnd"}
                                    cx={controlPointEndCoords.left}
                                    cy={controlPointEndCoords.top}
                                    r="7"
                                    className="hover:fill-blue-500 pointer-events-auto z-[60]"
                                 />
                              </>
                           ) : null}
                        </>
                     );
                  }
               }
            })}
         </svg>
      </>
   );
};
function cubicBezierMidpointTangentSlope(
   start: { top: number; left: number },
   end: { top: number; left: number },
   control1: { top: number; left: number },
   control2: { top: number; left: number }
): number {
   let first = (start.top - control1.top) / (start.left - control1.left);
   let second = (end.top - control2.top) / (end.left - control2.left);
   return (Math.atan((first + second) / 2) * 180) / Math.PI;
}
