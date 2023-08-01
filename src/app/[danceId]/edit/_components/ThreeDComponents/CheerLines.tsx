import { Vector3 } from "three";
import { Line } from "@react-three/drei";

export const CheerLines = ({ stageWidth, stageHeight, localSettings }: { stageWidth: number; stageHeight: number; localSettings: localSettings }) => {
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
