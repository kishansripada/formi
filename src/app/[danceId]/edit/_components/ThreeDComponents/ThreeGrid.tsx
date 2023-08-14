import { Vector3 } from "three";
import { Line } from "@react-three/drei";
import { cloudSettings, localSettings } from "../../../../../types/types";
import { useStore } from "../../store";

export const ThreeGrid = ({ localSettings }: { localSettings: localSettings }) => {
   const { cloudSettings } = useStore();
   const { stageDimensions, gridSubdivisions, horizontalGridSubdivisions } = cloudSettings;
   const lines = [];

   const vertSpacing = stageDimensions.width / gridSubdivisions;
   const halfHeight = stageDimensions.height / 2;

   for (let i = 0; i < gridSubdivisions + 1; i++) {
      const xPosition = -stageDimensions.width / 2 + i * vertSpacing;
      const start = new Vector3(xPosition, 0, -halfHeight);
      const end = new Vector3(xPosition, 0, halfHeight);

      lines.push(
         <Line
            points={[start, end]}
            color={localSettings.isDarkMode ? "#52525b" : "#d4d4d4"}
            lineWidth={1} // You can adjust the line width
            renderOrder={-1}
            key={"vert" + i.toString()}
         />
      );
   }

   const horSpacing = stageDimensions.height / horizontalGridSubdivisions;
   const halfWidth = stageDimensions.width / 2;

   for (let i = 0; i < horizontalGridSubdivisions + 1; i++) {
      const xPosition = -stageDimensions.height / 2 + i * horSpacing;
      const start = new Vector3(-halfWidth, 0, xPosition);

      const end = new Vector3(halfWidth, 0, xPosition);

      lines.push(
         <Line
            points={[start, end]}
            color={localSettings.isDarkMode ? "#52525b" : "#d4d4d4"}
            lineWidth={1} // You can adjust the line width
            renderOrder={-1}
            key={"hor" + i.toString()}
         />
      );
   }

   return <>{lines}</>;
};
