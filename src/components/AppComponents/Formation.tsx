import { dancer, dancerPosition, formation } from "../../types/types";

export const Formation: React.FC<{
   formation: formation;
   amSelected: boolean;
   index: number;
   setFormations: Function;
   setSelectedFormation: Function;
   viewOnly: boolean;
   pixelsPerSecond: number;
}> = ({ formation, amSelected, index, setFormations, setSelectedFormation, viewOnly, pixelsPerSecond }) => {
   return (
      <>
         <div
            className={`rounded-md  h-[50px]  mx-[2px] box-border cursor-pointer z-auto  ${
               amSelected ? "border-pink-600" : "border-gray-700"
            } border-4 relative  `}
            style={{
               width: (formation.transition.durationSeconds + formation.durationSeconds) * pixelsPerSecond - 4,
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
