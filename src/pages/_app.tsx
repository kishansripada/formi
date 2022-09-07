// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
   return (
      <DndProvider backend={HTML5Backend}>
         <Component {...pageProps} session={session} setSession={setSession} />;
      </DndProvider>
   );
}

export default MyApp;
