import { useEffect, useState, useRef } from "react";
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

import { Dropdown } from "../components/DashboardComponents/Dropdown";
const Dashboard = ({ dances, subscription, initialOrganization, sharedWithMe }: {}) => {
   let session = useSession();
   console.log(session);
   const supabase = useSupabaseClient();
   const [importIsOpen, setImportIsOpen] = useState(!dances.length);
   const [danceAppLink, setDanceAppLink] = useState("");
   const router = useRouter();
   const [myDances, setMyDances] = useState(dances);
   const [menuOpen, setMenuOpen] = useState<"mydances" | "sharedWithMe" | "trash">("mydances");

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
            {/* <TypeFromEmbed user_id={session?.user?.id}></TypeFromEmbed> */}
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
                           {/* {subscription.plan.product === "legacy" ? <p>Early Adopter</p> : subscription.plan.product ? <p>FORMI Pro </p> : <p> </p>} */}
                        </div>
                     </div>
                  </div>

                  <button
                     className={`flex flex-row justify-between mt-4 items-center ${menuOpen === "mydances" ? "bg-pink-200" : ""}   w-full h-9 px-3`}
                     onClick={() => setMenuOpen("mydances")}
                  >
                     <p>Recents</p>
                  </button>
                  <button
                     className={`flex flex-row justify-between items-center ${menuOpen === "sharedWithMe" ? "bg-pink-200" : ""}   w-full h-9 px-3`}
                     onClick={() => setMenuOpen("sharedWithMe")}
                  >
                     <p>Shared With Me</p>
                  </button>

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
                        {/* {subscription.plan.product && subscription.plan.product !== "legacy" ? (
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
                           <></>
                           <button
                              onClick={() => {
                                 router.push("/pricing");
                              }}
                              className="mr-5"
                           >
                              Upgrade
                           </button>
                        )} */}
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
                        myDances={[...myDances.filter((dance) => !dance.isInTrash)]}
                        canCreatePerformance={true}
                     ></MyDances>
                  ) : menuOpen === "sharedWithMe" ? (
                     <MyDances
                        subscription={subscription}
                        createNewDance={createNewDance}
                        invalidateDances={invalidateDances}
                        myDances={[...sharedWithMe.filter((dance) => !dance.isInTrash)]}
                        canCreatePerformance={false}
                     ></MyDances>
                  ) : menuOpen === "trash" ? (
                     <Trash removeFromTrash={removeFromTrash} deleteDance={deleteDance} trash={myDances.filter((dance) => dance.isInTrash)}></Trash>
                  ) : null}
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

      // async function getOrganization(session: Session) {
      //    return [];
      //    let data = await supabase.rpc("get_organization_and_people", {
      //       idd: session.user.id,
      //    });
      //    return data.data || [];
      // }

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

      // async function getSubscriptionPlan(session: Session) {
      //    if (!session?.user?.email) {
      //       return { plan: { product: null } };
      //    }
      //    if (grandfatheredEmails.includes(session.user.email)) {
      //       return { plan: { product: "legacy" } };
      //    }

      //    return await fetch(
      //       `https://api.stripe.com/v1/customers/search?query=metadata['supabase_id']:'${session?.user?.id}'&expand[]=data.subscriptions.data`,
      //       {
      //          cache: "no-cache",
      //          headers: {
      //             Authorization:
      //                "Basic cmtfbGl2ZV81MUxhajV0SHZDM3c2ZThmY21zVklCRjlKMjRLUWFFYlgwVUs0SHE0b245QTVXMUNIaWlHaHAwVzlrbHg5dDU3OW9WcWVibFJGOHh3cE8xc3FlUmFMOHBzYjAwMmhLNFl0NEU6",
      //          },
      //       }
      //    )
      //       .then((r) => r.json())
      //       .then((r) => {
      //          // customerExists = Boolean(r.data.length);

      //          let plan = r?.data?.[0]?.subscriptions.data?.[0] || null;

      //          return plan || { plan: { product: null } };
      //       });
      // }
      // getOrganizationPerformances(session);
      let [dances, sharedWithMe] = await Promise.all([
         getMyDances(session),
         // getSubscriptionPlan(session),
         // getOrganization(session),
         getSharedWithMe(session),
      ]);

      // const { data } = await supabase.from("dances").select("*").eq("user", user.id);

      return { props: { dances: dances, sharedWithMe } };
   },
});

function daysLeft(timestamp: number): number {
   const now = Date.now();
   const diffMs = timestamp * 1000 - now;
   const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
   return diffDays;
}

const TypeFromEmbed = ({ user_id }: { user_id: string }) => {
   useEffect(() => {
      // Load TikTok script
      const script = document.createElement("script");
      script.setAttribute("src", "//embed.typeform.com/next/embed.js");
      script.setAttribute("async", true);
      document.body.appendChild(script);

      return () => {
         // Clean up script to avoid multiple instances
         document.body.removeChild(script);
      };
   }, []);

   return (
      <>
         {user_id ? (
            <div
               data-tf-widget="cq9sssDy"
               data-tf-opacity="100"
               data-tf-inline-on-mobile
               data-tf-iframe-props="title=Onboarding"
               data-tf-transitive-search-params
               data-tf-auto-focus
               data-tf-medium="snippet"
               data-tf-full-screen
               data-tf-hidden={`user_id=${user_id}`}
            ></div>
         ) : null}
      </>
   );
};
