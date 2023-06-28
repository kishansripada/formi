import { dancerPosition, dancer } from "../../../types/types";
import { Vector3, BufferGeometry, CubicBezierCurve3 } from "three";
import { Line } from "@react-three/drei";

export const Path = ({
   dancerPosition,
   previousPosition,
   dancer,
}: {
   dancerPosition: dancerPosition;
   previousPosition: dancerPosition;
   dancer: dancer;
}) => {
   // console.log(dancerPosition);

   // vertices for the line
   // const vertices = [new Vector3(-1, 0, 0), new Vector3(0, 1, 0), new Vector3(1, 0, 0)];
   const vertices = [
      new Vector3(previousPosition.position.x, 0, -previousPosition.position.y),
      new Vector3(dancerPosition.position.x, 0, -dancerPosition.position.y),
   ];
   if (dancerPosition.transitionType !== "cubic")
      return (
         <Line
            dashed={true}
            dashSize={0.5} // Default
            points={vertices} // Array of Vector3
            color={dancer.color || "#db2777"}
            lineWidth={1} // In units of 1/1000 of screen width.
         />
      );
   const startPoint = new Vector3(previousPosition.position.x, 0, -previousPosition.position.y);
   const controlPoint1 = new Vector3(dancerPosition.controlPointStart.x, 0, -dancerPosition.controlPointStart.y);
   const controlPoint2 = new Vector3(dancerPosition.controlPointEnd.x, 0, -dancerPosition.controlPointEnd.y);
   const endPoint = new Vector3(dancerPosition.position.x, 0, -dancerPosition.position.y);

   // Create the curve
   const curve = new CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

   // Sample a number of points from the curve
   const points = curve.getPoints(100);

   // // Create the line geometry from the points
   const geometry = new BufferGeometry().setFromPoints(points);

   return (
      // <line geometry={new BufferGeometry().setFromPoints(vertices)}>
      //    <lineDashedMaterial attach="material" color="red" linewidth={20} scale={1} dashSize={1} gapSize={0.1} />
      // </line>
      <mesh>
         <tubeBufferGeometry attach="geometry" args={[curve, 20, 0.02, 8]} />
         <meshBasicMaterial attach="material" color={dancer.color || "#db2777"} />
      </mesh>
   );
};
