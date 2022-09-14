import { useDrag } from "react-dnd";
import { dancer, dancerPosition, formation } from "../../types/types";

export const Dancer = ({
   name,
   id,
   setDancers,
   dancers,
   selectedFormation,
   formations,
   setFormations,
   instagramUsername,
   isPlaying,
   removeDancer,
   setEditingDancer,
}: {
   name: string;
   id: string;
   setDancers: Function;
   dancers: dancer[];
   selectedFormation: number | null;
   formations: formation[];
   setFormations: Function;
   instagramUsername: string | null;
   isPlaying: boolean;
   removeDancer: Function;
   setEditingDancer: Function;
}) => {
   let canBeAddedToStage =
      // there is a formation select
      selectedFormation !== null &&
      // and the dancer is not already on the stage
      !formations[selectedFormation]?.positions.find((dancer) => dancer.id === id);

   const [{ isDragging }, drag] = useDrag(
      () => ({
         type: "dancer",
         canDrag: (monitor) => {
            return canBeAddedToStage && !isPlaying;
         },
         item: { id, formations, selectedFormation },
         collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
         }),
      }),
      [id, formations, selectedFormation]
   );

   let initials = name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

   // console.log(canBeAddedToStage);
   return (
      <>
         <div ref={drag} className={`flex flex-row items-center  border-black  rounded-xl mb-1 min-h-[64px] bg-white`} draggable={!isPlaying}>
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
                        <p className="">{initials}</p>
                     </div>
                  )}
               </div>
            </>

            <input
               className="ml-2 px-2 py-1 rounded-md focus:outline-gray-500 w-full mr-3"
               defaultValue={name}
               key={name}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     setDancers(dancers.map((dancer) => (dancer.id === id ? { ...dancer, name: e.target.value } : dancer)));
                  }
               }}
               onBlur={(e) => setDancers(dancers.map((dancer) => (dancer.id === id ? { ...dancer, name: e.target.value } : dancer)))}
            />
            {/* 
            <button className="ml-auto mr-4" onClick={() => removeDancer(id)}>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                     fillRule="evenodd"
                     d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                     clipRule="evenodd"
                  />
               </svg>
            </button> */}

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
