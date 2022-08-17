import { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";

export const Grid: React.FC<{ children: React.ReactNode; setDancers: Function }> = ({ children, setDancers }) => {
   let [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
   const [{ isOver }, drop] = useDrop(() => ({
      accept: "dancerAlias",
      drop: () => console.log("drop"),
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
      }),
   }));

   const mouseMove = (e: React.MouseEvent) => {
      var rect = document.getElementById("grid").getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      setMousePosition({ x, y });
   };

   const ref = useRef(null);
   const [zoom, setZoom] = useState(1);
   useEffect(() => {
      //   const handleWheel = (event) => {
      //      event.preventDefault();
      //      setZoom((zoom) => Math.max(Math.min(zoom - event.deltaY / 800, 3), 1));
      //   };
      //   const element = drop.current;
      //   element.addEventListener("wheel", handleWheel);
      //   return () => {
      //      element.removeEventListener("wheel", handleWheel);
      //   };
   }, []);

   return (
      <>
         <div
            className="min-w-[850px] h-[800px] grid gap-0 place-items-center relative"
            style={{
               gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
            }}
            ref={drop}
         >
            {children}
            {new Array(306).fill(0).map((_, i) => (
               <div className="w-12 h-12 relative">
                  <div
                     className="w-full h-[1px] bg-gray-300 absolute"
                     style={{
                        top: "50%",
                        transform: "translate(0, -50%)",
                     }}
                  ></div>
                  <div
                     className="w-[1px] h-full bg-gray-300 absolute "
                     style={{
                        left: "50%",
                        transform: "translate(-50%, 0)",
                     }}
                  ></div>
               </div>
            ))}
         </div>

         {/* <div
            className="flex flex-row justify-center relative w-[800px] h-[800px]  overflow-hidden border-2 border-black"
            id="grid"
            ref={drop}
            onMouseMove={mouseMove}
         >
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
         </div> */}
      </>
   );
};
