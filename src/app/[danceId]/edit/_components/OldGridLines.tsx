import { Fragment } from "react";
import { cloudSettings, localSettings, PIXELS_PER_SQUARE } from "../../../../types/types";
import { useStore } from "../store";

export const OldGridLines: React.FC<{
   opacity: number;
   zoom: number;
   localSettings: localSettings;
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
            viewBox={`0 0 ${stageDimensions.width} ${stageDimensions.height}`}
         >
            {/* Horizontal lines */}
            {new Array(Math.floor(stageDimensions.height)).fill(0).map((_, i) => {
               const centerPos = stageDimensions.height / 2;
               const myYOffset = centerPos + (i > centerPos ? i - Math.floor(centerPos) : -i);
               const differenceFromCenter = Math.round(Math.abs(myYOffset - centerPos));

               return (
                  <line
                     key={i}
                     x1="0"
                     y1={myYOffset}
                     x2={stageDimensions.width}
                     y2={myYOffset}
                     className="dark:stroke-neutral-600 stroke-neutral-300"
                     strokeWidth={
                        differenceFromCenter % cloudSettings.gridSubdivisions === 0
                           ? 0.05 * 1.2
                           : // : zoom < 0.6 && differenceFromCenter % 2 === 0
                             // ? 0
                             0.01 * 1.2
                     }
                  />
               );
            })}
            {/* Vertical lines */}
            {new Array(Math.floor(stageDimensions.width)).fill(0).map((_, i) => {
               const centerPos = stageDimensions.width / 2;
               const myXOffset = centerPos + (i > centerPos ? i - Math.floor(centerPos) : -i);
               const differenceFromCenter = Math.round(Math.abs(myXOffset - centerPos));

               return (
                  <Fragment key={i}>
                     <line
                        key={i}
                        x1={myXOffset}
                        y1="0"
                        x2={myXOffset}
                        y2={stageDimensions.height}
                        className="dark:stroke-neutral-600 stroke-neutral-300"
                        strokeWidth={
                           differenceFromCenter % cloudSettings.gridSubdivisions === 0
                              ? 0.05 * 1.2
                              : // : zoom < 0.6 && differenceFromCenter % 2 === 0
                                // ? 0
                                0.01 * 1.2
                        }
                     />
                     {localSettings ? (
                        <text
                           key={"text" + i}
                           style={{
                              fontSize:
                                 differenceFromCenter % 2 === 0 ? (zoom < 0.4 && differenceFromCenter % 4 === 0 ? 0 : Math.min(0.3 / zoom, 30)) : 0,
                           }}
                           opacity={0.8}
                           x={myXOffset}
                           y={localSettings.stageFlipped ? 0.7 : stageDimensions.height - 0.2}
                           textAnchor="middle"
                           className="dark:fill-neutral-400 fill-neutral-600 font-bold"
                        >
                           {differenceFromCenter}
                        </text>
                     ) : null}
                  </Fragment>
               );
            })}
         </svg>
      </>
   );
};
