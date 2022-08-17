import { useDrop } from "react-dnd";

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

export const SidebarDrop: React.FC<{ setDancers: Function }> = ({ setDancers }) => {
   const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: "dancerAlias",
      drop: (item: DragItem, monitor) => {
         setDancers((dancers: dancer[]) => {
            return dancers.map((dancer) => {
               if (dancer.id == parseInt(item.id)) {
                  return { ...dancer, isOnStage: false };
               }
               return dancer;
            });
         });
      },
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
         canDrop: monitor.canDrop(),
      }),
   }));

   return (
      <>
         <div
            className="grow"
            style={{
               backgroundColor: canDrop ? "red" : "transparent",
            }}
            ref={drop}
         >
            <p>{isOver ? "remove from scene" : ""}</p>
         </div>
      </>
   );
};
