import { dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
// import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { ProjectPreview } from "../myperformances/ProjectPreview";
import { PerformancePreview } from "../_components/PerformancePreview";
import { DndContext, useDroppable, MouseSensor, useSensors, useSensor } from "@dnd-kit/core";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import PageClient from "./client";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
async function getServerSideProps() {
   // Create authenticated Supabase Client
   // const supabase = createServerSupabaseClient(ctx, {
   //    supabaseKey:
   //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
   //    supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
   // });
   const supabase = createServerComponentClient(
      { cookies },
      {
         supabaseKey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
         supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
      }
   );

   // Check if we have a session
   const {
      data: { session },
      error,
   } = await supabase.auth.getSession();

   if (error) {
      throw error;
   }
   if (!session) {
      redirect("/login");
   }
   async function getRosters(session: Session) {
      let data = await supabase.from("rosters").select("*").eq("user_id", session.user.id);

      return data?.data || [];
   }

   let [rosters] = await Promise.all([getRosters(session)]);
   // console.log(projects);
   // console.log(data);

   // const { data } = await supabase.from("dances").select("*").eq("user", user.id);

   return { rosters, session };
}

export default async function Page({}) {
   const { rosters } = await getServerSideProps();

   return <PageClient rosters={rosters}></PageClient>;
}
