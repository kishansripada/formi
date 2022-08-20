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
   isOnStage?: boolean;
   position: { x: number | null; y: number | null };
};

export const SidebarDrop: React.FC<{ setDancers: Function }> = ({ setDancers }) => {
   const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: "dancerAlias",
      drop: (item: DragItem, monitor) => {
         setDancers((dancers: dancer[]) => {
            return dancers.map((dancer) => {
               if (dancer.id === item.id) {
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

   return canDrop ? (
      <>
         <div
            className="h-full opacity-30 absolute z-10 w-full  flex flex-row justify-center items-center"
            style={{
               background: "rgba(255, 0, 0, 0.5)",
            }}
            ref={drop}
         >
            <p>{isOver ? "remove from scene" : ""}</p>
         </div>
      </>
   ) : null;
};
