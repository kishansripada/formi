import { dancer, dancerPosition, formation } from "../../types/types";

export const Dancer: React.FC<{
   name: string;
   id: string;
   setDancers: Function;
   dancers: dancer[];
   selectedFormation: number | null;
   formations: formation[];
   instagramUsername: string | null;
   isPlaying: boolean;
   setEditingDancer: Function;
   setFormations: Function;
}> = ({ name, id, setDancers, dancers, selectedFormation, formations, instagramUsername, isPlaying, setEditingDancer, setFormations }) => {
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

   return (
      <>
         <div className={`flex flex-row items-center  border-black  rounded-xl mb-1 min-h-[64px] bg-white`}>
            <>
               <div
                  className={`min-w-[56px] min-h-[56px] ml-2 rounded-full grid place-items-center ${
                     canBeAddedToStage && !isPlaying ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" : "bg-black"
                  } `}
               >
                  {instagramUsername ? (
                     <div className="w-[51px] h-[51px] bg-white rounded-full grid place-items-center">
                        <img className="w-[48px]  h-[48px] rounded-full " src={instagramUsername} alt="" />
                     </div>
                  ) : (
                     <div className="bg-white rounded-full w-12 h-12 grid place-items-center">
                        <p className="font-bold">{initials}</p>
                     </div>
                  )}
               </div>
            </>

            <input
               className="ml-2 px-2 py-1 rounded-md focus:outline-pink-500 w-full mr-3"
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
               <button
                  onClick={() => {
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
                                       exitStrategy: "closest",
                                       enterStrategy: "closest",
                                       transitionType: "linear",
                                       controlPointStart: { x: -6, y: 1 },
                                       controlPointEnd: { x: 6, y: 1 },
                                    },
                                 ],
                              };
                           }
                           return formation;
                        });
                     });
                  }}
               >
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
      </>
   );
};
