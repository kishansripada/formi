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
         setLoading(true);
      };
      const end = () => {
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
               <div className="flex items-center justify-center h-screen dark:bg-neutral-900 ">
                  <style>
                     {`
                     /* Define the keyframes for the animation */
                     @keyframes width-animation {
                       0% {
                         width: 0;
                       }
                       100% {
                         width: 150px;
                       }
                     }
                     
                     /* Create a CSS class that applies the animation */
                     .animate-width {
                       animation: width-animation 0.5s linear forwards;
                     }
                     `}
                  </style>
                  <div className="w-[150px] cursor-pointer">
                     {/* <h1 className="text-6xl font-bold z-10 relative">naach.app</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[58%]"></div> */}
                     <h1 className="text-4xl font-bold z-10 dark:text-neutral-200 relative">FORMI</h1>

                     <div className="bg-[#E7ADC5] dark:bg-pink-600 relative h-2  top-[-10px] mr-auto animate-width"></div>
                  </div>
               </div>
            </>
         ) : (
            <Component {...pageProps} />
         )}
      </SessionContextProvider>
   );
}

export default MyApp;
