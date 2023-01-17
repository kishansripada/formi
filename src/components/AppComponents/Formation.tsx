import { dancer, dancerPosition, formation } from "../../types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRef } from "react";
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
   addToStack: Function;
   activeId: string | null;
}> = ({
   formation,
   amSelected,
   index,
   setFormations,
   setSelectedFormation,
   viewOnly,
   pixelsPerSecond,
   userPositions,
   onlineUsers,
   addToStack,
   activeId,
}) => {
   // console.log(onlineUsers);
   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: formation.id });
   const style = {
      transform: CSS.Translate.toString(transform),
      transition,
   };

   let idsOnThisFormation = Object.keys(userPositions).filter((id) => userPositions[id].selectedFormation === index);

   let colorsOnThisFormation = idsOnThisFormation.map((id) => onlineUsers[id][0].color);
   let firstNamesOnThisFormation = idsOnThisFormation.map((id) => onlineUsers[id][0].name).map((name) => name.split(" ")[0]);
   let listOfNames = ((list) => {
      if (!list.length) return null;
      if (list.length === 1) return list[0];
      if (list.length === 2) return `${list[0] & list[1]}`;
      return list.slice(0, -1).join(", ") + " & " + list[list.length - 1];
   })(firstNamesOnThisFormation);

   if (amSelected) {
      colorsOnThisFormation = [...colorsOnThisFormation, "#DB2777"];
   }

   return (
      <>
         <div
            ref={setNodeRef}
            className={`rounded-md  mx-[2px] box-border cursor-pointer bg-white  border-4 border-t-[12px] relative group `}
            style={{
               zIndex: activeId === formation.id ? 2 : 0,
               ...style,
               width: ((index === 0 ? 0 : formation.transition.durationSeconds) + formation.durationSeconds) * pixelsPerSecond - 4,
               borderColor: colorsOnThisFormation.length ? averageHex(colorsOnThisFormation) : "#18191B",
               // top: index === 5 ? 100 : null,
               // subtract 4 to account for the mx-[2px]
            }}
         >
            {listOfNames ? (
               <div
                  className="absolute h-5 right-[-4px] top-[-20px] z-10 w-fit px-2 text-xs text-white opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out pointer-events-none "
                  style={{ backgroundColor: colorsOnThisFormation.length ? averageHex(colorsOnThisFormation) : "black" }}
               >
                  <p>{listOfNames}</p>
               </div>
            ) : null}

            <div
               data-type="drag-handle"
               // onClick={() => {
               //    addToStack();
               // }}
               style={{
                  pointerEvents: viewOnly ? "none" : "auto",
               }}
               id={formation.id}
               {...attributes}
               {...listeners}
               className="w-full opacity-0 absolute top-[-12px] h-[12px]  cursor-move lg:pointer-events-auto pointer-events-none	z-[99999]"
            ></div>

            <div className=" absolute top-[-18px] -translate-x-1/2 left-1/2 h-[8px] select-none   cursor-move lg:pointer-events-auto pointer-events-none	z-[99999]">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className={`rotate-90 fill-white scale-90  pointer-events-none select-none`}
               >
                  <path fill="none" d="M0 0h24v24H0V0z" />
                  <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
               </svg>
               {/* <img className="rotate-90 scale-75 select-none pointer-events-none fill-white" src="/drag.svg" alt="" /> */}
            </div>

            <div
               data-type="formation-resize"
               id={formation.id}
               className="h-full absolute right-[-4px] lg:pointer-events-auto pointer-events-none w-[4px] cursor-col-resize	z-[99999]"
            ></div>

            <div className={`bg-white h-[17px]  px-2 overflow-clip border-b border-gray-300`}>
               <p className={`text-[12px] pointer-events-none select-none text-black font-medium`}>{formation.name}</p>
            </div>

            <div className={` flex flex-row  box-border`}>
               {index !== 0 ? (
                  <div
                     style={{
                        width: formation.transition.durationSeconds * pixelsPerSecond - 2,
                     }}
                     className="  "
                  >
                     <div className="flex flex-row  pointer-events-none h-[26px] mr-[5px]">
                        <svg className="w-1/2" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 10 20">
                           <polygon className="fill-gray-300" strokeWidth={0} points="0,0 0,20 10,10" />
                        </svg>
                        <svg className="w-1/2 " width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 10 20">
                           <polygon className="fill-gray-300" strokeWidth={0} points="0,10 10,0 10,20" />
                        </svg>
                     </div>
                  </div>
               ) : null}
               <div
                  style={{
                     width: formation.durationSeconds * pixelsPerSecond - 2,
                  }}
                  className="relative  h-[23px]"
               >
                  {index !== 0 ? (
                     <div
                        id={formation.id}
                        data-type="transition-resize"
                        className=" h-[26px]  w-[4px] lg:pointer-events-auto pointer-events-none cursor-col-resize	 absolute left-[-5px] z-50 flex flex-row justify-between"
                     >
                        <div className="h-full w-[1px] bg-black pointer-events-none"></div>
                        <div className="h-full w-[1px] bg-black pointer-events-none"></div>
                     </div>
                  ) : null}
               </div>
            </div>
         </div>
      </>
   );
};

function averageHex(colors) {
   if (colors.length === 1) {
      return colors[0];
   }
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
