import { useState } from "react";
import { dancer, dancerPosition, formation, formationGroup, localSettings } from "../../../../types/types";
import { Layer } from "./Layer";
import { useStore } from "../store";

export const Layers: React.FC<{
   // formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   // setFormations: Function;

   position: number | null;

   pixelsPerSecond: number;
   setSelectedDancers: Function;
   addToStack: Function;
   pushChange: Function;

   formationGroups: formationGroup[];
   setPosition: Function;

   localSettings: localSettings;
   shiftHeld: boolean;
   hasVisited: boolean;
}> = ({
   position,

   pixelsPerSecond,
   setSelectedDancers,
   pushChange,
   addToStack,
   formationGroups,
   setPosition,

   localSettings,
   shiftHeld,
   hasVisited,
   // setSelectedFormations,
   // selectedFormations,
}) => {
   const { formations, setFormations, get, viewOnly, pauseHistory, resumeHistory, songDuration, isPlaying } = useStore();
   const [resizingTransition, setResizingTransition] = useState<string | null>(null);
   const [resizingFormation, setResizingFormation] = useState<string | null>(null);
   const [showTutorial, setShowTutorial] = useState<boolean | "shown">(false);

   const totalDurationOfFormations = useStore((state) => state.getTotalDurationOfFormations());
   const timelineWidth = (songDuration ? Math.max(totalDurationOfFormations, songDuration / 1000) : totalDurationOfFormations) * pixelsPerSecond;

   return (
      <div
         className="flex flex-col   select-none"
         style={{
            width: timelineWidth + 1000,

            // width: "100%",
            // width: songDuration
            //    ? Math.max(
            //         formations.map((formation) => formation.durationSeconds + formation.transition.durationSeconds).reduce((a, b) => a + b, 0),
            //         (songDuration / 1000) * pixelsPerSecond
            //      )
            //    : "100%",
            // marginLeft: 40,
         }}
         // onPointerUp={pointerUp}
         // onPointerDown={pointerDown}
         // onPointerMove={pointerMove}
      >
         <>
            <div
               style={{
                  opacity: showTutorial === true ? 1 : 0,
                  pointerEvents: showTutorial === true ? "all" : "none",
               }}
               className="fixed flex flex-row items-center w-[600px] text-neutral-200 px-4 text-sm h-[50px] bg-black/80 rounded-xl -translate-x-1/2 left-1/2 transition opacity-0 bottom-[150px] "
            >
               <p className="mr-3">Hold shift when changing formation duration to move all future formations</p>
               <button
                  onClick={() => {
                     setShowTutorial("shown");
                  }}
                  className="bg-white px-3 py-2 text-black rounded-md ml-auto"
               >
                  Ok
               </button>
            </div>
         </>
         <Layer
            setPosition={setPosition}
            setSelectedDancers={setSelectedDancers}
            position={position}
            pixelsPerSecond={pixelsPerSecond}
            addToStack={addToStack}
            pushChange={pushChange}
            formationGroups={formationGroups}
            localSettings={localSettings}
            shiftHeld={shiftHeld}
            // bind={bind}
            // setSelectedFormations={setSelectedFormations}
            // selectedFormations={selectedFormations}
         />
      </div>
   );
};
