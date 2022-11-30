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
            className="rounded-md overflow-hidden h-[40px]  mx-[2px] box-border cursor-pointer relative z-[99999]  "
            style={{
               width: (formation.transition.durationSeconds + formation.durationSeconds) * pixelsPerSecond - 4,
               // top: index === 5 ? 100 : null,
               // subtract 4 to account for the mx-[2px]
            }}
         >
            <div className={`${amSelected ? " bg-pink-200" : "bg-pink-700"} h-[17px]  px-2 overflow-clip`}>
               <p className={`text-[12px] pointer-events-none select-none ${amSelected ? " text-pink-700" : "text-pink-100"}`}>{formation.name}</p>
            </div>
            <div className={` flex flex-row  box-border`}>
               <div
                  style={{
                     width: formation.durationSeconds * pixelsPerSecond - 2,
                  }}
                  className="relative bg-pink-700 h-[23px]"
               >
                  <div
                     id={index.toString()}
                     data-type="transition-resize"
                     className="bg-pink-200 h-full  w-[6px] cursor-col-resize	 absolute right-[-5px] z-50 "
                  ></div>
               </div>

               <div
                  style={{
                     width: formation.transition.durationSeconds * pixelsPerSecond - 2,
                  }}
                  className=" relative bg-pink-700 h-[23px]"
               >
                  <div
                     data-type="formation-resize"
                     id={index.toString()}
                     className="h-full bg-pink-200  absolute right-0  w-[6px] cursor-col-resize	"
                  ></div>

                  <div className="flex flex-row h-full  pointer-events-none mr-[2px] ml-[5px]">
                     <svg className="w-1/2" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 10 20">
                        <polygon className="fill-pink-200" strokeWidth={0} points="0,0 0,20 10,10" />
                     </svg>
                     <svg className="w-1/2 mr-1" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 10 20">
                        <polygon className="fill-pink-200" strokeWidth={0} points="0,10 10,0 10,20" />
                     </svg>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};
