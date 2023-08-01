export default function Loading() {
   return (
      <div className="w-full grid grid-cols-1 gap-[32px]  opacity-20  rounded-xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 col-span-4   overscroll-contain items-center">
         {[1, 1, 1, 1, 1, 1, 1, 1].map((dance) => {
            return (
               <>
                  <div
                     style={{
                        position: "relative",
                     }}
                  >
                     <div className="flex flex-col items-center group animate-pulse    w-full relative cursor-pointer  ">
                        <div className="w-full border-neutral-800 group-hover:border-pink-600 transition border overflow-hidden  bg-neutral-800 rounded-xl">
                           <div className="bg-neutral-900 rounded-md min-h-[150px]  w-full relative border-transparent transition   "></div>
                           <div className="flex flex-row justify-start items-center w-full  px-3 py-2 bg-neutral-800 rounded-b-xl">
                              <div className="w-full">
                                 <div className="mt-1 mb-1 text-xs font-semibold w-full bg-neutral-600 h-2 rounded-md"></div>
                                 <div className="mt-1 mb-1 text-xs font-semibold w-full bg-neutral-600 h-2 rounded-md"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            );
         })}
      </div>
   );
}
