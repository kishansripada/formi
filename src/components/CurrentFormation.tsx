import { dancer, dancerPosition, formation } from "../types/types";

export const CurrentFormation: React.FC<{
   selectedFormation: number | null;
   formations: formation[];
   setFormations: Function;
   dancers: dancer[];
}> = ({ formations, selectedFormation, setFormations, dancers }) => {
   if (selectedFormation === null) {
      return <div>no formation selected :(</div>;
   }

   let dancersWhoAreNotInNextFormation = formations[selectedFormation]?.positions.filter((dancerPosition: dancerPosition) => {
      return !formations[selectedFormation + 1]?.positions.find((dancer) => dancer.id === dancerPosition.id);
   });

   let dancersWhoAreNotInPreviousFormation =
      selectedFormation === 0
         ? []
         : formations[selectedFormation]?.positions.filter((dancerPosition: dancerPosition) => {
              return !formations[selectedFormation - 1]?.positions.find((dancer) => dancer.id === dancerPosition.id);
           });

   return (
      <>
         <div className="bg-purple-200 flex flex-col items-center">
            <input type="text" defaultValue={formations[selectedFormation]?.name || `Formation ${selectedFormation}`} />
            {dancersWhoAreNotInNextFormation?.length ? <p>Enter Strategy</p> : <></>}
            {dancersWhoAreNotInPreviousFormation?.map((dancer, i) => (
               <div className="flex flex-row justify-between w-full" key={i}>
                  {dancers.find((dancerx) => dancerx.id === dancer.id)?.name}
                  <select
                     defaultValue={formations[selectedFormation]?.positions.find((dancerPosition) => dancerPosition.id === dancer.id)?.enterStrategy}
                     onChange={(e) =>
                        setFormations((formations: formation[]) => {
                           return formations.map((formation, index: number) => {
                              if (index === selectedFormation) {
                                 return {
                                    ...formation,
                                    positions: formation.positions.map((dancerPosition) => {
                                       if (dancerPosition.id === dancer.id) {
                                          return { ...dancerPosition, enterStrategy: e.target.value };
                                       }
                                       return dancerPosition;
                                    }),
                                 };
                              }
                              return formation;
                           });
                        })
                     }
                  >
                     <option value="closest">closest</option>
                     <option value="left"> left</option>
                     <option value="right"> right</option>
                  </select>
               </div>
            ))}
            {dancersWhoAreNotInNextFormation?.length ? <p>Exit Strategy</p> : <></>}
            {dancersWhoAreNotInNextFormation?.map((dancer, i) => (
               <div className="flex flex-row justify-between w-full" key={i}>
                  {dancers.find((dancerx) => dancerx.id === dancer.id)?.name}
                  <select
                     defaultValue={formations[selectedFormation]?.positions.find((dancerPosition) => dancerPosition.id === dancer.id)?.exitStrategy}
                     onChange={(e) =>
                        setFormations((formations: formation[]) => {
                           return formations.map((formation, index: number) => {
                              if (index === selectedFormation) {
                                 return {
                                    ...formation,
                                    positions: formation.positions.map((dancerPosition) => {
                                       if (dancerPosition.id === dancer.id) {
                                          return { ...dancerPosition, exitStrategy: e.target.value };
                                       }
                                       return dancerPosition;
                                    }),
                                 };
                              }
                              return formation;
                           });
                        })
                     }
                  >
                     <option value="closest">closest</option>
                     <option value="left"> left</option>
                     <option value="right"> right</option>
                  </select>
               </div>
            ))}
         </div>
      </>
   );
};
