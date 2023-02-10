import React, { useRef, useEffect } from "react";
import { useGLTF, Text, useFBX } from "@react-three/drei";
import { dancerPosition, dancer, formation } from "../../types/types";
import { useSpring, animated } from "@react-spring/three";
import { useGesture, useDrag } from "react-use-gesture";
import { useThree, useFrame } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei/";

export function ThreeDancer({
   dancerPosition,
   dancers,
   position,
   currentFormationIndex,
   percentThroughTransition,
   isPlaying,
   formations,
   opacity,
}: {
   dancerPosition: dancerPosition;
   dancers: dancer[];
   position: number | null;
   currentFormationIndex: number | null;
   percentThroughTransition: number;
   isPlaying: boolean;
   formations: formation[];
   opacity: number;
}) {
   // const { size, viewport } = useThree();
   // const aspect = size.width / viewport.width;
   // const [isDragging, setIsDragging] = useState(false);
   // const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
   // let planeIntersectPoint = new THREE.Vector3();

   // const [spring, api] = useSpring(() => ({
   //    position: [dancerPosition.position.x / 2, 0, -dancerPosition.position.y / 2],
   //    scale: 1,
   //    rotation: [0, 0, 0],
   //    config: { friction: 10 },
   // }));

   // const bind = useDrag(
   //    ({ active, movement: [x, y], timeStamp, event }) => {
   //       if (active) {
   //          event.ray.intersectPlane(floorPlane, planeIntersectPoint);

   //          console.log([planeIntersectPoint.x, 1.5, planeIntersectPoint.z]);
   //       }

   //       setIsDragging(active);

   //       api.start({
   //          // position: active ? [x / aspect, -y / aspect, 0] : [0, 0, 0],
   //          position: [dancerPosition.position.x / 2, 0, -dancerPosition.position.y / 2],
   //          scale: active ? 1.2 : 1,
   //          rotation: [y / aspect, x / aspect, 0],
   //       });
   //       return timeStamp;
   //    },
   //    { delay: true }
   // );

   const { nodes, materials } = useGLTF("/roblox.glb");
   let dancer = dancers?.find((dancer) => dancer.id === dancerPosition.id);
   let maxHeight = Math.max(...dancers.map((dancer) => dancer?.height || 0)) || 182.88;
   let dancerPos;
   let textPos;
   // let dancerRot;
   if (isPlaying && position !== null && currentFormationIndex !== null) {
      let myPosition = animate(formations, dancer?.id, currentFormationIndex, percentThroughTransition);
      // if the animation function returns null, the dancer is not on the stage
      if (myPosition === null) return <></>;
      let x = myPosition.x / 2;
      let y = -myPosition.y / 2;
      dancerPos = { position: [x, 0, y] };
      textPos = { position: [x, 2, y] };
      // dancerRot = { rotation: [0, dancerPosition.position.x, 0] };
   } else {
      dancerPos = useSpring({ position: [dancerPosition.position.x / 2, 0, -dancerPosition.position.y / 2] });
      textPos = useSpring({ position: [dancerPosition.position.x / 2, 2, -dancerPosition.position.y / 2] });
      // dancerRot = useSpring({ rotation: [0, dancerPosition.position.x, 0] });
   }

   return (
      <>
         <animated.mesh position={textPos.position}>
            <Text scale={[0.2, 0.2, 0.2]} color="black" anchorX="center" anchorY="middle">
               {dancer?.name}
            </Text>
         </animated.mesh>

         <animated.mesh
            scale={[0.25, ((dancer?.height || 182.88) / maxHeight) * 0.35, 0.3]}
            // scale={[0.25, ((dancer.height || 182.88) / maxHeight) * 0.35, 0.3]}
            // rotation={dancerRot.rotation}
            position={dancerPos.position}
            dispose={null}
         >
            <group dispose={null}>
               <group name="Sketchfab_Scene">
                  <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
                     <group name="robloxfbx" rotation={[Math.PI / 2, 0, 0]}>
                        <group name="Object_2">
                           <group name="RootNode">
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

         {/* <animated.mesh scale={[1, 1, 1]} position={dancerPos.position} dispose={null}>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={0.07}>
               <group rotation={[Math.PI / 2, 0, 0]}>
                  <group position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                     <group position={[0, 0, -0.03]} scale={0.01}>
                        <meshBasicMaterial opacity={0.1} color="rgb(10, 20, 30)" />

                        <mesh geometry={nodes.defaultMaterial.geometry} material={materials.wood}>
                           <meshStandardMaterial opacity={opacity} attach="material" color={dancer?.color || "#db2777"} transparent />
                        </mesh>
                     </group>
                  </group>
               </group>
            </group>
         </animated.mesh> */}
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
