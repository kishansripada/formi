import { dancer, dancerPosition, formation } from "../types/types";

export const CurrentFormation: React.FC<{
   selectedFormation: number | null;
   formations: formation[];
   setFormations: Function;
}> = ({ formations, selectedFormation, setFormations }) => {
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
         <div className="bg-purple-200">
            <input type="text" defaultValue={formations[selectedFormation]?.name || `Formation ${selectedFormation}`} />
            <p>Exit Strategy</p>
            {dancersWhoAreNotInNextFormation?.map((dancer) => (
               <div className="flex flex-row">
                  <p>{dancer.id}</p>
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
            <p>Enter Strategy</p>
            {dancersWhoAreNotInPreviousFormation?.map((dancer) => (
               <div className="flex flex-row">
                  <p>{dancer.id}</p>
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
         </div>
      </>
   );
};
