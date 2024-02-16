import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import PageClient from "./client";
import { redirect } from "next/navigation";
import { teams } from "../../teams";
export const dynamic = "force-dynamic";
export const revalidate = 0;
async function getServerSideProps() {
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
   const myTeam = teams.find((team) => team.includes(session?.user.email))?.filter((email) => email !== session?.user.email);
   if (error) {
      throw error;
   }
   if (!session) {
      redirect("/login");
   }

   if (!myTeam) {
      redirect("/dashboard");
   }

   async function getTeamIds(session, supabase) {
      let data = await supabase.from("users").select("id").in("email", myTeam);

      return data?.data || [];
   }

   async function getTeamPerformances(session, supabase, teamIds) {
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
         .in("user", teamIds);

      return data?.data || [];
   }
   // console.log({ myTeam });
   const teamIds = (await getTeamIds(session, supabase)) || [];

   let [teamPerformances] = await Promise.all([
      getTeamPerformances(
         session,
         supabase,
         teamIds.map((member) => member.id)
      ),
   ]);
   // console.log(teamPerformances.length);
   return { teamPerformances };
}

export default async function Page({}) {
   const { teamPerformances } = await getServerSideProps();

   return <PageClient sharedWithMe={teamPerformances}></PageClient>;
}
