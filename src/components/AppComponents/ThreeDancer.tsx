import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { dancerPosition, dancer, formation } from "../../types/types";
import { OrbitControls, Stats, Text } from "@react-three/drei";

export function ThreeDancer({
   dancerPosition,
   dancers,
   position,
   currentFormationIndex,
   percentThroughTransition,
   isPlaying,
   formations,
}: {
   dancerPosition: dancerPosition;
   dancers: dancer[];
   position: number | null;
   currentFormationIndex: number | null;
   percentThroughTransition: number;
   isPlaying: boolean;
   formations: formation[];
}) {
   const { nodes, materials } = useGLTF("/dancer.gltf");
   let dancer = dancers?.find((dancer) => dancer.id === dancerPosition.id);

   let x;
   let y;
   if (isPlaying && position !== null && currentFormationIndex !== null) {
      let myPosition = animate(formations, dancer?.id, currentFormationIndex, percentThroughTransition);
      // if the animation function returns null, the dancer is not on the stage
      if (myPosition === null) return <></>;
      x = myPosition.x;
      y = myPosition.y;
   }
   return (
      <>
         <Text
            scale={[0.2, 0.2, 0.2]}
            position={[isPlaying ? x / 2 : dancerPosition.position.x / 2, 2, isPlaying ? -y / 2 : -dancerPosition.position.y / 2]}
            color="white"
            anchorX="center"
            anchorY="middle"
         >
            {dancer?.name}
         </Text>
         {/* <group
            scale={[0.01, 0.01, 0.01]}
            position={[isPlaying ? x / 2 : dancerPosition.position.x / 2, 0, isPlaying ? -y / 2 : -dancerPosition.position.y / 2]}
            dispose={null}
         >
            <mesh geometry={nodes.Beta_Surface.geometry} material={materials.Beta_HighLimbsGeoSG3} />
            <mesh geometry={nodes.Beta_Joints.geometry} material={materials.Beta_Joints_MAT1} />
         </group> */}

         <group
            scale={[1, 1, 1]}
            position={[isPlaying ? x / 2 : dancerPosition.position.x / 2, 1.3, isPlaying ? -y / 2 : -dancerPosition.position.y / 2]}
            dispose={null}
         >
            <group rotation={[-Math.PI / 2, 0, 0]} scale={0.07}>
               <group rotation={[Math.PI / 2, 0, 0]}>
                  <group position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                     <group position={[0, 0, -0.03]} scale={0.01}>
                        <meshBasicMaterial color="rgb(10, 20, 30)" />

                        <mesh castShadow receiveShadow geometry={nodes.defaultMaterial.geometry}>
                           <meshStandardMaterial attach="material" color={dancer?.color || "#db2777"} transparent />
                        </mesh>
                     </group>
                  </group>
               </group>
            </group>
         </group>
      </>
   );
}

useGLTF.preload("/dancer.gltf");

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
