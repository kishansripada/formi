// import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Edit from "./client";
import { Database } from "../../../types/supabase";
import Link from "next/link";
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
   let noAccess = false;
   // Check if we have a session
   const {
      data: { session },
   } = await supabase.auth.getSession();
   // console.log(session);
   let [{ data: dance }, { data: permissions }] = await Promise.all([
      supabase.from("dances").select("*, project_id(name, id)").eq("id", danceId).single(),
      supabase.from("permissions").select("*").eq("performance_id", danceId),
   ]);

   if (!dance?.formations && session) {
      noAccess = true;
   }

   if (!dance?.formations && !session) {
      redirect("/login");
   }
   let viewOnly = true;
   const DEMO_DANCE_ID = 207;

   if (
      // they can edit if its the demo
      // dance.id === DEMO_DANCE_ID ||
      // if it's their own
      dance?.user === session?.user?.id ||
      // if they have edit permissions
      permissions?.find((permission) => permission.email === session?.user?.email)?.role === "edit"
   ) {
      viewOnly = false;
   }

   // dance = { ...{ ...dance, formations: dance.formations } };

   // const extraDancers = (formation: formation, dancers: dancer[]) => {
   //    return formation.positions.filter((position) => !dancers.map((dancer) => dancer.id).includes(position.id)).map((position) => position.id);
   // };
   // const missingDancers = (formation: formation, dancers: dancer[]) => {
   //    return dancers.map((dancer) => dancer.id).filter((dancerId) => !formation.positions.map((position) => position.id).includes(dancerId));
   // };

   // if (extraDancers(dance.formations, dance.dancers).length > 0 || missingDancers(dance.formations, dance.dancers).length > 0) {
   //    throw new Error("Dancers and formations are out of sync");
   // }
   const headersList = headers();
   const userAgent = headersList.get("user-agent");
   // let isMobileView = userAgent!.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i);

   return {
      // props: {
      initialData: dance,
      viewOnly,
      pricingTier: "legacy",
      session,
      permissions,
      hasSeenCollab,
      noAccess,
      // isMobileView: Boolean(isMobileView),

      // },
   };
};

export default async function Page({ params }: { params: { danceId: string } }) {
   const data = await getServerSideProps(params.danceId);

   return (
      <>
         {data.noAccess ? (
            <div className="flex flex-col items-center justify-center h-screen">
               <div className="flex flex-col items-center">
                  <p>You don't have permission to view this performance</p>
                  <Link href="/dashboard">
                     <button className="bg-pink-600 text-white p-2 rounded-md mt-2">Go to Dashboard</button>
                  </Link>
               </div>
            </div>
         ) : (
            <Edit
               params={params}
               session={data.session}
               initialData={data.initialData}
               permissions={data.permissions}
               viewOnly={data.viewOnly}
               pricingTier={data.pricingTier}
               hasSeenCollab={data.hasSeenCollab}
            />
         )}
      </>
   );
}
