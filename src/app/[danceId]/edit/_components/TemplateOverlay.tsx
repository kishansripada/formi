import { cloudSettings, dancer, dancerPosition, formation, localSettings } from "../../../../types/types";
import { useStore } from "../store";
import { Fragment } from "react";
import { roundToHundredth } from "../../../../utls";
export const TemplateOverlay: React.FC<{
   selectedDancers: string[];
   coordsToPosition: (coords: { x: number; y: number } | null | undefined) => { left: number; top: number } | null;
   dancers: dancer[];
   localSettings: localSettings;
   collisions: any;
   zoom: number;
   currentTemplate: any;
}> = ({ selectedDancers, coordsToPosition, dancers, localSettings, collisions, zoom, currentTemplate }) => {
   const { cloudSettings } = useStore();

   if (!currentTemplate?.positions?.length) return;
   //    const { previousFormationView, stageFlipped } = localSettings;

   const roundPositions = (positions: { x: number; y: number }[]) => {
      const { stageBackground, gridSubdivisions, horizontalGridSubdivisions, verticalFineDivisions, horizontalFineDivisions, stageDimensions } =
         cloudSettings;

      //   console.log({ positions });

      //   const { gridSnap } = localSettings;
      const gridSnap = 1;
      let gridSizeX = 1;
      let gridSizeY = 1;
      let verticalOffset = 0;
      let horizontalOffset = 0;
      if (stageBackground === "gridfluid" || stageBackground === "cheer9") {
         // Determine the total number of divisions along each axis.
         const totalVerticalDivisions = gridSubdivisions * verticalFineDivisions;
         const totalHorizontalDivisions = horizontalGridSubdivisions * horizontalFineDivisions;

         // Calculate the width and height of each grid cell.
         gridSizeX = stageDimensions.width / totalVerticalDivisions / gridSnap;
         gridSizeY = stageDimensions.height / totalHorizontalDivisions / gridSnap;
         let isOddVerticalDivisions = (gridSubdivisions * verticalFineDivisions) % 2 !== 0;
         let isOddHorizontalDivisions = (horizontalGridSubdivisions * horizontalFineDivisions) % 2 !== 0;

         verticalOffset = isOddVerticalDivisions ? gridSizeX / 2 : 0;
         horizontalOffset = isOddHorizontalDivisions ? gridSizeY / 2 : 0;
         if (gridSnap % 2 === 0) {
            verticalOffset = 0;
            horizontalOffset = 0;
         }
      } else {
         gridSizeX = 1 / gridSnap;
         gridSizeY = 1 / gridSnap;
      }

      // console.log(gridSizeX);
      //   setFormations(
      return positions.map((position) => {
         // Use the grid cell dimensions to round the dancer positions to the nearest grid position.
         return {
            // ...formation,
            // positions: formation.positions.map((position) => {
            //    return {
            //   ...position,
            // position: {
            x: roundToHundredth(Math.round((position.x - verticalOffset) / gridSizeX) * gridSizeX + verticalOffset),
            y: roundToHundredth(Math.round((position.y - horizontalOffset) / gridSizeY) * gridSizeY + horizontalOffset),
            // },
            //    };
            // }),
         };
      });
      //   );
   };

   const stageFlippedFactor = localSettings.stageFlipped ? -1 : 1;
   // console.log("test", roundPositions(currentTemplate));
   return (
      <svg className="absolute pointer-events-none w-full h-full z-30 overflow-visible" xmlns="http://www.w3.org/2000/svg">
         {roundPositions(
            currentTemplate.positions.map((position: dancerPosition) => ({
               x: (position.left / 100) * cloudSettings.stageDimensions.width - cloudSettings.stageDimensions.width / 2,
               y: (position.top / 100) * cloudSettings.stageDimensions.height - cloudSettings.stageDimensions.height / 2,
            }))
         ).map((dancerPosition) => {
            const coords = coordsToPosition({
               x: stageFlippedFactor * dancerPosition.x,
               y: stageFlippedFactor * dancerPosition.y,
            });

            return (
               <circle
                  id="template"
                  style={
                     {
                        // translate x and y by half the width
                        //  transform: `translate(${-20 / 2}px, ${-20 / 2}px)`,
                     }
                  }
                  //   id={dancerPosition.id}
                  //   data-type={"controlPointStart"}
                  cx={coords.left}
                  cy={coords.top}
                  r="20"
                  //   width={20}
                  //   height={20}
                  className=" z-[10] fill-white opacity-50  "
               />
            );
         })}
      </svg>
   );
};
