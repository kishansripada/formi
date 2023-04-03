import "../styles/globals.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import Router from "next/router";

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
                  eventsPerSecond: -1,
                  log_level: "debug",
               },
            },
         },
      })
   );

   const [loading, setLoading] = useState(false);
   useEffect(() => {
      const start = () => {
         console.log("start");
         setLoading(true);
      };
      const end = () => {
         console.log("finished");
         setLoading(false);
      };
      Router.events.on("routeChangeStart", start);
      Router.events.on("routeChangeComplete", end);
      Router.events.on("routeChangeError", end);
      return () => {
         Router.events.off("routeChangeStart", start);
         Router.events.off("routeChangeComplete", end);
         Router.events.off("routeChangeError", end);
      };
   }, []);

   return (
      <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
         {loading ? (
            <>
               <div className="flex items-center justify-center h-screen ">
                  <div className="w-16 h-16 border-b-2 border-pink-600 rounded-full animate-spin"></div>
               </div>
            </>
         ) : (
            <Component {...pageProps} />
         )}
      </SessionContextProvider>
   );
}

export default MyApp;
