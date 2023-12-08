import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import Client from "./client";
import { AuthSession } from "@supabase/supabase-js";

async function getServerSideProps(projectId: string) {
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
      return { props: {} };
   }

   async function getMyDances(session: AuthSession) {
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
                 project_id ( id, name)
                 `
         )
         .eq("user", session.user.id)
         .eq("project_id", projectId)
         .eq("isInTrash", false);

      return data?.data || [];
   }

   let [dances] = await Promise.all([getMyDances(session)]);

   return { dances, session };
}

export default async function Page({ params }: { params: { projectId: string } }) {
   const { dances: myDances } = await getServerSideProps(params.projectId);
   return <Client myDances={myDances}></Client>;
}
