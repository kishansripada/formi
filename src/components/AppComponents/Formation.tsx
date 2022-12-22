import { dancer, dancerPosition, formation } from "../../types/types";

export const Formation: React.FC<{
   formation: formation;
   amSelected: boolean;
   index: number;
   setFormations: Function;
   setSelectedFormation: Function;
   viewOnly: boolean;
   pixelsPerSecond: number;
   userPositions: any;
   onlineUsers: any;
}> = ({ formation, amSelected, index, setFormations, setSelectedFormation, viewOnly, pixelsPerSecond, userPositions, onlineUsers }) => {
   // let idsOnThisFormation = Object.values(userPositions).filter((position) => position.selectedFormation === index);

   // let ids = idsOnThisFormation ? idsOnThisFormation.map((value) => onlineUsers[value.userId]) : null;
   // // console.log({ onlineUsers });
   // console.log(ids);
   return (
      <>
         <div
            className={`rounded-md  mx-[2px] box-border cursor-pointer z-auto  border-4 relative  `}
            style={{
               width: (formation.transition.durationSeconds + formation.durationSeconds) * pixelsPerSecond - 4,
               borderColor: amSelected ? "rgb(219 39 119)" : "rgb(55 65 81)",
               // top: index === 5 ? 100 : null,
               // subtract 4 to account for the mx-[2px]
            }}
         >
            <div
               data-type="formation-resize"
               id={index.toString()}
               className="h-full   absolute right-[-4px]  w-[4px] cursor-col-resize	z-[99999]"
            ></div>

            <div className={`bg-white h-[17px]  px-2 overflow-clip border-b border-gray-300`}>
               <p className={`text-[12px] pointer-events-none select-none text-black font-medium`}>{formation.name}</p>
            </div>
            <div className={` flex flex-row  box-border`}>
               <div
                  style={{
                     width: formation.durationSeconds * pixelsPerSecond - 2,
                  }}
                  className="relative  h-[23px]"
               >
                  <div
                     id={index.toString()}
                     data-type="transition-resize"
                     className=" h-[26px]  w-[4px] cursor-col-resize	 absolute right-[-5px] z-50 flex flex-row justify-between"
                  >
                     <div className="h-full w-[1px] bg-black pointer-events-none"></div>
                     <div className="h-full w-[1px] bg-black pointer-events-none"></div>
                  </div>
               </div>

               <div
                  style={{
                     width: formation.transition.durationSeconds * pixelsPerSecond - 2,
                  }}
                  className="  "
               >
                  <div className="flex flex-row  pointer-events-none h-[26px] ml-[5px]">
                     <svg className="w-1/2" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 10 20">
                        <polygon className="fill-gray-300" strokeWidth={0} points="0,0 0,20 10,10" />
                     </svg>
                     <svg className="w-1/2 " width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 10 20">
                        <polygon className="fill-gray-300" strokeWidth={0} points="0,10 10,0 10,20" />
                     </svg>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

function averageHex(colors) {
   // transform all hex codes to integer arrays, e.g. [[R, G, B], [R,G,B], ...]
   let numbers = colors.map(function (hex) {
      // split in seperate R, G and B
      let split = hex.match(/[\da-z]{2}/gi);

      // transform to integer values
      return split.map(function (toInt) {
         return parseInt(toInt, 16);
      });
   });

   // reduce the array by averaging all values, resulting in an average [R, G, B]
   let averages = numbers.reduce(function (total, amount, index, array) {
      return total.map(function (subtotal, subindex) {
         // if we reached the last color, average it out and return the hex value
         if (index == array.length - 1) {
            let result = Math.round((subtotal + amount[subindex]) / array.length).toString(16);

            // add a leading 0 if it is only one character
            return result.length == 2 ? "" + result : "0" + result;
         } else {
            return subtotal + amount[subindex];
         }
      });
   });

   // return them as a single hex string
   return "#" + averages.join("");
}
