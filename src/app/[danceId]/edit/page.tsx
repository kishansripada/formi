// import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Edit from "./client";
import { Database } from "../../../types/supabase";
import Link from "next/link";
import EXEMPT_EMAILS from "../../exemptEmails";
// import { getStripe } from "../../dashboard/api";
// import { getPlan } from "../../api/get-plan/route";
export const metadata: Metadata = {
   title: "Edit Performance",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
const getServerSideProps = async (danceId: string) => {
   const supabase = createServerComponentClient<Database>(
      { cookies }
      // {
   //    supabaseKey:
   //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
   //    supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
      // }
   );
   let noAccess = false;
   // Check if we have a session
   const {
      data: { session },
   } = await supabase.auth.getSession();

   async function getStripe(session: Session) {
      if (!session) return null;
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
   // console.log(session);
   let [{ data: dance }, { data: permissions }, plan] = await Promise.all([
      supabase.from("dances").select("*, project_id(name, id)").eq("id", danceId).single(),
      supabase.from("permissions").select("*").eq("performance_id", danceId),
      getStripe(session),
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

   const cookieStore = cookies();

   let myCookies = cookieStore.getAll();

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

   // const plan = await getPlan(session).then((r) => r.json());
   // const plan = { plan: null };
   // console.log(plan);
   return {
      // props: {
      initialData: dance,
      viewOnly,
      pricingTier: "legacy",
      session,
      permissions,
      // hasSeenCollab,
      noAccess,
      plan,
      myCookies,
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
               plan={data?.plan}
               myCookies={data.myCookies}
               // hasSeenCollab={data.hasSeenCollab}
            />
         )}
      </>
   );
}
