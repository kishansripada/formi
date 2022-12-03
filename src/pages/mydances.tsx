import { useEffect, useState } from "react";
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

   useEffect(() => {
      console.log(session);
   }, [session]);
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
                     <h1 className="text-2xl font-bold"> Import from danceapp.us</h1>

                     <input
                        value={danceAppLink}
                        onChange={(e) => {
                           setDanceAppLink(e.target.value);
                        }}
                        placeholder="danceapp.us link"
                        type="text"
                        className=" outline outline-2 rounded px-2 mt-6"
                     />
                     <div className="flex flex-row items-center justify-center">
                        <img src="https://i.imgur.com/mBCNO7A.png" className="w-48 rounded-xl mt-10" alt="" />
                        <p className="w-48 ml-10">make sure the dance is uploaded before pasting the url</p>
                     </div>
                     <button onClick={importFromDanceApp} className="ml-auto bg-blue-600 text-white px-3 mt-5 py-1 rounded-md">
                        import
                     </button>
                  </div>
               </div>
            </div>
         ) : null}
         <>
            <div className="h-screen flex flex-row font-proxima">
               <Toaster></Toaster>
               {/* <Header></Header> */}

               <div className="w-[17%] px-6 py-4 h-screen flex flex-col shadow-xl ">
                  <div className=" font-proxima">
                     <h1 className="text-5xl font-bold z-10 relative select-none">FORMI</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[100%]"></div>
                  </div>

                  <div className="flex flex-row mt-3  ">
                     <img className="rounded-md w-16 pointer-events-none select-none mr-3" src={session?.user.user_metadata.avatar_url} alt="" />
                     <div className="flex flex-col items-start justify-center">
                        <p className="font-semibold">{session?.user.user_metadata?.full_name}</p>
                        <p className="text-gray-500 text-sm">basic plan</p>
                     </div>
                  </div>

                  <button
                     className="flex flex-row justify-between items-center bg-pink-600 text-white text-sm w-full py-3 px-3 rounded-lg mt-5    font-medium"
                     onClick={createNewDance}
                  >
                     <p>new performance</p>

                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 mr-1"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                     </svg>
                  </button>

                  <button
                     className="flex flex-row justify-between items-center bg-gray-200 text-black  font-medium  w-full py-3 px-3 rounded-lg mt-2"
                     onClick={createNewDance}
                  >
                     <p>home</p>
                  </button>
                  <button
                     className="flex flex-row justify-between items-center  text-black  font-medium  w-full py-3 px-3 rounded-lg mt-2"
                     onClick={createNewDance}
                  >
                     <p>templates</p>
                  </button>
                  <button
                     className="flex flex-row justify-between items-center  text-black  font-medium  w-full py-3 px-3 rounded-lg mt-2"
                     onClick={createNewDance}
                  >
                     <p>rosters</p>
                  </button>
                  <button
                     className="flex flex-row justify-between items-center mt-auto text-black  font-medium  w-full py-3 px-3 rounded-lg "
                     onClick={createNewDance}
                  >
                     <p>trash</p>
                  </button>
               </div>

               <div className="flex flex-col bg-gray-100 w-[83%] pl-10 font-proxima">
                  <div className="flex flex-row items-center justify-end p-6 text-gray-500">
                     <button>upgrade ⚡️</button>
                  </div>
                  <h1 className="mt-16 text-2xl">
                     let's create some <span className="font-bold">performances</span>!
                  </h1>
                  <p className="mt-9 font-medium">recent performances</p>
                  <div className="w-full flex flex-row overflow-x-scroll mt-7 removeScrollBar">
                     {myDances.length ? (
                        myDances
                           .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                           .map((dance) => {
                              return (
                                 <>
                                    <div className="flex flex-col items-center  cursor-pointer text-gray-700 mr-5">
                                       <div className="bg-gray-200 rounded-xl h-[200px] w-[350px]"></div>
                                       <Link key={dance.id} href={`/${dance.id}/edit`}>
                                          <div className="flex flex-col items-start  w-full">
                                             <p className="mt-1 font-semibold">{dance.name}</p>
                                             <p className=" text-xs text-gray-400">{timeSince(dance.last_edited)} ago</p>
                                             {/* <div className="flex flex-row items-center ml-auto">
                                          
                                                <p className="mt-1 ml-auto mr-3">{timeSince(dance.created_at)} ago</p>
                                             </div> */}
                                          </div>
                                       </Link>
                                       {/* <svg
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
                                       </svg> */}
                                    </div>
                                 </>
                              );
                           })
                     ) : (
                        <p>looks like you don't have any dances</p>
                     )}
                  </div>
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
