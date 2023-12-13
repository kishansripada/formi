// import { useState, useEffect } from "react";
import { Metadata } from "next";
import { headers } from "next/headers";

import { createClientComponentClient, Session } from "@supabase/auth-helpers-nextjs";
export const metadata: Metadata = {
   title: "Dashboard",
};
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Sidebar } from "./_components/Sidebar";
import Header from "./_components/Header";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { ThemeProvider } from "../../../@/components/theme-provider";
import { getMyDances, getMyDancesMetadata, getProjects, getRosters, getStripe } from "./api";
import { AppWrapper } from "../../../@/components/ui/app-wrapper";
const getServerSideProps = async (projectId: string, onboarded: boolean) => {
   const supabase = createServerComponentClient(
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
   if (error) throw error;
   if (!session) redirect("/login");

   async function getUserData(session: Session) {
      // const userData = await supabase.from("user_data").select("*").eq("user_id", session.user?.id);
      // console.log({ onboarded });
      // if (onboarded) {
      //    console.log({ onboarded });
      //    return userData?.data[0];
      // } else if (!userData?.data?.length) {
      //    return redirect("/welcome/1");
      // } else {
      //    return userData?.data[0];
      // }
      return {};
   }

   let [rosters, plan, myDances, userData, projects] = await Promise.all([
      getRosters(session, supabase),
      getStripe(session),
      getMyDancesMetadata(session, supabase),
      getUserData(session),
      getProjects(session, supabase),
   ]);

   return { rosters, session, plan, myDances, userData, projects };
};
export default async function RootLayout({
   children,
   params,
   searchParams,
}: {
   children: React.ReactNode;
   params: { projectId: string };
   searchParams?: { [key: string]: string | string[] | undefined };
}) {
   // const posthog = PostHogClient();
   // set post hog user
   const headersList = headers();

   // console.log();
   const urlParams = new URLSearchParams((headersList.get("referer") || "").split("?")[1]);
   const onboarded = urlParams.get("onboarded") === "true";
   const { rosters, session, plan, myDances, userData, projects } = await getServerSideProps(params.projectId, onboarded);

   return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
         <AppWrapper className={"flex flex-col"}>
            <div className="flex flex-row font-inter overscroll-none overflow-hidden  text-white">
               <Sidebar projects={projects} myDances={myDances} plan={plan} session={session} rosters={rosters} userData={userData}></Sidebar>

               <div className="flex flex-col bg-neutral  h-full  overflow-hidden  w-full justify-start  ">
                  <Header session={session} plan={plan}></Header>
                  <div className="  w-full h-full overflow-hidden">{children}</div>
               </div>
            </div>
         </AppWrapper>
      </ThemeProvider>
   );
}
