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
import PropertyAdd from "../../../../../../@/components/PropertyAdd";
import { HStack, VStack } from "../../../../../../@/components/ui/stacks";
import { HDivider } from "../../../../../../@/components/ui/hdivider";
import { Subtract } from "../../../../../../@/components/ui/button";

import { cloudSettings } from "../../../../../types/types";
import { useStore } from "../../store";

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
      props,
      setProps,
      setFormations,
      formations,
   } = useStore();
   const supabase = createClientComponentClient();
   const [myDances, setMyDances] = useState([]);

   const setStageBackground = (val: "gridfluid" | "none" | "grid") => {
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
      <VStack
         style={{
            pointerEvents: viewOnly ? "none" : "all",
         }}
         className=" text-xs  font-medium  dark:text-white overflow-y-scroll overflow-x-hidden "
      >
         <HStack className="items-center justify-between gap-2 px-2 py-2">
            <p>Stage</p>

            {!viewOnly ? (
               <DropdownMenu>
                  <DropdownMenuTrigger>
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
                     <DropdownMenuItem onClick={() => setCloudSettings({ ...cloudSettings, ...templates.default })}>Default</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setCloudSettings({ ...cloudSettings, ...templates.cheer9 })}>
                        Cheer floor - 9 Rolls
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setCloudSettings({ ...cloudSettings, ...templates.nba })}>Basketball court</DropdownMenuItem>

                     {myDances.length ? (
                        <>
                           <DropdownMenuSeparator />
                           <DropdownMenuLabel>Import stage from</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           {myDances.map((dance) => {
                              return (
                                 <DropdownMenuItem onClick={() => setCloudSettings({ ...cloudSettings, ...(dance?.settings || {}) })}>
                                    {dance?.name}
                                 </DropdownMenuItem>
                              );
                           })}
                        </>
                     ) : null}
                  </DropdownMenuContent>
               </DropdownMenu>
            ) : null}
         </HStack>

         <VStack className="gap-2 px-2 py-2">
            <p className="py-1">Dimensions (feet)</p>

            <HStack className="items-center justify-between">
               <NumberToggle
                  readOnly={viewOnly}
                  count={stageDimensions.width}
                  label={"Width"}
                  setCount={(count: number) => setCloudSettings({ ...cloudSettings, stageDimensions: { ...stageDimensions, width: count } })}
                  min={5}
                  max={300}
               ></NumberToggle>
               <div className="h-full w-[1px] bg-neutral-700"></div>
               <NumberToggle
                  readOnly={viewOnly}
                  count={stageDimensions.height}
                  label={"Height"}
                  setCount={(count: number) => setCloudSettings({ ...cloudSettings, stageDimensions: { ...stageDimensions, height: count } })}
                  min={5}
                  max={300}
               ></NumberToggle>
            </HStack>
         </VStack>

         <HDivider />

         <VStack className="gap-2 p-2">
            <HStack className="items-center justify-between">
               <p>Grid</p>
               {stageBackground !== "none" && stageBackground !== "custom" && stageBackground ? (
                  <Subtract onClick={() => setStageBackground("none")}></Subtract>
               ) : (
                  <button
                     onClick={() => setCloudSettings({ ...cloudSettings, stageBackground: "gridfluid" })}
                     className="hover:bg-neutral-800 p-1 cursor-default"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                     </svg>
                  </button>
               )}
            </HStack>
            {/* custom is deprecated */}
            {stageBackground !== "none" && stageBackground !== "custom" && stageBackground ? (
               <Select
                  size={"1"}
                  onValueChange={(value: "none" | "grid" | "gridfluid") => {
                     setStageBackground(value);
                  }}
                  // deprecating cheer9 & custom
                  value={stageBackground === "cheer9" ? "gridfluid" : stageBackground}
               >
                  <SelectTrigger className=" dark:bg-neutral-900  h-8 w-min">
                     <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                     <SelectItem value="grid">Strict Grid</SelectItem>
                     <SelectItem value="gridfluid">Flex Grid</SelectItem>
                  </SelectContent>
               </Select>
            ) : null}
         </VStack>

         {stageBackground === "cheer9" || stageBackground === "gridfluid" ? (
            <>
               <HDivider />
               <VStack className="gap-2 p-2">
                  <p className="py-1">Divisions</p>

                  <div className="flex flex-row items-center justify-between w-full">
                     <NumberToggle
                        readOnly={viewOnly}
                        count={cloudSettings.gridSubdivisions}
                        label={"Vertical"}
                        setCount={(count: number) => setCloudSettings({ ...cloudSettings, gridSubdivisions: count })}
                        min={1}
                        max={20}
                     ></NumberToggle>
                     <div className="h-full w-[1px] bg-neutral-700"></div>
                     <NumberToggle
                        readOnly={viewOnly}
                        count={cloudSettings.horizontalGridSubdivisions}
                        label={"Horizontal"}
                        setCount={(count: number) => setCloudSettings({ ...cloudSettings, horizontalGridSubdivisions: count })}
                        min={1}
                        max={20}
                     ></NumberToggle>
                  </div>
               </VStack>

               <PropertyAdd
                  label={"Subdivisions"}
                  canAdd={cloudSettings.hideSubdivisions}
                  canSubtract={!cloudSettings.hideSubdivisions}
                  isOpen={!cloudSettings.hideSubdivisions}
                  onAdd={() => setCloudSettings({ ...cloudSettings, hideSubdivisions: false })}
                  onSubtract={() => setCloudSettings({ ...cloudSettings, hideSubdivisions: true })}
               >
                  <HStack className="items-center justify-between px-2">
                     <NumberToggle
                        readOnly={viewOnly}
                        count={cloudSettings.verticalFineDivisions}
                        label={"Vertical"}
                        setCount={(count: number) => setCloudSettings({ ...cloudSettings, verticalFineDivisions: count })}
                        min={1}
                        max={20}
                     ></NumberToggle>
                     <div className="h-full w-[1px] bg-neutral-700"></div>
                     <NumberToggle
                        readOnly={viewOnly}
                        count={cloudSettings.horizontalFineDivisions}
                        label={"Horizontal"}
                        setCount={(count: number) => setCloudSettings({ ...cloudSettings, horizontalFineDivisions: count })}
                        min={1}
                        max={20}
                     ></NumberToggle>
                  </HStack>
               </PropertyAdd>
            </>
         ) : null}

         {stageBackground === "grid" ? (
            <>
               <HDivider />
               <HStack className="items-center justify-center p-2">
                  <NumberToggle
                     readOnly={viewOnly}
                     count={cloudSettings.gridSubdivisions}
                     label={"Subdivisions"}
                     setCount={(count: number) => setCloudSettings({ ...cloudSettings, gridSubdivisions: count })}
                     min={1}
                     max={20}
                  ></NumberToggle>
               </HStack>
            </>
         ) : null}

         <PropertyAdd
            label={"Stage background image"}
            canAdd={!cloudSettings.backgroundUrl}
            canSubtract={Boolean(cloudSettings.backgroundUrl)}
            isOpen={Boolean(cloudSettings.backgroundUrl)}
            onAdd={() => setAssetsOpen("stagebackground")}
            onSubtract={() => setCloudSettings({ ...cloudSettings, backgroundUrl: "" })}
         >
            <HStack className="items-center w-full justify-between px-2">
               <div onClick={() => setAssetsOpen("stagebackground")} className="h-9 w-9 grid place-items-center">
                  <img draggable={false} className=" object-contain max-h-[36px] " src={cloudSettings.backgroundUrl} alt="" />
               </div>
               <input
                  value={(cloudSettings.backgroundImageOpacity === undefined ? "100" : cloudSettings.backgroundImageOpacity) + "%"}
                  onChange={(e) =>
                     setCloudSettings({
                        ...cloudSettings,
                        backgroundImageOpacity: e.target.value.replace("%", ""),
                     })
                  }
                  className="w-16 text-xs bg-transparent border text-center border-transparent focus:outline-none px-2 py-1 focus:border-neutral-700 cursor-default "
                  type="text"
               />
            </HStack>
         </PropertyAdd>

         <PropertyAdd
            label={"Set pieces"}
            canAdd={true}
            canSubtract={false}
            isOpen={props.length > 0}
            onAdd={() => setAssetsOpen({ type: "prop" })}
            onSubtract={() => setProps([])}
         >
            <VStack className="gap-2 w-full">
               {props.map((prop) => {
                  return (
                     <div className="flex flex-row w-full justify-between items-center px-2">
                        <div onClick={() => setAssetsOpen({ type: "prop", id: prop.id })} className="h-9 w-9 grid place-items-center">
                           <img
                              className=" object-contain max-h-[36px] "
                              src={`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${prop.user_id}/${prop?.url}`}
                              alt=""
                           />
                        </div>
                        <div className="flex flex-row items-center gap-2">
                           <Select
                              value={prop.type}
                              onValueChange={(value) => {
                                 // onChange={(event) => {
                                 if (viewOnly) return;
                                 // if you make a prop static just place it in the middle of the stage
                                 if (value === "static") {
                                    setProps(
                                       props.map((propx) => {
                                          if (propx.id === prop.id) {
                                             return {
                                                ...propx,
                                                static: {
                                                   width: 5,
                                                   position: {
                                                      x: 0,
                                                      y: 0,
                                                   },
                                                },
                                             };
                                          }
                                          return propx;
                                       })
                                    );
                                 } else {
                                    setFormations(
                                       formations.map((formation) => {
                                          const hasProp = (formation.props || []).find((propx) => propx.id === prop.id);

                                          return {
                                             ...formation,
                                             props: hasProp
                                                ? formation.props
                                                : [...(formation.props || []), { id: prop.id, position: { x: 0, y: 0 } }],
                                          };
                                       })
                                    );
                                 }

                                 const selectedValue = value;
                                 if (selectedValue === "static" || selectedValue === "dynamic") {
                                    setProps(
                                       props.map((propx) => {
                                          if (propx.id === prop.id) {
                                             return {
                                                ...propx,
                                                type: selectedValue, // Use the selectedValue here
                                             };
                                          }
                                          return propx;
                                       })
                                    );
                                 }
                                 // }}
                              }}
                           >
                              <SelectTrigger className="text-xs h-8 dark:bg-neutral-900">
                                 <SelectValue placeholder="Static" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="dynamic">Dynamic</SelectItem>
                                 <SelectItem value="static">Static</SelectItem>
                              </SelectContent>
                           </Select>

                           <Subtract
                              onClick={() => {
                                 if (viewOnly) return;
                                 setFormations(
                                    formations.map((formation, i) => {
                                       return {
                                          ...formation,
                                          props: formation.props?.filter((p) => p.id !== prop.id),
                                       };
                                    })
                                 );
                                 setProps(props.filter((p) => p.id !== prop.id));
                              }}
                           ></Subtract>
                        </div>
                     </div>
                  );
               })}
            </VStack>
         </PropertyAdd>
         <HDivider></HDivider>
      </VStack>
   );
};
