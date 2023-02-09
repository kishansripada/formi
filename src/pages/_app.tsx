import "../styles/globals.css";
import { useState } from "react";
import type { AppProps } from "next/app";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";

function MyApp({
   Component,
   pageProps,
}: AppProps<{
   initialSession: Session;
}>) {
   const [supabaseClient] = useState(() =>
      createBrowserSupabaseClient({
         supabaseKey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
         supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
         options: {
            realtime: {
               params: {
                  eventsPerSecond: 5,
               },
            },
         },
      })
   );

   return (
      <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
         <Component {...pageProps} />
      </SessionContextProvider>
   );
}

export default MyApp;
