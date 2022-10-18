import { dancer, dancerPosition, formation, coordsToPosition } from "../../types/types";

export const DancerAliasShadow: React.FC<{
   dancer: dancer;
   selectedFormation: number | null;
   formations: formation[];
   isPlaying: boolean;
   currentFormationIndex: number | null;
}> = ({ dancer, formations, selectedFormation, isPlaying, currentFormationIndex }) => {
   let initials = dancer.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

   let currentCoords;
   if (isPlaying) return;
   if (selectedFormation === null) return;
   currentCoords = formations[selectedFormation - 1]?.positions.find((dancerx: dancerPosition) => dancerx.id === dancer.id)?.position;

   if (!currentCoords) return;
   let { left, top } = coordsToPosition(currentCoords.x, currentCoords.y);

   return (
      <>
         <div
            style={{ left, top, transform: "translate(-50%, -50%)" }}
            id={dancer.id}
            className={`w-[38px] h-[38px] opacity-30 pointer-events-none  rounded-full flex flex-row justify-center items-center absolute z-[20] mr-auto ml-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 `}
         >
            {dancer.instagramUsername ? (
               <img
                  id={dancer.id}
                  draggable={false}
                  className="w-[34px] h-[34px] rounded-full select-none   "
                  src={dancer.instagramUsername}
                  alt=""
               />
            ) : (
               <div id={dancer.id} className="bg-white rounded-full  w-[34px] h-[34px] grid place-items-center select-none">
                  <p id={dancer.id} className="select-none ">
                     {initials}
                  </p>
               </div>
            )}
         </div>
      </>
   );
};
