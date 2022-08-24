import { useEffect } from "react";
// import { Resizable } from "re-resizable";
// import { ResizableBox } from "react-resizable";
import { Resizable } from "react-resizable";

import { dancer, dancerPosition, formation } from "../types/types";

export const Formation: React.FC<{
   formation: formation;
   amSelected: boolean;
   index: number;
   setFormations: Function;
   setSelectedFormation: Function;
   deleteFormation: Function;
}> = ({ formation, amSelected, index, setFormations, setSelectedFormation, deleteFormation }) => {
   const onResizeFormation = (event, { element, size, handle }) => {
      // this.setState({width: size.width, height: size.height});
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
               className="bg-blue-200 relative"
            >
               <Resizable
                  width={formation.transition.durationSeconds * 10}
                  onResize={onResizeTransition}
                  resizeHandles={["e"]}
                  handle={<div className="bg-gray-500 absolute right-0 h-16 w-1 cursor-e-resize"></div>}
               >
                  <span></span>
               </Resizable>
            </div>
         </div>
      </>
   );
};
