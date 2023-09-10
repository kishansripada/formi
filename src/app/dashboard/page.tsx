import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
// import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { ProjectPreview } from "./myperformances/ProjectPreview";
import { PerformancePreview } from "./_components/PerformancePreview";
import { DndContext, useDroppable, MouseSensor, useSensors, useSensor } from "@dnd-kit/core";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import Client from "./client";

async function getServerSideProps() {
   const supabase = createServerComponentClient(
      { cookies },
      {
         supabaseKey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
         supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
      }
   );

   // Check if we have a session
   const {
      data: { session },
      error,
   } = await supabase.auth.getSession();

   if (error) {
      throw error;
   }
   if (!session) {
      redirect("/login");
   }
   async function getStripe(session: Session) {
      const plan = fetch(
         `https://api.stripe.com/v1/customers/search?query=metadata['supabase_id']:'${session.user.id}'&expand[]=data.subscriptions.data`,
         {
            headers: {
               Authorization:
                  "Basic cmtfbGl2ZV81MUxhajV0SHZDM3c2ZThmY21zVklCRjlKMjRLUWFFYlgwVUs0SHE0b245QTVXMUNIaWlHaHAwVzlrbHg5dDU3OW9WcWVibFJGOHh3cE8xc3FlUmFMOHBzYjAwMmhLNFl0NEU6",
            },
         }
      )
         .then((r) => r.json())
         .then((r) => {
            // customerExists = Boolean(r.data.length);

            let plan = r?.data?.[0]?.subscriptions.data[0];
            return plan;
         });
      return plan;
   }

   async function getMyDances(session: Session) {
      let data = await supabase
         .from("dances")
         .select(
            `
                 id,
                 created_at,
                 user,
                 formations: formations->0,
                 name,
                 last_edited,
                 settings,
                 isInTrash,
                 dancers,
                 project_id
                 `
         )
         .eq("user", session.user.id);

      return data?.data || [];
   }

   async function getSharedWithMe(session: Session) {
      let data = await supabase
         .from("permissions")
         .select(
            `
                 performance_id (
                 id,
                 created_at,
                 user,
                 formations: formations->0,
                 name,
                 last_edited,
                 settings,
                 isInTrash,
                 dancers
                 )
                 
                 `
         )
         .eq("email", session.user.email);

      return data?.data?.map((x) => x?.performance_id) || [];
   }

   let [dances, sharedWithMe, plan] = await Promise.all([getMyDances(session), getSharedWithMe(session), getStripe(session)]);

   return { dances, sharedWithMe, session, plan };
}

export default async function Page({}) {
   const { dances: myDances, sharedWithMe, session, plan } = await getServerSideProps();
   return <Client sharedWithMe={sharedWithMe} myDances={myDances} session={session} plan={plan}></Client>;
}
