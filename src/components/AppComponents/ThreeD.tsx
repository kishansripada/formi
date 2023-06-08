import { dancer, dancerPosition, formation, dragBoxCoords, PIXELS_PER_SQUARE, comment, cloudSettings, localSettings } from "../../types/types";
import { ThreeDancer } from "../AppComponents/ThreeDancer";
import { Canvas as Canva } from "@react-three/fiber";
import { Stage, Grid, OrbitControls, Environment, Lightformer } from "@react-three/drei";
import { Text } from "@react-three/drei";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";

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
   localSettings: any;
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
         camera={{ position: [0, 10, (localSettings.stageFlipped ? -1 : 1) * 14], fov: 40 }}
      >
         {stageBackground === "cheer9" ? (
            <VerticalLines
               localSettings={localSettings}
               stageWidth={cloudSettings.stageDimensions.width}
               stageHeight={cloudSettings.stageDimensions.height}
            />
         ) : stageBackground === "grid" ? (
            <Grid
               renderOrder={-1}
               position={[0, 0, 0]}
               args={[cloudSettings.stageDimensions.width / 2, cloudSettings.stageDimensions.height / 2]}
               cellSize={0.5}
               cellThickness={0.5}
               sectionSize={2.5}
               sectionThickness={1.5}
               cellColor={`${localSettings.isDarkMode ? "white" : "black"}`}
               sectionColor={"#db2777"}
            />
         ) : null}

         <ambientLight intensity={0.5} />
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
            scale={[0.5, 0.5, 0.5]}
            position={[0, 0, cloudSettings.stageDimensions.height / 4 + 1]}
            rotation={[Math.PI * 1.5, 0, 0]}
            color={`${localSettings.isDarkMode ? "white" : "black"}`}
            anchorX="center"
            // anchorY="middle"
         >
            AUDIENCE
         </Text>
         <Text
            scale={[0.5, 0.5, 0.5]}
            position={[0, 0, -(cloudSettings.stageDimensions.height / 4 + 1)]}
            rotation={[Math.PI * 1.5, 0, Math.PI * 1]}
            color={`${localSettings.isDarkMode ? "white" : "black"}`}
            anchorX="center"
            // anchorY="middle"
         >
            BACKSTAGE
         </Text>
         <Text
            scale={[0.5, 0.5, 0.5]}
            position={[cloudSettings.stageDimensions.width / 4 + 1, 0, 0]}
            rotation={[Math.PI * 1.5, 0, Math.PI * 2.5]}
            color={`${localSettings.isDarkMode ? "white" : "black"}`}
            anchorX="center"
            // anchorY="middle"
         >
            STAGE LEFT
         </Text>
         <Text
            scale={[0.5, 0.5, 0.5]}
            position={[-(cloudSettings.stageDimensions.width / 4 + 1), 0, 0]}
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

const VerticalLines = ({ stageWidth, stageHeight, localSettings }: { stageWidth: number; stageHeight: number; localSettings: localSettings }) => {
   const lines = [];
   const numLines = 10;
   const spacing = stageWidth / 2 / (numLines - 1);
   const halfHeight = stageHeight / 4;

   for (let i = 0; i < numLines; i++) {
      const xPosition = -stageWidth / 4 + i * spacing;
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
