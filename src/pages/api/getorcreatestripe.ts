import { NextApiHandler } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const ProtectedRoute: NextApiHandler = async (req, res) => {
   // Create authenticated Supabase Client
   const supabase = createServerSupabaseClient({ req, res });
   // Check if we have a session
   const {
      data: { session },
   } = await supabase.auth.getSession();

   if (!session) {
      return res.redirect(307, "/login");
   }

   // Run queries with RLS on the server
   let customerExists = false;
   fetch(`https://api.stripe.com/v1/customers/search?query=metadata['supabase_id']:'${session.user.id}'&expand[]=data.subscriptions.data`, {
      headers: {
         Authorization:
            "Basic cmtfbGl2ZV81MUxhajV0SHZDM3c2ZThmY21zVklCRjlKMjRLUWFFYlgwVUs0SHE0b245QTVXMUNIaWlHaHAwVzlrbHg5dDU3OW9WcWVibFJGOHh3cE8xc3FlUmFMOHBzYjAwMmhLNFl0NEU6",
      },
   })
      .then((r) => r.json())
      .then((r) => {
         customerExists = Boolean(r.data.length);

         let plan = r?.data?.[0]?.subscriptions.data[0];
         return res.json(plan);
      });
};

export default ProtectedRoute;
