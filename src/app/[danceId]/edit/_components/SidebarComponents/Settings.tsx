import { cloudSettings, dancer, dancerPosition, formation, localSettings, stageDimensions } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import { useStore } from "../../store";
export const Settings: React.FC<{
   setLocalSettings: Function;
   localSettings: any;
   dropDownToggle: boolean;
   pushChange: Function;
   // formations: formation[];
   // cloudSettings: cloudSettings;
   // setCloudSettings: Function;
   // setFormations: Function;
   setHelpUrl: Function;
}> = ({ setLocalSettings, localSettings, dropDownToggle, pushChange, setHelpUrl }) => {
   const {
      formations,
      cloudSettings: { stageBackground, stageDimensions },
      setCloudSettings,
      cloudSettings,
   } = useStore();
   let { previousFormationView, gridSnap, dancerStyle, videoPlacement } = localSettings;
   // let { stageBackground, stageDimensions } = cloudSettings;
   const [newWidth, setNewWidth] = useState(stageDimensions.width.toString());
   const [newHeight, setNewHeight] = useState(stageDimensions.height.toString());

   useEffect(() => {
      setNewWidth(stageDimensions.width.toString());
      setNewHeight(stageDimensions.height.toString());
   }, [stageDimensions]);

   const setPreviousFormationView = (val: string) => {
      setLocalSettings((settings: localSettings) => {
         return { ...settings, previousFormationView: val };
      });
   };

   const setGridSnap = (val: number) => {
      setLocalSettings((settings: localSettings) => {
         return { ...settings, gridSnap: val };
      });
   };
   const setDancerStyle = (val: string) => {
      setLocalSettings((settings: localSettings) => {
         return { ...settings, dancerStyle: val };
      });
   };

   const setVideoPlacement = (val: string) => {
      setLocalSettings((settings: localSettings) => {
         return { ...settings, videoPlacement: val };
      });
   };

   const changeWidth = (amount: number) => {
      // for (let i = 0; i < formations.length; i++) {
      //    for (let j = 0; j < formations[i].positions.length; j++) {
      //       if (
      //          (formations[i].positions[j]?.position.x === stageDimensions.width / 2 - 3 ||
      //             formations[i].positions[j]?.position.x === -stageDimensions.width / 2 + 3) &&
      //          amount < 0
      //       ) {
      //          toast.error("Dancers are too close to the edge");
      //          return;
      //       }
      //    }
      // }

      // move dancers that are too close to the edge
      // setFormations((formations: formation[]) => {
      //    return formations.map((formation, i) => {
      //       return {
      //          ...formation,
      //          positions: formation.positions.map((position) => {
      //             if (position.position.x < -(stageDimensions.width / 2 - 3)) {
      //                return { ...position, position: { ...position.position, x: position.position.x - amount / 2 } };
      //             }
      //             if (position.position.x > stageDimensions.width / 2 - 3) {
      //                return { ...position, position: { ...position.position, x: position.position.x + amount / 2 } };
      //             }
      //             return position;
      //          }),
      //       };
      //    });
      // });

      setCloudSettings({ ...cloudSettings, stageDimensions: { ...stageDimensions, width: cloudSettings.stageDimensions.width + amount } });

      pushChange();
   };

   const changeHeight = (amount: number) => {
      // check to make sure dancers won't fall off the stage
      // for (let i = 0; i < formations.length; i++) {
      //    for (let j = 0; j < formations[i].positions.length; j++) {
      //       if (
      //          (formations[i].positions[j]?.position.y === stageDimensions.height / 2 - 1 ||
      //             formations[i].positions[j]?.position.y === -stageDimensions.height / 2 + 1) &&
      //          amount < 0
      //       ) {
      //          toast.error("dancers will fall off the stage");
      //          return;
      //       }
      //    }
      // }

      setCloudSettings({ ...cloudSettings, stageDimensions: { ...stageDimensions, height: cloudSettings.stageDimensions.height + amount } });
      pushChange();
   };

   const setStageBackground = (val: string) => {
      if (val === "cheer9") {
         setCloudSettings({ ...cloudSettings, stageDimensions: { width: 36, height: 28 } });
      }
      setCloudSettings({
         ...cloudSettings,
         stageBackground: val,
      });
   };

   return (
      <>
         <style jsx>
            {`
               input::-webkit-outer-spin-button,
               input::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
               }
            `}
         </style>
         <Toaster></Toaster>
         <div className=" w-[260px]  min-w-[260px]  block bg-white dark:bg-neutral-800 dark:text-white h-full  py-4 overflow-y-scroll pl-1">
            <p className=" pl-3  font-medium mb-1 text-sm flex flex-row justify-between">
               Previous Formation's Avatars{" "}
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2  cursor-pointer"
                  onClick={(e) => {
                     setHelpUrl({ url: "https://www.youtube.com/shorts/pY0IUM1ebHE", event: e });
                  }}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
               </svg>
            </p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={
                  previousFormationView === "none" ? "None" : previousFormationView === "ghostDancers" ? "Ghost Dancers" : "Ghost Dancers + Paths"
               }
               actions={[
                  () => setPreviousFormationView("none"),
                  () => setPreviousFormationView("ghostDancers"),
                  () => setPreviousFormationView("ghostDancersAndPaths"),
               ]}
               options={["None", "Ghost Dancers", "Ghost Dancers + Paths"]}
            ></Dropdown>

            {/* <hr className="my-2" /> */}

            <p className="pl-3 font-medium mb-1 text-sm mt-4">Grid Snap</p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={gridSnap === 100 ? "None" : gridSnap === 1 ? "Whole Square" : "Half Square"}
               actions={[() => setGridSnap(100), () => setGridSnap(2), () => setGridSnap(1)]}
               options={["None", "Half Square", "Whole Square"]}
            ></Dropdown>

            {/* <hr className="my-2" /> */}

            <p className="  pl-3 font-medium mb-1 text-sm mt-4">Dancer Style</p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={
                  dancerStyle === "initials"
                     ? "Initials"
                     : dancerStyle === "numbered"
                     ? "Numbered"
                     : dancerStyle === "initialsAndName"
                     ? "Intiials and Name"
                     : "Solid"
               }
               actions={[
                  () => setDancerStyle("initials"),
                  () => setDancerStyle("numbered"),
                  () => setDancerStyle("solid"),
                  () => setDancerStyle("initialsAndName"),
               ]}
               options={["Initials", "Numbered", "Solid", "Initials and Name"]}
            ></Dropdown>
            <p className="  pl-3 font-medium mb-1 text-sm mt-4">Video Position</p>
            <Dropdown
               dropDownToggle={dropDownToggle}
               value={videoPlacement === "left" ? "Left" : videoPlacement === "hidden" ? "Hidden" : videoPlacement === "above" ? "Above" : "PIP"}
               actions={[
                  () => setVideoPlacement("pip"),
                  () => setVideoPlacement("left"),
                  () => setVideoPlacement("above"),
                  () => setVideoPlacement("hidden"),
               ]}
               options={["PIP", "Left", "Above", "Hidden"]}
            ></Dropdown>
         </div>
      </>
   );
};
