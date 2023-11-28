import { cloudSettings, localSettings, PIXELS_PER_SQUARE } from "../../../../types/types";
import { useStore } from "../store";
import { Fragment } from "react";
export const GridLines: React.FC<{
   // stageDimensions: { width: number; height: number };
   // cloudSettings: cloudSettings;
   opacity: number;
   zoom: number;
   localSettings: localSettings;
}> = ({ zoom, localSettings, opacity }) => {
   const {
      cloudSettings,
      cloudSettings: { stageDimensions },
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
            viewBox={`0 0 ${stageDimensions.width} ${stageDimensions.height}`}
         >
            {/* Horizontal lines */}
            {new Array(Math.floor(cloudSettings.horizontalGridSubdivisions * cloudSettings.horizontalFineDivisions)).fill(0).map((_, i) => {
               // const centerPos = stageDimensions.height / 2;
               // const myYOffset = centerPos + (i > centerPos ? i - Math.floor(centerPos) : -i);
               // const differenceFromCenter = Math.round(Math.abs(myYOffset - centerPos));
               const spaceBeteenLines = stageDimensions.height / cloudSettings.horizontalGridSubdivisions / cloudSettings.horizontalFineDivisions;
               const myYOffset = i * spaceBeteenLines;

               return (
                  <line
                     key={i}
                     x1="0"
                     y1={myYOffset}
                     x2={stageDimensions.width}
                     y2={myYOffset}
                     className="dark:stroke-neutral-700 stroke-neutral-300"
                     strokeWidth={
                        // differenceFromCenter % cloudSettings.gridSubdivisions === 0
                        //    ? 0.05 * 1.2
                        //    : // : zoom < 0.6 && differenceFromCenter % 2 === 0
                        //      // ? 0
                        0.01 * 1.2
                     }
                  />
               );
            })}
            {/* Vertical lines */}
            {new Array(Math.floor(cloudSettings.gridSubdivisions * cloudSettings.verticalFineDivisions)).fill(0).map((_, i) => {
               const spaceBeteenLines = stageDimensions.width / cloudSettings.gridSubdivisions / cloudSettings.verticalFineDivisions;
               const myXOffset = i * spaceBeteenLines;
               const center = stageDimensions.width / 2;
               return (
                  <Fragment key={i}>
                     <line
                        key={i}
                        x1={myXOffset}
                        y1="0"
                        x2={myXOffset}
                        y2={stageDimensions.height}
                        className="dark:stroke-neutral-700 stroke-neutral-300"
                        strokeWidth={
                           // differenceFromCenter % cloudSettings.gridSubdivisions === 0
                           //    ? 0.05 * 1.2
                           //    : // : zoom < 0.6 && differenceFromCenter % 2 === 0
                           //      // ? 0
                           0.01 * 1.2
                        }
                     />

                     {cloudSettings.stageBackground === "gridfluid" || cloudSettings.stageBackground === "cheer9" ? (
                        <>
                           {localSettings ? (
                              <text
                                 style={{
                                    fontSize: i % 2 === 0 ? (zoom < 0.2 && i % 4 === 0 ? 0 : Math.min(0.3 / zoom, 30)) : 0,
                                 }}
                                 opacity={0.8}
                                 x={myXOffset + center}
                                 y={localSettings.stageFlipped ? 0.7 : stageDimensions.height - 0.4}
                                 textAnchor="middle"
                                 className="dark:fill-neutral-400 fill-neutral-600 font-bold z-10"
                              >
                                 {i}
                              </text>
                           ) : null}
                           {localSettings ? (
                              <text
                                 style={{
                                    fontSize: i % 2 === 0 ? (zoom < 0.2 && i % 4 === 0 ? 0 : Math.min(0.3 / zoom, 30)) : 0,
                                 }}
                                 opacity={0.8}
                                 x={center - myXOffset}
                                 y={localSettings.stageFlipped ? 0.7 : stageDimensions.height - 0.4}
                                 textAnchor="middle"
                                 className="dark:fill-neutral-400 fill-neutral-600 font-bold z-10"
                              >
                                 {i}
                              </text>
                           ) : null}
                        </>
                     ) : null}
                  </Fragment>
               );
            })}
         </svg>
      </>
   );
};
