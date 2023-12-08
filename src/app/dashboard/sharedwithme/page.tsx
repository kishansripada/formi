import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import PageClient from "./client";
import { redirect } from "next/navigation";
import { getSharedWithMe } from "../api";
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

   if (error) {
      throw error;
   }
   if (!session) {
      redirect("/login");
   }

   let [sharedWithMe] = await Promise.all([getSharedWithMe(session, supabase)]);

   return { sharedWithMe };
}

export default async function Page({}) {
   const { sharedWithMe } = await getServerSideProps();

   return <PageClient sharedWithMe={sharedWithMe}></PageClient>;
}
