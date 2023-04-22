import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "../components/NonAppComponents/Header";
import toast, { Toaster } from "react-hot-toast";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";

import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { MyDances } from "../components/DashboardComponents/MyDances";
import { Rosters } from "../components/DashboardComponents/Rosters";
import { AudioFiles } from "../components/DashboardComponents/AudioFiles";
import { Trash } from "../components/DashboardComponents/Trash";
import { grandfatheredEmails } from "../../public/grandfathered";
// import { Organization } from "../components/DashboardComponents/Organization";
// import { OrganizationPerformances } from "../components/DashboardComponents/OrganizationPerformances";
// import { SharedWithMe } from "../components/DashboardComponents/SharedWithMe";
import { Dropdown } from "../components/DashboardComponents/Dropdown";
const Dashboard = ({ dances, subscription, initialOrganization, sharedWithMe }: {}) => {
   let session = useSession();

   const supabase = useSupabaseClient();
   const [importIsOpen, setImportIsOpen] = useState(!dances.length);
   const [danceAppLink, setDanceAppLink] = useState("");
   const router = useRouter();
   const [myDances, setMyDances] = useState(dances);
   const [menuOpen, setMenuOpen] = useState<"mydances" | "rosters" | "audio" | "trash">("mydances");
   // const [organization, setOrganization] = useState(initialOrganization);
   // const [orgName, setOrgName] = useState("");
   async function getOrganization(session: Session) {
      let data = await supabase.rpc("get_organization_and_people", {
         idd: session.user.id,
      });
      // setOrganization(data.data || []);
   }
   const removeFromTrash = async (id: string) => {
      console.log(id);
      const { data, error } = await supabase.from("dances").update({ isInTrash: false }).eq("id", id);
      console.log(error);
      invalidateDances();
      toast.success("Removed from trash");
   };

   const invalidateDances = async () => {
      let data = await supabase.rpc("get_dances_by_user", {
         input_uuid: session.user.id,
      });
      setMyDances(data.data);
   };

   const deleteDance = async (id: number) => {
      console.log(id);
      const { data, error } = await supabase.from("dances").delete().eq("id", id);
      if (error) {
         toast.error("there was an issue deleting your dance");
         return;
      }
      toast.success("Deleted dance");
      invalidateDances();
   };

   async function createNewDance() {
      if (session === null) {
         router.push(`/login`);
         return;
      }

      const { data, error } = await supabase
         .from("dances")
         .insert([{ user: session.user.id, last_edited: new Date() }])
         .select("id")
         .single();

      if (!data?.id) return;
      router.push(`/${data.id}/edit`);
   }

   async function importFromDanceApp() {
      if (session === null) {
         router.push(`/login`);
         return;
      }
      const { dancers, formations } = await fetch(`/api/importFromDanceApp?url=${danceAppLink}`).then((r) => r.json());

      const { data, error } = await supabase
         .from("dances")
         .insert([{ user: session.user.id, last_edited: new Date(), dancers, formations, name: "New import from danceapp" }])
         .select("id")
         .single();

      if (!data?.id) return;
      router.push(`/${data.id}/edit`);
   }

   return (
      <>
         <>
            <Toaster></Toaster>
            <style>
               {`
               body {
                  overscroll-behavior: none;
                  user-select: none;
              }
               `}
            </style>
            <div className="h-screen flex flex-row font-inter overscroll-none overflow-hidden">
               <Toaster></Toaster>
               {/* <Header></Header> */}

               <div className="min-w-[240px] w-[240px]  py-4 h-screen lg:flex hidden flex-col box-border border-r-neutral-200 text-sm border ">
                  {/* <img className="w-44" src="/logos/logo_light.svg" alt="" /> */}

                  <div className="flex flex-row mt-3 ml-2  ">
                     <img
                        referrerPolicy="no-referrer"
                        className="rounded-md w-16 pointer-events-none select-none mr-3"
                        src={
                           session?.user.user_metadata.avatar_url ||
                           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjof8tQrQxYWAJQ7ICx4AaaN9rZK_bfgKsFuqssREfxA&s"
                        }
                        alt=""
                     />

                     <div className="flex flex-col items-start justify-center w-full">
                        <p className="font-semibold">{session?.user.user_metadata?.full_name}</p>
                        <div className="text-neutral-500 text-sm flex flex-row items-center justify-between w-full">
                           {subscription.plan.product === "legacy" ? (
                              <p>Early Adopter</p>
                           ) : subscription.plan.product ? (
                              <p>FORMI Pro </p>
                           ) : (
                              <p>Free Plan </p>
                           )}
                        </div>
                     </div>
                  </div>

                  <button
                     className={`flex flex-row justify-between mt-4 items-center ${menuOpen === "mydances" ? "bg-pink-200" : ""}   w-full h-9 px-3`}
                     onClick={() => setMenuOpen("mydances")}
                  >
                     <p>Recents</p>
                  </button>
                  {/* <button
                     className={`flex flex-row justify-between items-center ${menuOpen === "sharedwithme" ? "bg-pink-200" : ""}   w-full h-9 px-3`}
                     onClick={() => setMenuOpen("sharedwithme")}
                  >
                     <p>Shared With Me</p>
                  </button> */}
                  {!subscription.plan.product ? (
                     <div className="w-full px-3 mt-2">
                        <div className="w-full p-6 bg-neutral-100 text-center text-xs rounded-md">
                           <p>Ready to go beyond the free plan? Upgrade for unlimited performances.</p>
                           <Link href={"/pricing"}>
                              <button className="bg-pink-600 text-white w-full mt-3 py-2 rounded-md">View Plans</button>
                           </Link>
                        </div>
                     </div>
                  ) : null}

                  {/* <button
                     className={`flex flex-row justify-between items-center ${
                        menuOpen === "sharedwithme" ? "bg-pink-200" : ""
                     } text-black  font-medium  w-full py-3 px-3 rounded-lg mt-2`}
                     onClick={() => setMenuOpen("sharedwithme")}
                  >
                     <p>Shared With Me</p>
                  </button> */}
                  {/* <button
                     className={`flex flex-row justify-between items-center ${
                        menuOpen === "orgdances" ? "bg-neutral-200" : ""
                     } text-black  font-medium  w-full py-3 px-3 rounded-lg mt-2`}
                     onClick={() => setMenuOpen("orgdances")}
                  >
                     <p>My Organization's Performances</p>
                  </button> */}

                  {/* <button
                     className={`flex flex-row justify-between items-center ${
                        menuOpen === "rosters" ? "bg-neutral-200" : ""
                     } text-black  font-medium  w-full py-3 px-3 rounded-lg mt-2`}
                     onClick={() => setMenuOpen("rosters")}
                  >
                     <p>rosters</p>
                  </button> */}
                  {/* <button
                     onClick={() => setMenuOpen("audio")}
                     className={`flex flex-row justify-between items-center ${
                        menuOpen === "audio" ? "bg-neutral-200" : ""
                     } text-black  font-medium  w-full py-3 px-3 rounded-lg mt-2`}
                  >
                     <p>Uploaded Audio</p>
                  </button> */}
                  {/* <button
                     className={`flex flex-row justify-between items-center mt-auto ${
                        menuOpen === "organization" ? "bg-neutral-200" : ""
                     } text-black  font-medium  w-full py-3 px-3 rounded-lg mt-2`}
                     onClick={() => setMenuOpen("organization")}
                  >
                     <p>My Organization</p>
                  </button> */}

                  <button
                     className={`flex flex-row justify-between items-center mt-auto  ${
                        menuOpen === "trash" ? "bg-neutral-200" : ""
                     } text-black  font-medium  w-full py-3 px-3 rounded-lg mt-2`}
                     onClick={() => setMenuOpen("trash")}
                  >
                     <p>Trash</p>
                  </button>
               </div>

               <div className="flex flex-col bg-neutral    w-full justify-start items-center ">
                  <div className="flex flex-row items-center justify-end px-6 py-4 text-neutral-500 ml-auto border-b border-b-neutral-200 w-full">
                     <div className="flex flex-row items-center text-neutral-900">
                        {/* {organization ? (
                           <p
                              onClick={() => {
                                 toast("You're plan is managed by your organization.");
                              }}
                              className="mr-4 "
                           >
                              {organization[0].organization_name}
                           </p>
                        ) : null} */}
                        {subscription.plan.product && subscription.plan.product !== "legacy" ? (
                           <>
                              {subscription.cancel_at ? (
                                 <p className="mr-4 text-neutral-600 text-sm">{daysLeft(subscription.cancel_at)} days remaining </p>
                              ) : null}

                              <button
                                 onClick={() => {
                                    router.push("/api/customerportal");
                                 }}
                                 className="mr-5 "
                              >
                                 Manage Subscription
                              </button>
                           </>
                        ) : (
                           <button
                              onClick={() => {
                                 router.push("/pricing");
                              }}
                              className="mr-5"
                           >
                              Upgrade
                           </button>
                        )}
                     </div>

                     <button
                        onClick={() => {
                           supabase.auth.signOut().then((r) => {
                              router.push("/login");
                           });
                        }}
                        className="mr-5"
                     >
                        Sign Out
                     </button>
                  </div>

                  {menuOpen === "mydances" ? (
                     <MyDances
                        subscription={subscription}
                        createNewDance={createNewDance}
                        invalidateDances={invalidateDances}
                        myDances={[...myDances.filter((dance) => !dance.isInTrash), ...sharedWithMe]}
                     ></MyDances>
                  ) : menuOpen === "rosters" ? (
                     <Rosters></Rosters>
                  ) : menuOpen === "trash" ? (
                     <Trash removeFromTrash={removeFromTrash} deleteDance={deleteDance} trash={myDances.filter((dance) => dance.isInTrash)}></Trash>
                  ) : // : menuOpen === "organization" ? (
                  //       <Organization organization={organization} getOrganization={getOrganization}></Organization>
                  //    ) : menuOpen === "orgdances" ? (
                  //       <OrganizationPerformances></OrganizationPerformances>
                  //    )

                  null}
               </div>
            </div>
         </>
      </>
   );
};

