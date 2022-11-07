import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { dancer, dancerPosition, formation } from "../../types/types";

export const NewDancer: React.FC<{ setDancers: Function }> = ({ setDancers }) => {
   const [newName, setNewName] = useState("");

   const createNewDancer = () => {
      if (newName === "") return;
      setDancers((dancers: dancer[]) => {
         return [
            ...dancers,
            {
               name: newName,
               id: uuidv4(),
               instagramUsername: null,
            },
         ];
      });
      setNewName("");
   };
   return (
      <>
         <div
            className="flex flex-row items-center h-[55px] rounded-xl bg-white shrink-0 mb-1"
            style={{
               opacity: 1,
            }}
         >
            <input
               className="ml-3 focus:outline-pink-600 rounded-md  hover:outline-gray-400 focus:outline-2  hover:outline-2 focus:outline hover:outline px-2"
               onKeyDown={(event) => (event.key === "Enter" ? createNewDancer() : null)}
               placeholder="new dancer"
               value={newName}
               onChange={(e) => setNewName(e.target.value)}
               onBlur={createNewDancer}
            />
         </div>
      </>
   );
};
