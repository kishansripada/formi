import "../styles/globals.css";
import { useState } from "react";
import type { AppProps } from "next/app";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({
   Component,
   pageProps,
}: AppProps<{
   initialSession: Session;
}>) {
   const [supabaseClient] = useState(() => createBrowserSupabaseClient());
   let router = useRouter();
   useEffect(() => {
      if (!router) return;

      window.location.href = `https://www.formistudio.app${router.asPath}`;
   }, [router]);
   return (
     
         <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
            <Component {...pageProps} />
         </SessionContextProvider>
    
   );
}

export default MyApp;
