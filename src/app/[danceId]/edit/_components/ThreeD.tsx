import {
   dancer,
   dancerPosition,
   formation,
   dragBoxCoords,
   PIXELS_PER_SQUARE,
   comment,
   cloudSettings,
   localSettings,
   initials,
   prop,
   item,
} from "../../../../types/types";
import dynamic from "next/dynamic";
import { useState, useRef, useMemo, useLayoutEffect, useEffect } from "react";
import { SpotLight, useDepthBuffer, SpotLightShadow } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Plane } from "three";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, Text } from "@react-three/drei";

import { ThreeDancer } from "./ThreeDComponents/ThreeDancer";
import { ThreeSetPiece } from "./ThreeDComponents/ThreeSetPiece";
import { ThreeGrid } from "./ThreeDComponents/ThreeGrid";
// import { ThreeComment } from "./ThreeDComponents/ThreeComment";

const CheerLines = dynamic(() => import("./ThreeDComponents/CheerLines").then((mod) => mod.CheerLines));
const Path = dynamic(() => import("./ThreeDComponents/Path").then((mod) => mod.Path));
const StageBackground = dynamic(() => import("./ThreeDComponents/StageBackground").then((mod) => mod.StageBackground));

export const ThreeD: React.FC<{
   children: React.ReactNode;
   setFormations: Function;
   selectedFormation: number | null;
   formations: formation[];
   selectedDancers: string[];
   setSelectedDancers: Function;
   setSelectedFormation: Function;
   setIsPlaying: Function;
   viewOnly: boolean;
   setPixelsPerSecond: Function;
   songDuration: number | null;
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
   draggingDancerId: string | null;
   setDraggingDancerId: Function;
   player: any;
   undo: Function;
   addToStack: Function;
   pushChange: Function;
   localSettings: localSettings;
   isCommenting: boolean;
   setIsCommenting: Function;
   zoom: number;
   setZoom: Function;
   soundCloudTrackId: string | null;
   cloudSettings: cloudSettings;
   stageFlipped: boolean;
   shiftHeld: boolean;
   setShiftHeld: Function;
   setIsThreeDancerDragging: Function;
   isThreeDancerDragging: boolean;
   isPlaying: boolean;
   currentFormationIndex: number;
   percentThroughTransition: number;
   dancers: dancer[];
   position: number;
   props: prop[];
   items: item[];
   isIntro: boolean;
   // comments: comment[];
}> = ({
   player,
   children,
   setFormations,
   selectedFormation,
   formations,
   setSelectedDancers,
   selectedDancers,
   setSelectedFormation,
   setIsPlaying,
   viewOnly,
   setPixelsPerSecond,
   songDuration,
   cloudSettings,
   coordsToPosition,
   draggingDancerId,
   setDraggingDancerId,
   undo,
   addToStack,
   pushChange,
   localSettings,
   isCommenting,
   setIsCommenting,
   zoom,
   setZoom,
   soundCloudTrackId,
   stageFlipped,
   shiftHeld,
   setShiftHeld,
   setIsThreeDancerDragging,
   isThreeDancerDragging,
   isPlaying,
   currentFormationIndex,
   percentThroughTransition,
   dancers,
   position,
   props,
   items,
   isIntro,
   // comments,
}) => {
   const { gridSnap } = localSettings;
   const { stageBackground, stageDimensions, gridSubdivisions, horizontalGridSubdivisions, verticalFineDivisions, horizontalFineDivisions } =
      cloudSettings;
   let planeIntersectPoint = new Vector3();
   const floorPlane = new Plane(new Vector3(0, 1, 0), 0);
   // const depthBuffer = useDepthBuffer({ frames: 1 });
   const squareWidthFeet = cloudSettings.stageDimensions.width / cloudSettings.gridSubdivisions / cloudSettings.verticalFineDivisions;
   const squareHeightFeet = cloudSettings.stageDimensions.height / cloudSettings.horizontalGridSubdivisions / cloudSettings.horizontalFineDivisions;

   return (
      <Canvas
         onPointerUp={() => {
            if (viewOnly) return;
            setIsThreeDancerDragging(false);

            // setFormations((formations: formation[]) => {
            //    return formations.map((formation) => {
            //       return {
            //          ...formation,
            //          positions: formation.positions.map((position) => {
            //             return {
            //                ...position,
            //                position: {
            //                   x: Math.round(position.position.x * gridSnap) / gridSnap,
            //                   y: Math.round(position.position.y * gridSnap) / gridSnap,
            //                },
            //             };
            //          }),
            //       };
            //    });
            // });
            setFormations((formations: formation[]) => {
               return formations.map((formation) => {
                  let gridSizeX = 1;
                  let gridSizeY = 1;
                  let verticalOffset = 0;
                  let horizontalOffset = 0;
                  if (stageBackground === "gridfluid" || stageBackground === "cheer9") {
                     // Determine the total number of divisions along each axis.
                     const totalVerticalDivisions = gridSubdivisions * verticalFineDivisions;
                     const totalHorizontalDivisions = horizontalGridSubdivisions * horizontalFineDivisions;

                     // Calculate the width and height of each grid cell.
                     gridSizeX = stageDimensions.width / totalVerticalDivisions / gridSnap;
                     gridSizeY = stageDimensions.height / totalHorizontalDivisions / gridSnap;
                     let isOddVerticalDivisions = (gridSubdivisions * verticalFineDivisions) % 2 !== 0;
                     let isOddHorizontalDivisions = (horizontalGridSubdivisions * horizontalFineDivisions) % 2 !== 0;

                     verticalOffset = isOddVerticalDivisions ? gridSizeX / 2 : 0;
                     horizontalOffset = isOddHorizontalDivisions ? gridSizeY / 2 : 0;
                     if (gridSnap % 2 === 0) {
                        verticalOffset = 0;
                        horizontalOffset = 0;
                     }
                  } else {
                     gridSizeX = 1 / gridSnap;
                     gridSizeY = 1 / gridSnap;
                  }

                  // Use the grid cell dimensions to round the dancer positions to the nearest grid position.
                  return {
                     ...formation,
                     positions: formation.positions.map((position) => {
                        return {
                           ...position,
                           position: {
                              x: roundToHundredth(Math.round((position.position.x - verticalOffset) / gridSizeX) * gridSizeX + verticalOffset),
                              y: roundToHundredth(Math.round((position.position.y - horizontalOffset) / gridSizeY) * gridSizeY + horizontalOffset),
                           },
                        };
                     }),
                  };
               });
            });
            pushChange();
         }}
         gl={{ logarithmicDepthBuffer: true }}
         camera={{ position: [0, 10, (localSettings.stageFlipped ? -1 : 1) * 40], fov: 40, near: 0.1, far: 1000 }}
      >
         {/* {(formations[selectedFormation]?.comments || []).map((comment: comment) => {
            return (
               <ThreeComment
                  // draggingCommentId={draggingCommentId}
                  // setDraggingCommentId={setDraggingCommentId}
                  setIsThreeDancerDragging={setIsThreeDancerDragging}
                  isThreeDancerDragging={isThreeDancerDragging}
                  viewOnly={viewOnly}
                  isPlaying={isPlaying}
                  selectedFormation={selectedFormation}
                  formations={formations}
                  setFormations={setFormations}
                  comment={comment}
               ></ThreeComment>
            );
         })} */}

         {stageBackground === "gridfluid" || stageBackground === "cheer9" ? (
            <>
               <ThreeGrid localSettings={localSettings} cloudSettings={cloudSettings}></ThreeGrid>

               {stageBackground === "gridfluid" ? (
                  <>
                     {new Array(Math.floor((cloudSettings.gridSubdivisions * cloudSettings.verticalFineDivisions) / 2))
                        .fill(0)
                        .map((_: number, index: number) => {
                           return (
                              <Text
                                 scale={[0.7, 0.7, 0.7]}
                                 position={[index * squareWidthFeet, 0, cloudSettings.stageDimensions.height / 2]}
                                 rotation={[Math.PI * 1.5, 0, 0]}
                                 fillOpacity={0.7}
                                 color={`${localSettings.isDarkMode ? "white" : "black"}`}
                                 anchorX="center"
                              >
                                 {index % 2 === 0 && index !== 0 ? index : ""}
                              </Text>
                           );
                        })}
                     {new Array(Math.floor((cloudSettings.gridSubdivisions * cloudSettings.verticalFineDivisions) / 2))
                        .fill(0)
                        .map((_: number, index: number) => {
                           return (
                              <Text
                                 scale={[0.7, 0.7, 0.7]}
                                 position={[-(index * squareWidthFeet), 0, cloudSettings.stageDimensions.height / 2]}
                                 rotation={[Math.PI * 1.5, 0, 0]}
                                 fillOpacity={0.7}
                                 color={`${localSettings.isDarkMode ? "white" : "black"}`}
                                 anchorX="center"
                              >
                                 {index % 2 === 0 && index !== 0 ? index : ""}
                              </Text>
                           );
                        })}
                     <Text
                        scale={[0.7, 0.7, 0.7]}
                        position={[0, 0, cloudSettings.stageDimensions.height / 2]}
                        rotation={[Math.PI * 1.5, 0, 0]}
                        fillOpacity={0.7}
                        color={`${localSettings.isDarkMode ? "white" : "black"}`}
                        anchorX="center"
                        // anchorY="middle"
                     >
                        0
                     </Text>
                  </>
               ) : null}
            </>
         ) : null}

         {stageBackground === "cheer9" ? (
            <>
               {new Array(Math.floor(cloudSettings.gridSubdivisions)).fill(0).map((_: number, index: number) => {
                  // index = cloudSettings.stageDimensions.width / 2 - index;
                  return (
                     <Text
                        scale={[0.7, 0.7, 0.7]}
                        position={[
                           index * cloudSettings.verticalFineDivisions * squareWidthFeet -
                              stageDimensions.width / 2 +
                              (cloudSettings.verticalFineDivisions * squareWidthFeet) / 2,
                           0,
                           cloudSettings.stageDimensions.height / 2,
                        ]}
                        rotation={[Math.PI * 1.5, 0, 0]}
                        fillOpacity={0.7}
                        color={`${localSettings.isDarkMode ? "white" : "black"}`}
                        anchorX="center"
                        // anchorY="middle"
                     >
                        {/* {index % 2 === 0 && index !== 0 ? index : ""} */}
                        {index + 1}
                        {/* {(Math.floor(stageDimensions.width / 2) - index - 1) % 2 === 0 ? Math.floor(stageDimensions.width / 2) - index - 1 : ""} */}
                     </Text>
                  );
               })}
            </>
         ) : null}

         {/* {cloudSettings.gridSystem === "fixed" ? ( */}

         {stageBackground === "custom" || stageBackground === "grid" ? (
            <>
               <Grid
                  receiveShadow
                  castShadow
                  onPointerDown={(e) => {
                     setSelectedDancers([]);
                  }}
                  renderOrder={-1}
                  position={[0, 0, 0]}
                  args={[cloudSettings.stageDimensions.width, cloudSettings.stageDimensions.height]}
                  cellSize={1}
                  cellThickness={0.5}
                  sectionSize={8}
                  sectionThickness={1.5}
                  cellColor={`${localSettings.isDarkMode ? "white" : "black"}`}
                  sectionColor={"#737373"}
               />
               {new Array(Math.floor(stageDimensions.width / 2)).fill(0).map((_: number, index: number) => {
                  // index = cloudSettings.stageDimensions.width / 2 - 1 - index;
                  return (
                     <Text
                        scale={[0.7, 0.7, 0.7]}
                        position={[index, 0, cloudSettings.stageDimensions.height / 2]}
                        rotation={[Math.PI * 1.5, 0, 0]}
                        fillOpacity={0.7}
                        color={`${localSettings.isDarkMode ? "white" : "black"}`}
                        anchorX="center"
                        // anchorY="middle"
                     >
                        {index % 2 === 0 && index !== 0 ? index : ""}
                     </Text>
                  );
               })}
               {new Array(Math.floor(stageDimensions.width / 2)).fill(0).map((_: number, index: number) => {
                  // index = cloudSettings.stageDimensions.width / 2 - index;
                  return (
                     <Text
                        scale={[0.7, 0.7, 0.7]}
                        position={[-index, 0, cloudSettings.stageDimensions.height / 2]}
                        rotation={[Math.PI * 1.5, 0, 0]}
                        fillOpacity={0.7}
                        color={`${localSettings.isDarkMode ? "white" : "black"}`}
                        anchorX="center"
                        // anchorY="middle"
                     >
                        {index % 2 === 0 && index !== 0 ? index : ""}
                        {/* {(Math.floor(stageDimensions.width / 2) - index - 1) % 2 === 0 ? Math.floor(stageDimensions.width / 2) - index - 1 : ""} */}
                     </Text>
                  );
               })}
            </>
         ) : null}

         {/* {stageBackground === "cheer9" ? (
            <>
               <CheerLines
                  localSettings={localSettings}
                  stageWidth={cloudSettings.stageDimensions.width}
                  stageHeight={cloudSettings.stageDimensions.height}
               />
               {new Array(Math.floor(cloudSettings.gridSubdivisions)).fill(0).map((_: number, index: number) => {
                  // index = cloudSettings.stageDimensions.width / 2 - index;
                  return (
                     <Text
                        scale={[0.7, 0.7, 0.7]}
                        position={[
                           (index * stageDimensions.width) / cloudSettings.gridSubdivisions -
                              stageDimensions.width / 2 +
                              stageDimensions.width / cloudSettings.gridSubdivisions / 2,
                           0,
                           cloudSettings.stageDimensions.height / 2,
                        ]}
                        rotation={[Math.PI * 1.5, 0, 0]}
                        fillOpacity={0.7}
                        color={`${localSettings.isDarkMode ? "white" : "black"}`}
                        anchorX="center"
                        // anchorY="middle"
                     >
                        {index + 1}
                     </Text>
                  );
               })}
            </>
         ) : null} */}

         {/* ) : null} */}

         {/* <mesh receiveShadow castShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeBufferGeometry attach="geometry" args={[cloudSettings.stageDimensions.width, cloudSettings.stageDimensions.height]} />
            <meshStandardMaterial attach="material" color={`${localSettings.isDarkMode ? "white" : "black"}`} />
         </mesh> */}

         {/* <ThreeGrid localSettings={localSettings} cloudSettings={cloudSettings}></ThreeGrid> */}
         {cloudSettings?.backgroundUrl && cloudSettings.stageBackground === "custom" ? (
            <StageBackground cloudSettings={cloudSettings} url={cloudSettings.backgroundUrl}></StageBackground>
         ) : null}

         {props
            .filter((prop) => prop.url && prop.url !== "null")
            .map((prop: prop) => {
               return (
                  <ThreeSetPiece
                     selectedFormation={selectedFormation}
                     isPlaying={isPlaying}
                     position={position}
                     currentFormationIndex={currentFormationIndex}
                     percentThroughTransition={percentThroughTransition}
                     prop={prop}
                     formations={formations}
                  ></ThreeSetPiece>
               );
            })}

         {/* <color attach="background" args={["#09090b"]} /> */}
         {/* <fog attach="fog" args={["#202020", 5, 20]} /> */}
         <ambientLight intensity={0.5} />
         {/* <SpotLight
            position={[0, 20, cloudSettings.stageDimensions.height / 2]}
            color={"white"}
            castShadow
            penumbra={0}
            distance={25}
            angle={1}
            attenuation={50}
            anglePower={10}
            intensity={5}
         /> */}

         {/* <Scene /> */}
         {/* <SpotLight color={"blue"} castShadow penumbra={1} distance={6} angle={0.35} attenuation={5} anglePower={4} intensity={2} /> */}
         <directionalLight position={[0, 10, 5]} intensity={1} />
         {/* <directionalLight position={[0, 10, 0]} intensity={1} castShadow /> */}

         {/* <MovingSpot color="#0c8cbf" position={[3, 3, 2]} /> */}

         {/* <spotLight intensity={1} position={[10, 10, 10]} color="blue" /> */}
         {/* <spotLight ref={spotLightRef} args={[0xffffff, 1]} position={[0, 5, 10]} angle={0.3} penumbra={1} castShadow /> */}
         {/* {spotLightRef.current && <SpotLightHelper args={[spotLightRef.current]} />} */}

         {selectedFormation !== null
            ? formations[selectedFormation].positions.map((dancerPosition: dancerPosition) => {
                 return (
                    <ThreeDancer
                       items={items}
                       setSelectedDancers={setSelectedDancers}
                       key={dancerPosition.id}
                       selectedDancers={selectedDancers}
                       setIsThreeDancerDragging={setIsThreeDancerDragging}
                       isThreeDancerDragging={isThreeDancerDragging}
                       isPlaying={isPlaying}
                       currentFormationIndex={currentFormationIndex}
                       percentThroughTransition={percentThroughTransition}
                       dancers={dancers}
                       position={position}
                       addToStack={addToStack}
                       pushChange={pushChange}
                       viewOnly={viewOnly}
                       dancerPosition={dancerPosition}
                       formations={formations}
                       setFormations={setFormations}
                       selectedFormation={selectedFormation}
                       localSettings={localSettings}
                    ></ThreeDancer>
                 );
              })
            : null}

         <OrbitControls
            enableDamping={false}
            // dampingFactor={0.5}
            autoRotate={isIntro}
            autoRotateSpeed={1}
            enableZoom={!isIntro}
            makeDefault
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            enabled={!isThreeDancerDragging}
            // minDistance={5} // Prevents the camera from going too close to the point of interest
            // maxDistance={50} //
         />
         <Text
            scale={[1, 1, 1]}
            position={[0, 0, cloudSettings.stageDimensions.height / 2 + 2]}
            rotation={[Math.PI * 1.5, 0, 0]}
            color={`${localSettings.isDarkMode ? "white" : "black"}`}
            anchorX="center"
            // anchorY="middle"
         >
            AUDIENCE
         </Text>
         <Text
            scale={[1, 1, 1]}
            position={[0, 0, -(cloudSettings.stageDimensions.height / 2 + 1)]}
            rotation={[Math.PI * 1.5, 0, Math.PI * 1]}
            color={`${localSettings.isDarkMode ? "white" : "black"}`}
            anchorX="center"
            // anchorY="middle"
         >
            BACKSTAGE
         </Text>
         <Text
            scale={[1, 1, 1]}
            position={[Math.floor(stageDimensions.width / 2) + 1, 0, 0]}
            rotation={[Math.PI * 1.5, 0, Math.PI * 2.5]}
            color={`${localSettings.isDarkMode ? "white" : "black"}`}
            anchorX="center"
            // anchorY="middle"
         >
            STAGE LEFT
         </Text>
         <Text
            scale={[1, 1, 1]}
            position={[-(Math.floor(stageDimensions.width / 2) + 1), 0, 0]}
            rotation={[Math.PI * 1.5, 0, Math.PI * 1.5]}
            color={`${localSettings.isDarkMode ? "white" : "black"}`}
            anchorX="center"
            // anchorY="middle"
         >
            STAGE RIGHT
         </Text>

         {/* <mesh
            rotation={[0, 0, 0]}
            position={[0, -1, 0]}
            onPointerMove={(event) => {
               // console.log(planeIntersectPoint.x, planeIntersectPoint.z);
               event.ray.intersectPlane(floorPlane, planeIntersectPoint);
               if (!isThreeDancerDragging) return;

               setFormations((formations: formation[]) => {
                  return formations.map((formation, i) => {
                     if (i === selectedFormation) {
                        return {
                           ...formation,
                           positions: formation.positions.map((position: dancerPosition) => {
                              if (selectedDancers.includes(position.id)) {
                                 return {
                                    ...position,
                                    position: {
                                       x: planeIntersectPoint.x,
                                       y: -planeIntersectPoint.z,
                                    },
                                 };
                              }
                              return position;
                           }),
                        };
                     }
                     return formation;
                  });
               });
            }}
         >
            <boxBufferGeometry attach="geometry" args={[100, 0.1, 100]} />
            <meshBasicMaterial attach="material" color="transparent" opacity={0} transparent />
         </mesh> */}

         {/* {selectedFormation &&
            formations[selectedFormation].positions
               .filter((position) => selectedDancers.includes(position.id))
               .map((dancerPosition: dancerPosition) => {
                  return (
                     <Path
                        dancer={dancers.find((dancer) => dancer.id === dancerPosition.id)}
                        previousPosition={formations[selectedFormation - 1]?.positions.find((position) => position.id === dancerPosition.id)}
                        dancerPosition={dancerPosition}
                     ></Path>
                  );
               })} */}
      </Canvas>
   );
};

function roundToHundredth(value: number): number {
   return Math.round(value * 100) / 100;
}
