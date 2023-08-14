import type { NextPage } from "next";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Script from "next/script";
import { Header } from "../components/NonAppComponents/Header";
import { PricingTable } from "../components/NonAppComponents/PricingTable";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Upgrade: NextPage = () => {
   // const session = useSession();
   const supabase = createClientComponentClient();

   return (
      <div className="h-screen font-proxima  ">
         <div className="flex flex-col items-center">
            <div className="w-[250px] pointer-events-none select-none mt-24">
               {/* <h1 className="text-6xl font-bold z-10 relative">naach.app</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[58%]"></div> */}
               <h1 className="text-6xl font-bold z-10 relative">FORMI</h1>
               <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[100%]"></div>
            </div>
            <p className="tracking-widest text-gray-500 font-semibold">UPGRADE PLAN</p>
            <p className="text-3xl mt-8 font-bold">the most intuitive performance planning software</p>
            <p className="text-2xl mt-2 font-thin">join thousands of artists that use FORMI to perfect their performances</p>
         </div>

         <Script strategy="lazyOnload" src="https://js.stripe.com/v3/pricing-table.js" />

         <div className="flex flex-col justify-center mt-16 ">
            <PricingTable session={supabase.auth.getSession()}></PricingTable>
         </div>
      </div>
   );
};

export default Upgrade;
