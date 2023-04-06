import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { dancerPosition, dancer, formation, localSettings } from "../../types/types";
import { Text, Cylinder } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useDrag } from "@use-gesture/react";
import { useThree, useFrame } from "@react-three/fiber";

import * as THREE from "three";

export function ThreeDancer({
   dancerPosition,
   dancers,
   position,
   currentFormationIndex,
   percentThroughTransition,
   isPlaying,
   formations,
   opacity,
   setFormations,
   selectedFormation,
   localSettings,
   viewOnly,
   pushChange,
   addToStack,
   setIsThreeDancerDragging,
   isThreeDancerDragging,
   selectedDancers,
}: {
   dancerPosition: dancerPosition;
   dancers: dancer[];
   position: number | null;
   currentFormationIndex: number | null;
   percentThroughTransition: number;
   isPlaying: boolean;
   formations: formation[];
   opacity: number;
   setFormations: Function;
   selectedFormation: number | null;
   localSettings: localSettings;
   viewOnly: boolean;
   pushChange: Function;
   addToStack: Function;
   setIsThreeDancerDragging: Function;
   isThreeDancerDragging: boolean;
   selectedDancers: string[];
}) {
   let { gridSnap } = localSettings;
   /**
    * Text always looks at the camera
    */
   const textRef = useRef();

   // const changeStateDancerDragging = useDancerDragging((state) => state.changeStateDancerDragging);
   useFrame((state, dt) => {
      if (textRef?.current != null) {
         textRef.current.lookAt(state.camera.position);
      }
   });
   let dancer = dancers?.find((dancer) => dancer.id === dancerPosition.id);
   // const isDancerDragging = useDancerDragging((state) => state.isDancerDragging);
   let planeIntersectPoint = new THREE.Vector3();
   const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

   const bind = useDrag(
      ({ active, movement: [x, y], timeStamp, event }) => {
         if (viewOnly) return;
         event.stopPropagation();

         if (active) {
            document.body.style.cursor = "grabbing";
            event.ray.intersectPlane(floorPlane, planeIntersectPoint);
            // setPos([-dancerPosition.position.x / 2 + planeIntersectPoint.x, 0, dancerPosition.position.y / 2 + planeIntersectPoint.z]);
            // console.log(planeIntersectPoint.x);
            setFormations((formations: formation[]) => {
               return formations.map((formation, index: number) => {
                  if (index === selectedFormation) {
                     return {
                        ...formation,
                        positions: formation.positions.map((dancerPosition) => {
                           if (dancerPosition.id === dancer.id && dancerPosition.transitionType === "cubic") {
                              return {
                                 ...dancerPosition,
                                 position: {
                                    x: Math.round(planeIntersectPoint.x * 2 * gridSnap) / gridSnap,
                                    y: Math.round(-planeIntersectPoint.z * 2 * gridSnap) / gridSnap,
                                 },

                                 // THIS NEEDS TO BE FIXED
                                 controlPointEnd: {
                                    x: planeIntersectPoint.x,
                                    y: -planeIntersectPoint.z,
                                 },
                              };
                           }
                           if (dancerPosition.id === dancer.id && (dancerPosition.transitionType === "linear" || !dancerPosition.transitionType)) {
                              return {
                                 ...dancerPosition,
                                 position: {
                                    x: Math.round(planeIntersectPoint.x * 2 * gridSnap) / gridSnap,
                                    y: Math.round(-planeIntersectPoint.z * 2 * gridSnap) / gridSnap,
                                 },
                              };
                           }
                           return dancerPosition;
                        }),
                     };
                  }

                  return formation;
               });
            });
         } else {
            document.body.style.cursor = "default";
         }
         setIsThreeDancerDragging(active);

         // api.start({
         //    position: [dancerPosition.position.x, dancerPosition.position.y],
         // });
         return timeStamp;
      },
      { delay: true }
   );

   const { nodes, materials } = useGLTF("/roblox.glb");

   let maxHeight = Math.max(...dancers.map((dancer) => dancer?.height || 0)) || 182.88;
   let dancerPos;
   let textPos;
   let selectedPos;
   dancerPos = useSpring({ position: [dancerPosition.position.x / 2, 0, -dancerPosition.position.y / 2] });
   textPos = useSpring({ position: [dancerPosition.position.x / 2, ((dancer?.height || 182.88) / maxHeight) * 2, -dancerPosition.position.y / 2] });
   selectedPos = useSpring({ position: [dancerPosition.position.x / 2, 0, -dancerPosition.position.y / 2] });
   // if (isDancerDragging && position !== null && currentFormationIndex !== null) {
   //    dancerPos = { position: [dancerPosition.position.x, 0, dancerPosition.position.y] };
   //    textPos = { position: [dancerPosition.position.x, 2, dancerPosition.position.y] };
   // } else

   if (isPlaying && position !== null && currentFormationIndex !== null) {
      let myPosition = animate(formations, dancer?.id, currentFormationIndex, percentThroughTransition);
      // if the animation function returns null, the dancer is not on the stage
      if (myPosition === null) return <></>;
      let x = myPosition.x / 2;
      let y = -myPosition.y / 2;
      dancerPos = { position: [x, 0, y] };
      textPos = { position: [x, ((dancer?.height || 182.88) / maxHeight) * 2, y] };
      selectedPos = { position: [x, 0, y] };
   }
   // const outerMaterial = new MeshStandardMaterial({ color: 0x00ff00 });

   return (
      <>
         <animated.mesh position={textPos.position}>
            <Text ref={textRef} scale={[0.2, 0.2, 0.2]} color="black" anchorX="center" anchorY="middle">
               {dancer?.name}
            </Text>
         </animated.mesh>
         {selectedDancers.includes(dancer?.id) ? (
            <animated.mesh position={selectedPos.position}>
               <group>
                  <Cylinder
                     args={[0.5, 0.5, 0.02, 32]} // Adjust outer cylinder radius
                     // material={(<meshStandardMaterial color={"#db2777"}></meshStandardMaterial>)}
                     // position={textPos.position}
                     rotation={[Math.PI, 0, 0]}
                  >
                     <meshStandardMaterial attach="material" color={"#db2777"} />
                  </Cylinder>
               </group>
            </animated.mesh>
         ) : null}

         <animated.mesh
            // {...spring}
            {...bind()}
            scale={[0.25, ((dancer?.height || 182.88) / maxHeight) * 0.35, 0.3]}
            // scale={[0.25, ((dancer.height || 182.88) / maxHeight) * 0.35, 0.3]}
            // rotation={[Math.PI / 2, 0, 0]}
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
                              onPointerDown={() => {
                                 if (viewOnly) return;

                                 // addToStack();
                              }}
                              onPointerEnter={() => {
                                 if (viewOnly) return;
                                 document.body.style.cursor = "grab";
                              }}
                              onPointerLeave={() => {
                                 if (viewOnly) return;
                                 document.body.style.cursor = "default";
                              }}
                           >
                              <group name="vecto">
                                 <group name="Model9">
                                    <mesh name="Model9_b0b0b0_0" geometry={nodes.Model9_b0b0b0_0.geometry} material={materials.b0b0b0}>
                                       <meshStandardMaterial opacity={opacity} attach="material" color={dancer?.color || "#db2777"} transparent />
                                    </mesh>
                                 </group>
                                 <group scale={[0.7, 1, 1]}>
                                    <group name="Model5">
                                       <mesh name="Model5_b0b0b0_0" geometry={nodes.Model5_b0b0b0_0.geometry} material={materials.b0b0b0}>
                                          <meshStandardMaterial opacity={opacity} attach="material" color={dancer?.color || "#db2777"} transparent />
                                       </mesh>
                                    </group>
                                    <group name="Model7">
                                       <mesh name="Model7_b0b0b0_0" geometry={nodes.Model7_b0b0b0_0.geometry} material={materials.b0b0b0}>
                                          <meshStandardMaterial opacity={opacity} attach="material" color={dancer?.color || "#db2777"} transparent />
                                       </mesh>
                                    </group>
                                    <group name="Model6">
                                       <mesh name="Model6_b0b0b0_0" geometry={nodes.Model6_b0b0b0_0.geometry} material={materials.b0b0b0}>
                                          <meshStandardMaterial opacity={opacity} attach="material" color={dancer?.color || "#db2777"} transparent />
                                       </mesh>
                                    </group>
                                    <group name="Model4">
                                       <mesh name="Model4_b0b0b0_0" geometry={nodes.Model4_b0b0b0_0.geometry} material={materials.b0b0b0}>
                                          <meshStandardMaterial opacity={opacity} attach="material" color={dancer?.color || "#db2777"} transparent />
                                       </mesh>
                                    </group>
                                    <group name="Model8">
                                       <mesh name="Model8_b0b0b0_0" geometry={nodes.Model8_b0b0b0_0.geometry} material={materials.b0b0b0}>
                                          <meshStandardMaterial opacity={opacity} attach="material" color={dancer?.color || "#db2777"} transparent />
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
   percentThroughTransition: number | undefined
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
            from = inPreviousFormation.position;
            to = inThisFormation.position;
         } else {
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

   if (!from || !to) return null;

   function easeInOutQuad(x: number): number {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
   }

   percentThroughTransition = easeInOutQuad(percentThroughTransition);

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
