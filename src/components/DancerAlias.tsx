import { useDrag } from "react-dnd";
type dancer = {
   name?: string;
   id: string;
   position: { x: number | null; y: number | null };
};

type formation = {
   durationSeconds: number;
   positions: dancer[];
   transition: {
      durationSeconds: number;
   };
};

export interface DancerAliasProps {
   name: string;
   id: string;
   setDancers: Function;
   selectedFormation: number | null;
   formations: formation[];
}

export const DancerAlias: React.FC<DancerAliasProps> = ({ name, id, formations, setDancers, selectedFormation }) => {
   let currentCoords = formations[selectedFormation]?.positions.find((dancer: dancer) => dancer.id === id)?.position;

   let { left, top } = selectedFormation !== null && currentCoords ? coordsToPosition(currentCoords.x, currentCoords.y) : { left: 800, top: 400 };

   const [{ isDragging }, drag] = useDrag(
      () => ({
         type: "dancerAlias",
         item: { id, left, top, formations, selectedFormation },
         collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
         }),
      }),
      [id, left, top, formations, selectedFormation]
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

const coordsToPosition = (x: number, y: number) => {
   return { left: 400 + 40 * x, top: 400 + 40 * -y };
};
