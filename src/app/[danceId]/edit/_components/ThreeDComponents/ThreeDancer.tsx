import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { dancerPosition, dancer, formation, localSettings, item } from "../../../../../types/types";
import { Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useDrag } from "@use-gesture/react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Plane } from "three";
import { ThreeItem } from "./ThreeItem";
import { useStore } from "../../store";
export function ThreeDancer({
   dancerPosition,
   dancers,
   position,
   currentFormationIndex,
   percentThroughTransition,
   isPlaying,
   opacity,
   localSettings,
   setIsThreeDancerDragging,
   isThreeDancerDragging,
   setSelectedDancers,
   setScene,
}: {
   dancerPosition: dancerPosition;
   dancers: dancer[];
   position: number | null;
   currentFormationIndex: number | null;
   percentThroughTransition: number;
   isPlaying: boolean;
   opacity: number;
   localSettings: localSettings;
   pushChange: Function;
   addToStack: Function;
   setIsThreeDancerDragging: Function;
   isThreeDancerDragging: boolean;
   selectedDancers: string[];
   setSelectedDancers: Function;
   setScene: Function;
}) {
   const { formations, setFormations, get, viewOnly, items, selectedFormations } = useStore();

   const { scene } = useThree((state) => state);

   const FEET_IN_A_METER = 3.28084;
   useEffect(() => {
      scene.scale.set(1 / FEET_IN_A_METER, 1 / FEET_IN_A_METER, 1 / FEET_IN_A_METER);
      setScene(scene); // Adjust scale as needed
   }, [scene]);

   /**
    * Text always looks at the camera
    */
   if (!selectedFormations.length) return null;

   const textRef = useRef();

   // const changeStateDancerDragging = useDancerDragging((state) => state.changeStateDancerDragging);
   useFrame((state, dt) => {
      if (textRef?.current != null) {
         textRef.current.lookAt(state.camera.position);
         // bgRef.current.lookAt(state.camera.position);
      }
   });

   let dancer = dancers?.find((dancer) => dancer.id === dancerPosition.id);
   let planeIntersectPoint = new Vector3();
   const floorPlane = new Plane(new Vector3(0, 1, 0), 0);

   const bind = useDrag(
      ({ active, movement: [x, y], timeStamp, event }) => {
         if (viewOnly || isPlaying) return;
         event.stopPropagation();

         if (active) {
            document.body.style.cursor = "grabbing";
            event.ray.intersectPlane(floorPlane, planeIntersectPoint);

            setFormations(
               get().formations.map((formation, index: number) => {
                  if (selectedFormations.includes(formation.id)) {
                     return {
                        ...formation,
                        positions: formation.positions.map((dancerPosition) => {
                           if (dancerPosition.id === dancer.id && dancerPosition.transitionType === "cubic") {
                              return {
                                 ...dancerPosition,
                                 position: {
                                    x: planeIntersectPoint.x * FEET_IN_A_METER,
                                    y: -planeIntersectPoint.z * FEET_IN_A_METER,
                                 },

                                 // THIS NEEDS TO BE FIXED
                                 controlPointEnd: {
                                    x: planeIntersectPoint.x * FEET_IN_A_METER,
                                    y: -planeIntersectPoint.z * FEET_IN_A_METER,
                                 },
                              };
                           }
                           if (dancerPosition.id === dancer.id && (dancerPosition.transitionType === "linear" || !dancerPosition.transitionType)) {
                              return {
                                 ...dancerPosition,
                                 position: {
                                    x: planeIntersectPoint.x * FEET_IN_A_METER,
                                    y: -planeIntersectPoint.z * FEET_IN_A_METER,
                                 },
                              };
                           }
                           return dancerPosition;
                        }),
                     };
                  }

                  return formation;
               })
            );
         } else {
            document.body.style.cursor = "default";
         }
         setIsThreeDancerDragging(active);

         return timeStamp;
      },
      { delay: true }
   );
   const { nodes, materials } = useGLTF("/roblox.glb");

   let dancerPos;
   let textPos;
   let bgPos;
   let itemPos;

   dancerPos = useSpring({ position: [dancerPosition.position.x, 0, -dancerPosition.position.y] });
   textPos = useSpring({ position: [dancerPosition.position.x, (dancer?.height || 182.88) / 28, -dancerPosition.position.y] });
   bgPos = useSpring({ position: [dancerPosition.position.x, (dancer?.height || 182.88) / 28, -dancerPosition.position.y - 0.02] });
   itemPos = useSpring({ position: [dancerPosition.position.x, (dancer?.height || 182.88) / 28 / 2, -dancerPosition.position.y + 0.5] });

   // selectedPos = useSpring({ position: [dancerPosition.position.x, 0, -dancerPosition.position.y] });
   if (isThreeDancerDragging) {
      dancerPos = { position: [dancerPosition.position.x, 0, -dancerPosition.position.y] };
      textPos = { position: [dancerPosition.position.x, (dancer?.height || 182.88) / 28, -dancerPosition.position.y] };
      bgPos = { position: [dancerPosition.position.x, (dancer?.height || 182.88) / 28, -dancerPosition.position.y - 0.02] };
      itemPos = { position: [dancerPosition.position.x, (dancer?.height || 182.88) / 28 / 2, -dancerPosition.position.y + 0.5] };
      // selectedPos = { position: [dancerPosition.position.x, 0, -dancerPosition.position.y] };
   }

   if (isPlaying && position !== null && currentFormationIndex !== null) {
      let myPosition = animate(formations, dancer?.id, currentFormationIndex, percentThroughTransition);
      // if the animation function returns null, the dancer is not on the stage
      if (myPosition === null) return <></>;
      let x = myPosition.x;
      let y = -myPosition.y;
      dancerPos = { position: [x, 0, y] };
      textPos = { position: [x, (dancer?.height || 182.88) / 28, y] };
      // selectedPos = { position: [x, 0, y] };
      bgPos = { position: [x, (dancer?.height || 182.88) / 28, y] };
      itemPos = { position: [x, (dancer?.height || 182.88) / 28, y] };
      itemPos = { position: [x, (dancer?.height || 182.88) / 28 / 2, y + 0.5] };
   }

   const thisItem = items.find((item) => item.id === dancerPosition?.itemId) || null;

   return (
      <>
         {/* <animated.mesh position={bgPos.position}>
            <RoundedBox ref={bgRef} args={[3, 0.6, 0.001]} radius={0.2}>
               <meshLambertMaterial
                  attach="material"
                  color={selectedDancers.includes(dancer.id) ? "#db2777" : localSettings.isDarkMode ? "white" : "#3f3f46"}
               />
            </RoundedBox>
         </animated.mesh>  */}

         <animated.mesh position={textPos.position}>
            <Text ref={textRef} scale={[0.4, 0.4, 0.4]} color={`${localSettings.isDarkMode ? "white" : "black"}`} anchorX="center" anchorY="middle">
               {dancer?.name.split(" ")[0]}
            </Text>
         </animated.mesh>

         {thisItem?.url && <ThreeItem itemPos={itemPos} thisItem={thisItem}></ThreeItem>}

         <animated.mesh
            // {...spring}
            {...bind()}
            scale={[0.6, (dancer?.height || 182.88) / 156, 0.7]}
            // scale={[0.25, ((dancer.height || 182.88) / maxHeight) * 0.35, 0.3]}

            // rotation={[0, Math.PI / 2, 0]}
            // rotation={[0, dancerPosition?.rotation?.angle ? dancerPosition?.rotation?.angle * (Math.PI / 180) : 0, 0]}
            position={dancerPos.position}
            dispose={null}
         >
            <group dispose={null}>
               <group name="Sketchfab_Scene">
                  <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
                     <group name="robloxfbx" rotation={[Math.PI / 2, 0, 0]}>
                        <group name="Object_2">
                           <group
                              name="RootNode"
                              onPointerDown={(e) => {
                                 if (viewOnly) return;
                                 // e.stopPropagation();
                                 setSelectedDancers([dancer.id]);
                                 setIsThreeDancerDragging(true);
                                 // addToStack();
                              }}
                              onPointerEnter={() => {
                                 if (viewOnly || isPlaying) return;
                                 document.body.style.cursor = "grab";
                              }}
                              onPointerLeave={() => {
                                 if (viewOnly || isPlaying) return;
                                 document.body.style.cursor = "default";
                              }}
                           >
                              <group castShadow name="vecto">
                                 <group name="Model9">
                                    <mesh castShadow name="Model9_b0b0b0_0" geometry={nodes.Model9_b0b0b0_0.geometry} material={materials.b0b0b0}>
                                       <meshStandardMaterial
                                          opacity={opacity}
                                          attach="material"
                                          color={dancerPosition.color || dancer?.color || "#db2777"}
                                          transparent
                                       />
                                    </mesh>
                                 </group>
                                 <group scale={[0.7, 1, 1]}>
                                    <group name="Model5">
                                       <mesh castShadow name="Model5_b0b0b0_0" geometry={nodes.Model5_b0b0b0_0.geometry} material={materials.b0b0b0}>
                                          <meshStandardMaterial
                                             opacity={opacity}
                                             attach="material"
                                             color={dancerPosition.color || dancer?.color || "#db2777"}
                                             transparent
                                          />
                                       </mesh>
                                    </group>
                                    <group name="Model7">
                                       <mesh castShadow name="Model7_b0b0b0_0" geometry={nodes.Model7_b0b0b0_0.geometry} material={materials.b0b0b0}>
                                          <meshStandardMaterial
                                             opacity={opacity}
                                             attach="material"
                                             color={dancerPosition.color || dancer?.color || "#db2777"}
                                             transparent
                                          />
                                       </mesh>
                                    </group>
                                    <group name="Model6">
                                       <mesh castShadow name="Model6_b0b0b0_0" geometry={nodes.Model6_b0b0b0_0.geometry} material={materials.b0b0b0}>
                                          <meshStandardMaterial
                                             opacity={opacity}
                                             attach="material"
                                             color={dancerPosition.color || dancer?.color || "#db2777"}
                                             transparent
                                          />
                                       </mesh>
                                    </group>
                                    <group name="Model4">
                                       <mesh castShadow name="Model4_b0b0b0_0" geometry={nodes.Model4_b0b0b0_0.geometry} material={materials.b0b0b0}>
                                          <meshStandardMaterial
                                             opacity={opacity}
                                             attach="material"
                                             color={dancerPosition.color || dancer?.color || "#db2777"}
                                             transparent
                                          />
                                       </mesh>
                                    </group>
                                    <group name="Model8">
                                       <mesh castShadow name="Model8_b0b0b0_0" geometry={nodes.Model8_b0b0b0_0.geometry} material={materials.b0b0b0}>
                                          <meshStandardMaterial
                                             opacity={opacity}
                                             attach="material"
                                             color={dancerPosition.color || dancer?.color || "#db2777"}
                                             transparent
                                          />
                                       </mesh>
                                    </group>
                                 </group>
                              </group>
                           </group>
                        </group>
                     </group>
                  </group>
               </group>
            </group>
         </animated.mesh>
      </>
   );
}

useGLTF.preload("/roblox.glb");
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
