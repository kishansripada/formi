import { useEffect } from "react";
import { Resizable } from "react-resizable";
import { dancer, dancerPosition, formation } from "../../types/types";

export const Formation: React.FC<{
   formation: formation;
   amSelected: boolean;
   index: number;
   setFormations: Function;
   setSelectedFormation: Function;
}> = ({ formation, amSelected, index, setFormations, setSelectedFormation }) => {
   const onResizeFormation = (event: any, { size }: { size: any }) => {
      setFormations((formations: formation[]) => {
         return formations.map((formation, i) => {
            if (i === index) {
               return {
                  ...formation,
                  durationSeconds: size.width / 10,
                  transition: { durationSeconds: formation.transition.durationSeconds + (formation.durationSeconds - size.width / 10) },
               };
            }
            return formation;
         });
      });
   };
   const onResizeTransition = (event: any, { size }: { size: any }) => {
      // change the width of just the formation based on the transition
      // this.setState({width: size.width, height: size.height});
      setFormations((formations: formation[]) => {
         return formations.map((formation, i) => {
            if (i === index) {
               return { ...formation, transition: { ...formation.transition, durationSeconds: size.width / 10 } };
            }
            return formation;
         });
      });
   };

   return (
      <>
         <div
            className="rounded-md overflow-hidden h-[50px]  mx-[2px] box-border "
            style={{
               width: formation.transition.durationSeconds * 10 + formation.durationSeconds * 10 - 4,
               // subtract 4 to account for the mx-[2px]
            }}
         >
            <div className={`${amSelected ? " bg-pink-200" : "bg-pink-600"} h-[17px]  px-2 overflow-clip`}>
               <p className={`text-[12px] pointer-events-none select-none ${amSelected ? " text-pink-700" : "text-pink-100"}`}>{formation.name}</p>
            </div>
            <div className={` flex flex-row  box-border`}>
               <div
                  style={{
                     width: formation.durationSeconds * 10 - 2,
                  }}
                  className="relative bg-pink-600 h-[33px]"
               >
                  <Resizable
                     width={formation.durationSeconds * 10}
                     height={100}
                     onResize={onResizeFormation}
                     resizeHandles={["e"]}
                     handle={<div className="bg-pink-200 h-full  w-[6px] cursor-ew-resize absolute right-0 "></div>}
                  >
                     <span></span>
                  </Resizable>
               </div>

               <div
                  style={{
                     width: formation.transition.durationSeconds * 10 - 2,
                  }}
                  className=" relative bg-pink-600 h-[33px]"
               >
                  <Resizable
                     width={formation.transition.durationSeconds * 10}
                     onResize={onResizeTransition}
                     resizeHandles={["e"]}
                     height={100}
                     handle={<div className="h-full bg-pink-200  absolute right-0  w-[6px] cursor-ew-resize"></div>}
                  >
                     <span></span>
                  </Resizable>

                  <div className="flex flex-row h-full  pointer-events-none mr-[2px]">
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
