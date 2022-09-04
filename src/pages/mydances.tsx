import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";
import { type } from "os";
import Link from "next/link";
import { Header } from "../components/NonAppComponents/Header";

const Home: NextPage = ({ session, setSession }) => {
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
                     <p className="ml-auto">created</p>
                  </div>
                  <hr />
                  {myDances.length ? (
                     myDances
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .map((dance) => {
                           return (
                              <>
                                 <Link key={dance.id} href={`/${dance.id}/edit`}>
                                    <div className="flex flex-row items-center h-16 cursor-pointer">
                                       <p className="mt-1">{dance.name}</p>
                                       <p className="mt-1 ml-auto">{timeSince(dance.created_at)} ago</p>
                                    </div>
                                 </Link>
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

export default Home;
