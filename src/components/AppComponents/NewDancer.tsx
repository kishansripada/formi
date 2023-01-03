import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { dancer, dancerPosition, formation, stageDimensions } from "../../types/types";

export const NewDancer: React.FC<{
   setDancers: Function;
   stageDimensions: stageDimensions;
   setFormations: Function;
   addToStack: Function;
   pushChange: Function;
}> = ({ setDancers, stageDimensions, setFormations, addToStack, pushChange }) => {
   const [newName, setNewName] = useState("");

   const createNewDancer = () => {
      if (newName === "") return;
      addToStack();
      let id = uuidv4();
      setDancers((dancers: dancer[]) => {
         return [
            ...dancers,
            {
               name: newName,
               id,
               instagramUsername: null,
            },
         ];
      });

      setFormations((formations: formation[]) => {
         return formations.map((formation, index) => {
            let position = { x: 0, y: 0 };
            for (let y = stageDimensions.height / 2 - 1; y >= -(stageDimensions.height / 2 - 1); y--) {
               let leftSide = formation.positions.find(
                  (position) => position.position.x === -(stageDimensions.width / 2 - 1) && position.position.y === y
               );
               if (!leftSide) {
                  position = { x: -(stageDimensions.width / 2 - 1), y };
                  break;
               }

               let rightSide = formation.positions.find(
                  (position) => position.position.x === stageDimensions.width / 2 - 1 && position.position.y === y
               );
               if (!rightSide) {
                  position = { x: stageDimensions.width / 2 - 1, y };
                  break;
               }
            }

            return { ...formation, positions: [...formation.positions, { id, position }] };
         });
      });
      setNewName("");
      pushChange();
   };
   return (
      <>
         <div
            className="flex flex-row items-center h-[55px]  bg-white shrink-0 mb-1 px-3"
            style={{
               opacity: 1,
            }}
         >
            <div
               style={{
                  transform: "translate(0, 0)",
               }}
               className={`min-w-[48px] min-h-[48px] ml-2 rounded-full grid place-items-center cursor-pointer bg-black  `}
            >
               <div className="bg-white rounded-full w-[41px] h-[41px] grid place-items-center" data-type={"newDancer"}>
                  <p className="font-bold" data-type={"newDancer"}>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                     </svg>
                  </p>
               </div>
            </div>
            <input
               className="h-6  px-3 py-4 transition duration-300  rounded-md  ml-3 hover:bg-gray-100 text-gray-500 focus:bg-gray-100 outline-none cursor-pointer"
               onKeyDown={(event) => (event.key === "Enter" ? createNewDancer() : null)}
               placeholder="new dancer"
               value={newName}
               onChange={(e) => setNewName(e.target.value)}
               onBlur={createNewDancer}
            />
         </div>
         {/* <hr /> */}
      </>
   );
};
