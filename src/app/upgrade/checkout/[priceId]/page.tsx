// import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Database } from "../../../../types/supabase";
export const metadata: Metadata = {
   title: "Edit Performance",
};
export const dynamic = "force-dynamic";
export const revalidate = 0;
const getServerSideProps = async (priceId: string) => {
   // Create authenticated Supabase Client
   // const supabase = createServerSupabaseClient(ctx, {
   //    supabaseKey:
   //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
   //    supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
   // });

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

   if (!session) {
      redirect("/login?redirect=/upgrade");
   }

   let customer;
   //attempt to find customer by searching by supabase_id
   customer = await fetch(
      `https://api.stripe.com/v1/customers/search?query=metadata['supabase_id']:'${session.user.id}'&expand[]=data.subscriptions.data`,
      {
         headers: {
            Authorization:
               "Basic cmtfbGl2ZV81MUxhajV0SHZDM3c2ZThmY21zVklCRjlKMjRLUWFFYlgwVUs0SHE0b245QTVXMUNIaWlHaHAwVzlrbHg5dDU3OW9WcWVibFJGOHh3cE8xc3FlUmFMOHBzYjAwMmhLNFl0NEU6",
         },
      }
   ).then((r) => r.json());

   let customerId = customer?.data?.[0]?.id || null;

   //    if customer doesn't exist in stripe, create it using its supabase id
   if (!customerId) {
      // create customer
      customer = await fetch("https://api.stripe.com/v1/customers", {
         body: `name=${session.user.user_metadata.full_name};\nmetadata[supabase_id]=${session.user.id};\nemail=${session.user.email}`,
         headers: {
            Authorization:
               "Basic c2tfbGl2ZV81MUxhajV0SHZDM3c2ZThmY1llbTBoUGdQVFdKb29Sd3owMmpucW5iYlRpVXk2NkJTRE5UMjN6U1JQRDV3Tjg1QktRcVRBWFY5UENaTGNud2Joc2F5ZDdTVTAwVnNEVHZLWVI6",
            "Content-Type": "application/x-www-form-urlencoded",
         },
         method: "POST",
      }).then((r) => r.json());
      customerId = customer?.id;
   }

   //    create a checkout sessions for the given stripe customer
   let checkoutSession = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      body: `success_url=https://formistudio.app/dashboard;line_items[0[price]=${priceId};line_items[0][quantity]=1;mode=subscription;customer=${customerId};subscription_data[trial_period_days]=7;cancel_url=https://formistudio.app/upgrade;allow_promotion_codes=true`,
      headers: {
         Authorization:
            "Basic c2tfbGl2ZV81MUxhajV0SHZDM3c2ZThmY1llbTBoUGdQVFdKb29Sd3owMmpucW5iYlRpVXk2NkJTRE5UMjN6U1JQRDV3Tjg1QktRcVRBWFY5UENaTGNud2Joc2F5ZDdTVTAwVnNEVHZLWVI6",
         "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
   }).then((r) => r.json());
   // console.log(checkoutSession);
   redirect(checkoutSession.url);

   //    if (!dance?.formations && session) {
   //       redirect("/noaccess");
   //    }
   //    if (!dance?.formations && !session) {
   //       redirect("/login");
   //    }

   //    return {
   //       // props: {
   //       initialData: dance,
   //       viewOnly,
   //       pricingTier: "legacy",
   //       session,
   //       permissions,
   //       hasVisited,
   //       // },
   //    };
};

export default async function Page({ params }: { params: { priceId: string } }) {
   const data = await getServerSideProps(params.priceId);

   // return <>{JSON.stringify(data)}</>;
   // console.log(data);
   return <></>;
}
