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
               if (dancerPosition.transitionType === "linear" || !dancerPosition.transitionType) {
                  // either previousFormationView is true or the dancer is selected to show their linear path
                  if (selectedDancers.includes(dancerPosition.id) || previousFormationView === "ghostDancersAndPaths") {
                     return (
                        <>
                           <path
                              key={dancerPosition.id}
                              d={`M ${startCoords.left} ${startCoords.top} L ${endCoords.left} ${endCoords.top}`}
                              stroke="red"
                              fill="transparent"
                              strokeWidth={selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? 2 : 1}
                           />
                           {/* <path
                              key={dancerPosition.id}
                              d={`M ${midpoint.left} ${midpoint.top} L ${midpoint.left + 100} ${midpoint.top + 100}`}
                              stroke="red"
                              fill="transparent"
                              strokeWidth={selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? 2 : 1}
                           /> */}
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
