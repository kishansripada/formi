import { PIXELS_PER_SQUARE } from "../../types/types";

export const CheerLines: React.FC<{ stageDimensions: { width: number; height: number } }> = ({ stageDimensions }) => {
   return (
      <>
         <div
            className="flex flex-row h-full justify-between rounded-xl "
            style={{
               width: PIXELS_PER_SQUARE * stageDimensions.width,
            }}
         >
            {new Array(10).fill(0).map((_, i) => (
               <div
                  key={i}
                  className={`bg-gray-600 `}
                  style={{
                     width: i === 0 || i === 9 ? 0 : 2.5,
                  }}
               ></div>
            ))}
         </div>
      </>
   );
};
