import { useDrag } from "react-dnd";

export interface DancerAliasProps {
   name: string;
   id: number;
   left: number;
   top: number;
   setDancers: Function;
}

export const DancerAlias: React.FC<DancerAliasProps> = ({ name, id, left, top, setDancers }) => {
   const [{ isDragging }, drag] = useDrag(
      () => ({
         type: "dancerAlias",
         item: { id, left, top },
         collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
         }),
      }),
      [id, left, top]
   );

   let initials = name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();
   return (
      <>
         <div
            ref={drag}
            className="w-8 h-8 bg-red-500 rounded-full flex flex-row justify-center items-center absolute z-10 mr-auto ml-auto"
            style={{
               transform: "translate(-50%, -50%)",
               left: left,
               top: top,
               opacity: isDragging ? 0 : 1,
            }}
         >
            <p className="pointer-events-none select-none">{initials}</p>
         </div>
      </>
   );
};
