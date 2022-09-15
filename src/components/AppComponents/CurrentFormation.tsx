import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";

export const CurrentFormation: React.FC<{
   selectedFormation: number | null;
   formations: formation[];
   setFormations: Function;
   dancers: dancer[];
   setSelectedFormation: Function;
}> = ({ formations, selectedFormation, setFormations, dancers, setSelectedFormation }) => {
   let dancersWhoAreNotInNextFormation =
      selectedFormation !== null
         ? formations?.[selectedFormation]?.positions.filter((dancerPosition: dancerPosition) => {
              return !formations[selectedFormation + 1]?.positions.find((dancer) => dancer.id === dancerPosition.id);
           })
         : [];

   let dancersWhoAreNotInPreviousFormation =
      selectedFormation === 0 || selectedFormation === null
         ? []
         : formations[selectedFormation]?.positions.filter((dancerPosition: dancerPosition) => {
              return !formations[selectedFormation - 1]?.positions.find((dancer) => dancer.id === dancerPosition.id);
           });

   return (
      <>
         <div className=" flex flex-col  w-1/4 mr-3 border-black rounded-xl border-1 mb-6 px-3 bg-white">
            {selectedFormation !== null && formations[selectedFormation]?.name !== null ? (
               <div className="h-full  flex flex-col">
                  <input
                     className="w-full text-center h-12 text-2xl focus:outline-none"
                     onBlur={(e) => {
                        // console.log(e.target.value);
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
                        // console.log(formations);
                     }}
                     type="text"
                     key={formations[selectedFormation]?.name}
                     defaultValue={formations[selectedFormation]?.name || ""}
                  />
                  <hr className="" />
                  {/* <p className="text-sm text-gray-400 mb-2 ml-auto mr-auto">formation name</p> */}
                  {dancersWhoAreNotInPreviousFormation?.length ? (
                     <div className="border-gray-500 border-[2px]  rounded-xl px-3 py-2">
                        <p className="text-xl">Enter from:</p>
                        {dancersWhoAreNotInPreviousFormation?.map((dancer: dancerPosition, i: number) => (
                           <div className="flex flex-row justify-between w-full" key={i}>
                              {dancers.find((dancerx) => dancerx.id === dancer.id)?.name}
                              <select
                                 className=" focus:outline-none outline-1 outline-gray-300"
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
                                 <option value="left">left</option>
                                 <option value="right">right</option>
                              </select>
                           </div>
                        ))}
                     </div>
                  ) : null}

                  {dancersWhoAreNotInNextFormation?.length ? (
                     <div className="border-gray-500 border-[2px] my-2 rounded-xl px-3 py-2">
                        <p className="text-xl">Exit towards:</p>
                        {dancersWhoAreNotInNextFormation?.map((dancer: dancerPosition, i) => (
                           <div className="flex flex-row justify-between w-full" key={i}>
                              {dancers.find((dancerx) => dancerx.id === dancer.id)?.name}
                              <select
                                 className=" focus:outline-none outline-1 outline-gray-300"
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
                                 <option value="left">left</option>
                                 <option value="right">right</option>
                              </select>
                           </div>
                        ))}
                     </div>
                  ) : null}
                  <div className="flex flex-row  mt-auto">
                     <button
                        className="text-white bg-red-600 px-2 py-1 rounded-md mb-2  flex flex-row items-center justify-center w-1/2 mx-2"
                        onClick={() => {
                           if (selectedFormation === formations.length - 1) {
                              setSelectedFormation((selectedFormation: number) => selectedFormation - 1);
                           }

                           setFormations((formations: formation[]) => {
                              return formations.filter((_, index) => {
                                 return index !== selectedFormation;
                              });
                           });
                           toast.success("formation deleted");
                        }}
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className=" fill-white w-5 h-5 mr-2">
                           <path
                              fillRule="evenodd"
                              d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                              clipRule="evenodd"
                           />
                        </svg>
                        delete
                     </button>
                     <button
                        className="text-white bg-blue-600 px-2 py-1 rounded-md mb-2  flex flex-row items-center justify-center w-1/2 mx-2"
                        onClick={() => {
                           setFormations((formations: formation[]) => {
                              return formations.map((formation, index) => {
                                 if (index === selectedFormation) {
                                    return { ...formation, positions: [] };
                                 }
                                 return formation;
                              });
                           });
                        }}
                     >
                        clear
                     </button>
                  </div>
               </div>
            ) : (
               <></>
            )}
         </div>
         <Toaster></Toaster>
      </>
   );
};
