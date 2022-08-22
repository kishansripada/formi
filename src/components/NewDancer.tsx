import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type dancer = {
   name?: string;
   id: string;
   position: { x: number | null; y: number | null };
};

type formation = {
   durationSeconds: number;
   positions: dancer[];
   transition: {
      durationSeconds: number;
   };
};

export const NewDancer = ({ setDancers }: { setDancers: Function }) => {
   const [newName, setNewName] = useState("");

   const createNewDancer = () => {
      if (newName === "") return;
      setDancers((dancers: dancer[]) => {
         return [...dancers, { name: newName, id: uuidv4() }];
      });
      setNewName("");
   };
   return (
      <>
         <div
            className="flex flex-row items-center bg-slate-300 border-black border-2"
            style={{
               opacity: 1,
            }}
         >
            new
            <div className="w-12 h-12 bg-red-500 rounded-full flex flex-row justify-center items-center">
               <p className="pointer-events-none select-none">New</p>
            </div>
            <input
               onKeyDown={(event) => (event.key === "Enter" ? createNewDancer() : null)}
               placeholder="New dancer"
               value={newName}
               onChange={(e) => setNewName(e.target.value)}
               onBlur={createNewDancer}
            />
         </div>
      </>
   );
};
