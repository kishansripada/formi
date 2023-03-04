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

         let customerId = r?.data?.[0]?.id;

         fetch("https://api.stripe.com/v1/checkout/sessions", {
            body: `success_url=https://formistudio.app/dashboard;line_items[0[price]=${req.query.price};line_items[0][quantity]=1;mode=subscription;customer=${customerId};subscription_data[trial_period_days]=7;cancel_url=https://formistudio.app/dashboard`,
            headers: {
               Authorization:
                  "Basic c2tfbGl2ZV81MUxhajV0SHZDM3c2ZThmY1llbTBoUGdQVFdKb29Sd3owMmpucW5iYlRpVXk2NkJTRE5UMjN6U1JQRDV3Tjg1QktRcVRBWFY5UENaTGNud2Joc2F5ZDdTVTAwVnNEVHZLWVI6",
               "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
         })
            .then((r) => r.json())
            .then((r) => {
               return res.redirect(307, r.url);
            });
      });
   // res.json(session);
};

export default ProtectedRoute;
