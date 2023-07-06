import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "../components/NonAppComponents/Header";
import toast, { Toaster } from "react-hot-toast";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Widget } from "@typeform/embed-react";
import "@typeform/embed/build/css/widget.css";

import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { MyDances } from "../components/DashboardComponents/MyDances";
import { Trash } from "../components/DashboardComponents/Trash";
import { grandfatheredEmails } from "../../public/grandfathered";
import { PerformancePreview } from "../components/DashboardComponents/PerformancePreview";
import { Dropdown } from "../components/DashboardComponents/Dropdown";
import { MyFiles } from "../components/DashboardComponents/Tabs/MyFiles";
import { Sidebar } from "../components/DashboardComponents/Sidebar";
import { NewFolderModel } from "../components/DashboardComponents/NewFolderModel";
const Dashboard = ({ dances, userData, sharedWithMe, projects: initialProjects }: {}) => {
   let session = useSession();

   const supabase = useSupabaseClient();
   const router = useRouter();
   const [myDances, setMyDances] = useState(dances); //dances
   const [projects, setProjects] = useState(initialProjects); //dances
   const [menuOpen, setMenuOpen] = useState<"home" | "shared" | "myfiles">("home");

   const [newFolderOpen, setNewFolderOpen] = useState(false);
   const [newFolderName, setNewFolderName] = useState("");
   let [openPerformanceMenu, setOpenPerformanceMenu] = useState<string | null>(null);
   const videos = [
      { url: "uiTwpkpsL1E", title: "Tutorial/Demo" },
      { url: "JRS1tPHJKAI", title: "Welcome to FORMI" },
      { url: "pY0IUM1ebHE", title: "Previous formation settings" },
      { url: "rhGn486vJJc", title: "What's a set piece?" },
   ];
   const clickHandler = (e) => {
      let isDropdown = e
         .composedPath()
         .map((elem) => elem.id)
         .includes("dropdown");

      if (!isDropdown) {
         setOpenPerformanceMenu(null);
      }
   };

   useEffect(() => {
      window.addEventListener("click", clickHandler);

      return () => {
         window.removeEventListener("click", clickHandler);
      };
   }, [openPerformanceMenu]);

   const removeFromTrash = async (id: string) => {
      const { data, error } = await supabase.from("dances").update({ isInTrash: false }).eq("id", id);
      invalidateDances();
      toast.success("Removed from trash");
   };
   async function invalidateProjects() {
      let data = await supabase.from("projects").select("*").eq("parent_id", session.user.id);
      setProjects(data?.data || []);
   }

   const invalidateDances = async () => {
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

      setMyDances(data?.data);
   };

   const deleteProject = async (id: number) => {
      const { data, error } = await supabase.from("projects").delete().eq("id", id);
      if (error) {
         toast.error("there was an issue deleting your dance");
         return;
      }
      toast.success("Deleted project");
      invalidateProjects();
   };
   const deleteDance = async (id: number) => {
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

   async function createNewProject() {
      setMenuOpen("myfiles");
      if (session === null) {
         router.push(`/login`);
         return;
      }

      const { data, error } = await supabase
         .from("projects")
         .insert([{ parent_id: session.user.id, name: newFolderName }])
         .select("id")
         .single();

      invalidateProjects();
      // if (!data?.id) return;
      // router.push(`/${data.id}/edit`);
   }

   return (
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
         {newFolderOpen ? (
            <NewFolderModel
               createNewProject={createNewProject}
               setNewFolderName={setNewFolderName}
               setNewFolderOpen={setNewFolderOpen}
               newFolderName={newFolderName}
            ></NewFolderModel>
         ) : null}

         <Toaster></Toaster>
         <div className="h-screen flex flex-row font-inter overscroll-none overflow-hidden bg-[#09090b] text-white">
            <Sidebar
               setNewFolderOpen={setNewFolderOpen}
               setMenuOpen={setMenuOpen}
               menuOpen={menuOpen}
               createNewDance={createNewDance}
               createNewProject={createNewProject}
            ></Sidebar>

            <div className="flex flex-col bg-neutral h-screen   overflow-hidden  w-full justify-start  ">
               <div className="flex flex-row items-center  px-6 py-4 text-neutral-200 ml-auto w-full mt-3">
                  <div className="mr-4 flex flex-row items-center">
                     {menuOpen === "home" ? (
                        <p>Home</p>
                     ) : menuOpen === "myfiles" ? (
                        <p>My files</p>
                     ) : menuOpen === "shared" ? (
                        <p>Shared With Me</p>
                     ) : menuOpen === "trash" ? (
                        <p>Trash</p>
                     ) : null}
                  </div>

                  <button
                     onClick={() => {
                        supabase.auth.signOut().then((r) => {
                           router.push("/login");
                        });
                     }}
                     className="mr-5 ml-auto text-xs"
                  >
                     Sign Out
                  </button>
               </div>

               {menuOpen === "home" ? (
                  <>
                     <div className="px-4 pb-10 h-full flex flex-col overflow-hidden">
                        <div className="h-[310px] min-h-[310px] overflow-scroll bg-neutral-900 rounded-xl mt-5">
                           <div className="flex flex-row items-center justify-between p-5">
                              <p className=" text-sm">Recents</p>
                              <button
                                 onClick={() => {
                                    setMenuOpen("myfiles");
                                 }}
                                 className="flex flex-row items-center text-xs border border-neutral-700 px-3 py-1 rounded-full"
                              >
                                 <p>All my files</p>
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 ml-2"
                                 >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                 </svg>
                              </button>
                           </div>
                           <div className="flex flex-row px-5">
                              {myDances.length ? (
                                 [...myDances.filter((dance) => !dance.isInTrash), ...sharedWithMe.filter((dance) => !dance.isInTrash)]
                                    .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                                    .slice(0, 4)
                                    ?.map((dance) => {
                                       return (
                                          <>
                                             <div className="w-full mr-5">
                                                <PerformancePreview
                                                   invalidateDances={invalidateDances}
                                                   dance={dance}
                                                   openPerformanceMenu={openPerformanceMenu}
                                                   setOpenPerformanceMenu={setOpenPerformanceMenu}
                                                ></PerformancePreview>
                                             </div>
                                          </>
                                       );
                                    })
                              ) : (
                                 <p className="text-sm">Click new performance to create your first performance</p>
                              )}
                           </div>
                        </div>
                        <div className=" h-full bg-neutral-900 mt-10 py-5  rounded-xl">
                           {/* <p className=" text-sm">Tutorials</p> */}
                           <div className="flex flex-row  h-full px-6">
                              {videos.map((video) => {
                                 return (
                                    <iframe
                                       src={`https://www.youtube.com/embed/${video.url}?rel=0&modestbranding=1&showinfo=0&controls=0`}
                                       title="YouTube video player"
                                       width="200"
                                       allow="accelerometer; autoplay; clipboard-write; encrypted-media;
                     gyroscope; picture-in-picture;
                     web-share"
                                       height="100%"
                                       className=" rounded-xl  mr-6"
                                    ></iframe>
                                 );
                              })}
                           </div>
                        </div>
                     </div>
                  </>
               ) : menuOpen === "myfiles" ? (
                  <MyFiles
                     setMyDances={setMyDances}
                     projects={projects}
                     deleteProject={deleteProject}
                     createNewDance={createNewDance}
                     invalidateDances={invalidateDances}
                     myDances={[...myDances.filter((dance) => !dance.isInTrash)]}
                     openPerformanceMenu={openPerformanceMenu}
                     setOpenPerformanceMenu={setOpenPerformanceMenu}
                  ></MyFiles>
               ) : menuOpen === "shared" ? (
                  <MyDances
                     openPerformanceMenu={openPerformanceMenu}
                     setOpenPerformanceMenu={setOpenPerformanceMenu}
                     invalidateDances={invalidateDances}
                     myDances={[...sharedWithMe.filter((dance) => !dance.isInTrash)]}
                  ></MyDances>
               ) : menuOpen === "trash" ? (
                  <Trash removeFromTrash={removeFromTrash} deleteDance={deleteDance} trash={myDances.filter((dance) => dance.isInTrash)}></Trash>
               ) : null}
            </div>
         </div>
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

      async function getProjects(session: Session) {
         let data = await supabase.from("projects").select("*").eq("parent_id", session.user.id);

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

      async function getUserData(session: Session) {
         let data = await supabase.from("user_data").select("*").eq("user_id", session.user.id).maybeSingle();
         return data?.data || null;
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
      let [dances, sharedWithMe, userData, projects] = await Promise.all([
         getMyDances(session),

         // getSubscriptionPlan(session),
         // getOrganization(session),
         getSharedWithMe(session),
         getUserData(session),
         getProjects(session),
      ]);
      // console.log(projects);
      // console.log(data);

      // const { data } = await supabase.from("dances").select("*").eq("user", user.id);

      return { props: { dances: dances, userData, sharedWithMe, projects } };
   },
});

function daysLeft(timestamp: number): number {
   const now = Date.now();
   const diffMs = timestamp * 1000 - now;
   const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
   return diffDays;
}
