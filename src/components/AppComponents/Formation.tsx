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
         <div className={`${amSelected ? "border-[2px]" : "border-[1px]"} border-black  flex flex-row  rounded-md overflow-hidden z-50 h-[35px]`}>
            <div
               style={{
                  width: formation.durationSeconds * 10 - (amSelected ? 4 : 2),
               }}
               className="relative z-0"
            >
               <Resizable
                  width={formation.durationSeconds * 10}
                  // height={100}
                  onResize={onResizeFormation}
                  resizeHandles={["e"]}
                  handle={<div className="bg-gray-500  h-16 w-1 cursor-e-resize absolute right-0"></div>}
               >
                  <span></span>
               </Resizable>
            </div>

            <div
               style={{
                  width: formation.transition.durationSeconds * 10,
               }}
               className=" relative"
            >
               <Resizable
                  width={formation.transition.durationSeconds * 10}
                  onResize={onResizeTransition}
                  resizeHandles={["e"]}
                  // height={"100%"}
                  handle={<div className="bg-gray-500 absolute right-0 h-16 w-1 cursor-e-resize"></div>}
               >
                  <span></span>
               </Resizable>
               <div className="flex flex-row h-full -z-50">
                  <svg className="w-1/2" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 10 20">
                     <polygon fill="lightgray" strokeWidth={0} points="0,0 0,20 10,10" />
                  </svg>
                  <svg className="w-1/2 mr-1" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 10 20">
                     <polygon fill="lightgray" strokeWidth={0} points="0,10 10,0 10,20" />
                  </svg>
               </div>
            </div>
         </div>
      </>
   );
};
