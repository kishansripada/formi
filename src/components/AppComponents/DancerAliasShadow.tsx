import { dancer, dancerPosition, formation } from "../../types/types";

export const DancerAliasShadow: React.FC<{
   dancer: dancer;
   selectedFormation: number | null;
   formations: formation[];
   isPlaying: boolean;
   currentFormationIndex: number | null;
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
}> = ({ dancer, formations, selectedFormation, isPlaying, currentFormationIndex, coordsToPosition }) => {
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
   let { left, top } = coordsToPosition(currentCoords);

   return (
      <>
         <div
            style={{
               left,
               top,
               backgroundColor: dancer.color || "#db2777",
            }}
            id={dancer.id}
            data-type={"dancer"}
            className={`rounded-full -translate-y-1/2 -translate-x-1/2	 flex pointer-events-none  flex-row justify-center opacity-30 items-center absolute z-[30] mr-auto ml-auto cursor-default  w-[38px] h-[38px]`}
         >
            {dancer.instagramUsername ? (
               <img
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="w-[32px] h-[32px] rounded-full select-none"
                  src={dancer.instagramUsername}
                  alt={dancer.name}
               />
            ) : (
               <div className="bg-white  rounded-full w-[32px] h-[32px] grid place-items-center select-none cursor-default ">
                  <p id={dancer.id} data-type={"dancer"} className="select-none font-semibold cursor-default  ">
                     {initials}
                  </p>
               </div>
            )}
         </div>
      </>
   );
};
