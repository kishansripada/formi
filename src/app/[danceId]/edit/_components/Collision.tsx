import { dancer, dancerPosition, formation, stageDimensions } from "../../../../types/types";

export const Collision: React.FC<{
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
   collision: any;
}> = ({ coordsToPosition, collision }) => {
   // if there is no formation selected and the track is not playing, then just return nothing

   let { left, top } = coordsToPosition(collision.collisionPoint);

   return (
      <>
         <div
            style={{
               left: left,
               top: top,
               backgroundColor: "red",
               width: 10,
               height: 10,
            }}
            className={`rounded-full   select-none pointer-events-none flex  -translate-y-1/2 -translate-x-1/2 flex-row  absolute z-[40]  cursor-default   `}
         ></div>
      </>
   );
};
