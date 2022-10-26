import { ReactEventHandler } from "react";
import { Formation } from "./Formation";
// import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
// import { SortableContext } from "@dnd-kit/sortable";

import { useCallback, useEffect, useState } from "react";
import { dancer, dancerPosition, formation } from "../../types/types";
import { Layer } from "./Layer";
import cursor from "../../../public/cursor.svg";
import { PIXELS_PER_SECOND } from "../../types/types";
// import { horizontalListSortingStrategy } from "@dnd-kit/sortable";

export const Layers: React.FC<{
   formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   setFormations: Function;
   songDuration: number | null;
   position: number | null;
   isPlaying: boolean;
   soundCloudTrackId: string;
   viewOnly: boolean;
   pixelsPerSecond: number;
}> = ({
   formations,
   selectedFormation,
   setSelectedFormation,
   setFormations,
   songDuration,
   position,
   isPlaying,
   soundCloudTrackId,
   viewOnly,
   pixelsPerSecond,
}) => {
   return (
      <div
         className="flex flex-col pt-2 pb-3 w-full  bg-white  max-h-[75px] overflow-x-scroll  "
         style={{
            width: songDuration ? (songDuration / 1000) * pixelsPerSecond : "100%",
            marginLeft: soundCloudTrackId ? (soundCloudTrackId.length < 15 ? 122 : 10) : 115,
         }}
         id="layers"
      >
         <Layer
            viewOnly={viewOnly}
            songDuration={songDuration}
            setFormations={setFormations}
            formations={formations}
            selectedFormation={selectedFormation}
            setSelectedFormation={setSelectedFormation}
            isPlaying={isPlaying}
            position={position}
            pixelsPerSecond={pixelsPerSecond}
         />

         <svg
            style={{
               left: position !== null ? position * pixelsPerSecond : 0,
               top: -30,
               transform: "translate(-50%, 0%) scale(12)",
            }}
            viewBox="0 0 3730 27444"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-70  relative z-50 pointer-events-none"
         >
            <path d="M1873 2248L1865.04 27443" stroke="white" strokeWidth="459" />
            <rect x="547" width="2635" height="2635" rx="400" fill="black" />
            <path
               d="M2200.22 3874.07C2042.45 4116.42 1687.55 4116.42 1529.78 3874.07L652.332 2526.23C479.11 2260.14 670.054 1908 987.557 1908L2742.44 1908C3059.95 1908 3250.89 2260.15 3077.67 2526.23L2200.22 3874.07Z"
               fill="black"
            />
         </svg>
      </div>
   );
};
