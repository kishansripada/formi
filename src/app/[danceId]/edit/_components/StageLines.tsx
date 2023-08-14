import { cloudSettings, localSettings, PIXELS_PER_SQUARE } from "../../../../types/types";
import { useStore } from "../store";

export const StageLines: React.FC<{
   // stageDimensions: { width: number; height: number };
   // cloudSettings: cloudSettings;
   opacity: number;
   zoom: number;
   localSettings: localSettings;
   //    divisions: { x: number; y: number };
}> = ({ zoom, localSettings, opacity }) => {
   const {
      cloudSettings: { stageDimensions },
      cloudSettings,
   } = useStore();
   return (
      <>
         <svg
            style={{
               // position: "absolute",
               // bottom: !localSettings.stageFlipped ? 0 : "auto",
               // top: localSettings.stageFlipped ? 0 : "auto",
               width: stageDimensions.width * PIXELS_PER_SQUARE,
               height: stageDimensions.height * PIXELS_PER_SQUARE,
            }}
            width="100%"
            height="100%"
            className="absolute left-0 top-0"
            viewBox={`0 0 ${stageDimensions.width} ${stageDimensions.height}`}
         >
            {/* Horizontal lines */}
            {new Array(cloudSettings.horizontalGridSubdivisions).fill(0).map((_, i) => {
               //    const centerPos = stageDimensions.height / 2;
               const spaceBeteenLines = stageDimensions.height / cloudSettings.horizontalGridSubdivisions;
               const myYOffset = i * spaceBeteenLines;
               //    const differenceFromCenter = Math.round(Math.abs(myYOffset - centerPos));

               return (
                  <line
                     key={i}
                     x1="0"
                     y1={myYOffset}
                     x2={stageDimensions.width}
                     y2={myYOffset}
                     className="dark:stroke-neutral-600 stroke-neutral-300"
                     strokeWidth={
                        // differenceFromCenter % cloudSettings.gridSubdivisions === 0
                        //    ? 0.05 * 1.2
                        //    : // : zoom < 0.6 && differenceFromCenter % 2 === 0
                        //      // ? 0
                        0.05 * 1.2
                     }
                  />
               );
            })}
            {/* Vertical lines */}
            {new Array(Math.floor(cloudSettings.gridSubdivisions)).fill(0).map((_, i) => {
               const spaceBeteenLines = stageDimensions.width / cloudSettings.gridSubdivisions;
               const myXOffset = i * spaceBeteenLines;
               return (
                  <line
                     key={i}
                     x1={myXOffset}
                     y1="0"
                     x2={myXOffset}
                     y2={stageDimensions.height}
                     className="dark:stroke-neutral-600 stroke-neutral-300"
                     strokeWidth={
                        // differenceFromCenter % cloudSettings.gridSubdivisions === 0
                        //    ? 0.05 * 1.2
                        //    : // : zoom < 0.6 && differenceFromCenter % 2 === 0
                        //      // ? 0
                        0.05 * 1.2
                     }
                  />
               );
            })}
         </svg>
      </>
   );
};

function roundToNearestEven(n: number): number {
   // If n is an even number, return it as is.
   if (n % 2 === 0) {
      return n;
   } else {
      return n + 1;
   }
}
