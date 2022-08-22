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

export const Dancer = ({
   name,
   id,
   setDancers,
   dancers,
   selectedFormation,
   formations,
}: {
   name: string;
   id: string;
   position: { x: number | null; y: number | null };
   setDancers: Function;
   dancers: dancer[];
   selectedFormation: number | null;
   formations: formation[];
}) => {
   const [{ isDragging }, drag] = useDrag(
      () => ({
         type: "dancer",
         // canDrag: (monitor) => {
         //    return !isOnStage && selectedFormation !== null;
         // },
         item: { id, formations, selectedFormation },
         collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
         }),
      }),
      [id, formations, selectedFormation]
   );

   const removeDancer = () => {
      setDancers((dancers: dancer[]) => {
         return dancers.filter((dancer) => dancer.id !== id);
      });
   };

   let initials = name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

   let canBeAddedToStage =
      // there is a formation select
      selectedFormation !== null &&
      // and the dancer is not already on the stage
      !formations[selectedFormation]?.positions.find((dancer) => dancer.id === id);

   console.log(canBeAddedToStage);
   return (
      <>
         <div
            ref={drag}
            className={`flex flex-row items-center bg-slate-300 border-black border-2`}
            draggable={canBeAddedToStage}
            style={{
               opacity: canBeAddedToStage ? 1 : 0.7,
            }}
         >
            {id}
            <div className="w-12 h-12 bg-red-500 rounded-full flex flex-row justify-center items-center">
               <p className="pointer-events-none select-none">{initials}</p>
            </div>
            <input
               defaultValue={name}
               onChange={(e) => setDancers(dancers.map((dancer, index) => (dancer.id === id ? { ...dancer, name: e.target.value } : dancer)))}
            />
            <button className="ml-auto mr-4" onClick={removeDancer}>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                     fillRule="evenodd"
                     d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                     clipRule="evenodd"
                  />
               </svg>
            </button>
         </div>
      </>
   );
};
