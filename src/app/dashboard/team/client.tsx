"use client";

import { PerformancePreview } from "../_components/PerformancePreview";

export default function PageClient({ sharedWithMe }) {
   return (
      <div className="overflow-y-scroll h-full flex-grow px-4 py-5 flex flex-col gap-5 ">
         <p className="text-3xl font-semibold">My Team's Performances</p>

         <div className="w-full grid grid-cols-1 gap-[32px]    rounded-xl sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-4   overscroll-contain items-center">
            {sharedWithMe.length ? (
               sharedWithMe
                  .sort((a: Dance, b: Dance) => new Date(b.last_edited).getTime() - new Date(a.last_edited).getTime())
                  .filter((dance) => !dance.isInTrash)
                  ?.map((dance: Dance) => {
                     return (
                        <div key={dance.id}>
                           <PerformancePreview dance={dance}></PerformancePreview>
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
