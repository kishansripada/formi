import { Room } from "@liveblocks/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WebhookHandler } from "@liveblocks/node";
const webhookHandler = new WebhookHandler(process.env.WEBHOOK_SECRET);
export async function POST(request: Request) {
   // Get the current user from your database
   //    const user = __getUserFromDB__(request);
   const supabase = createClient(
      "https://dxtxbxkkvoslcrsxbfai.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2MTQ2Mzc0NiwiZXhwIjoxOTc3MDM5NzQ2fQ.1Sbj1t90pvU2JveRQj0YvCGddbo5ojph-SBcPtGgNDo"
   );
   const { roomId } = await request.json();
   try {
      const event = webhookHandler.verifyRequest({
         headers: request.headers,
         rawBody: request.body,
      });

      // Handle `WebhookEvent`

      if (event.type === "storageUpdated") {
         return new Response(JSON.stringify(event));
      } else if (event.type === "userEntered") {
         // Handle `UserEnteredEvent`
      } else if (event.type === "userLeft") {
         // Handle `UserLeftEvent`
      }
   } catch (error) {
      console.error(error);
      return new Response(error, { status: 400 });
   }
}
