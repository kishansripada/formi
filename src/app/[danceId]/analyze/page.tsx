"use client";

// import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { formation, dancer } from "../../../types/types";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";

const Analyze = ({ initialData, viewOnly: viewOnlyInitial, pricingTier }: { viewOnly: boolean }) => {
   // const supabase = useSupabaseClient();
   // const router = useRouter();
   // //    return <JSONViewer json={initialData}></JSONViewer>;
   // const extraDancers = (formation: formation, dancers: dancer[]) => {
   //    return formation.positions.filter((position) => !dancers.map((dancer) => dancer.id).includes(position.id)).map((position) => position.id);
   // };
   // const missingDancers = (formation: formation, dancers: dancer[]) => {
   //    return dancers.map((dancer) => dancer.id).filter((dancerId) => !formation.positions.map((position) => position.id).includes(dancerId));
   // };
   // const removeExtraDancers = async (formations: formation[], dancers: dancer[]) => {
   //    const fixedFormations = formations.map((formation) => {
   //       return {
   //          ...formation,
   //          positions: formation.positions.filter((position) => {
   //             return dancers.map((dancer) => dancer.id).includes(position.id);
   //          }),
   //       };
   //    });

   //    const { data, error } = await supabase
   //       .from("dances")
   //       .update({ formations: fixedFormations, last_edited: new Date() })
   //       .eq("id", router.query.danceId);
   // };

   // const addMissingDancers = async (formations: formation[], dancers: dancer[]) => {
   //    const fixedFormations = formations.map((formation) => {
   //       const missing = missingDancers(formation, dancers);
   //       return {
   //          ...formation,
   //          positions: [...formation.positions, ...missing.map((dancerId) => ({ id: dancerId, position: { x: 0, y: 0 } }))],
   //       };
   //    });

   //    const { data, error } = await supabase
   //       .from("dances")
   //       .update({ formations: fixedFormations, last_edited: new Date() })
   //       .eq("id", router.query.danceId);
   // };

   return (
      <>
         <div>test</div>
         {/* <div className="w-full h-64 flex flex-row  border ">
            <div className="border-r"></div>
            <div className="border-r w-1/3">
               <p>index</p>
            </div>
            <div className="border-r w-1/3">
               <p>extra dancers</p>
               <button
                  onClick={() => {
                     removeExtraDancers(initialData.formations, initialData.dancers);
                  }}
               >
                  repair
               </button>
            </div>
            <div className="border-r w-1/3">
               <p>missing dancers</p>
               <button
                  onClick={() => {
                     addMissingDancers(initialData.formations, initialData.dancers);
                  }}
               >
                  repair
               </button>
            </div>
         </div>

         <div className="flex flex-col w-full">
            {initialData.formations.map((formation: formation, index: number) => {
               const extras = extraDancers(formation, initialData.dancers);
               const missing = missingDancers(formation, initialData.dancers);
               return (
                  <div className="w-full h-64 flex flex-row  border ">
                     <div className="border-r text-2xl font-bold w-1/3">{index}</div>
                     <div
                        style={{
                           backgroundColor: extras.length ? "red" : "green",
                        }}
                        className="border-r w-1/3"
                     >
                        <p>{JSON.stringify(extras)}</p>
                     </div>

                     <div
                        style={{
                           backgroundColor: missing.length ? "red" : "green",
                        }}
                        className="border-r w-1/3"
                     >
                        <p>missing dancers</p>
                        <p>{JSON.stringify(missing)}</p>
                     </div>
                  </div>
               );
            })}
         </div> */}
      </>
   );
};

export default Analyze;

// export const getServerSideProps = async (ctx) => {
//    // Create authenticated Supabase Client
//    const supabase = createServerSupabaseClient(ctx, {
//       supabaseKey:
//          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
//       supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
//    });
//    // Check if we have a session
//    const {
//       data: { session },
//    } = await supabase.auth.getSession();

//    // console.log(session?.user.id);

//    // if (!session) {
//    //    return {
//    //       redirect: {
//    //          destination: "/",
//    //          permanent: false,
//    //       },
//    //    };
//    // }

//    // async function getSubscriptionPlan(supabase_id: string) {
//    //    return await fetch(
//    //       `https://api.stripe.com/v1/customers/search?query=metadata['supabase_id']:'${supabase_id}'&expand[]=data.subscriptions.data`,
//    //       {
//    //          headers: {
//    //             Authorization:
//    //                "Basic cmtfbGl2ZV81MUxhajV0SHZDM3c2ZThmY21zVklCRjlKMjRLUWFFYlgwVUs0SHE0b245QTVXMUNIaWlHaHAwVzlrbHg5dDU3OW9WcWVibFJGOHh3cE8xc3FlUmFMOHBzYjAwMmhLNFl0NEU6",
//    //          },
//    //       }
//    //    )
//    //       .then((r) => r.json())
//    //       .then((r) => {
//    //          // customerExists = Boolean(r.data.length);

//    //          let plan = r?.data?.[0]?.subscriptions.data?.[0] || null;
//    //          return plan || { plan: { product: null } };
//    //       });
//    // }

//    let [{ data: dance }, { data: permissions }] = await Promise.all([
//       supabase.from("dances").select("*, project_id(name)").eq("id", ctx.query.danceId).single(),
//       supabase.from("permissions").select("*").eq("performance_id", ctx.query.danceId),
//    ]);

//    // console.log(permissions);
//    // !session
//    // ? { plan: { product: null } }
//    // : grandfatheredEmails.includes(session?.user?.email)
//    // ? { plan: { product: "legacy" } }
//    // : getSubscriptionPlan(session?.user.id),

//    // let pricingTier = subscription.plan.product;

//    // let { data: dance } = await supabase.from("dances").select("*").eq("id", ctx.query.danceId).single();

//    // let sortedDeltas = deltas?.sort((a, b) => a.timestamp - b.timestamp);

//    // for (let i = 0; i < sortedDeltas.length; i++) {
//    //    jsondiffpatch.patch(dance.formations, sortedDeltas[i].delta);
//    // }

//    // let _ = await Promise.all([
//    //    supabase.from("deltas").delete().eq("danceid", ctx.query.danceId),
//    //    supabase.from("dances").update({ formations: dance.formations }).eq("id", ctx.query.danceId),
//    // ]);
//    // console.log(dance);
//    if (!dance?.formations && session) {
//       return {
//          redirect: {
//             destination: "/noaccess",
//             permanent: false,
//          },
//       };
//    }
//    if (!dance?.formations && !session) {
//       return {
//          redirect: {
//             destination: "/login",
//             permanent: false,
//          },
//       };
//    }
//    let viewOnly = false;

//    // dance = { ...{ ...dance, formations: dance.formations } };

//    return {
//       props: {
//          initialData: { ...dance, permissions },
//          viewOnly,
//          pricingTier: "legacy",
//       },
//    };
// };
