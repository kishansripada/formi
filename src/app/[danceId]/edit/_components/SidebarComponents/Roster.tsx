import { dancer, dancerPosition, formation, localSettings, stageDimensions } from "../../../../../types/types";
import { Dancer } from "../Dancer";
import { v4 as uuidv4 } from "uuid";
import { AuthSession } from "@supabase/supabase-js";
import { PopoverPicker } from "../ColorPicker";
import { useStore } from "../../store";
import { convertToCentimeters, convertToFeetAndInches } from "../../../../../utls";
import { Add } from "../../../../../../@/components/ui/button";
export const Roster: React.FC<{
   addToStack: Function;
   pushChange: Function;
   selectedDancers: string[];
   setSelectedDancers: Function;
   localSettings: localSettings;
   session: AuthSession | null;
}> = ({ pushChange, selectedDancers, setSelectedDancers, localSettings, session }) => {
   const { formations, setFormations, cloudSettings, pauseHistory, resumeHistory } = useStore();
   const removeDancer = (id: string) => {
      // remove dancer and all their positions
      setFormations(
         formations.map((formation) => {
            return { ...formation, positions: formation.positions.filter((dancerPosition) => dancerPosition.id !== id) };
         })
      );
      setDancers(dancers.filter((dancer) => dancer.id !== id));
   };

   const { dancers, setDancers, viewOnly } = useStore();
   let { stageDimensions } = cloudSettings;

   let height = convertToFeetAndInches(dancers.find((dancer) => dancer.id === selectedDancers[0])?.height || 182.88);

   const createNewDancer = () => {
      pauseHistory();
      let id = uuidv4();
      setDancers([
         ...dancers,
         {
            name: "New dancer",
            id,
         },
      ]);

      setFormations(
         formations.map((formation, index) => {
            let position = { x: 0, y: 0 };
            for (let y = Math.floor(stageDimensions.height / 2) - 1; y >= -(Math.floor(stageDimensions.height / 2) - 1); y--) {
               let leftSide = formation.positions.find(
                  (position) => position.position.x === -(Math.floor(stageDimensions.width / 2) - 1) && position.position.y === y
               );
               if (!leftSide) {
                  position = { x: -(Math.floor(stageDimensions.width / 2) - 1), y };
                  break;
               }

               let rightSide = formation.positions.find(
                  (position) => position.position.x === Math.floor(stageDimensions.width / 2) - 1 && position.position.y === y
               );
               if (!rightSide) {
                  position = { x: Math.floor(stageDimensions.width / 2) - 1, y };
                  break;
               }
            }

            return {
               ...formation,
               positions: [...formation.positions, { id, position }],
            };
         })
      );
      resumeHistory();
      pushChange();
   };

   const setDancerShape = (shape: string) => {
      if (shape === "circle" || shape === "square" || shape === "triangle") {
         setDancers(
            dancers.map((dancer) => {
               if (selectedDancers.includes(dancer.id)) {
                  return { ...dancer, shape: shape };
               }
               return dancer;
            })
         );
      }
   };

   const setColor = (color: string) => {
      //   console.log(color);
      setDancers(
         dancers.map((dancer) => {
            if (selectedDancers.includes(dancer.id)) {
               return { ...dancer, color };
            }
            return dancer;
         })
      );
   };
   return (
      <>
         <div className="flex h-full w-full flex-col   dark:text-white ">
            {!viewOnly ? (
               <>
                  <div className="flex flex-row items-center justify-between border-b border-neutral-200 px-2 py-2 text-xs dark:border-neutral-700 min-h-[40px] w-full">
                     <p className="font-medium">Performers</p>
                     <Add onClick={createNewDancer}></Add>
                  </div>
               </>
            ) : null}
            <div
               style={{
                  touchAction: "pan-y",
               }}
               className="flex-grow overflow-y-scroll overscroll-y-none"
            >
               {dancers.slice().map((dancer, index) => (
                  <Dancer
                     // uniqueDancers={uniqueDancers}
                     pushChange={pushChange}
                     setSelectedDancers={setSelectedDancers}
                     selectedDancers={selectedDancers}
                     //
                     dancer={dancer}
                     key={dancer.id}
                     index={index}
                     localSettings={localSettings}
                  />
               ))}
            </div>
            {/* <div className="bg-blue-200 flex-grow  overflow-y-auto"></div> */}

            <div className=" flex h-[250px]  min-h-[250px] flex-col   ">
               {selectedDancers.length ? (
                  <div
                     className="mt-3 px-3"
                     style={{
                        pointerEvents: viewOnly ? "none" : "auto",
                     }}
                  >
                     <p className="   mb-2 text-sm font-medium">Height</p>
                     <div className="flex w-full flex-row  items-center ">
                        <div className="flex flex-row items-center border border-neutral-200 dark:border-neutral-700">
                           <input
                              // onBlur={pushChange}
                              value={height.feet}
                              type="number"
                              onChange={(e) => {
                                 // setHeightFeet(parseInt(e.target.value));
                                 if (height.feet === null || height.feet === undefined) return;
                                 setDancers(
                                    dancers.map((dancer) => {
                                       if (selectedDancers.includes(dancer.id)) {
                                          return {
                                             ...dancer,
                                             height: convertToCentimeters(parseInt(e.target.value), height.inches),
                                          };
                                       }
                                       return dancer;
                                    })
                                 );
                              }}
                              style={{
                                 borderRadius: 0,
                              }}
                              className="w-[45px] rounded-none p-1 text-center focus:outline-none dark:bg-neutral-800  "
                           />
                           <p className="mx-1">ft</p>
                        </div>
                        <div className="ml-4 flex flex-row items-center border border-neutral-200 dark:border-neutral-700">
                           <input
                              // onBlur={pushChange}
                              type="number"
                              value={height.inches}
                              onChange={(e) => {
                                 // setHeightIn(parseInt(e.target.value));
                                 if (height.inches === null || height.inches === undefined) return;
                                 setDancers(
                                    dancers.map((dancer) => {
                                       if (selectedDancers.includes(dancer.id)) {
                                          return {
                                             ...dancer,
                                             height: convertToCentimeters(height.feet, parseInt(e.target.value)),
                                          };
                                       }
                                       return dancer;
                                    })
                                 );
                              }}
                              style={{
                                 borderRadius: 0,
                              }}
                              className="w-[45px] rounded-none p-1 text-center focus:outline-none  dark:bg-neutral-800"
                           />
                           <p className="mx-1">in</p>
                        </div>
                     </div>
                     <div className="flex flex-row items-center justify-between   ">
                        <div className="flex flex-col ">
                           <p className=" mb-2 mt-2  text-sm font-medium text-neutral-800 dark:text-white">Shape</p>

                           <div className="flex w-full flex-row items-center gap-2">
                              <button
                                 onClick={() => {
                                    setDancerShape("circle");
                                 }}
                              >
                                 <svg className="h-8 w-8 dark:fill-white  " xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                    <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
                                 </svg>
                              </button>

                              <button
                                 onClick={() => {
                                    setDancerShape("square");
                                 }}
                              >
                                 <svg className="h-8 w-8 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                    <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z" />
                                 </svg>
                              </button>
                              <button
                                 onClick={() => {
                                    setDancerShape("triangle");
                                 }}
                              >
                                 <svg className="h-8 w-8 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                    <path d="m80-160 401-640 399 640H80Zm107-60h586L481-685 187-220Zm293-233Z" />
                                 </svg>
                              </button>
                           </div>
                           {/* <p className=" text-neutral-800  text-sm mb-2 mt-2 font-medium">Color</p> */}
                        </div>

                        <div className="flex flex-col justify-end">
                           <p className=" mb-2 mt-2  text-sm font-medium text-neutral-800 dark:text-white">Color</p>
                           <PopoverPicker
                              dancers={dancers}
                              color={dancers.find((dancer) => dancer.id === selectedDancers[0])?.color || null}
                              selectedDancers={selectedDancers}
                              setColor={setColor}
                              position="top"
                           ></PopoverPicker>
                        </div>
                     </div>
                  </div>
               ) : (
                  <p className="grid h-full w-full place-items-center">No Dancers Selected</p>
               )}
               {!viewOnly ? (
                  // <div
                  //    onClick={() => {
                  //       selectedDancers.forEach((dancerId) => {
                  //          removeDancer(dancerId);
                  //       });
                  //       setSelectedDancers([]);
                  //       // console.log(selectedDancers);
                  //       pushChange();
                  //    }}
                  //    className=" mt-auto  w-full text-sm  cursor-pointer select-none  text-center  bg-opacity-80 py-2 bg-red-600 text-white  "
                  // >
                  //    Delete Dancer
                  // </div>

                  <div className="mt-auto p-2">
                     <div
                        style={{
                           opacity: selectedDancers.length ? 1 : 0.5,
                           pointerEvents: selectedDancers.length ? "all" : "none",
                        }}
                        onClick={() => {
                           pauseHistory();
                           setSelectedDancers([]);
                           selectedDancers.forEach((dancerId) => {
                              removeDancer(dancerId);
                           });
                           resumeHistory();
                           // setSelectedDancers([]);
                           // setSelectedDancers([dancers[dancers.length - 1]?.id || ""]);
                           // console.log(selectedDancers);
                           pushChange();
                        }}
                        className="  grid w-full cursor-pointer select-none place-items-center rounded-md bg-red-500  bg-opacity-20 py-2  text-sm font-semibold text-red-600 shadow-sm dark:text-red-400  "
                     >
                        {selectedDancers.length > 1 ? "Delete Dancers" : "Delete Dancer"}
                     </div>
                  </div>
               ) : null}
            </div>
         </div>
      </>
   );
};
