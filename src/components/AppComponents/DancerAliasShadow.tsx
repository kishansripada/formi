import { dancer, dancerPosition, formation } from "../../types/types";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

export interface DancerAliasProps {
   dancer: dancer;
   setDancers: Function;
   selectedFormation: number | null;
   formations: formation[];
   isPlaying: boolean;
   position: number | null;
   setFormations: Function;
}

export const DancerAliasShadow: React.FC<DancerAliasProps> = ({
   dancer,
   formations,
   setDancers,
   selectedFormation,
   isPlaying,
   position,
   setFormations,
}) => {
   let currentCoords = formations[selectedFormation + 1]?.positions.find((dancerx: dancerPosition) => dancerx.id === dancer.id)?.position;

   if (selectedFormation === null || selectedFormation === formations.length - 1 || !currentCoords || isPlaying) return <></>;

   // console.log("dancer alias created");
   let initials = dancer.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

   // if there is no formation selected and the track is not playing, then just return nothing

   // if the dancer does not have any coordinates right now, return nothing since it shouln't be displayed
   if (!currentCoords) return <></>;

   let { left, top } = coordsToPosition(currentCoords.x, currentCoords.y);

   return (
      <>
         <div
            style={{ left, top, transform: "translate(-50%, -50%)" }}
            id={dancer.id}
            className={`w-[38px] h-[38px] opacity-30 pointer-events-none  rounded-full flex flex-row justify-center items-center absolute z-[40] mr-auto ml-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 `}
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

const coordsToPosition = (x: number, y: number) => {
   return { left: 400 + 40 * x, top: 400 + 40 * -y };
};
