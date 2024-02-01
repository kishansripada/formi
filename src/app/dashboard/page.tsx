import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import Client from "./client";
import { getMyDances, getProjects, getRosters, getSharedWithMe, getStripe, getUserData } from "./api";

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

   if (error) {
      throw error;
   }
   if (!session) {
      redirect("/login");
   }
   const cookieStore = cookies();

   let myCookies = cookieStore.getAll();

   // convert cookie store to object where key is cookie name and value is cookie value
   myCookies = myCookies.reduce((acc, cookie) => {
      return { ...acc, [cookie.name]: cookie.value };
   }, {});

   let [myDances, sharedWithMe, plan, rosters, projects, userData] = await Promise.all([
      getMyDances(session, supabase),
      getSharedWithMe(session, supabase),
      getStripe(session),
      getRosters(session, supabase),
      getProjects(session, supabase),
      getUserData(session, supabase),
   ]);

   return { myDances, sharedWithMe, plan, rosters, projects, session, myCookies, userData };
}

export default async function Page({}) {
   const { myDances, sharedWithMe, session, plan, rosters, projects, myCookies, userData } = await getServerSideProps();

   return (
      <Client
         myCookies={myCookies}
         sharedWithMe={sharedWithMe}
         myDances={myDances}
         session={session}
         plan={plan}
         rosters={rosters}
         projects={projects}
         userData={userData}
      ></Client>
   );
}
