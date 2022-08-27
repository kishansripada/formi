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
      <>
         <div className="h-20 bg-blue-200"></div>
         <div className="flex flex-row">
            <button className="ml-auto" onClick={createNewDance}>
               new dance
            </button>
         </div>
         <hr />
         <div className="grid grid-flow-col-dense		 gap-4 ">
            {myDances.length ? (
               myDances.map((dance) => {
                  return (
                     <Link key={dance.id} href={`/${dance.id}/edit`}>
                        <button className="w-20 h-20 bg-gray-200">
                           <a> {dance.id}</a>
                        </button>
                     </Link>
                  );
               })
            ) : (
               <p>looks like you don't have any dances</p>
            )}
         </div>
      </>
   );
};

export default Home;
