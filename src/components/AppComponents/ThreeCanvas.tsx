import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { GridLines } from "./GridLines";
import { dancer, dancerPosition, formation, dragBoxCoords, PIXELS_PER_SQUARE, comment } from "../../types/types";
import { toast, Toaster } from "react-hot-toast";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, Grid, OrbitControls, Environment, useFBX } from "@react-three/drei";
import { ThreeDancer } from "./ThreeDancer";
export const ThreeCanvas: React.FC<{
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
   stageDimensions: { width: number; height: number };
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
   draggingDancerId: string | null;
   setDraggingDancerId: Function;
   player: any;
   undo: Function;
   addToStack: Function;
   pushChange: Function;
   gridSnap: number;
   isCommenting: boolean;
   setIsCommenting: Function;
   zoom: number;
   setZoom: Function;
   videoCoordinates: { left: number; top: number };
   setVideoCoordinates: Function;
   stageBackground: string;
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
   stageDimensions,
   coordsToPosition,
   draggingDancerId,
   setDraggingDancerId,
   undo,
   addToStack,
   pushChange,
   gridSnap,
   isCommenting,
   setIsCommenting,
   zoom,
   setZoom,
   videoCoordinates,
   setVideoCoordinates,
   stageBackground,
}) => {
   //    const fbx = useFBX("/dancer.fbx");
   return (
      <div className="flex flex-row relative justify-center  h-full w-full overflow-hidden  overscroll-contain ">
         <p className="absolute bottom-1 left-2 z-50 text-white text-xs">
            The 3D preview is currently limited to view only. Support for 3D editing and animations is coming soon.{" "}
         </p>
         <Canvas gl={{ logarithmicDepthBuffer: true }} shadows camera={{ position: [-15, 0, 10], fov: 25 }}>
            {/* <fog attach="fog" args={["black", 15, 21.5]} /> */}
            <Stage
               position={[10, 0, 0]}
               intensity={0.5}
               environment="studio"
               //    shadows={{ type: "accumulative", bias: -0.001 }}
               adjustCamera={false}
            ></Stage>
            <Grid
               renderOrder={-1}
               position={[0, 0, 0]}
               args={[stageDimensions.width / 2, stageDimensions.height / 2]}
               cellSize={0.5}
               cellThickness={0.5}
               sectionSize={2.5}
               sectionThickness={1.5}
               sectionColor={[0.5, 0.5, 10]}
               //    fadeDistance={30}
            />
            {selectedFormation !== null
               ? formations[selectedFormation].positions.map((position: dancerPosition) => {
                    return <ThreeDancer position={[position.position.x / 2, 0, -position.position.y / 2]} scale={[0.01, 0.01, 0.01]}></ThreeDancer>;
                 })
               : null}

            <OrbitControls autoRotate autoRotateSpeed={0} enableZoom={true} makeDefault minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
            <Environment background preset="city" blur={0.8} />
         </Canvas>
      </div>
   );
};
