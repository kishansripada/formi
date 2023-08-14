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
const getServerSideProps = async () => {
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
      redirect("/login?redirect=/upgrade/customerportal");
   }

   //    let customerExists = false;
   const customer = await fetch(
      `https://api.stripe.com/v1/customers/search?query=metadata['supabase_id']:'${session.user.id}'&expand[]=data.subscriptions.data`,
      {
         headers: {
            Authorization:
               "Basic cmtfbGl2ZV81MUxhajV0SHZDM3c2ZThmY21zVklCRjlKMjRLUWFFYlgwVUs0SHE0b245QTVXMUNIaWlHaHAwVzlrbHg5dDU3OW9WcWVibFJGOHh3cE8xc3FlUmFMOHBzYjAwMmhLNFl0NEU6",
         },
      }
   ).then((r) => r.json());
   //   .then((r) => r.json())
   //   .then((r) => {
   //  console.log(r);
   //    customerExists = Boolean(customer.data.length);

   let customerId = customer?.data?.[0]?.id || null;
   if (!customerId) {
      // create customer
      const newCustomer = await fetch("https://api.stripe.com/v1/customers", {
         body: `name=${session.user.user_metadata.full_name};\nmetadata[supabase_id]=${session.user.id};\nemail=${session.user.email}`,
         headers: {
            Authorization:
               "Basic c2tfbGl2ZV81MUxhajV0SHZDM3c2ZThmY1llbTBoUGdQVFdKb29Sd3owMmpucW5iYlRpVXk2NkJTRE5UMjN6U1JQRDV3Tjg1QktRcVRBWFY5UENaTGNud2Joc2F5ZDdTVTAwVnNEVHZLWVI6",
            "Content-Type": "application/x-www-form-urlencoded",
         },
         method: "POST",
      }).then((r) => r.json());
      customerId = newCustomer?.id;
   }

   const portal = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      body: `customer=${customerId}&return_url=https://formistudio.app/dashboard`,
      headers: {
         Authorization:
            "Basic c2tfbGl2ZV81MUxhajV0SHZDM3c2ZThmY1llbTBoUGdQVFdKb29Sd3owMmpucW5iYlRpVXk2NkJTRE5UMjN6U1JQRDV3Tjg1QktRcVRBWFY5UENaTGNud2Joc2F5ZDdTVTAwVnNEVHZLWVI6",
         "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
   }).then((r) => r.json());

   redirect(portal.url);
};

export default async function Page() {
   const data = await getServerSideProps();

   // return <>{JSON.stringify(data)}</>;
   // console.log(data);
   return <></>;
}
