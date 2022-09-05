import { dancer, dancerPosition, formation } from "../../types/types";

export const CurrentFormation: React.FC<{
   selectedFormation: number | null;
   formations: formation[];
   setFormations: Function;
   dancers: dancer[];
   setSelectedFormation: Function;
}> = ({ formations, selectedFormation, setFormations, dancers, setSelectedFormation }) => {
   let dancersWhoAreNotInNextFormation = formations?.[selectedFormation]?.positions.filter((dancerPosition: dancerPosition) => {
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
         <div className=" flex flex-col  w-1/4 mr-3 border-black rounded-xl border-1 mb-6 px-3 bg-white">
            {selectedFormation !== null ? (
               <div className="h-full  flex flex-col">
                  <input
                     className="w-full text-center h-12 text-2xl focus:outline-none"
                     onBlur={(e) => {
                        console.log(e.target.value);
                        setFormations((formations: formation[]) => {
                           return formations.map((formation, i) => {
                              if (i === selectedFormation) {
                                 return {
                                    ...formation,
                                    name: e.target.value,
                                 };
                              }

                              return formation;
                           });
                        });
                        console.log(formations);
                     }}
                     type="text"
                     key={formations[selectedFormation].name}
                     defaultValue={formations[selectedFormation].name}
                  />
                  <hr className="" />
                  {/* <p className="text-sm text-gray-400 mb-2 ml-auto mr-auto">formation name</p> */}
                  {dancersWhoAreNotInPreviousFormation?.length ? <p className="text-xl">Enter from:</p> : <></>}
                  {dancersWhoAreNotInPreviousFormation?.map((dancer, i) => (
                     <div className="flex flex-row justify-between w-full" key={i}>
                        {dancers.find((dancerx) => dancerx.id === dancer.id)?.name}
                        <select
                           className="text-2xl focus:outline-none outline-1 outline-gray-300"
                           defaultValue={
                              formations[selectedFormation]?.positions.find((dancerPosition) => dancerPosition.id === dancer.id)?.enterStrategy
                           }
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
                           <option value="closest"></option>
                           <option value="left"> ⬅️</option>
                           <option value="right"> ➡️</option>
                        </select>
                     </div>
                  ))}

                  {dancersWhoAreNotInNextFormation?.length ? <p className="text-xl">Exit towards:</p> : <></>}
                  {dancersWhoAreNotInNextFormation?.map((dancer, i) => (
                     <div className="flex flex-row justify-between w-full" key={i}>
                        {dancers.find((dancerx) => dancerx.id === dancer.id)?.name}
                        <select
                           className="text-2xl focus:outline-none outline-1 outline-gray-300"
                           defaultValue={
                              formations[selectedFormation]?.positions.find((dancerPosition) => dancerPosition.id === dancer.id)?.exitStrategy
                           }
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
                           <option value="closest"></option>
                           <option value="left"> ⬅️</option>
                           <option value="right"> ➡️</option>
                        </select>
                     </div>
                  ))}
                  <button
                     className="text-white bg-red-600 px-2 py-1 rounded-md mt-auto mb-2 w-full"
                     onClick={() => {
                        if (selectedFormation === formations.length - 1) {
                           setSelectedFormation((selectedFormation: number) => selectedFormation - 1);
                        }

                        setFormations((formations: formation[]) => {
                           return formations.filter((_, index) => {
                              return index !== selectedFormation;
                           });
                        });
                     }}
                  >
                     delete formation
                  </button>
               </div>
            ) : (
               <></>
            )}
         </div>
      </>
   );
};
