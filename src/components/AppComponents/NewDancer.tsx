import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { dancer, dancerPosition, formation } from "../../types/types";

export const NewDancer = ({ setDancers }: { setDancers: Function }) => {
   const [newName, setNewName] = useState("");

   const createNewDancer = () => {
      if (newName === "") return;
      setDancers((dancers: dancer[]) => {
         return [...dancers, { name: newName, id: uuidv4(), instagramUsername: null }];
      });
      setNewName("");
   };
   return (
      <>
         <div
            className="flex flex-row items-center h-16 rounded-xl bg-white shrink-0"
            style={{
               opacity: 1,
            }}
         >
            <input
               className="ml-3 outline-none"
               onKeyDown={(event) => (event.key === "Enter" ? createNewDancer() : null)}
               placeholder="New dancer"
               value={newName}
               onChange={(e) => setNewName(e.target.value)}
               onBlur={createNewDancer}
            />
            <p className="ml-auto text-gray-400 mr-3"> enter to create</p>
         </div>
      </>
   );
};
