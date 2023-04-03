import { dancer, dancerPosition, formation, initials } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

type Point = {
   x: number;
   y: number;
};

export const Presets: React.FC<{
   selectedFormation: number | null;
   formations: formation[];
   setFormations: Function;
   dancers: dancer[];
   setSelectedFormation: Function;
   selectedDancers: string[];
   setSelectedDancers: Function;
   pricingTier: string;
   addToStack: Function;
   pushChange: Function;
   isCommenting: boolean;
   setIsCommenting: Function;
   setUpgradeIsOpen: Function;
   cloudSettings: any;
}> = ({
   formations,
   selectedFormation,
   setFormations,
   dancers,
   setSelectedFormation,
   selectedDancers,
   setSelectedDancers,

   pricingTier,
   addToStack,
   pushChange,
   isCommenting,
   setIsCommenting,
   setUpgradeIsOpen,
   cloudSettings,
}) => {
   let { stageDimensions } = cloudSettings;
   return (
      <>
         <div className="lg:flex hidden flex-col p-6 min-w-[350px] w-[23%] bg-white border-r border-r-gray-300 ">
            <p className="  font-medium text-xl">Formation Templates</p>
            <p className="text-gray-500 text-xs mt-2">Quickly arrange all your dancers into prebuilt formations (more templates on the way)</p>

            <div className=" grid   flex-col mt-6  grid-cols-2  gap-2 ">
               <button
                  className=" w-full h-24 border border-gray-200 shadow-sm ml-auto mr-auto rounded-xl grid place-items-center"
                  onClick={() => {
                     if (pricingTier === "basic") {
                        setUpgradeIsOpen(true);
                     }
                     // addToStack();
                     setFormations(horizontalLineFormation(formations, selectedFormation));
                     pushChange();
                  }}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                     className="w-10 h-10"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                     />
                  </svg>
               </button>
               <button
                  className=" w-full h-24 border border-gray-200 shadow-sm ml-auto mr-auto rounded-xl grid place-items-center"
                  onClick={() => {
                     if (pricingTier === "basic") {
                        setUpgradeIsOpen(true);
                     }
                     addToStack();
                     setFormations(verticalLineFormation(formations, selectedFormation));
                     pushChange();
                  }}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                     className="w-10 h-10"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                     />
                  </svg>
               </button>
            </div>
            <Toaster></Toaster>
         </div>
      </>
   );
};

const horizontalLineFormation = (formations: formation[], selectedFormation: number | null) => {
   let previousFormation = selectedFormation === 0 ? formations[selectedFormation] : formations[selectedFormation - 1];

   let numberOfDancers = previousFormation.positions.length;
   let possiblePositions = previousFormation.positions.map((position, i) => {
      return { x: i - Math.round(numberOfDancers / 2), y: 0 };
   });

   let newPositions = previousFormation?.positions.map((position) => {
      let distances = possiblePositions.map((possiblePosition) => {
         return calculateDistance(position.position, possiblePosition);
      });
      let positionIndex = distances.indexOf(Math.min(...distances));
      let newPosition = possiblePositions.splice(positionIndex, 1);
      return { ...position, position: newPosition[0] };
   });

   return formations.map((formation, i) => {
      if (i === selectedFormation) {
         return { ...formation, positions: newPositions };
      }
      return formation;
   });
};

const verticalLineFormation = (formations: formation[], selectedFormation: number | null) => {
   let previousFormation = selectedFormation === 0 ? formations[selectedFormation] : formations[selectedFormation - 1];

   let numberOfDancers = previousFormation.positions.length;
   let possiblePositions = previousFormation.positions.map((position, i) => {
      return { y: i - Math.round(numberOfDancers / 2), x: 0 };
   });

   let newPositions = previousFormation?.positions.map((position) => {
      let distances = possiblePositions.map((possiblePosition) => {
         return calculateDistance(position.position, possiblePosition);
      });
      let positionIndex = distances.indexOf(Math.min(...distances));
      let newPosition = possiblePositions.splice(positionIndex, 1);
      return { ...position, position: newPosition[0] };
   });

   return formations.map((formation, i) => {
      if (i === selectedFormation) {
         return { ...formation, positions: newPositions };
      }
      return formation;
   });
};

function calculateDistance(point1: Point, point2: Point) {
   const xDistance = point1.x - point2.x;
   const yDistance = point1.y - point2.y;
   return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}
