import NumberToggle from "../../../../@/components/NumberToggle";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import Image from "next/image";
import nflField from "../../../../public/nfl.svg";
import nbaCourt from "../../../../public/nba.svg";
import cheerFloor from "../../../../public/cheerfloor.svg";
import { v4 as uuidv4 } from "uuid";
import { cloudSettings, dancer } from "../../../types/types";
import { SelectGroup, SelectLabel, SelectScrollDownButton } from "@radix-ui/react-select";
import { useRouter } from "next/navigation";

export const NewPerformanceBuilder: React.FC<{}> = ({ rosters, projects, createNewDance, myDances }) => {
   const router = useRouter();

   // ignore if roster chosen
   const [numPerformers, setNumPerformers] = useState(10);

   // this is either the rosterId or the danceId to pull the roster from
   const [selectedRoster, setSelectedRoster] = useState(null);

   // can be template name or danceId from which to pull the stage
   const [selectedTemplate, setSelectedTemplate] = useState<"cheer9" | "nba" | "nfl" | "default" | string>("default");
   const [selectedProjectId, setSelectedProjectId] = useState(null);

   const [creatingPerformanceLoading, setCreatingPerformanceLoading] = useState(false);

   const templates = {
      cheer9: {
         stageDimensions: { width: 54, height: 42 },
         gridSubdivisions: 9,
      },
      cheer7: {
         stageDimensions: { width: 42, height: 42 },
         gridSubdivisions: 7,
      },
      nba: {
         stageDimensions: { width: 94, height: 50 },
         backgroundUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/f30197ba-cf06-4234-bcdb-5d40d83c7999/basketball.png",
      },
      nfl: { stageDimensions: { width: 330, height: 160 } },
      default: { stageDimensions: { width: 36, height: 24 } },
   };

   const roster = useMemo(() => {
      const preMadeRoster = rosters.find((roster) => roster.id === selectedRoster)?.roster;
      const rosterFromDance = myDances.find((dance) => dance.id === selectedRoster)?.dancers;
      const newRoster = new Array(numPerformers).fill(0).map((_, index) => ({ name: `Dancer-${index + 1}` }));

      const roster = preMadeRoster || rosterFromDance || newRoster;

      // assign new ids to each dancer
      return roster.map((dancer: dancer) => {
         return { ...dancer, id: uuidv4() };
      });
   }, [selectedRoster, numPerformers]);

   const stage = templates[selectedTemplate] || myDances.find((dance) => dance.id === selectedTemplate)?.settings;

   return (
      <>
         <style>
            {`
            
            
//             ::-webkit-scrollbar {
//   -webkit-appearance: none;
//   width: 7px;
// }

// ::-webkit-scrollbar-thumb {
//   border-radius: 4px;
//   background-color: rgba(0, 0, 0, .5);
//   box-shadow: 0 0 1px rgba(255, 255, 255, .5);
// }


`}
         </style>
         <div className="flex flex-col gap-8">
            <div className="w-full h-full flex flex-row items-start justify-between">
               <div className="flex flex-col  gap-2 w-full items-start">
                  <p className="font-medium text-lg">
                     Add performers <span className="text-xs font-normal ml-2 text-neutral-400">you can change this later</span>
                  </p>
                  <div className="flex flex-row justify-between w-full items-end">
                     <div
                        style={{
                           opacity: selectedRoster ? 0.5 : 1,
                           pointerEvents: selectedRoster ? "none" : "auto",
                        }}
                        className="flex flex-col gap-3 "
                     >
                        <NumberToggle label={"performers"} count={roster.length} setCount={setNumPerformers} min={1} max={100}></NumberToggle>
                     </div>

                     {rosters.length || myDances.filter((dance) => !dance.isInTrash).length ? (
                        <div className="flex flex-col gap-1  items-end">
                           <p className="text-sm font-medium">Existing rosters</p>

                           <Select
                              onValueChange={(value) => {
                                 setSelectedRoster(value);
                              }}
                           >
                              <SelectTrigger className="w-min overflow-hidden">
                                 <SelectValue placeholder="No roster" />
                              </SelectTrigger>

                              <SelectContent className="max-h-[300px]">
                                 <SelectGroup>
                                    <SelectItem value={null}>
                                       <p className="">No roster</p>
                                    </SelectItem>
                                 </SelectGroup>
                                 {rosters.length ? (
                                    <SelectGroup>
                                       <div className="flex flex-row w-full items-end py-2">
                                          <div className="w-[10px] bg-neutral-700 h-[1px] "></div>
                                          <p className="text-[10px] text-neutral-300 px-2 relative top-[3px]">Rosters</p>
                                          <div className="w-full bg-neutral-700 h-[1px]"></div>
                                       </div>
                                       {rosters.map((roster) => {
                                          return (
                                             <SelectItem key={roster.id} value={roster.id}>
                                                <p className="">{roster.name}</p>
                                             </SelectItem>
                                          );
                                       })}
                                    </SelectGroup>
                                 ) : null}
                                 {myDances.length ? (
                                    <SelectGroup>
                                       <div className="flex flex-row w-full items-end py-2">
                                          <div className="w-[10px] bg-neutral-700 h-[1px] "></div>
                                          <p className="text-[10px] whitespace-nowrap text-neutral-300 px-2 relative top-[3px]">Copy roster from</p>
                                          <div className="w-full bg-neutral-700 h-[1px] "></div>
                                       </div>
                                       {myDances
                                          .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                                          .filter((dance) => !dance.isInTrash)
                                          .map((dance) => {
                                             return (
                                                <SelectItem key={dance.id} value={dance.id}>
                                                   <p className="">{dance.name}</p>
                                                </SelectItem>
                                             );
                                          })}
                                    </SelectGroup>
                                 ) : null}
                              </SelectContent>
                           </Select>
                        </div>
                     ) : null}
                  </div>
               </div>
            </div>
         </div>

         <div className="h-[1px] bg-neutral-700 w-full my-4"></div>
         <div className="flex flex-col  w-full">
            <DialogTitle className="mb-3">
               Choose your stage <span className="text-xs font-normal ml-2 text-neutral-400">you can change this later</span>
            </DialogTitle>
            <Tabs
               onValueChange={() => {
                  setSelectedTemplate(null);
               }}
               defaultValue="existing"
               className=""
            >
               <TabsContent className="gap-5 flex flex-col" value="existing">
                  <div>
                     <div className=" w-[550px]  overflow-scroll pb-3 ">
                        <div className="flex flex-row items-center justify-center gap-8  w-min  p-2 ">
                           <div
                              onClick={() => {
                                 setSelectedTemplate("default");
                              }}
                              className="   "
                           >
                              <div
                                 style={{
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    width: letterboxDimensions(198, 98, 36, 24).width,
                                    height: letterboxDimensions(198, 98, 36, 24).height,
                                    outline: selectedTemplate === "default" ? "2px solid #FCA3FE" : "2px solid #404040",
                                 }}
                                 className="relative pointer-events-none  rounded-md opacity-100 bg-neutral-800 flex flex-col items-center justify-end text-xs py-1 "
                              >
                                 <p className="text-neutral-300">{"Default"}</p>
                                 <div className=" text-xl font-semibold absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ">
                                    <p className="whitespace-nowrap">
                                       36x24 <span className="text-xs text-neutral-300 font-normal"> feet</span>
                                    </p>
                                 </div>
                              </div>
                           </div>

                           {myDances.length ? (
                              <>
                                 <div className="bg-neutral-700 h-[100px] min-w-[1px]"></div>
                                 {myDances.map((dance) => {
                                    return (
                                       <div
                                          onClick={() => {
                                             setSelectedTemplate(dance.id);
                                          }}
                                          className="w-full h-full grid place-items-center relative "
                                          key={dance.id}
                                       >
                                          <div
                                             style={{
                                                backgroundImage: `url(${dance.settings.backgroundUrl})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                width: letterboxDimensions(
                                                   198,
                                                   98,
                                                   dance.settings.stageDimensions.width,
                                                   dance.settings.stageDimensions.height
                                                ).width,
                                                height: letterboxDimensions(
                                                   198,
                                                   98,
                                                   dance.settings.stageDimensions.width,
                                                   dance.settings.stageDimensions.height
                                                ).height,

                                                outline: selectedTemplate === dance.id ? "2px solid #FCA3FE" : "2px solid #404040",
                                             }}
                                             className="rounded-md opacity-100 flex pointer-events-none  flex-col overflow-hidden bg-neutral-800  items-center justify-end text-xs py-1 "
                                          >
                                             <p className="text-neutral-300  whitespace-nowrap">{dance.name}</p>
                                          </div>
                                          <p className="absolute text-xl font-semibold">
                                             {dance.settings.stageDimensions.width}x{dance.settings.stageDimensions.height}
                                             <span className="text-xs text-neutral-300 font-normal"> feet</span>
                                          </p>
                                       </div>
                                    );
                                 })}
                              </>
                           ) : null}
                        </div>
                     </div>
                  </div>

                  <div>
                     <p className=" font-medium text-sm">Stage templates</p>
                     <div className=" w-[550px]  overflow-scroll pb-3 ">
                        <div className="flex flex-row items-center justify-center gap-8  w-min  ">
                           <div
                              onClick={() => {
                                 setSelectedTemplate("cheer9");
                              }}
                              style={{
                                 borderColor: selectedTemplate === "cheer9" ? "#FCA3FE" : "transparent",
                              }}
                              className="flex flex-col gap-1 w-max border-2 rounded-md p-2 pt-1 border-transparent"
                           >
                              <p className="text-sm">{"Cheer floor (9 rolls)"}</p>
                              <Image height={80} priority src={cheerFloor} alt="Follow us on Twitter" />
                           </div>
                           <div
                              onClick={() => {
                                 setSelectedTemplate("cheer7");
                              }}
                              style={{
                                 borderColor: selectedTemplate === "cheer7" ? "#FCA3FE" : "transparent",
                              }}
                              className="flex flex-col gap-1 w-max border-2 rounded-md p-2 pt-1 border-transparent"
                           >
                              <p className="text-sm">{"Cheer floor (7 rolls)"}</p>
                              <Image height={80} priority src={cheerFloor} alt="Follow us on Twitter" />
                           </div>

                           <div
                              onClick={() => {
                                 setSelectedTemplate("nba");
                              }}
                              style={{
                                 borderColor: selectedTemplate === "nba" ? "#FCA3FE" : "transparent",
                              }}
                              className="flex flex-col gap-1 w-max border-2 rounded-md p-2 border-transparent"
                           >
                              <p className="text-sm">{"Basketball court"}</p>
                              <Image height={80} priority src={nbaCourt} alt="Follow us on Twitter" />
                           </div>
                        </div>
                     </div>
                  </div>
               </TabsContent>
            </Tabs>

            <div className="flex flex-row justify-between items-end py-3">
               {projects.length ? (
                  <div className="flex flex-col items-start">
                     <p className="font-medium mb-1">Add to project</p>
                     <Select
                        onValueChange={(value) => {
                           setSelectedProjectId(value);
                        }}
                     >
                        <SelectTrigger className="w-[180px]">
                           <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value={null}>
                              <p className="">None</p>
                           </SelectItem>
                           {projects.map((project) => {
                              return (
                                 <SelectItem key={project.id} value={project.id}>
                                    <p className="">{project.name}</p>
                                 </SelectItem>
                              );
                           })}
                        </SelectContent>
                     </Select>
                  </div>
               ) : null}

               <Button
                  onClick={async () => {
                     setCreatingPerformanceLoading(true);
                     const data = await createNewDance(roster, stage, selectedProjectId);

                     setCreatingPerformanceLoading(false);
                  }}
                  style={{
                     width: projects.length ? "200px" : "100%",
                     opacity: creatingPerformanceLoading ? 0.5 : 1,
                     pointerEvents: creatingPerformanceLoading ? "none" : "auto",
                  }}
                  className=" ml-auto  "
               >
                  Create performance
               </Button>
            </div>
         </div>
         {/* )} */}
      </>
   );
};
function letterboxDimensions(maxWidth: number, maxHeight: number, actualWidth: number, actualHeight: number): { width: number; height: number } {
   // Calculate the aspect ratio of the actual dimensions
   const aspectRatio = actualWidth / actualHeight;

   // Initialize the new width and height
   let newWidth: number;
   let newHeight: number;

   // Scale based on the aspect ratio
   if (actualWidth / maxWidth > actualHeight / maxHeight) {
      // If the width is the limiting factor
      newWidth = maxWidth;
      newHeight = newWidth / aspectRatio;
   } else {
      // If the height is the limiting factor
      newHeight = maxHeight;
      newWidth = newHeight * aspectRatio;
   }

   // Return the new dimensions
   return { width: newWidth, height: newHeight };
}
