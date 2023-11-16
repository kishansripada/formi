import { dancer, dancerPosition, formation, localSettings } from "../../../../types/types";
import { useStore } from "../store";

export const Dancer: React.FC<{
   dancer: dancer;
   selectedDancers: string[];
   index: number;
   setSelectedDancers: Function;
   pushChange: Function;
   localSettings: localSettings;
}> = ({ dancer, selectedDancers, index, setSelectedDancers, pushChange, localSettings }) => {
   const { viewOnly, setHoveringDancerIds, shiftHeld } = useStore();
   let { name, id, instagramUsername, color } = dancer;
   const { isDarkMode } = localSettings;
   let amSelected = selectedDancers.includes(id);
   const { dancers, setDancers } = useStore();
   // let suggestedDancer = uniqueDancers.find((dancer: string) => {
   //    return dancer.toLowerCase().startsWith(name.toLowerCase());
   // });

   // let canBeAddedToStage =
   //    // there is a formation select
   //    selectedFormation !== null &&
   //    // and the dancer is not already on the stage
   //    !formations[selectedFormation]?.positions.find((dancer) => dancer.id === id);

   let initials = name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

   // const addDancerToStage = () => {
   //    setFormations(
   //       formations.map((formation, i) => {
   //          if (i === selectedFormation) {
   //             return {
   //                ...formation,
   //                positions: [
   //                   ...formation.positions,
   //                   {
   //                      id: id,
   //                      position: {
   //                         x: 0,
   //                         y: 6,
   //                      },
   //                      transitionType: "linear",
   //                   },
   //                ],
   //             };
   //          }
   //          return formation;
   //       })
   //    );
   // };

   return (
      <>
         <div
            onClick={() => {
               setSelectedDancers([...(shiftHeld ? selectedDancers : []), id]);
            }}
            onPointerEnter={() => {
               setHoveringDancerIds([dancer.id]);
            }}
            onPointerLeave={() => {
               setHoveringDancerIds([]);
            }}
            className={`flex flex-row items-center px-3 border box-content  border-transparent  ${
               amSelected ? "bg-pink-200 dark:bg-dark-secondary " : "hover:border-pink-600"
            }  group  select-none   min-h-[40px] `}
         >
            <p className="font-semibold   text-sm "> {index + 1}</p>
            <div className="relative">
               <input
                  style={
                     {
                        // backgroundColor: amSelected ? (isDarkMode ? "#db2777" : "#fbcfe8") : "transparent",
                     }
                  }
                  spellCheck={false}
                  className="h-6 w-full    px-2 py-4  text-sm rounded-md  ml-2 bg-transparent   outline-none cursor-default"
                  value={name}
                  // onBlur={pushChange}
                  disabled={viewOnly}
                  onChange={(e) => {
                     if (viewOnly) return;
                     setDancers(dancers.map((dancer) => (dancer.id === id ? { ...dancer, name: e.target.value } : dancer)));
                  }}
               />
            </div>

            <div
               style={{
                  backgroundColor: color || "#db2777",
               }}
               className="h-2 w-2 ml-auto rounded-full"
            ></div>
         </div>
      </>
   );
};
