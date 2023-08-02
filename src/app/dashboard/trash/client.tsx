"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PerformancePreview } from "../_components/PerformancePreview";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
export default function PageClient({ trash }) {
   const supabase = createClientComponentClient();
   const router = useRouter();
   const removeFromTrash = async (id: string) => {
      const { data, error } = await supabase.from("dances").update({ isInTrash: false }).eq("id", id);
      if (error) {
         toast.error("There was an issue removing your dance from trash");
         return;
      } else {
         toast.success("Removed from trash");
         router.refresh();
      }
   };

   const deleteDance = async (id: number) => {
      const { data, error } = await supabase.from("dances").delete().eq("id", id);
      if (error) {
         toast.error("There was an issue deleting your dance");
      } else {
         toast.success("Deleted dance");
         // revalidatePath("/dashboard/trash");
         router.refresh();
      }
   };
   return (
      <>
         <Toaster></Toaster>
         <div className="w-full grid grid-cols-1 gap-[32px] overflow-scroll   rounded-xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 col-span-4   overscroll-contain items-center">
            {trash.length ? (
               trash
                  .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                  ?.map((dance) => {
                     return (
                        <>
                           <div
                              style={{
                                 position: "relative",
                              }}
                              className="group"
                           >
                              <div className="absolute cursor-pointer flex flex-col p-2 text-xs group-hover:opacity-100 opacity-0 transition left-0 top-0 z-50 w-full h-full bg-black/70">
                                 <div
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       removeFromTrash(dance.id);
                                    }}
                                    className="h-1/2 border border-white rounded-md mb-1 hover:bg-white/20 grid place-items-center transition"
                                 >
                                    Remove from Trash
                                 </div>
                                 <div
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       deleteDance(dance.id);
                                    }}
                                    className="h-1/2 border border-red-600 rounded-md mt-1 hover:bg-red-600/20 grid place-items-center transition"
                                 >
                                    Delete Permanently
                                 </div>
                              </div>
                              <PerformancePreview dance={dance}></PerformancePreview>
                           </div>
                        </>
                     );
                  })
            ) : (
               <p>No performances here 🤷🏽‍♂️</p>
            )}
         </div>
      </>
   );
}
