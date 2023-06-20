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

   const responseData = await supabase.from("user_data").insert({ response_data: req.body });

   res.send("dummy");
};

export default ProtectedRoute;
