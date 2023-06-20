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
         ) : null}
         {localSettings ? (
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
         ) : null}
         <div
            className="flex flex-row h-full w-full  justify-between rounded-xl absolute z-10  "
            style={{
               width: PIXELS_PER_SQUARE * stageDimensions.width,
               opacity: opacity,
            }}
         >
            {new Array(stageDimensions.width + 1).fill(0).map((_, i) => (
               <div
                  key={i}
                  className={`w-full bg-neutral-300  dark:bg-neutral-600 `}
                  style={{
                     width:
                        i === stageDimensions.width || i === 0
                           ? 0
                           : (i - stageDimensions.width / 2) % cloudSettings.gridSubdivisions === 0
                           ? 2.5
                           : 0.5,
                     // backgroundColor: i === stageDimensions.width / 2 ? "black" : "rgb(209 213 219)",
                     zIndex: i === stageDimensions.width / 2 ? 1 : 0,
                  }}
               ></div>
            ))}
         </div>
         <div
            className="flex flex-col justify-between absolute w-full h-full left-0 top-0 rounded-xl z-10 "
            style={{
               height: PIXELS_PER_SQUARE * stageDimensions.height,
               opacity: opacity,
               // top: -PIXELS_PER_SQUARE * stageDimensions.height,
            }}
         >
            {new Array(stageDimensions.height + 1).fill(0).map((_, i) => (
               <div
                  key={i}
                  // ${i === stageDimensions.height / 2 ? "bg-neutral-600 dark:bg-neutral-400" : "bg-neutral-300 dark:bg-neutral-600"}

                  className={`w-full bg-neutral-300  dark:bg-neutral-600   `}
                  style={{
                     height:
                        i === stageDimensions.height || i === 0
                           ? 0
                           : (i - stageDimensions.height / 2) % cloudSettings.gridSubdivisions === 0
                           ? (1 / 1) * 2.5
                           : 0.5,
                     // backgroundColor: i === stageDimensions.height / 2 ? "black" : "rgb(209 213 219)",
                     zIndex: i === stageDimensions.height / 2 ? 1 : 0,
                  }}
               ></div>
            ))}
         </div>
      </>
   );
};
