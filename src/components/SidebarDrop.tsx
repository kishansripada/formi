import { useDrop } from "react-dnd";

export interface DragItem {
   type: string;
   id: string;
   top: number;
   left: number;
}

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

export const SidebarDrop: React.FC<{ setFormations: Function }> = ({ setFormations }) => {
   const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: "dancerAlias",
      drop: (item: DragItem, monitor) => {
         console.log("dropped on sidebar");
         console.log(setFormations);
         setFormations((formations: formation[]) => {
            return formations.map((formation: formation, index: number) => {
               if (index === item.selectedFormation) {
                  return {
                     ...formations,
                     positions: formation.positions.filter((dancer) => dancer.id !== item.id),
                  };
               }
               return formation;
            });
         });
      },
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
         canDrop: monitor.canDrop(),
      }),
   }));

   return canDrop ? (
      <>
         <div
            className="h-full opacity-70 absolute z-10 w-full  flex flex-row justify-center items-center bg-red-500/40  ring-black rounded ring-2"
            ref={drop}
         >
            <p>{isOver ? "remove from scene" : ""}</p>
         </div>
      </>
   ) : null;
};
