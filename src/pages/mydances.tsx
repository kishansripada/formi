import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";
import { type } from "os";
import Link from "next/link";
import { Header } from "../components/NonAppComponents/Header";

const MyDances: NextPage = ({ session, setSession }) => {
   var timeSince = function (date) {
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
   console.log(session);
   const router = useRouter();
   const [myDances, setMyDances] = useState([]);

   const deleteDance = async (id) => {
      const { data, error } = await supabase.from("dances").delete().eq("id", id);
      console.log(data);
   };

   useEffect(() => {
      if (!session) return;
      console.log(session);

      supabase
         .from("dances")
         .select("*")
         .eq("user", session.user.id)
         .then((r) => {
            console.log(r);
            setMyDances(r.data);
         });
   }, [session]);

   async function createNewDance() {
      const { data, error } = await supabase.from("dances").insert([{ user: session.user.id }]);
      console.log(data);
      router.push(`/${data[0].id}/edit`);
      console.log(error);
   }

   return (
      <div className="">
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
      </div>
   );
};

export default MyDances;
