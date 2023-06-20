import { NextApiHandler } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const ProtectedRoute: NextApiHandler = async (req, res) => {
   // Create authenticated Supabase Client
   const supabase = createServerSupabaseClient({ req, res });
   // Check if we have a session
   //    const {
   //       data: { session },
   //    } = await supabase.auth.getSession();

   //    if (!session) {
   //       return res.redirect(307, "/login");
   //    }

   const responseData = await supabase
      .from("user_data")
      .insert({ user_id: req.body?.form_response?.hidden?.user_id, response_data: req.body, name: req.body?.form_response?.answers[0]?.text });

   res.send("dummy");
};

export default ProtectedRoute;
