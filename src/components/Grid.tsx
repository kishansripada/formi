import { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import type { XYCoord } from "react-dnd";

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

export const Grid: React.FC<{ children: React.ReactNode; setDancers: Function; dancers: dancer[] }> = ({ children, setDancers, dancers }) => {
   const [{ isOver }, drop] = useDrop(() => ({
      accept: ["dancerAlias", "dancer"],
      drop: (item: DragItem, monitor) => {
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
         if (
            dancers.find((dancer) => {
               return dancer.position.x === positionToCoords(left, top).x && positionToCoords(left, top).y === dancer.position.y;
            })
         ) {
            return;
         }

         setDancers((dancers: dancer[]) => {
            return dancers.map((dancer) => {
               if (dancer.id === parseInt(item.id)) {
                  return { ...dancer, position: { x: positionToCoords(left, top).x, y: positionToCoords(left, top).y } };
               }
               return dancer;
            });
         });
      },
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
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
         <div className="flex flex-row justify-center relative w-[800px] h-[800px] overflow-hidden border-2 border-black" id="grid" ref={drop}>
            <div
               className="h-[800px] w-[800px] absolute"
               style={{
                  transform: `scale(${zoom})`,
                  left: 0,
               }}
            >
               {children}

               <div className="flex flex-row h-full justify-between">
                  {new Array(21).fill(0).map((_, i) => (
                     <div
                        key={i}
                        className="h-full bg-gray-300"
                        style={{
                           width: i % 5 == 0 ? (1 / zoom) * 2.5 : 1 / zoom,
                           backgroundColor: i === 10 ? "black" : "",
                           zIndex: i === 10 ? 1 : 0,
                        }}
                     ></div>
                  ))}
               </div>

               <div className="flex flex-col h-[800px] justify-between relative top-[-800px]">
                  {new Array(21).fill(0).map((_, i) => (
                     <div
                        key={i}
                        className=" w-full bg-gray-300"
                        style={{
                           height: i % 5 === 0 ? (1 / zoom) * 2.5 : 1 / zoom,
                           backgroundColor: i === 10 ? "black" : "rgb(209 213 219)",
                           zIndex: i === 10 ? 1 : 0,
                        }}
                     ></div>
                  ))}
               </div>
            </div>
         </div>
      </>
   );
};

const positionToCoords = (left: number, top: number) => {
   return { x: Math.round((left - 400) / 40), y: Math.round((-1 * (top - 400)) / 40) + 0 };
};
