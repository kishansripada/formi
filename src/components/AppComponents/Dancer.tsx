import { dancer, dancerPosition, formation } from "../../types/types";

export const Dancer: React.FC<{
   setDancers: Function;
   dancers: dancer[];
   selectedFormation: number | null;
   formations: formation[];
   dancer: dancer;
   setEditingDancer: Function;
   setFormations: Function;
   selectedDancers: string[];
}> = ({ setDancers, dancers, selectedFormation, formations, setEditingDancer, dancer, setFormations, selectedDancers }) => {
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
      .slice(0, 3)
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
               backgroundColor: amSelected ? "#e5e7eb" : "white",
            }}
            className={`flex flex-row items-center px-3  select-none  mb-1 min-h-[55px] bg-white`}
         >
            <>
               <div
                  style={{
                     transform: "translate(0, 0)",
                     backgroundColor: color || "#db2777",
                  }}
                  className={`min-w-[48px] min-h-[48px] ml-2 rounded-full grid place-items-center cursor-pointer pointer-events-none select-none`}
               >
                  {instagramUsername ? (
                     <div className="w-[41px] h-[41px] bg-white rounded-full grid place-items-center">
                        <img referrerPolicy="no-referrer" className="w-[41px] h-[41px] rounded-full " src={instagramUsername} alt="" />
                     </div>
                  ) : (
                     <div className="bg-white rounded-full w-[41px] h-[41px] grid place-items-center text-gray-700" data-type={"newDancer"}>
                        <p className="font-semibold">{initials}</p>
                     </div>
                  )}
               </div>
            </>

            <input
               className="h-6 w-full  px-3 py-4 transition duration-300  rounded-md font-[500] ml-3 hover:bg-gray-100 text-gray-800 focus:bg-gray-100 outline-none cursor-pointer"
               defaultValue={name}
               key={name}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     setDancers(dancers.map((dancer) => (dancer.id === id ? { ...dancer, name: e.target.value } : dancer)));
                  }
               }}
               onBlur={(e) => {
                  if (e.target.value === dancers.find((dancer) => dancer.id === id)?.name) return;
                  setDancers(dancers.map((dancer) => (dancer.id === id ? { ...dancer, name: e.target.value } : dancer)));
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

            <button className="ml-auto mr-3" onClick={() => setEditingDancer(id)}>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
               </svg>
            </button>
         </div>
         {/* <hr /> */}
      </>
   );
};
