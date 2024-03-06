"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "../../../../../@/components/ui/button";
import { PerformancePreview } from "../../_components/PerformancePreview";
import { useRouter } from "next/navigation";
import { UploadInput } from "../../../../../@/components/upload-input";
export default function PageClient({ myDances, session, projectId }) {
   const router = useRouter();
   const supabase = createClientComponentClient();

   const updateProjectName = async (name: string) => {
      await supabase.from("projects").update({ name }).eq("id", projectId);
   };

   return (
      <div className="px-4 py-5 gap-5 flex flex-col overflow-y-scroll h-full">
         <div className="flex flex-row items-center justify-between gap-3">
            <UploadInput
               className="text-3xl font-semibold bg-transparent"
               value={myDances?.[0]?.project_id?.name || "No performances here yet"}
               onUpdate={updateProjectName}
            ></UploadInput>
            {/* <p className="text-3xl font-semibold">{myDances?.[0]?.project_id?.name || "No performances here yet"}</p> */}
            <Button
               className="shrink-0"
               onClick={async () => {
                  await supabase.from("projects").delete().eq("id", projectId);
                  router.push("/dashboard");
               }}
               variant={"destructive"}
            >
               Delete project
            </Button>
         </div>

         <div className="w-full grid grid-cols-1 gap-[32px]   rounded-xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 col-span-4   overscroll-contain items-center">
            {myDances.length ? (
               myDances
                  .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                  .filter((dance: Dance) => !dance.isInTrash)
                  ?.map((dance) => {
                     return (
                        <div
                           style={{
                              position: "relative",
                           }}
                           key={dance.id}
                        >
                           <PerformancePreview session={session} dance={dance}></PerformancePreview>
                        </div>
                     );
                  })
            ) : (
               <></>
            )}
         </div>
      </div>
   );
}
