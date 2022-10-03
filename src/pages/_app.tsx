// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

import { Session } from "@supabase/supabase-js";
function MyApp({ Component, pageProps }: AppProps) {
   let [session, setSession] = useState<Session | null>(null);
   useEffect(() => {
      async function getInitialAuth() {
         let initalSession = await supabase.auth.session();
         setSession(initalSession);
      }
      getInitialAuth();
      supabase.auth.onAuthStateChange((event, session) => {
         setSession(session);
      });
   });
   return <Component {...pageProps} session={session} setSession={setSession} />;
}

export default MyApp;
