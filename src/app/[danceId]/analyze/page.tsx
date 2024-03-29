// import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Edit from "./client";
import { Database } from "../../../types/supabase";
import { dancer, formation } from "../../../types/types";
import { deleteLiveblocksRoom } from "../../dashboard/api";
import Client from "./client";
export const metadata: Metadata = {
   title: "Edit Performance",
};
export const dynamic = "force-dynamic";
export const revalidate = 0;
const getServerSideProps = async (danceId: string) => {
   // Create authenticated Supabase Client
   // const supabase = createServerSupabaseClient(ctx, {
   //    supabaseKey:
   //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
   //    supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
   // });
   const cookieStore = cookies();
   const hasSeenCollab = cookieStore.get("hasSeenCollab");
   // cookies().set("hasVisited", "true");
   const supabase = createServerComponentClient<Database>(
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
   } = await supabase.auth.getSession();
   // console.log(session);
   let [{ data: dance }, { data: permissions }] = await Promise.all([
      supabase
         .from("dances")
         .select(
            `*,
            project_id(name, id)
             `
         )
         .eq("id", danceId)
         .single(),
      supabase.from("permissions").select("*").eq("performance_id", danceId),
   ]);

   if (session?.user.email !== "kishansripada@gmail.com") redirect("/login");
   return {
      // props: {
      dance,
      // viewOnly,
      // pricingTier: "legacy",
      // session,
      // permissions,
      // hasSeenCollab,

      // },
   };
};

export default async function Page({ params }: { params: { danceId: string } }) {
   const { dance } = await getServerSideProps(params.danceId);

   return <Client dance={dance}></Client>;
}
