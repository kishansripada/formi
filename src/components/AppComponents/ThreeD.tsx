import { dancer, dancerPosition, formation, dragBoxCoords, PIXELS_PER_SQUARE, comment, cloudSettings } from "../../types/types";
import { ThreeDancer } from "../AppComponents/ThreeDancer";
import { Canvas as Canva } from "@react-three/fiber";
import { Stage, Grid, OrbitControls, Environment } from "@react-three/drei";
import { Text } from "@react-three/drei";

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
   return (
      <Canva
         onPointerUp={() => {
            if (viewOnly) return;
            pushChange();
         }}
         gl={{ logarithmicDepthBuffer: true }}
         camera={{ position: [0, 10, (localSettings.stageFlipped ? -1 : 1) * 14], fov: 40 }}
      >
         <Environment path="/" files="potsdamer_platz_1k.hdr" />
         <Stage position={[0, 0, 0]} adjustCamera={false}></Stage>
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
         {selectedFormation !== null
            ? formations[selectedFormation].positions.map((dancerPosition: dancerPosition) => {
                 return (
                    <ThreeDancer
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
