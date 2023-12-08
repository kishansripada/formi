"use client";

import { PerformancePreview } from "../../_components/PerformancePreview";

export default function PageClient({ myDances, session }) {
   return (
      <>
         <div className="px-4 py-5 gap-5 flex flex-col">
            <p className="text-3xl font-semibold">{myDances?.[0]?.project_id?.name || "No performances here yet"}</p>
            <div className="w-full grid grid-cols-1 gap-[32px]   rounded-xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 col-span-4   overscroll-contain items-center">
               {myDances.length ? (
                  myDances
                     .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
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
      </>
   );
}
