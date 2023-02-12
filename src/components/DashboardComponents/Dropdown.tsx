import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

export const Dropdown: React.FC<{ dance: any; invalidateDances: Function; setOpenPerformanceMenu: Function }> = ({
   dance,
   invalidateDances,
   setOpenPerformanceMenu,
}) => {
   let router = useRouter();
   let session = useSession();
   const supabase = useSupabaseClient();
   const moveToTrash = async (id: string) => {
      console.log(id);
      const { data, error } = await supabase.from("dances").update({ isInTrash: true }).eq("id", id);
      console.log(error);
      invalidateDances();
      toast.success("moved to trash");
   };

   const duplicateDance = async (dance) => {
      delete dance.id;
      delete dance.created_at;
      delete dance.last_edited;
      console.log(dance);
      const { data: newDance } = await supabase
         .from("dances")
         .insert([{ last_edited: new Date(), ...dance, name: "copy of " + dance.name }])
         .select("id")
         .single();

      if (!newDance?.id) return;
      router.push(`/${newDance.id}/edit`);
   };

   const duplicateRoster = async (dance) => {
      console.log(dance);
      const { data: newDance } = await supabase
         .from("dances")
         .insert([{ user: session.user.id, last_edited: new Date(), dancers: dance.dancers, formations: [dance.formations[0]] }])
         .select("id")
         .single();

      if (!newDance?.id) return;
      router.push(`/${newDance.id}/edit`);
   };
   return (
      <div
         id="dropdown"
         className="bg-white w-[250px] absolute rounded-xl right-[-170px] p-1 top-[250px] z-50  border-gray-200 border shadow-md flex flex-col font-semibold py-2"
      >
         <Toaster></Toaster>
         <button
            onClick={() => {
               moveToTrash(dance.id);
               setOpenPerformanceMenu(null);
            }}
            className="flex flex-row items-center justify-start w-full  hover:bg-pink-600 hover:text-white  rounded px-2 py-1"
         >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
               />
            </svg>

            <p className="">Move to Trash</p>
         </button>
         <button
            onClick={() => {
               duplicateDance(dance);
               setOpenPerformanceMenu(null);
            }}
            className="flex flex-row items-center justify-start w-full hover:bg-pink-600 hover:text-white  rounded px-2 py-1"
         >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
               />
            </svg>

            <p className="">Duplicate</p>
         </button>
         <button
            onClick={() => {
               duplicateRoster(dance);
               setOpenPerformanceMenu(null);
            }}
            className="flex flex-row items-center justify-start w-full hover:bg-pink-600 hover:text-white  rounded px-2 py-1"
         >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
               />
            </svg>

            <p className="">New Dance From Roster</p>
         </button>
      </div>
   );
};
