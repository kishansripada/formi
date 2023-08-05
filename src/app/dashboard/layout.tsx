// import { useState, useEffect } from "react";
import { Metadata } from "next";

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
const getServerSideProps = async (projectId: string) => {
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

   // async function getProject(session: Session) {
   //    if (!projectId) return;
   //    let data = await supabase.from("projects").select("*").eq("user_id", session.user.id).eq("id", projectId).single();

   //    return data?.data || [];
   // }

   let [rosters] = await Promise.all([getRosters(session)]);

   return { rosters, session };
};
export default async function RootLayout({ children, params }: { children: React.ReactNode; params: { projectId: string } }) {
   const { rosters, session } = await getServerSideProps(params.projectId);
   return (
      <div>
         <style>
            {`
             html, body {
                overscroll-behavior: none;
                user-select: none;
             }
          `}
         </style>

         <div className="h-screen flex flex-row font-inter overscroll-none overflow-hidden bg-[#09090b] text-white">
            <Sidebar session={session} rosters={rosters}></Sidebar>
            {/* {JSON.stringify(project)} */}
            <div className="flex flex-col bg-neutral  h-full  overflow-hidden  w-full justify-start  ">
               <Header></Header>
               <div className="px-6 pt-5 w-full h-full overflow-hidden">{children}</div>
            </div>
         </div>
      </div>
   );
}
