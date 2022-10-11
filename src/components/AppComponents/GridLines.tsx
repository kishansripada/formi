import { PIXELS_PER_SQUARE, GRID_HEIGHT, GRID_WIDTH } from "../../types/types";

export const GridLines: React.FC<{}> = ({}) => {
   return (
      <>
         <div
            className="flex flex-row h-full justify-between "
            style={{
               width: PIXELS_PER_SQUARE * GRID_WIDTH,
            }}
         >
            {new Array(GRID_WIDTH + 1).fill(0).map((_, i) => (
               <div
                  key={i}
                  className="h-full bg-gray-300"
                  style={{
                     width: i % 5 === 0 ? (1 / 1) * 2.5 : 1 / 1,
                     backgroundColor: i === GRID_WIDTH / 2 ? "black" : "rgb(209 213 219)",
                     zIndex: i === 10 ? 1 : 0,
                  }}
               ></div>
            ))}
         </div>
         <div
            className="flex flex-col justify-between relative"
            style={{
               height: PIXELS_PER_SQUARE * GRID_HEIGHT,
               top: -PIXELS_PER_SQUARE * GRID_HEIGHT,
            }}
         >
            {new Array(GRID_HEIGHT + 1).fill(0).map((_, i) => (
               <div
                  key={i}
                  className=" w-full bg-gray-300"
                  style={{
                     height: i % 5 === 0 ? (1 / 1) * 2.5 : 1 / 1,
                     backgroundColor: i === GRID_HEIGHT / 2 ? "black" : "rgb(209 213 219)",
                     zIndex: i === 10 ? 1 : 0,
                  }}
               ></div>
            ))}
         </div>
      </>
   );
};
