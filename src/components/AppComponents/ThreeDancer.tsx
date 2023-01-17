import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function ThreeDancer(props) {
   const { nodes, materials } = useGLTF("/dancer.gltf");

   return (
      <group {...props} dispose={null}>
         <mesh geometry={nodes.Beta_Surface.geometry} material={materials.Beta_HighLimbsGeoSG3} />
         <mesh geometry={nodes.Beta_Joints.geometry} material={materials.Beta_Joints_MAT1} />
      </group>
   );
}

useGLTF.preload("/dancer.gltf");
