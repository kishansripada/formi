import { dancer, dancerPosition, formation, localSettings } from "../../../../types/types";
import { useStore } from "../store";

export const Dancer: React.FC<{
   selectedFormation: number | null;
   formations: formation[];
   dancer: dancer;
   // setFormations: Function;
   selectedDancers: string[];
   index: number;
   setSelectedDancers: Function;
   pushChange: Function;
   // uniqueDancers: string[];
   // viewOnly: boolean;
   localSettings: localSettings;
}> = ({
   selectedFormation,
   // formations,
   dancer,
   // setFormations,
   selectedDancers,
   index,
   setSelectedDancers,
   pushChange,
   // uniqueDancers,
   // viewOnly,
   localSettings,
}) => {
   const { setFormations, formations, viewOnly } = useStore();
   let { name, id, instagramUsername, color } = dancer;
   const { isDarkMode } = localSettings;
   let amSelected = selectedDancers.includes(id);
   const { dancers, setDancers } = useStore();
   // let suggestedDancer = uniqueDancers.find((dancer: string) => {
   //    return dancer.toLowerCase().startsWith(name.toLowerCase());
   // });

   let canBeAddedToStage =
      // there is a formation select
      selectedFormation !== null &&
      // and the dancer is not already on the stage
      !formations[selectedFormation]?.positions.find((dancer) => dancer.id === id);

   let initials = name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

   const addDancerToStage = () => {
      setFormations(
         formations.map((formation, i) => {
            if (i === selectedFormation) {
               return {
                  ...formation,
                  positions: [
                     ...formation.positions,
                     {
                        id: id,
                        position: {
                           x: 0,
                           y: 6,
                        },
                        transitionType: "linear",
                     },
                  ],
               };
            }
            return formation;
         })
      );
   };

   return (
      <>
         <div
            style={
               {
                  // backgroundColor: amSelected ? (isDarkMode ? "#db2777" : "#fbcfe8") : "transparent",
               }
            }
            onClick={() => {
               setSelectedDancers([id]);
            }}
            className={`flex flex-row items-center px-5 box-border ${
               amSelected ? "bg-pink-200 dark:bg-pink-600" : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
            }  group  select-none   min-h-[40px] `}
         >
            <p className="font-semibold   text-sm "> {index + 1}</p>
            <div className="relative">
               <input
                  style={{
                     backgroundColor: amSelected ? (isDarkMode ? "#db2777" : "#fbcfe8") : "transparent",
                  }}
                  className="h-6 w-full    px-2 py-4  text-sm rounded-md  ml-2    outline-none cursor-default"
                  value={name}
                  onBlur={pushChange}
                  disabled={viewOnly}
                  onChange={(e) => {
                     if (viewOnly) return;
                     setDancers(dancers.map((dancer) => (dancer.id === id ? { ...dancer, name: e.target.value } : dancer)));
                  }}
               />
               {/* <p className="absolute z-[50] left-[16px] top-[6.5px] text-neutral-500 text-sm">{suggestedDancer}</p> */}
            </div>

            {canBeAddedToStage ? (
               <button onClick={addDancerToStage}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
               </button>
            ) : (
               <></>
            )}
         </div>
      </>
   );
};
