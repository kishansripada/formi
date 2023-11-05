import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { cookies } from "next/headers";
async function getStripe(session: Session) {
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

         return activeProducts;
      });

   // return null;
   return plan as string | null;
}
const home = async () => {
   const supabase = createServerComponentClient<Database>(
      { cookies },
      {
         supabaseKey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
         supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
      }
   );

   const session = await supabase.auth.getSession();
   if (!session) return;
   const data = await getStripe(session.data.session);
   return <>{JSON.stringify(data)}</>;
};

export default home;
