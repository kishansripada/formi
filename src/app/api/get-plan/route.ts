"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { AuthSession } from "@supabase/supabase-js";

export async function getPlan(session: AuthSession) {
   // Get the current user from your database
   //    const user = __getUserFromDB__(request);
   // const supabase = createServerComponentClient(
   //    { cookies },
   //    {
   //       supabaseKey:
   //          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
   //       supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
   //    }
   // );

   // //    Check if we have a sessions
   // const {
   //    data: { session },
   //    error,
   // } = await supabase.auth.getSession();

   if (!session) {
      return NextResponse.json({ plan: null });
   }

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

   if (session.user.email?.endsWith("@umich.edu") || EXEMPT_EMAILS.includes(session?.user?.email)) {
      return NextResponse.json({ plan: "choreographer" });
   }

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
      })
      .catch((e) => {
         return NextResponse.json({ plan: null });
      });

   return NextResponse.json({ plan });
}
