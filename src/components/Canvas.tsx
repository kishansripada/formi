import { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import type { XYCoord } from "react-dnd";
import { GridLines } from "../components/GridLines";

export interface DragItem {
   type: string;
   id: string;
   top: number;
   left: number;
}

type dancer = {
   name: string;
   id: number;
   isOnStage: boolean;
   position: { x: number | null; y: number | null };
};

export const Canvas: React.FC<{ children: React.ReactNode; setDancers: Function; dancers: dancer[] }> = ({ children, setDancers, dancers }) => {
   const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: ["dancerAlias", "dancer"],
      drop: (item: DragItem, monitor) => {
         if (item.left && item.top) {
            const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
            const left = Math.round(item.left + delta.x);
            const top = Math.round(item.top + delta.y);

            console.log(dancers);
            //  console.log(
            //     dancers.find((dancer) => {
            //        console.log(dancer.position.x, dancer.position.y);
            //        return dancer.position.x === positionToCoords(left, top).x && positionToCoords(left, top).y === dancer.position.y;
            //     })
            //  );
            //  if (
            //     dancers.find((dancer) => {
            //        return dancer.position.x === positionToCoords(left, top).x && positionToCoords(left, top).y === dancer.position.y;
            //     })
            //  ) {
            //     return;
            //  }

            setDancers((dancers: dancer[]) => {
               return dancers.map((dancer) => {
                  if (dancer.id === parseInt(item.id)) {
                     return { ...dancer, position: { x: positionToCoords(left, top).x, y: positionToCoords(left, top).y } };
                  }
                  return dancer;
               });
            });
         } else {
            console.log("new dancer");
            setDancers((dancers: dancer[]) => {
               return dancers.map((dancer) => {
                  if (dancer.id === parseInt(item.id)) {
                     return { ...dancer, position: { x: 0, y: 0 }, isOnStage: true };
                  }
                  return dancer;
               });
            });
         }
      },
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
         canDrop: monitor.canDrop(),
      }),
   }));

   const ref = useRef(null);
   const [zoom, setZoom] = useState(1);
   useEffect(() => {
      //   const handleWheel = (event) => {
      //      event.preventDefault();
      //      setZoom((zoom) => Math.max(Math.min(zoom - event.deltaY / 800, 3), 1));
      //   };
      //   const element = ref.current;
      //   element.addEventListener("wheel", handleWheel);
      //   return () => {
      //      element.removeEventListener("wheel", handleWheel);
      //   };
   }, []);

   return (
      <>
         <div className="flex flex-row justify-center items-center relative w-[800px]   overflow-hidden  border-2 border-black" id="grid" ref={drop}>
            <div className="h-[800px] w-[800px] absolute">
               <GridOverlay />
               {children}
               <GridLines />
            </div>
         </div>
      </>
   );
};

const positionToCoords = (left: number, top: number) => {
   return { x: Math.round((left - 400) / 40), y: Math.round((-1 * (top - 400)) / 40) + 0 };
};

// overlay when moving a dancer on the stage for the first time
export const GridOverlay: React.FC<{}> = ({}) => {
   const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: ["dancer"],
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
         canDrop: monitor.canDrop(),
      }),
   }));

   return canDrop ? (
      <div className=" w-[800px] h-[800px] bg-red-200 opacity-30 flex flex-row justify-center items-center absolute z-20" ref={drop}>
         add to scene
      </div>
   ) : (
      <div></div>
   );
};
