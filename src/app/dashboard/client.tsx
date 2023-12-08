"use client";

import { PerformancePreview } from "./_components/PerformancePreview";
import { v4 as uuidv4 } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { NewPerformanceBuilder } from "./_components/NewPerformanceBuilder";
import { useIsDesktop } from "../../utls";
import { cloudSettings, dancer } from "../../types/types";
import { Dance } from "../../types/supabase";

export default function Client({ myDances, sharedWithMe, session, rosters, projects, plan }) {
   const MAX_NUMBER_OF_DANCES_FOR_FREE_PLAN = 3;

   const supabase = createClientComponentClient();
   const router = useRouter();

   async function createNewDance(roster, stage, projectId: string | null) {
      if (!plan && myDances.length >= MAX_NUMBER_OF_DANCES_FOR_FREE_PLAN) {
         router.push("/upgrade");
         return;
      }
      if (!session) {
         router.push(`/login`);
         return;
      }

      const defaultRoster = new Array(10)
         .fill(0)
         .map((_, index) => ({ name: `Dancer-${index + 1}` }))
         .map((dancer) => {
            return { ...dancer, id: uuidv4() };
         });

      const settings = {
         gridSnap: 1,
         previousFormationView: "ghostDancersAndPaths",

         // default stage
         stageBackground: "gridfluid",
         gridSubdivisions: 8,
         verticalFineDivisions: 4,
         horizontalFineDivisions: 4,
         horizontalGridSubdivisions: 4,
         stageDimensions: { width: 36, height: 24 },
         ...stage,
      };

      const { gridSizeX, gridSizeY } = getGridCellSize(settings);

      const { data, error } = await supabase
         .from("dances")
         .insert([
            {
               user: session.user.id,
               last_edited: new Date(),
               dancers: roster || defaultRoster,
               formations: [
                  {
                     name: "First formation",
                     id: uuidv4(),
                     positions: (roster || defaultRoster).map((dancer, index) => {
                        const numDancersPerCol = stage?.stageDimensions?.height / gridSizeY;
                        const currentCol = Math.floor(index / numDancersPerCol);
                        const oddIndex = index % 2 === 0;
                        const x = oddIndex
                           ? -settings.stageDimensions.width / 2 - gridSizeX * currentCol * 2
                           : settings.stageDimensions.width / 2 + gridSizeX * currentCol * 2;
                        const cycle = Math.floor((index % numDancersPerCol) / 2);

                        const y = settings.stageDimensions.height / 2 - cycle * gridSizeY * 2;
                        return {
                           ...dancer,
                           position: { x, y },
                        };
                     }),

                     durationSeconds: 3,
                     transition: { durationSeconds: 3 },
                  },
                  {
                     name: "Second formation",
                     id: uuidv4(),
                     positions: (roster || defaultRoster).map((dancer, index) => {
                        const numDancersPerCol = stage?.stageDimensions?.height / gridSizeY;
                        const currentCol = Math.floor(index / numDancersPerCol) + 1;
                        const oddIndex = index % 2 === 0;
                        let x = oddIndex
                           ? -settings.stageDimensions.width / 2 - gridSizeX * currentCol * 2
                           : settings.stageDimensions.width / 2 + gridSizeX * currentCol * 2;

                        // in second formation, dancers are closer to the center
                        x = x / 2;
                        const cycle = Math.floor((index % numDancersPerCol) / 2);

                        const y = settings.stageDimensions.height / 2 - cycle * gridSizeY * 2;
                        return {
                           ...dancer,
                           position: { x, y },
                        };
                     }),

                     durationSeconds: 3,
                     transition: { durationSeconds: 3 },
                  },
               ],
               settings,
               project_id: projectId || null,
            },
         ])
         .select("*")
         .single();

      if (!data?.id) return;
      return data;
   }

   const isDesktop = useIsDesktop();

   return (
      <div className="overflow-y-scroll h-full flex-grow px-4 py-5 flex flex-col gap-5 ">
         <p className="text-3xl font-semibold">Recents</p>
         <button
            onClick={async () => {
               // mobile create new default dance no options
               const data = await createNewDance(null, null, null);
               router.refresh();
               router.push(`/${data.id}/edit`);
            }}
            className="bg-pink-600  mb-6 lg:hidden  mt-3 w-full text-white text-xs py-2 px-4  rounded-lg mr-auto "
         >
            New performance
         </button>

         <div className="flex flex-row items-center gap-5">
            <Dialog>
               {isDesktop ? (
                  <DialogTrigger>
                     <button className="w-[230px] bg-white h-[50px] rounded-md flex flex-row items-center pl-5 text-black">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-4 h-4 mr-3"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                           />
                        </svg>
                        <p className="text-sm font-medium">New performance</p>
                     </button>
                  </DialogTrigger>
               ) : null}

               <DialogContent className="min-w-[600px] ">
                  <NewPerformanceBuilder
                     myDances={myDances}
                     rosters={rosters}
                     projects={projects}
                     createNewDance={createNewDance}
                  ></NewPerformanceBuilder>
               </DialogContent>
            </Dialog>
         </div>

         <div className="w-full grid grid-cols-1 gap-[32px]    rounded-xl sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-4   overscroll-contain items-center">
            {[...myDances, ...sharedWithMe].length ? (
               [...myDances, ...sharedWithMe]
                  .sort((a: Dance, b: Dance) => new Date(b.last_edited).getTime() - new Date(a.last_edited).getTime())
                  ?.map((dance: Dance) => {
                     return (
                        <div key={dance.id}>
                           <PerformancePreview projects={projects} dance={dance} session={session}></PerformancePreview>
                        </div>
                     );
                  })
            ) : (
               <p className="text-sm font-medium">No performances here</p>
            )}
         </div>
      </div>
   );
}

const getGridCellSize = (cloudSettings: cloudSettings) => {
   const { stageBackground, gridSubdivisions, horizontalGridSubdivisions, verticalFineDivisions, horizontalFineDivisions, stageDimensions } =
      cloudSettings;

   let gridSizeX = 1;
   let gridSizeY = 1;

   if (stageBackground === "gridfluid" || stageBackground === "cheer9") {
      // Determine the total number of divisions along each axis.
      const totalVerticalDivisions = gridSubdivisions * verticalFineDivisions;
      const totalHorizontalDivisions = horizontalGridSubdivisions * horizontalFineDivisions;

      // Calculate the width and height of each grid cell.
      gridSizeX = stageDimensions.width / totalVerticalDivisions;
      gridSizeY = stageDimensions.height / totalHorizontalDivisions;
   } else {
      gridSizeX = 1;
      gridSizeY = 1;
   }

   return { gridSizeX, gridSizeY };
};
