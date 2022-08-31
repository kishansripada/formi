export const GridLines: React.FC<{}> = ({}) => {
   return (
      <>
         <div className="flex flex-row h-full justify-between">
            {new Array(21).fill(0).map((_, i) => (
               <div
                  key={i}
                  className="h-full bg-gray-300"
                  style={{
                     width: i % 5 === 0 ? (1 / 1) * 2.5 : 1 / 1,
                     backgroundColor: i === 10 ? "black" : "rgb(209 213 219)",
                     zIndex: i === 10 ? 1 : 0,
                  }}
               ></div>
            ))}
         </div>
         <div className="flex flex-col h-[800px] justify-between relative top-[-800px]">
            {new Array(21).fill(0).map((_, i) => (
               <div
                  key={i}
                  className=" w-full bg-gray-300"
                  style={{
                     height: i % 5 === 0 ? (1 / 1) * 2.5 : 1 / 1,
                     backgroundColor: i === 10 ? "black" : "rgb(209 213 219)",
                     zIndex: i === 10 ? 1 : 0,
                  }}
               ></div>
            ))}
         </div>
      </>
   );
};
