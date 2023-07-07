import { cloudSettings, localSettings, PIXELS_PER_SQUARE } from "../../types/types";

export const GridLines: React.FC<{
   stageDimensions: { width: number; height: number };
   cloudSettings: cloudSettings;
   opacity: number;
   zoom: number;
   localSettings: localSettings;
}> = ({ stageDimensions, cloudSettings, zoom, localSettings, opacity }) => {
   return (
      <>
         {localSettings ? (
            <>
               <div
                  style={{
                     bottom: !localSettings.stageFlipped ? 0 : "auto",
                     top: localSettings.stageFlipped ? 0 : "auto",
                  }}
                  className="absolute w-1/2 right-0 h-10 flex flex-row justify-between pointer-events-none"
               >
                  {new Array(stageDimensions.width / 2).fill(0).map((_, i) => {
                     return (
                        <div
                           className=" -translate-x-1/2 text-center  font-bold z-20 text-neutral-400 flex flex-col items-center justify-end"
                           style={{
                              width: 100 / (stageDimensions.width / 2) + "%",
                              fontSize: i % 2 === 0 || zoom > 1 ? Math.min(16 / zoom, 30) : 0,
                              flexDirection: !localSettings.stageFlipped ? "column" : "column-reverse",
                           }}
                        >
                           <p className=""> {i}</p>
                           {i % 2 === 0 || zoom > 1 ? <div className="h-3 w-[1px] bg-pink-300 dark:bg-pink-600"></div> : null}
                        </div>
                     );
                  })}
               </div>
               <div
                  style={{
                     bottom: !localSettings.stageFlipped ? 0 : "auto",
                     top: localSettings.stageFlipped ? 0 : "auto",
                  }}
                  className="absolute w-1/2 left-0 h-10 flex justify-between pointer-events-none"
               >
                  {new Array(stageDimensions.width / 2)
                     .fill(0)

                     .map((_, i) => {
                        i = stageDimensions.width / 2 - 1 - i;
                        return (
                           <div
                              className=" translate-x-1/2 text-center  font-bold z-20 text-neutral-400 flex flex-col items-center justify-end"
                              style={{
                                 width: 100 / (stageDimensions.width / 2) + "%",
                                 fontSize: i % 2 === 0 || zoom > 1 ? Math.min(16 / zoom, 30) : 0,
                                 flexDirection: !localSettings.stageFlipped ? "column" : "column-reverse",
                              }}
                           >
                              <p className=""> {i}</p>
                              {i % 2 === 0 || zoom > 1 ? <div className="h-3 w-[1px] bg-pink-300 dark:bg-pink-600"></div> : null}
                           </div>
                        );
                     })}
               </div>
            </>
         ) : null}

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
            {new Array(stageDimensions.height + 1).fill(0).map((_, i) => (
               <line
                  key={i}
                  x1="0"
                  y1={i}
                  x2={stageDimensions.width}
                  y2={i}
                  className="dark:stroke-neutral-600 stroke-neutral-300"
                  // stroke={i === stageDimensions.height / 2 ? "#525252" : "#d4d4d4"}
                  strokeWidth={
                     i === stageDimensions.height || i === 0
                        ? 0
                        : (i - stageDimensions.height / 2) % cloudSettings.gridSubdivisions === 0
                        ? 0.05 * 1.2
                        : 0.01 * 1.2
                  }
               />
            ))}
            {/* Vertical lines */}
            {new Array(stageDimensions.width + 1).fill(0).map((_, i) => (
               <line
                  key={i}
                  x1={i}
                  y1="0"
                  x2={i}
                  y2={stageDimensions.height}
                  // stroke={i === stageDimensions.width / 2 ? "#525252" : "#d4d4d4"}
                  className="dark:stroke-neutral-600 stroke-neutral-300"
                  strokeWidth={
                     i === stageDimensions.width || i === 0
                        ? 0
                        : (i - stageDimensions.width / 2) % cloudSettings.gridSubdivisions === 0
                        ? 0.05 * 1.2
                        : 0.01 * 1.2
                  }
               />
            ))}
         </svg>
      </>
   );
};
