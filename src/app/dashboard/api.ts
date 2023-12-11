"use server";

import { Session, SupabaseClient } from "@supabase/supabase-js";

const EXEMPT_EMAILS = [
   // MINE
   //    "kishansripada@formistudio.app",

   // KIRSTEN
   "kirsten.e.collison@gmail.com",
   "courtney.j.laney@gmail.com",
   "annaludgate11@gmail.com",
   "natalie.e1010@gmail.com",

   // BALEX
   "alex.battenfield@gmail.com",

   // DFD
   "devikafusiondance@gmail.com",

   // DAREN
   "darrengundling18@gmail.com",

   "gtramblinraas@gmail.com",
];

export async function getStripe(session: Session | null) {
   if (!session) return null;
   if (session.user.email?.endsWith("@umich.edu") || EXEMPT_EMAILS.includes(session.user.email)) return "choreographer";
   const plan = await fetch(
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

         let activeProducts = r?.data?.[0]?.subscriptions.data.map((data) => data.items.data.map((obj) => obj.plan.product)).flat();
         let plan = null;
         if (activeProducts?.includes("prod_MngV5QMEYtDnjr")) {
            plan = "choreographer";
         }
         return plan;
      });

   // return null;
   return plan as string | null;
}
export async function getRosters(session: Session, supabase: SupabaseClient) {
   let data = await supabase.from("rosters").select("*").eq("user_id", session.user.id);

   return data?.data || [];
}

export async function getMyDancesMetadata(session: Session, supabase: SupabaseClient) {
   let data = await supabase
      .from("dances")
      .select(
         `
               id,
               created_at,
               user,
               name,
               last_edited,
               settings,
               isInTrash,
               project_id
               `
      )
      .eq("user", session.user.id);

   return data?.data || [];
}

export async function getProjects(session: Session, supabase: SupabaseClient) {
   let data = await supabase.from("projects").select("*").eq("parent_id", session.user.id);

   return data?.data || [];
}

export async function getSharedWithMe(session: Session, supabase: SupabaseClient) {
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

export async function getMyDances(session: Session, supabase: SupabaseClient) {
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

export const deleteLiveblocksRoom = async (roomId: string) => {
   const options = {
      method: "DELETE",
      headers: {
         Authorization: "Bearer sk_prod_4KyaW_oX6LrE5PlWMvb3S79GNxTyTyBJqgG1g9caEJ_p5gGL4TZw3EDupgNeiDf0",
      },
   };

   const data = await fetch(`https://api.liveblocks.io/v2/rooms/${roomId}`, options).then((response) => response.json());

   return data;
};
