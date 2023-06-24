import Link from "next/link";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { Header } from "../components/NonAppComponents/Header";
import { Footer } from "../components/NonAppComponents/Footer";
import toast, { Toaster } from "react-hot-toast";
import { PricingTable } from "../components/NonAppComponents/PricingTable";
const Pricing = () => {
   let session = useSession();
   const router = useRouter();
   return (
      <>
         <Toaster></Toaster>
         <style jsx>{`
            @keyframes sidetoside {
               0% {
                  left: 0%;
               }
               50% {
                  left: 100%;
               }
               100% {
                  left: 0%;
               }
            }

            @keyframes upanddown {
               0% {
                  top: -100px;
               }
               50% {
                  top: 100px;
               }
               100% {
                  top: -100px;
               }
            }
         `}</style>
         <Head>
            <title>FORMI: Pricing</title>
            <meta
               name="description"
               content="FORMI's pricing plans are designed to fit your needs. Whether you're a solo performer or a large team, we have a plan for you."
            />
            <meta name="keywords" content="dance, choreography, desi, formations, cheer, cheerleading, formation building tool" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="FORMI: Online stage performance planning software." />
            <meta name="twitter:image" content="https://i.imgur.com/83VsfSG.png" />
            <meta property="og:type" content="song" />
            <meta property="og:title" content="FORMI: Online stage performance planning software." />
            <meta
               property="og:description"
               content="Easily build, create and visualize your dance and cheer formations synced to music. Formi is the ultimate choreographer formation tool."
            />
            <meta property="og:image" content="https://i.imgur.com/83VsfSG.png" />

            <meta property="og:site_name" content="FORMI: Online stage performance planning software." />
         </Head>
         <div className="h-screen w-full flex flex-col">
            <Header></Header>
            <div className="h-full">
               <p className="  text-8xl text-center font-bold">Sike!</p>
               <p className="  text-5xl text-center font-bold">We're free</p>
            </div>

            {/* <PricingTable></PricingTable> */}

            <Footer></Footer>
         </div>
      </>
   );
};
export default Pricing;
