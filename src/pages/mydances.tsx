import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";
import { type } from "os";
import Link from "next/link";

const Home: NextPage = ({ session }) => {
   const [myDances, setMyDances] = useState([]);

   useEffect(() => {
      supabase
         .from("dances")
         .select("*")
         .eq("user", session.user.id)
         .then((r) => {
            console.log(r);
            setMyDances(r.data);
         });
   }, []);

   async function createNewDance() {
      const { data, error } = await supabase.from("dances").insert([{ user: session.user.id }]);
      console.log(data);
      console.log(error);
   }

   return (
      <div className="">
         <div className="h-20 flex flex-row items-center px-[10%]">
            <p className="text-3xl">naach</p>
         </div>
         <hr />
         <div className="px-[10%]">
            <p className="text-3xl font-semibold mb-6 mt-3">My dances</p>
            <div className="grid grid-flow-col  gap-4 child:rounded-xl ">
               {myDances.length ? (
                  myDances.map((dance) => {
                     return (
                        <Link key={dance.id} href={`/${dance.id}/edit`}>
                           <div className="flex flex-col items-center">
                              <button className="w-20 h-20 bg-gray-200 hover:bg-gray-100 rounded-xl">
                                 <a> {dance.id}</a>
                              </button>
                              <p className="mt-1">{dance.name}</p>
                           </div>
                        </Link>
                     );
                  })
               ) : (
                  <p>looks like you don't have any dances</p>
               )}
               <button className="w-20 h-20 bg-gray-200 grid place-items-center hover:bg-gray-100" onClick={createNewDance}>
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                     className="w-10 h-10"
                  >
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
               </button>
            </div>
         </div>
      </div>
   );
};

export default Home;
