import { useState, useEffect, useRef, PointerEvent, PointerEventHandler } from "react";

import { dancer, dancerPosition, formation, coordsToPosition } from "../../types/types";

export const PathEditor: React.FC<{
   setDancers: Function;
   dancers: dancer[];
   setFormations: Function;
   selectedFormation: number | null;
   formations: formation[];
   selectedDancers: string[];
   setSelectedDancers: Function;
   setSelectedFormation: Function;
   viewAllPaths: boolean;
   isPlaying: boolean;
   currentFormationIndex: number | null;
}> = ({
   setDancers,
   dancers,
   setFormations,
   selectedFormation,
   formations,
   setSelectedDancers,
   selectedDancers,
   setSelectedFormation,
   viewAllPaths,
   isPlaying,
   currentFormationIndex,
}) => {
   return (
      <>
         <svg className="absolute pointer-events-none w-full h-full z-10" xmlns="http://www.w3.org/2000/svg">
            {formations?.[isPlaying ? currentFormationIndex : selectedFormation]?.positions.map((dancerPosition) => {
               let end = formations?.[(isPlaying ? currentFormationIndex : selectedFormation) + 1]?.positions?.find(
                  (dancerPosition2) => dancerPosition2.id === dancerPosition.id
               )?.position;
               if (!end) return <></>;

               if (dancerPosition.transitionType === "linear") {
                  // either viewAllPaths is true or the dancer is selected to show their linear path
                  if (selectedDancers.includes(dancerPosition.id) || viewAllPaths) {
                     return (
                        <path
                           d={`M ${coordsToPosition(dancerPosition.position.x, dancerPosition.position.y).left} ${
                              coordsToPosition(dancerPosition.position.x, dancerPosition.position.y).top
                           } L ${coordsToPosition(end.x, end.y).left} ${coordsToPosition(end.x, end.y).top}`}
                           stroke="red"
                           fill="transparent"
                           strokeWidth={selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? 2 : 1}
                        />
                     );
                  }
               }

               if (dancerPosition.transitionType === "cubic") {
                  let controlPointStart = dancerPosition.controlPointStart;
                  let controlPointEnd = dancerPosition.controlPointEnd;
                  let startCoords = dancerPosition.position;
                  let endCoords = formations?.[(isPlaying ? currentFormationIndex : selectedFormation) + 1]?.positions?.find(
                     (dancerPosition2) => dancerPosition2.id === dancerPosition.id
                  )?.position;
                  if (!endCoords) return <></>;
                  if (selectedDancers.includes(dancerPosition.id) || viewAllPaths) {
                     return (
                        <>
                           <path
                              d={`M ${coordsToPosition(startCoords.x, startCoords.y).left} ${coordsToPosition(startCoords.x, startCoords.y).top} C ${
                                 coordsToPosition(controlPointStart.x, controlPointStart.y).left
                              } ${coordsToPosition(controlPointStart.x, controlPointStart.y).top},  ${
                                 coordsToPosition(controlPointEnd.x, controlPointEnd.y).left
                              } ${coordsToPosition(controlPointEnd.x, controlPointEnd.y).top}, ${coordsToPosition(endCoords.x, endCoords.y).left} ${
                                 coordsToPosition(endCoords.x, endCoords.y).top
                              }`}
                              stroke="red"
                              fill="transparent"
                              strokeWidth={selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? 2 : 1}
                           />
                           {selectedDancers[0] === dancerPosition.id && selectedDancers.length === 1 ? (
                              <>
                                 <path
                                    d={`M ${coordsToPosition(startCoords.x, startCoords.y).left} ${
                                       coordsToPosition(startCoords.x, startCoords.y).top
                                    } L ${coordsToPosition(controlPointStart.x, controlPointStart.y).left} ${
                                       coordsToPosition(controlPointStart.x, controlPointStart.y).top
                                    }`}
                                    stroke="black"
                                    fill="transparent"
                                    className="z-[60]"
                                 />
                                 <path
                                    d={`M ${coordsToPosition(endCoords.x, endCoords.y).left} ${coordsToPosition(endCoords.x, endCoords.y).top} L ${
                                       coordsToPosition(controlPointEnd.x, controlPointEnd.y).left
                                    } ${coordsToPosition(controlPointEnd.x, controlPointEnd.y).top}`}
                                    stroke="black"
                                    fill="transparent"
                                    className="z-[60]"
                                 />
                                 <circle
                                    id={dancerPosition.id}
                                    data-type={"controlPointStart"}
                                    cx={coordsToPosition(controlPointStart.x, controlPointStart.y).left}
                                    cy={coordsToPosition(controlPointStart.x, controlPointStart.y).top}
                                    r="5"
                                    className="hover:fill-blue-500 pointer-events-auto z-[60]"
                                 />
                                 <circle
                                    id={dancerPosition.id}
                                    data-type={"controlPointEnd"}
                                    cx={coordsToPosition(controlPointEnd.x, controlPointEnd.y).left}
                                    cy={coordsToPosition(controlPointEnd.x, controlPointEnd.y).top}
                                    r="5"
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