export default Dashboard;

export const getServerSideProps = withPageAuth({
   redirectTo: "/login",
   async getServerSideProps(ctx, supabase) {
      const {
         data: { session },
         error,
      } = await supabase.auth.getSession();

      if (error) {
         throw error;
      }
      if (!session) {
         return { props: {} };
      }

      // async function getOrganizationPerformances(session: Session) {
      //    let { data, error } = await supabase.rpc("organization_performances_from_user_id", {
      //       idd: session.user.id,
      //    });
      //    console.log(error);
      // }
      async function getOrganization(session: Session) {
         return [];
         let data = await supabase.rpc("get_organization_and_people", {
            idd: session.user.id,
         });
         return data.data || [];
      }

      async function getMyDances(session: Session) {
         let data = await supabase.rpc("get_dances_by_user", {
            input_uuid: session.user.id,
         });
         console.log(data.data);
         return data.data || [];
      }

      async function getSharedWithMe(session: Session) {
         let data = await supabase.rpc("get_shared_dances_with_first_formation", {
            email: session.user.email,
         });
         return data.data || [];
      }

      async function getSubscriptionPlan(session: Session) {
         if (!session?.user?.email) {
            return { plan: { product: null } };
         }
         if (grandfatheredEmails.includes(session.user.email)) {
            return { plan: { product: "legacy" } };
         }

         return await fetch(
            `https://api.stripe.com/v1/customers/search?query=metadata['supabase_id']:'${session?.user?.id}'&expand[]=data.subscriptions.data`,
            {
               cache: "no-cache",
               headers: {
                  Authorization:
                     "Basic cmtfbGl2ZV81MUxhajV0SHZDM3c2ZThmY21zVklCRjlKMjRLUWFFYlgwVUs0SHE0b245QTVXMUNIaWlHaHAwVzlrbHg5dDU3OW9WcWVibFJGOHh3cE8xc3FlUmFMOHBzYjAwMmhLNFl0NEU6",
               },
            }
         )
            .then((r) => r.json())
            .then((r) => {
               // customerExists = Boolean(r.data.length);

               let plan = r?.data?.[0]?.subscriptions.data?.[0] || null;

               return plan || { plan: { product: null } };
            });
      }
      // getOrganizationPerformances(session);
      let [dances, subscription, organization, sharedWithMe] = await Promise.all([
         getMyDances(session),
         getSubscriptionPlan(session),
         getOrganization(session),
         getSharedWithMe(session),
      ]);

      // const { data } = await supabase.from("dances").select("*").eq("user", user.id);

      return { props: { dances: dances, subscription: subscription, initialOrganization: organization, sharedWithMe } };
   },
});

function daysLeft(timestamp: number): number {
   const now = Date.now();
   const diffMs = timestamp * 1000 - now;
   const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
   return diffDays;
}
