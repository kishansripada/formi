import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "../components/NonAppComponents/Header";
import toast, { Toaster } from "react-hot-toast";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

const MyDances = ({ dances }: {}) => {
   let session = useSession();
   const supabase = useSupabaseClient();
   const [importIsOpen, setImportIsOpen] = useState(false);
   const [danceAppLink, setDanceAppLink] = useState("");
   const router = useRouter();
   const [myDances, setMyDances] = useState(dances);

   const deleteDance = async (id: number) => {
      const { data, error } = await supabase.from("dances").delete().eq("id", id);
      if (data) {
         toast.success("deleted dance");
      }
      if (error) {
         toast.error("there was an issue deleting your dance");
      }
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
         {importIsOpen ? (
            <div
               className="fixed top-0 left-0 z-[70] flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
               id="outside"
               onClick={(e) => {
                  if (e.target.id === "outside") {
                     setImportIsOpen(false);
                  }
               }}
            >
               <div className="flex  w-[700px] flex-col rounded-xl bg-white">
                  <div className="flex flex-col rounded-xl px-10 pt-10 pb-6 h-full">
                     <p>paste an uploaded link from danceapp.us</p>
                     <input
                        value={danceAppLink}
                        onChange={(e) => {
                           setDanceAppLink(e.target.value);
                        }}
                        type="text"
                        className=" outline outline-2"
                     />
                     <button onClick={importFromDanceApp} className="ml-auto bg-blue-600 text-white px-3 mt-5 py-1 rounded-md">
                        import
                     </button>
                  </div>
               </div>
            </div>
         ) : null}
         <>
            <div className="h-screen flex flex-col">
               <Toaster></Toaster>
               <Header session={session}></Header>
               <hr />
               <div className="px-[10%]">
                  <div className="flex flex-row">
                     <div className="w-full">
                        <div className="flex flex-row items-center">
                           <p className="text-3xl font-semibold mb-6 mt-3">My dances</p>
                           <div className="ml-auto">
                              <button onClick={() => setImportIsOpen(true)} className=" px-3 py-2 text-pink-600">
                                 import from Danceapp.us
                              </button>
                              <button onClick={createNewDance} className=" px-3 py-2 text-white rounded-md  bg-pink-600 hover:bg-pink-700 ">
                                 New Dance
                              </button>
                           </div>
                        </div>
                        <div className="flex flex-row text-gray-500">
                           <p>name</p>
                           <p className="ml-auto mr-9">created</p>
                        </div>
                        <hr />
                        {myDances.length ? (
                           myDances
                              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                              .map((dance) => {
                                 return (
                                    <>
                                       <div className="flex flex-row items-center h-16 cursor-pointer">
                                          <Link key={dance.id} href={`/${dance.id}/edit`}>
                                             <div className="flex flex-row items-center grow">
                                                <p className="mt-1">{dance.name}</p>
                                                <p className="mt-1 ml-auto mr-3">{timeSince(dance.created_at)} ago</p>
                                             </div>
                                          </Link>
                                          <svg
                                             onClick={() => {
                                                deleteDance(dance.id);
                                                setMyDances((dances) => {
                                                   return dances.filter((mapDance) => mapDance.id !== dance.id);
                                                });
                                             }}
                                             xmlns="http://www.w3.org/2000/svg"
                                             fill="none"
                                             viewBox="0 0 24 24"
                                             strokeWidth={1.5}
                                             stroke="currentColor"
                                             className="w-6 h-6"
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                             />
                                          </svg>
                                       </div>

                                       <hr />
                                    </>
                                 );
                              })
                        ) : (
                           <p>looks like you don't have any dances</p>
                        )}
                     </div>
                  </div>
               </div>

               <div className="h-28 w-full bg-pink-200 mt-auto flex flex-row items-center px-[10%]">
                  have a feature request or bug to report?
                  <a className="ml-3" href="https://forms.gle/UHN2RFz94B2Y1C2M7">
                     submit it here
                  </a>
               </div>
            </div>
         </>
      </>
   );
};

export default MyDances;

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
      const { user } = session;

      const { data } = await supabase.from("dances").select("*").eq("user", user.id);

      return { props: { dances: data } };
   },
});

var timeSince = function (date: string) {
   if (typeof date !== "object") {
      date = new Date(date);
   }

   var seconds = Math.floor((new Date() - date) / 1000);
   var intervalType;

   var interval = Math.floor(seconds / 31536000);
   if (interval >= 1) {
      intervalType = "year";
   } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
         intervalType = "month";
      } else {
         interval = Math.floor(seconds / 86400);
         if (interval >= 1) {
            intervalType = "day";
         } else {
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
               intervalType = "hour";
            } else {
               interval = Math.floor(seconds / 60);
               if (interval >= 1) {
                  intervalType = "minute";
               } else {
                  interval = seconds;
                  intervalType = "second";
               }
            }
         }
      }
   }

   if (interval > 1 || interval === 0) {
      intervalType += "s";
   }

   return interval + " " + intervalType;
};
