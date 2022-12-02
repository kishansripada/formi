import { dancer, dancerPosition, formation } from "../../types/types";

export const Dancer: React.FC<{
   setDancers: Function;
   dancers: dancer[];
   selectedFormation: number | null;
   formations: formation[];
   dancer: dancer;
   setEditingDancer: Function;
}> = ({ setDancers, dancers, selectedFormation, formations, setEditingDancer, dancer }) => {
   let { name, id, instagramUsername, color } = dancer;
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

   // const addDancerToStage = () => {
   //    setFormations((formations: formation[]) => {
   //       return formations.map((formation, i) => {
   //          if (i === selectedFormation) {
   //             return {
   //                ...formation,
   //                positions: [
   //                   ...formation.positions,
   //                   {
   //                      id: id,
   //                      position: {
   //                         x: 0,
   //                         y: 6,
   //                      },
   //                      exitStrategy: "closest",
   //                      enterStrategy: "closest",
   //                      transitionType: "linear",
   //                      controlPointStart: { x: -6, y: 1 },
   //                      controlPointEnd: { x: 6, y: 1 },
   //                   },
   //                ],
   //             };
   //          }
   //          return formation;
   //       });
   //    });
   // };

   return (
      <>
         <div className={`flex flex-row items-center px-3    mb-1 min-h-[55px] bg-white`} data-type={"newDancer"}>
            <>
               <div
                  style={{
                     transform: "translate(0, 0)",
                     backgroundColor: color || "",
                  }}
                  className={`min-w-[48px] min-h-[48px] ml-2 rounded-full grid place-items-center cursor-pointer pointer-events-none select-none ${
                     !color || color === "#FFFFFF" ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" : ""
                  }  `}
               >
                  {instagramUsername ? (
                     <div className="w-[41px] h-[41px] bg-white rounded-full grid place-items-center">
                        <img className="w-[41px] h-[41px] rounded-full " src={instagramUsername} alt="" />
                     </div>
                  ) : (
                     <div className="bg-white rounded-full w-[41px] h-[41px] grid place-items-center text-gray-700" data-type={"newDancer"}>
                        <p className="font-semibold">{initials}</p>
                     </div>
                  )}
               </div>
            </>

            <input
               className="h-6  px-3 py-4 transition duration-300  rounded-md  ml-3 hover:bg-gray-100 text-gray-500 focus:bg-gray-100 outline-none cursor-pointer"
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
            {/* {canBeAddedToStage ? (
               <button onClick={addDancerToStage}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
               </button>
            ) : (
               <></>
            )} */}

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
         <hr />
      </>
   );
};
