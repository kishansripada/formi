import { dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
// import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { ProjectPreview } from "./ProjectPreview";
import { PerformancePreview } from "../_components/PerformancePreview";
import { DndContext, useDroppable, MouseSensor, useSensors, useSensor } from "@dnd-kit/core";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { default as nextDynamic } from "next/dynamic";
export const revalidate = 0;
export const dynamic = "force-dynamic";
import { Database } from "../../../types/supabase";
import { redirect } from "next/navigation";

const PageClient = nextDynamic(() => import("./client"), {
   ssr: false,
});

async function getServerSideProps() {
   const supabase = createServerComponentClient<Database>(
      { cookies },
      {
         supabaseKey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
         supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
      }
   );
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

   async function getMyDances(session: Session) {
      let data = await supabase
         .from("dances")
         .select(
            `
                 id,
                 created_at,
                 user,
                 formations: formations->0,
                 name,
                 last_edited,
                 settings,
                 isInTrash,
                 dancers,
                 project_id
                 `
         )
         .eq("user", session.user.id)
         .eq("isInTrash", false);

      return data?.data || [];
   }

   async function getProjects(session: Session) {
      let data = await supabase.from("projects").select("*").eq("parent_id", session.user.id);

      return data?.data || [];
   }

   let [dances, projects] = await Promise.all([getMyDances(session), getProjects(session)]);

   return { dances, projects, session };
}

export default async function Page({}) {
   const { dances: myDances, projects } = await getServerSideProps();

   return <PageClient myDances={myDances} projects={projects}></PageClient>;
}
