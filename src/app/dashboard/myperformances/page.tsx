import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export const revalidate = 0;
export const dynamic = "force-dynamic";
import { Database } from "../../../types/supabase";
import { redirect } from "next/navigation";
import { getMyDances, getProjects } from "../api";
import Client from "./client";

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

   let [myDances, projects] = await Promise.all([getMyDances(session, supabase), getProjects(session, supabase)]);

   return { myDances, projects, session };
}

export default async function Page({}) {
   const { myDances, projects, session } = await getServerSideProps();

   return <Client session={session} myDances={myDances} projects={projects}></Client>;
}
