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
   const onResizeTransition = (event, { element, size, handle }) => {
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
            className={`  h-full flex flex-row  rounded-xl  box-border  border-black ${amSelected ? "border-[3px]" : "border-[1px]"} overflow-hidden`}
         >
            <div
               style={{
                  width: formation.durationSeconds * 10,
               }}
            >
               <Resizable
                  className="flex flex-row justify-between w-full items-center"
                  width={formation.durationSeconds * 10}
                  onResize={onResizeFormation}
                  resizeHandles={["e"]}
                  handle={<div className="bg-gray-500 ml-auto h-16 w-1 cursor-e-resize"></div>}
               >
                  <span></span>
               </Resizable>
            </div>

            <div
               style={{
                  width: formation.transition.durationSeconds * 10,
               }}
            >
               <Resizable
                  className="flex flex-row justify-between w-full items-center"
                  width={formation.transition.durationSeconds * 10}
                  onResize={onResizeTransition}
                  resizeHandles={["e"]}
                  handle={<div className="bg-gray-500 ml-auto h-16 w-1 cursor-e-resize"></div>}
               >
                  <span></span>
               </Resizable>
            </div>
         </div>
      </>
   );
};