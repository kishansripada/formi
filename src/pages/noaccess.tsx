// import { supabase } from "../utils/supabase";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import { supabase } from "../utils/supabase";
import { Header } from "../components/NonAppComponents/Header";
import { Session } from "@supabase/supabase-js";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

const NoAccess = () => {
   return (
      <>
         <p>nice try 😉. you can't view this dance</p>
      </>
   );
};
export default NoAccess;
