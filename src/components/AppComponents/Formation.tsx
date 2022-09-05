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
   const onResizeFormation = (event, { element, size, handle }) => {
      setFormations((formations: formation[]) => {
         return formations.map((formation, i) => {
            if (i === index) {
               return { ...formation, durationSeconds: size.width / 10 };
            }
            return formation;
         });
      });
   };
   const onResizeTransition = (event: any, { size }: { size: any }) => {
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
         <div className={`  h-full flex flex-row  rounded-xl  border-black ${amSelected ? "border-[3px]" : "border-[1px]"} overflow-hidden`}>
            <div
               style={{
                  width: formation.durationSeconds * 10,
               }}
               className="relative"
            >
               <Resizable
                  width={formation.durationSeconds * 10}
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
                  handle={<div className="bg-gray-500 absolute right-0 h-16 w-1 cursor-e-resize"></div>}
               >
                  <span></span>
               </Resizable>
               <div className="flex flex-row h-full">
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
