import { dancer, dancerPosition, formation } from "../../types/types";

export const Dancer: React.FC<{
   setDancers: Function;
   dancers: dancer[];
   selectedFormation: number | null;
   formations: formation[];
   dancer: dancer;

   setFormations: Function;
   selectedDancers: string[];
   index: number;
   setSelectedDancers: Function;
   pushChange: Function;
}> = ({
   setDancers,
   dancers,
   selectedFormation,
   formations,

   dancer,
   setFormations,
   selectedDancers,
   index,
   setSelectedDancers,
   pushChange,
}) => {
   let { name, id, instagramUsername, color } = dancer;

   let amSelected = selectedDancers.includes(id);

   let canBeAddedToStage =
      // there is a formation select
      selectedFormation !== null &&
      // and the dancer is not already on the stage
      !formations[selectedFormation]?.positions.find((dancer) => dancer.id === id);

   let initials = name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

   const addDancerToStage = () => {
      setFormations((formations: formation[]) => {
         return formations.map((formation, i) => {
            if (i === selectedFormation) {
               return {
                  ...formation,
                  positions: [
                     ...formation.positions,
                     {
                        id: id,
                        position: {
                           x: 0,
                           y: 6,
                        },
                        transitionType: "linear",
                     },
                  ],
               };
            }
            return formation;
         });
      });
   };

   return (
      <>
         <div
            style={{
               backgroundColor: amSelected ? "#fbcfe8" : "transparent",
            }}
            onClick={() => {
               setSelectedDancers([id]);
            }}
            className={`flex flex-row items-center px-5 box-border   group  select-none border border-white hover:border-pink-600   min-h-[40px] bg-white`}
         >
            <p className="font-semibold   text-sm "> {index + 1}</p>
            <input
               style={{
                  backgroundColor: amSelected ? "#fbcfe8" : "transparent",
               }}
               className="h-6 w-full    px-2 py-4  text-sm rounded-md  ml-2  text-neutral-800  outline-none cursor-default"
               value={name}
               onBlur={pushChange}
               onChange={(e) => {
                  setDancers((dancers: dancer[]) => {
                     return dancers.map((dancer) => (dancer.id === id ? { ...dancer, name: e.target.value } : dancer));
                  });
               }}
            />
            {canBeAddedToStage ? (
               <button onClick={addDancerToStage}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
               </button>
            ) : (
               <></>
            )}
         </div>
      </>
   );
};
