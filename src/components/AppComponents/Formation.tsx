import { useEffect } from "react";
import { Resizable } from "react-resizable";
import { dancer, dancerPosition, formation } from "../../types/types";
import { PIXELS_PER_SECOND } from "../../types/types";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

export const Formation: React.FC<{
   formation: formation;
   amSelected: boolean;
   index: number;
   setFormations: Function;
   setSelectedFormation: Function;
}> = ({ formation, amSelected, index, setFormations, setSelectedFormation }) => {
   // const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: formation.id });

   // const style = {
   //    transform: CSS.Transform.toString(transform),
   //    transition,
   // };

   const onResizeFormation = (event: any, { size }: { size: any }) => {
      setFormations((formations: formation[]) => {
         return formations.map((formation, i) => {
            if (i === index) {
               return {
                  ...formation,
                  durationSeconds: size.width / PIXELS_PER_SECOND,
                  transition: {
                     durationSeconds: formation.transition.durationSeconds + (formation.durationSeconds - size.width / PIXELS_PER_SECOND),
                  },
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
               return { ...formation, transition: { ...formation.transition, durationSeconds: size.width / PIXELS_PER_SECOND } };
            }
            return formation;
         });
      });
   };

   return (
      <>
         <div
            className="rounded-md overflow-hidden h-[40px]  mx-[2px] box-border cursor-pointer  "
            // ref={setNodeRef}
            // {...attributes}
            // {...listeners}
            style={{
               // ...style,
               width: (formation.transition.durationSeconds + formation.durationSeconds) * PIXELS_PER_SECOND - 4,
               // subtract 4 to account for the mx-[2px]
            }}
         >
            <div className={`${amSelected ? " bg-pink-200" : "bg-pink-600"} h-[17px]  px-2 overflow-clip`}>
               <p className={`text-[12px] pointer-events-none select-none ${amSelected ? " text-pink-700" : "text-pink-100"}`}>{formation.name}</p>
            </div>
            <div className={` flex flex-row  box-border`}>
               <div
                  style={{
                     width: formation.durationSeconds * PIXELS_PER_SECOND - 2,
                  }}
                  className="relative bg-pink-600 h-[23px]"
               >
                  <Resizable
                     width={formation.durationSeconds * PIXELS_PER_SECOND}
                     height={100}
                     onResize={onResizeFormation}
                     resizeHandles={["e"]}
                     handle={<div data-no-dnd="true" className="bg-pink-200 h-full  w-[6px] cursor-ew-resize absolute right-[-5px] z-50 "></div>}
                     minConstraints={[0, 100]}
                  >
                     <span></span>
                  </Resizable>
               </div>

               <div
                  style={{
                     width: formation.transition.durationSeconds * PIXELS_PER_SECOND - 2,
                  }}
                  className=" relative bg-pink-600 h-[23px]"
               >
                  <Resizable
                     width={formation.transition.durationSeconds * PIXELS_PER_SECOND}
                     onResize={onResizeTransition}
                     resizeHandles={["e"]}
                     height={100}
                     handle={<div data-no-dnd="true" className="h-full bg-pink-200  absolute right-0  w-[6px] cursor-ew-resize"></div>}
                  >
                     <span></span>
                  </Resizable>

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
