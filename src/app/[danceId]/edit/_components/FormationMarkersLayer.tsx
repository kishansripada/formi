import { dancer, localSettings } from "../../../../types/types";
import SmoothLine from "../../../../utils/smoothLine";
import { useStore } from "../store";

export const FormationMarkersLayer: React.FC<{
   selectedDancers: string[];
   coordsToPosition: (coords: { x: number; y: number } | null | undefined) => { left: number; top: number } | null;
   dancers: dancer[];
   localSettings: localSettings;
   collisions: any;
   zoom: number;
}> = ({ selectedDancers, coordsToPosition, dancers, localSettings, collisions, zoom }) => {
   let { formations } = useStore();

   const thisFormation = useStore((state) => state.getFirstSelectedFormation());
   const { stageFlipped } = localSettings;

   //    stage flipped
   return (
      <svg className="absolute pointer-events-none w-full h-full z-40 overflow-visible" xmlns="http://www.w3.org/2000/svg">
         {(thisFormation?.stageMarkers || []).map((stageMarker) => {
            return (
               <SmoothLine
                  zoom={zoom}
                  points={stageMarker.positions.map((point) => [coordsToPosition(point)?.left, coordsToPosition(point)?.top])}
               ></SmoothLine>
            );
         })}
      </svg>
   );
};