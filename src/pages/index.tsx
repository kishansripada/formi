// import { supabase } from "../utils/supabase";
// import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
// import { supabase } from "../utils/supabase";
// import { Header } from "../components/NonAppComponents/Header";

const home = () => {
   const router = useRouter();

   useEffect(() => {
      if (router.isReady) {
         router.push("/login");
      }
   }, [router]);

   return <></>;
};
export default home;
