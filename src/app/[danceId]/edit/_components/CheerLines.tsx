import { PIXELS_PER_SQUARE } from "../../../../types/types";

export const CheerLines: React.FC<{ stageDimensions: { width: number; height: number } }> = ({ stageDimensions }) => {
   return (
      <>
         <div className="absolute top-0 left-0 right-0 bottom-0 m-auto  select-none ">
            <div className="absolute top-2 w-full flex flex-row justify-around dark:text-neutral-300 text-neutral-600 text-xl">
               <p className="">1</p>
               <p className="">2</p>
               <p className="">3</p>
               <p className="">4</p>
               <p className="">5</p>
               <p className="">6</p>
               <p className="">7</p>
               <p className="">8</p>
               <p className="">9</p>
            </div>
            <div
               className="flex flex-row h-full justify-between rounded-xl   overflow-hidden"
               style={{
                  width: PIXELS_PER_SQUARE * stageDimensions.width,
               }}
            >
               {new Array(9).fill(0).map((_, i) => (
                  <div key={i} className={` ${i % 2 == 0 ? "bg-neutral-200 dark:bg-neutral-700" : "bg-white dark:bg-neutral-800"}  w-full `} s></div>
               ))}
            </div>
         </div>
      </>
   );
};
