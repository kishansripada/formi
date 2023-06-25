import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

export const Dropdown: React.FC<{ dance: any; invalidateDances: Function; setOpenPerformanceMenu: Function; isMine: boolean }> = ({
   dance,
   invalidateDances,
   setOpenPerformanceMenu,
   isMine,
}) => {
   let router = useRouter();
   let session = useSession();
   const supabase = useSupabaseClient();
   const moveToTrash = async (id: string) => {
      console.log(id);
      const { data, error } = await supabase.from("dances").update({ isInTrash: true }).eq("id", id);
      console.log(error);
      invalidateDances();
      toast.success("Moved to trash");
   };

   const duplicateDance = async (danceId) => {
      let dance = await supabase
         .from("dances")
         .select("*")
         .eq("id", danceId)
         .single()
         .then((r) => r.data);

      delete dance.id;
      delete dance.created_at;
      delete dance.last_edited;
      delete dance.sharesettings;
      console.log(dance);
      const { data: newDance } = await supabase
         .from("dances")
         .insert([{ ...dance, name: "Copy of " + dance.name, user: session?.user.id, last_edited: new Date() }])
         .select("id")
         .single();

      if (!newDance?.id) return;
      router.push(`/${newDance.id}/edit`);
   };

   const duplicateRoster = async (dance) => {
      // console.log(dance);
      const { data: newDance } = await supabase
         .from("dances")
         .insert([{ user: session?.user.id, last_edited: new Date(), dancers: dance.dancers, formations: [dance.formations] }])
         .select("id")
         .single();

      if (!newDance?.id) return;
      router.push(`/${newDance.id}/edit`);
   };
   return (
      <div
         // style={{
         //    left,
         //    top,
         // }}
         id="dropdown"
         className=" w-[200px] absolute bg-neutral-900  z-50  text-white text-xs border-gray-200 border shadow-md flex flex-col  py-2"
      >
         <Toaster></Toaster>
         {isMine ? (
            <button
               onClick={() => {
                  moveToTrash(dance.id);
                  setOpenPerformanceMenu(null);
               }}
               className="flex flex-row items-center justify-start w-full  hover:bg-pink-600   px-2 py-1"
            >
               <p className="">Move to Trash</p>
            </button>
         ) : null}

         <button
            onClick={() => {
               duplicateDance(dance.id);
               setOpenPerformanceMenu(null);
            }}
            className="flex flex-row items-center justify-start w-full hover:bg-pink-600    px-2 py-1"
         >
            <p className="">Duplicate</p>
         </button>
         <button
            onClick={() => {
               duplicateRoster(dance);
               setOpenPerformanceMenu(null);
            }}
            className="flex flex-row items-center justify-start w-full hover:bg-pink-600    px-2 py-1"
         >
            <p className="">New Dance From Roster</p>
         </button>
      </div>
   );
};
