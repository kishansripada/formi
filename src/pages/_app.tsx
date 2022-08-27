// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { supabase } from "../utils/supabase";
const session = supabase.auth.session();

function MyApp({ Component, pageProps }: AppProps) {
   return <Component {...pageProps} session={session} />;
}

export default MyApp;
