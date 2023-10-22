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
// import PostHogClient from "../posthog";
import { ThemeProvider } from "../../../@/components/theme-provider";
const getServerSideProps = async (projectId: string, onboarded: boolean) => {
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

   const EXEMPT_EMAILS = [
      // MINE
      "kishansripada@formistudio.app",

      // KIRSTEN
      "kirsten.e.collison@gmail.com",
      "courtney.j.laney@gmail.com",
      "annaludgate11@gmail.com",
      "natalie.e1010@gmail.com",

      // BALEX
      "alex.battenfield@gmail.com",

      // DFD
      "devikafusiondance@gmail.com",

      // DAREN
      "darrengundling18@gmail.com",

      "gtramblinraas@gmail.com",
   ];

   async function getRosters(session: Session) {
      let data = await supabase.from("rosters").select("*").eq("user_id", session.user.id);

      return data?.data || [];
   }
   async function getStripe(session: Session) {
      if (session.user.email?.endsWith("@umich.edu") || EXEMPT_EMAILS.includes(session.user.email)) return "choreographer";
      const plan = await fetch(
         `https://api.stripe.com/v1/customers/search?query=metadata['supabase_id']:'${session.user.id}'&expand[]=data.subscriptions.data`,
         {
            headers: {
               Authorization:
                  "Basic cmtfbGl2ZV81MUxhajV0SHZDM3c2ZThmY21zVklCRjlKMjRLUWFFYlgwVUs0SHE0b245QTVXMUNIaWlHaHAwVzlrbHg5dDU3OW9WcWVibFJGOHh3cE8xc3FlUmFMOHBzYjAwMmhLNFl0NEU6",
            },
         }
      )
         .then((r) => r.json())
         .then((r) => {
            // customerExists = Boolean(r.data.length);

            let activeProducts = r?.data?.[0]?.subscriptions.data.map((data) => data.items.data.map((obj) => obj.plan.product)).flat();
            let plan = null;
            if (activeProducts?.includes("prod_MngV5QMEYtDnjr")) {
               plan = "choreographer";
            }
            return plan;
         });

      // return null;
      return plan as string | null;
   }

   async function getMyDances(session: Session) {
      let data = await supabase
         .from("dances")
         .select(
            `
                 id,
                 user,
                 isInTrash
                 `
         )
         .eq("user", session.user.id);
      // .eq("isInTrash", false);
      return data?.data || [];
   }

   async function getUserData(session: Session) {
      const userData = await supabase.from("user_data").select("*").eq("user_id", session.user?.id);
      // console.log({ onboarded });
      if (onboarded) {
         console.log({ onboarded });
         return userData?.data[0];
      } else if (!userData?.data?.length) {
         return redirect("/welcome/1");
      } else {
      return userData?.data[0];
      }
   }
   // async function getProject(session: Session) {
   //    if (!projectId) return;
   //    let data = await supabase.from("projects").select("*").eq("user_id", session.user.id).eq("id", projectId).single();

   //    return data?.data || [];
   // }

   let [rosters, plan, myDances, userData] = await Promise.all([getRosters(session), getStripe(session), getMyDances(session), getUserData(session)]);

   return { rosters, session, plan, myDances, userData };
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
   const { rosters, session, plan, myDances, userData } = await getServerSideProps(params.projectId, onboarded);
   // posthog?.capture({
   //    event: "dashboard visited",
   //    distinctId: session.user.id,
   // });

   // await posthog.shutdownAsync();

   return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
         <div>
            <style>
               {`
             html, body {
                overscroll-behavior: none;
                user-select: none;
             }
          `}
            </style>

            <div className="h-[calc(100dvh)] flex flex-col font-inter overscroll-none overflow-hidden bg-[#09090b] text-white">
               {/* <div className="h-10 bg-pink-600 w-full grid place-items-center">
               <p className="text-xs text-white">try editing with your friends in real-time by sending them a link to your performance!</p>
            </div> */}
               <div className="flex flex-row font-inter overscroll-none overflow-hidden bg-[#09090b] text-white">
                  <Sidebar myDances={myDances} plan={plan} session={session} rosters={rosters} userData={userData}></Sidebar>
                  {/* {JSON.stringify(project)} */}
                  <div className="flex flex-col bg-neutral  h-full  overflow-hidden  w-full justify-start  ">
                     <Header session={session} plan={plan}></Header>
                     <div className="px-6 pt-5 w-full h-full overflow-hidden">{children}</div>
                  </div>
               </div>
            </div>
         </div>
      </ThemeProvider>
   );
}
