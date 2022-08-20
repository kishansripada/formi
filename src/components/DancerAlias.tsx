import { useDrag } from "react-dnd";

export interface DancerAliasProps {
   name: string;
   id: string;
   left: number;
   top: number;
   setDancers: Function;
   selectedFormation: number | null;
}

export const DancerAlias: React.FC<DancerAliasProps> = ({ name, id, left, top, setDancers, selectedFormation }) => {
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
            className={`w-8 h-8 bg-red-500 rounded-full flex flex-row justify-center items-center absolute z-[9999] mr-auto ml-auto ${
               selectedFormation === null ? "pointer-events-none" : ""
            }`}
            style={{
               transform: "translate(-50%, -50%)",
               left: left,
               top: top,
               opacity: isDragging ? 0 : 1,
            }}
         >
            <p className="">{initials}</p>
         </div>
      </>
   );
};
