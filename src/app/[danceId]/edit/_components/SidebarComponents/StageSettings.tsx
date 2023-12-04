import { cloudSettings, dancer, dancerPosition, formation, localSettings, stageDimensions } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useStore } from "../../store";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NumberToggle from "../../../../../../@/components/NumberToggle";
import { useEffect, useState } from "react";

import { Session, SupabaseClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
export const StageSettings: React.FC<{
   setAssetsOpen: Function;
   session: Session;
}> = ({ setAssetsOpen, session }) => {
   const {
      viewOnly,
      cloudSettings: { stageBackground, stageDimensions },
      cloudSettings,
      setCloudSettings,
      get,
   } = useStore();
   const supabase = createClientComponentClient();
   const [myDances, setMyDances] = useState([]);
   const setStageBackground = (val: string) => {
      // if (val === "cheer9") {
      //    setCloudSettings({ ...cloudSettings, stageDimensions: { width: 36, height: 28 }, gridSubdivisions: 9 });
      // }
      setCloudSettings({
         ...get().cloudSettings,
         stageBackground: val,
      });
   };
   const templates = {
      cheer9: {
         stageDimensions: { width: 54, height: 42 },
         horizontalGridSubdivisions: 4,
         horizontalFineDivisions: 4,
         verticalFineDivisions: 4,
         gridSubdivisions: 9,
         backgroundUrl: "",
         hideSubdivisions: false,
         stageBackground: "gridfluid",
         // backgroundUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/f30197ba-cf06-4234-bcdb-5d40d83c7999/IMG_1130.png",
      },
      nba: {
         stageDimensions: { width: 94, height: 50 },
         horizontalGridSubdivisions: 4,
         horizontalFineDivisions: 4,
         verticalFineDivisions: 4,
         gridSubdivisions: 9,
         stageBackground: "gridfluid",
         hideSubdivisions: false,
         backgroundUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/f30197ba-cf06-4234-bcdb-5d40d83c7999/basketball.png",
      },
      nfl: { stageDimensions: { width: 330, height: 160 } },
      default: {
         stageDimensions: { width: 36, height: 24 },
         horizontalGridSubdivisions: 4,
         horizontalFineDivisions: 4,
         verticalFineDivisions: 4,
         gridSubdivisions: 8,
         backgroundUrl: "",
         stageBackground: "gridfluid",
         backgroundImageOpacity: 100,
         hideSubdivisions: false,
      },
   } as { [key: string]: Partial<cloudSettings> };

   useEffect(() => {
      if (!session) return;
      const getStages = async () => {
         async function getMyDancesMetadata(session: Session, supabase: SupabaseClient) {
            let data = await supabase
               .from("dances")
               .select(
                  `
                        id,
                        created_at,
                        user,
                        name,
                        last_edited,
                        settings,
                        isInTrash,
                        project_id
                        `
               )
               .eq("user", session.user.id);

            return data?.data || [];
         }
         const data = await getMyDancesMetadata(session, supabase);
         if (data.length) {
            setMyDances(data);
         }
      };
      getStages();
   }, []);

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

         <div
            style={{
               pointerEvents: viewOnly ? "none" : "all",
            }}
            className="w-full   dark:text-white h-full flex flex-col overflow-y-scroll overflow-x-hidden "
         >
            <div className=" px-2 flex flex-col gap-2 py-2">
               <div className="flex flex-row items-center justify-between">
                  <p className="text-xs font-medium py-1">Stage</p>

                  {!viewOnly ? (
                     <DropdownMenu>
                        <DropdownMenuTrigger>
                           {" "}
                           <div className="hover:bg-neutral-800 p-1  cursor-default ">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-5 h-5 "
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                                 />
                              </svg>
                           </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-[500px] overflow-scroll">
                           <DropdownMenuLabel>Presets</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              onClick={() => {
                                 setCloudSettings({ ...cloudSettings, ...templates.default });
                              }}
                           >
                              Default
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              onClick={() => {
                                 setCloudSettings({ ...cloudSettings, ...templates.cheer9 });
                              }}
                           >
                              Cheer floor - 9 Rolls
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              onClick={() => {
                                 setCloudSettings({ ...cloudSettings, ...templates.nba });
                              }}
                           >
                              Basketball court
                           </DropdownMenuItem>

                           {myDances.length ? (
                              <>
                                 <DropdownMenuSeparator />
                                 <DropdownMenuLabel>Import stage from</DropdownMenuLabel>
                                 <DropdownMenuSeparator />
                                 {myDances.map((dance) => {
                                    return (
                                       <DropdownMenuItem
                                          onClick={() => {
                                             setCloudSettings({ ...cloudSettings, ...dance.settings });
                                          }}
                                       >
                                          {dance.name}
                                       </DropdownMenuItem>
                                    );
                                 })}
                              </>
                           ) : null}
                        </DropdownMenuContent>
                     </DropdownMenu>
                  ) : null}
               </div>
            </div>
            <div className=" px-2 flex flex-col gap-2 pb-2 border-neutral-700 ">
               <p className="text-xs font-medium py-1">Dimensions (feet)</p>

               <div className="flex flex-row items-center justify-between">
                  <NumberToggle
                     count={stageDimensions.width}
                     label={"Width"}
                     setCount={(count: number) => {
                        setCloudSettings({ ...cloudSettings, stageDimensions: { ...stageDimensions, width: count } });
                     }}
                     min={5}
                     max={300}
                  ></NumberToggle>
                  <div className="h-full w-[1px] bg-neutral-700"></div>
                  <NumberToggle
                     count={stageDimensions.height}
                     label={"Height"}
                     setCount={(count: number) => {
                        setCloudSettings({ ...cloudSettings, stageDimensions: { ...stageDimensions, height: count } });
                     }}
                     min={5}
                     max={300}
                  ></NumberToggle>
               </div>
            </div>
            <div className="w-full bg-neutral-700 min-h-[1px]"></div>
            <div className="px-2 flex flex-col gap-2 py-2">
               <div className="flex flex-row items-center justify-between">
                  <p className=" font-medium text-xs ">Grid</p>
                  {stageBackground !== "none" && stageBackground !== "custom" && stageBackground ? (
                     <button
                        onClick={() => {
                           // setSelectedPositionProperty(propertyKey, null);
                           setStageBackground("none");
                        }}
                        className="  md:text-xs text-[10px] hover:bg-neutral-800 p-1  cursor-default "
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                           <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                        </svg>
                     </button>
                  ) : (
                     <button
                        onClick={() => {
                           setCloudSettings({ ...cloudSettings, stageBackground: "gridfluid" });
                           // setAssetsOpen("stagebackground");
                        }}
                        className="hover:bg-neutral-800 p-1 cursor-default"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                           <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                     </button>
                  )}
               </div>
               {/* custom is deprecated */}
               {stageBackground !== "none" && stageBackground !== "custom" && stageBackground ? (
                  <div className="flex flex-row items-center justify-between">
                     <Select
                        size={"1"}
                        onValueChange={(value: "none" | "grid" | "gridfluid") => {
                           setStageBackground(value);
                        }}
                        // deprecating cheer9 & custom
                        value={stageBackground === "cheer9" ? "gridfluid" : stageBackground}
                     >
                        <SelectTrigger className=" dark:bg-neutral-900 text-xs h-8 w-min">
                           <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="text-xs">
                           <SelectItem value="grid">Strict Grid</SelectItem>
                           <SelectItem value="gridfluid">Flex Grid</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               ) : null}
            </div>

            {stageBackground === "cheer9" || stageBackground === "gridfluid" ? (
               <>
                  <div className=" px-2 flex flex-col gap-2 py-2 border-t border-neutral-700 ">
                     <div className="flex flex-row items-center justify-between py-1">
                        <p className=" font-medium text-xs">Divisions</p>
                     </div>

                     <div className="flex flex-row items-center justify-between">
                        <NumberToggle
                           count={cloudSettings.gridSubdivisions}
                           label={"Vertical"}
                           setCount={(count: number) => {
                              setCloudSettings({ ...cloudSettings, gridSubdivisions: count });
                           }}
                           min={1}
                           max={20}
                        ></NumberToggle>
                        <div className="h-full w-[1px] bg-neutral-700"></div>
                        <NumberToggle
                           count={cloudSettings.horizontalGridSubdivisions}
                           label={"Horizontal"}
                           setCount={(count: number) => {
                              setCloudSettings({ ...cloudSettings, horizontalGridSubdivisions: count });
                           }}
                           min={1}
                           max={20}
                        ></NumberToggle>
                     </div>
                  </div>
                  <div className="px-2 flex flex-col gap-2 border-neutral-700 border-t py-2 ">
                     <div className="flex flex-row items-center justify-between">
                        <p className=" font-medium text-xs">Subdivisions</p>
                        {!cloudSettings.hideSubdivisions ? (
                           <button
                              onClick={() => {
                                 // setSelectedPositionProperty(propertyKey, null);
                                 setCloudSettings({ ...cloudSettings, hideSubdivisions: true });
                              }}
                              className="  md:text-xs text-[10px] hover:bg-neutral-800 p-1  cursor-default "
                           >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                 <path
                                    fillRule="evenodd"
                                    d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                                    clipRule="evenodd"
                                 />
                              </svg>
                           </button>
                        ) : (
                           <button
                              onClick={() => {
                                 setCloudSettings({ ...cloudSettings, hideSubdivisions: false });
                                 // setAssetsOpen("stagebackground");
                              }}
                              className="hover:bg-neutral-800 p-1 cursor-default"
                           >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                 <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                              </svg>
                           </button>
                        )}
                     </div>

                     {!cloudSettings.hideSubdivisions ? (
                        <>
                           <div className="flex flex-row items-center justify-between">
                              {" "}
                              <NumberToggle
                                 count={cloudSettings.verticalFineDivisions}
                                 label={"Vertical"}
                                 setCount={(count: number) => {
                                    setCloudSettings({ ...cloudSettings, verticalFineDivisions: count });
                                 }}
                                 min={1}
                                 max={20}
                              ></NumberToggle>
                              <div className="h-full w-[1px] bg-neutral-700"></div>
                              <NumberToggle
                                 count={cloudSettings.horizontalFineDivisions}
                                 label={"Horizontal"}
                                 setCount={(count: number) => {
                                    setCloudSettings({ ...cloudSettings, horizontalFineDivisions: count });
                                 }}
                                 min={1}
                                 max={20}
                              ></NumberToggle>
                           </div>
                        </>
                     ) : null}
                  </div>
               </>
            ) : null}

            {stageBackground === "grid" ? (
               <div className="flex flex-row items-center justify-center py-2">
                  <NumberToggle
                     count={cloudSettings.gridSubdivisions}
                     label={"Subdivisions"}
                     setCount={(count: number) => {
                        setCloudSettings({ ...cloudSettings, gridSubdivisions: count });
                     }}
                     min={1}
                     max={20}
                  ></NumberToggle>
               </div>
            ) : null}

            {/* <div className="flex items-center space-x-2 px-2">
               <Switch id="airplane-mode" />
               <p className="text-xs">Show numbered line</p>
            </div> */}
            <div className="flex flex-col w-full px-2 border-y border-neutral-700 ">
               <div className=" flex flex-row items-center w-full justify-between h-12 ">
                  <p className="text-xs font-medium ">Stage background image</p>
                  {!cloudSettings.backgroundUrl ? (
                     <button
                        onClick={() => {
                           // setCloudSettings({ ...cloudSettings, backgroundUrl: null });
                           setAssetsOpen("stagebackground");
                        }}
                        className="hover:bg-neutral-800 p-1"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                           <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                     </button>
                  ) : null}
               </div>
               {cloudSettings.backgroundUrl ? (
                  <div className="w-full pb-2 flex flex-row items-center justify-between">
                     <div
                        onClick={() => {
                           // setCloudSettings({ ...cloudSettings, backgroundUrl: null });
                           setAssetsOpen("stagebackground");
                        }}
                        className="h-9 w-9 grid place-items-center"
                     >
                        <img className=" object-contain " src={cloudSettings.backgroundUrl} alt="" />
                     </div>
                     <input
                        value={(cloudSettings.backgroundImageOpacity === undefined ? "100" : cloudSettings.backgroundImageOpacity) + "%"}
                        onChange={(e) => {
                           setCloudSettings({
                              ...cloudSettings,
                              backgroundImageOpacity: e.target.value.replace("%", ""),
                           });
                        }}
                        className="w-16 text-xs bg-transparent border text-center border-transparent focus:outline-none px-2 py-1 focus:border-neutral-700 cursor-default "
                        type="text"
                     />

                     <button
                        onClick={() => {
                           setCloudSettings({ ...cloudSettings, backgroundUrl: null });
                        }}
                        className="  md:text-xs text-[10px] hover:bg-neutral-800 p-1  cursor-default "
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                           <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                        </svg>
                     </button>
                  </div>
               ) : null}
            </div>
         </div>
      </>
   );
};
