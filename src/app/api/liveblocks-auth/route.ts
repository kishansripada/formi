import { Room } from "@liveblocks/client";
import { Liveblocks } from "@liveblocks/node";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const liveblocks = new Liveblocks({
   secret: "sk_prod_4KyaW_oX6LrE5PlWMvb3S79GNxTyTyBJqgG1g9caEJ_p5gGL4TZw3EDupgNeiDf0",
});

export async function POST(request: Request) {
   // Get the current user from your database
   //    const user = __getUserFromDB__(request);
   const supabase = createServerComponentClient(
      { cookies },
      {
         supabaseKey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
         supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
      }
   );

   //    Check if we have a session
   const {
      data: { session },
      error,
   } = await supabase.auth.getSession();

   //    if (!session) {
   //       redirect("/login");
   //    }

   // Start an auth session inside your endpoint
   const blockssession = liveblocks.prepareSession(session?.user?.id || "Anonymous");
   const { room } = await request.json();

   // if (session?.user.id === "f30197ba-cf06-4234-bcdb-5d40d83c7999") {
   //    blockssession.allow(room, blockssession.FULL_ACCESS);
   //    const { status, body } = await blockssession.authorize();
   //    return new Response(body, { status });
   // }

   if (session?.user.id === "f30197ba-cf06-4234-bcdb-5d40d83c7999") {
      blockssession.allow(room, blockssession.FULL_ACCESS);
      const { status, body } = await blockssession.authorize();
      return new Response(body, { status });
   }

   let [{ data: dance }, { data: permissions }] = await Promise.all([
      supabase.from("dances").select("user, anyonecanview").eq("id", room).single(),
      supabase.from("permissions").select("*").eq("performance_id", room),
   ]);

   if (session?.user.id === dance?.user || permissions?.find((permission) => permission.email === session?.user?.email)?.role === "edit") {
      blockssession.allow(room, blockssession.FULL_ACCESS);
      const { status, body } = await blockssession.authorize();
      return new Response(body, { status });
   }

   blockssession.allow(room, blockssession.READ_ACCESS);
   // Authorize the user and return the result
   const { status, body } = await blockssession.authorize();
   return new Response(body, { status });
}
