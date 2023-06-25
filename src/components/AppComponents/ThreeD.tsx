import { dancer, dancerPosition, formation, dragBoxCoords, PIXELS_PER_SQUARE, comment, cloudSettings, localSettings } from "../../types/types";
import { ThreeDancer } from "../AppComponents/ThreeDancer";
import { Canvas as Canva, useLoader } from "@react-three/fiber";
import { Stage, Grid, OrbitControls, Environment, Lightformer } from "@react-three/drei";
import { Text } from "@react-three/drei";
import { Line } from "@react-three/drei";
import { Vector3, TextureLoader, DoubleSide, BufferGeometry, MeshBasicMaterial } from "three";
import { useState, useEffect } from "react";
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
}) => {
   const { stageBackground } = cloudSettings;
   return (
      <Canva
         onPointerUp={() => {
            if (viewOnly) return;
            pushChange();
         }}
         gl={{ logarithmicDepthBuffer: true }}
         camera={{ position: [0, 10, (localSettings.stageFlipped ? -1 : 1) * 40], fov: 40 }}
      >
         {stageBackground === "cheer9" ? (
            <VerticalLines
               localSettings={localSettings}
               stageWidth={cloudSettings.stageDimensions.width}
               stageHeight={cloudSettings.stageDimensions.height}
            />
         ) : stageBackground === "grid" || stageBackground === "custom" ? (
            <Grid
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
         ) : null}

         <ambientLight intensity={0.5} />
         {cloudSettings?.backgroundUrl && cloudSettings.stageBackground === "custom" ? (
            <ImageComponent cloudSettings={cloudSettings} url={cloudSettings.backgroundUrl}></ImageComponent>
         ) : null}

         <directionalLight position={[0, 10, 5]} intensity={1} />
         {selectedFormation !== null
            ? formations[selectedFormation].positions.map((dancerPosition: dancerPosition) => {
                 return (
                    <ThreeDancer
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
            autoRotate
            autoRotateSpeed={0}
            enableZoom={true}
            makeDefault
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            enabled={!isThreeDancerDragging}
         />
         <Text
            scale={[1, 1, 1]}
            position={[0, 0, cloudSettings.stageDimensions.height / 2 + 1]}
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
            position={[cloudSettings.stageDimensions.width / 2 + 1, 0, 0]}
            rotation={[Math.PI * 1.5, 0, Math.PI * 2.5]}
            color={`${localSettings.isDarkMode ? "white" : "black"}`}
            anchorX="center"
            // anchorY="middle"
         >
            STAGE LEFT
         </Text>
         <Text
            scale={[1, 1, 1]}
            position={[-(cloudSettings.stageDimensions.width / 2 + 1), 0, 0]}
            rotation={[Math.PI * 1.5, 0, Math.PI * 1.5]}
            color={`${localSettings.isDarkMode ? "white" : "black"}`}
            anchorX="center"
            // anchorY="middle"
         >
            STAGE RIGHT
         </Text>
      </Canva>
   );
};

function ImageComponent({ url, cloudSettings }: { url: string; cloudSettings: cloudSettings }) {
   const texture = useLoader(TextureLoader, url);
   const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

   useEffect(() => {
      calculateImageDimensions(cloudSettings, url, (width, height) => {
         setDimensions({ width, height });
      });
   }, [cloudSettings, url]);

   return (
      <mesh position={[0, 0, 0]} rotation={[Math.PI * 1.5, 0, 0]}>
         <planeBufferGeometry attach="geometry" args={[dimensions.width, dimensions.height]} />
         <meshBasicMaterial opacity={0.7} transparent={true} attach="material" map={texture} side={DoubleSide} />
      </mesh>
   );
}

const VerticalLines = ({ stageWidth, stageHeight, localSettings }: { stageWidth: number; stageHeight: number; localSettings: localSettings }) => {
   const lines = [];
   const numLines = 10;
   const spacing = stageWidth / (numLines - 1);
   const halfHeight = stageHeight / 2;

   for (let i = 0; i < numLines; i++) {
      const xPosition = -stageWidth / 2 + i * spacing;
      const start = new Vector3(xPosition, 0, -halfHeight);
      const end = new Vector3(xPosition, 0, halfHeight);
      lines.push(
         <Line
            points={[start, end]}
            color={localSettings.isDarkMode ? "#52525b" : "#d4d4d4"}
            lineWidth={2} // You can adjust the line width
            renderOrder={-1}
            key={i}
         />
      );
   }

   return <>{lines}</>;
};

function calculateImageDimensions(
   cloudSettings: { stageDimensions: { width: number; height: number } },
   url: string,
   callback: (newWidth: number, newHeight: number) => void
): void {
   // Create a new image object
   let img = new Image();

   // Define the onload function
   img.onload = function () {
      // Get the actual width and height of the image
      const imgWidth: number = this.width;
      const imgHeight: number = this.height;

      // Get the stage width and height
      const stageWidth: number = cloudSettings.stageDimensions.width;
      const stageHeight: number = cloudSettings.stageDimensions.height;

      // Calculate the image aspect ratio
      const imgAspectRatio: number = imgWidth / imgHeight;

      // Calculate the stage aspect ratio
      const stageAspectRatio: number = stageWidth / stageHeight;

      let newImgWidth: number, newImgHeight: number;

      if (stageAspectRatio > imgAspectRatio) {
         // If stage aspect ratio is larger, image height should be equal to stage height
         newImgHeight = stageHeight;
         newImgWidth = newImgHeight * imgAspectRatio;
      } else {
         // If image aspect ratio is larger, image width should be equal to stage width
         newImgWidth = stageWidth;
         newImgHeight = newImgWidth / imgAspectRatio;
      }

      // Return the new width and height
      callback(newImgWidth, newImgHeight);
   };

   // Set the src attribute to start loading the image
   img.src = url;
}
