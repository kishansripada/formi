import { PIXELS_PER_SQUARE } from "../../types/types";

export const GridLines: React.FC<{ stageDimensions: { width: number; height: number } }> = ({ stageDimensions }) => {
   return (
      <>
         <div
            className="flex flex-row h-full justify-between rounded-xl "
            style={{
               width: PIXELS_PER_SQUARE * stageDimensions.width,
            }}
         >
            {new Array(stageDimensions.width + 1).fill(0).map((_, i) => (
               <div
                  key={i}
                  className={`h-full ${i === stageDimensions.width / 2 ? "bg-gray-600" : "bg-gray-300"} `}
                  style={{
                     width: i === stageDimensions.width || i === 0 ? 0 : (i - stageDimensions.width / 2) % 5 === 0 ? 2.5 : 0.5,
                     // backgroundColor: i === stageDimensions.width / 2 ? "black" : "rgb(209 213 219)",
                     zIndex: i === stageDimensions.width / 2 ? 1 : 0,
                  }}
               ></div>
            ))}
         </div>
         <div
            className="flex flex-col justify-between relative rounded-xl"
            style={{
               height: PIXELS_PER_SQUARE * stageDimensions.height,
               top: -PIXELS_PER_SQUARE * stageDimensions.height,
            }}
         >
            {new Array(stageDimensions.height + 1).fill(0).map((_, i) => (
               <div
                  key={i}
                  className={`w-full ${i === stageDimensions.height / 2 ? "bg-gray-600" : "bg-gray-300"} `}
                  style={{
                     height: i === stageDimensions.height || i === 0 ? 0 : (i - stageDimensions.height / 2) % 5 === 0 ? (1 / 1) * 2.5 : 0.5,
                     // backgroundColor: i === stageDimensions.height / 2 ? "black" : "rgb(209 213 219)",
                     zIndex: i === stageDimensions.height / 2 ? 1 : 0,
                  }}
               ></div>
            ))}
         </div>
      </>
   );
};
