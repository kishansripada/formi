import { useDrag } from "react-dnd";
export const DancerAlias = ({ name, position }: { name: string; position: { x: number | null; y: number | null } }) => {
   const [{ isDragging }, drag] = useDrag(() => ({
      type: "dancerAlias",
      collect: (monitor) => ({
         isDragging: !!monitor.isDragging(),
      }),
   }));

   let initials = name
      .split(" ")
      .map((word) => word[0])
      .join("");

   return (
      <>
         <div
            ref={drag}
            className="w-8 h-8 bg-red-500 rounded-full flex flex-row justify-center items-center absolute z-10 mr-auto ml-auto"
            style={{
               left: 400 - 16 + (800 / 20) * position.x,
               top: 400 - 16 - (800 / 20) * position.y,

               opacity: isDragging ? 0 : 1,
            }}
         >
            <p className="pointer-events-none select-none">{initials}</p>
         </div>
      </>
   );
};
