import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";
import { type } from "os";
import Link from "next/link";
import { Header } from "../components/NonAppComponents/Header";
import { Session } from "@supabase/supabase-js";
import toast, { Toaster } from "react-hot-toast";

const MyDances = ({ session, setSession }: { session: Session; setSession: Function }) => {
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
   //    console.log(session);
   const router = useRouter();
   const [myDances, setMyDances] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   const deleteDance = async (id: number) => {
      const { data, error } = await supabase.from("dances").delete().eq("id", id);
      if (data) {
         toast.success("deleted dance");
      }
      if (error) {
         toast.error("there was an issue deleting your dance");
      }
      console.log(data);
   };

   useEffect(() => {
      if (!session) return;
      //   console.log(session);

      supabase
         .from("dances")
         .select("*")
         .eq("user", session.user.id)
         .then((r) => {
            setIsLoading(false);
            setMyDances(r.data);
         });
   }, [session]);

   async function createNewDance() {
      const { data, error } = await supabase.from("dances").insert([{ user: session.user.id, last_edited: new Date() }]);
      console.log(data);
      router.push(`/${data[0].id}/edit`);
      console.log(error);
   }

   return (
      <div className="h-screen flex flex-col">
         <Header session={session} setSession={setSession}></Header>
         <hr />
         <div className="px-[10%]">
            <div className="flex flex-row">
               <div className="w-full">
                  <div className="flex flex-row items-center">
                     <p className="text-3xl font-semibold mb-6 mt-3">My dances</p>
                     <button onClick={createNewDance} className=" px-3 py-2 text-white rounded-md  bg-pink-600 hover:bg-pink-700 ml-auto">
                        New Dance
                     </button>
                  </div>
                  <div className="flex flex-row text-gray-500">
                     <p>name</p>
                     <p className="ml-auto mr-9">created</p>
                  </div>
                  <hr />
                  {isLoading ? (
                     <div className="flex flex-row justify-center mt-12">
                        <svg
                           className="mr-2 w-12 h-12 text-gray-200 animate-spin  fill-blue-600"
                           viewBox="0 0 100 101"
                           fill="white"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                           />
                           <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                           />
                        </svg>
                     </div>
                  ) : myDances.length ? (
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
         <Toaster></Toaster>
         <div className="h-28 w-full bg-pink-200 mt-auto flex flex-row items-center px-[10%]">
            have a feature request or bug to report?
            <a className="ml-3" href="https://forms.gle/UHN2RFz94B2Y1C2M7">
               submit it here
            </a>
         </div>
      </div>
   );
};

export default MyDances;
