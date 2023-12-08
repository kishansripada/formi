"use client";

import { deleteLiveblocksRoom } from "../../dashboard/api";
import toast, { Toaster } from "react-hot-toast";
export default function Client({ dance }) {
   const isIdsAligned = (formation: formation) => {
      const dancerIds = [...dance.dancers.map((dancer: dancer) => dancer.id)];
      const formationDancerIds = formation.positions.map((position) => position.id);

      const extras = formationDancerIds.filter((id: string) => !dancerIds.includes(id));
      const missing = dancerIds.filter((id: string) => !formationDancerIds.includes(id));
      return { extras, missing };
   };

   const areDurationsValid = (formation) => {
      if (typeof formation.durationSeconds !== "number" || formation.durationSeconds < 0) {
         return false;
      }
      if (formation.transition && (typeof formation.transition.durationSeconds !== "number" || formation.transition.durationSeconds < 0.3)) {
         return false;
      }
      return true;
   };

   return (
      <>
         <Toaster></Toaster>
         <div className="flex flex-row justify-between">
            <div>
               <p className="mb-4">
                  <span className="font-semibold">Total Formations:</span> {dance.formations.length}
               </p>
               {/* Displaying number of dancers */}
               <p className="mb-4">
                  <span className="font-semibold">Total Dancers:</span> {dance.dancers.length}
               </p>
            </div>
            <div>
               <p>{dance.user}</p>
            </div>

            <button onClick={() => deleteLiveblocksRoom(dance.id).then((r) => toast(JSON.stringify(r)))}>Delete liveblocks room</button>
         </div>

         <div className="p-4 bg-gray-100 min-h-screen flex flex-row space-x-4">
            {/* Dancers Column */}
            <div className="w-1/4 bg-white p-2 rounded-lg shadow-md">
               <h3 className="text-lg font-semibold mb-3">Dancers</h3>
               <ul className="space-y-2 text-sm">
                  {dance.dancers.map((dancer) => (
                     <li key={dancer.id} className="flex items-center space-x-2">
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: dancer.color || "#db2777" }}></span>
                        <span>
                           {dancer.name} ({dancer.id})
                        </span>
                     </li>
                  ))}
               </ul>
            </div>

            {/* Formations Column */}
            <div className="w-3/4">
               <h1 className="text-xl font-bold mb-4">Dance Formations</h1>

               {dance.formations.map((formation, index) => (
                  <div key={index} className="bg-white p-2 rounded-lg shadow-md mb-4 text-sm">
                     <h2 className="text-lg font-semibold mb-2">{formation.name}</h2>
                     <div className="flex space-x-4">
                        <span
                           className={`p-1 rounded-full ${
                              !isIdsAligned(formation).extras.length && !isIdsAligned(formation).missing.length ? "bg-green-200" : "bg-red-200"
                           }`}
                        >
                           ID Check
                        </span>
                        <span className={`p-1 rounded-full ${areDurationsValid(formation) ? "bg-green-200" : "bg-red-200"}`}>Duration Check</span>
                        <span className="p-1">Duration: {formation.durationSeconds}s</span>
                        {formation.transition && <span className="p-1">Transition: {formation.transition.durationSeconds}s</span>}
                        <p>extras</p>
                        {isIdsAligned(formation).extras.map((id) => (
                           <span key={id} className="p-1 rounded-full bg-red-200">
                              {id}
                           </span>
                        ))}
                        <p>missing</p>
                        {isIdsAligned(formation).missing.map((id) => (
                           <span key={id} className="p-1 rounded-full bg-red-200">
                              {id}
                           </span>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
}
