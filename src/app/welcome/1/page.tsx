import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import Client from "./client";

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

   const { data } = await supabase
      .from("user_data")
      .select("*")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

   if (data?.length) {
      return redirect("/dashboard");
   }

   return { session };
}

export default async function Page({}) {
   const { session } = await getServerSideProps();
   return <Client session={session}></Client>;
}
