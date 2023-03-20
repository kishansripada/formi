import Link from "next/link";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "../components/NonAppComponents/Header";
import { Footer } from "../components/NonAppComponents/Footer";
import Image from "next/image";

const home = () => {
   return (
      <>
         <Head>
            <title>FORMI: Dance and cheer formation planning software.</title>
            <meta
               name="description"
               content="Dance formation app. Easily build, create and visualize your dance and cheer formations synced to music. Formi is the ultimate choreographer formation tool. Dance formation builder. Cheer formation builder."
            />
            <meta
               name="keywords"
               content="dance, choreography, desi, formations, cheer, cheerleading, formation building tool, dance formation app"
            />
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

         <Header></Header>

         <div className="overflow-hidden  ">
            <div className="absolute -z-10 left-[-150px] top-[200px] opacity-10">
               <img className="w-[800px] right-[-200px]  -rotate-[30deg]" src="/background.png" alt="" />
            </div>

            <div className="overflow-hidden">
               <div className=" flex flex-row items-center justify-center w-full  text-center pt-12 px-[10%] lg:px-[20%]   ">
                  <div className="w-full  ">
                     <h1
                        style={{
                           lineHeight: 1.15,
                        }}
                        className=" text-4xl lg:text-6xl   font-bold text-gray-900 "
                     >
                        Latest news & knowledge hub
                        {/* Visualize your stage formations <span className="italic">before</span> performing */}
                     </h1>
                     <h1 className=" text-xl  text-gray-500 px-[20%]  mt-4 ">Know more, do more.</h1>
                     {/* <p className="text-gray-500  mt-5">Plan out your dance and cheer formations, visualizing the transitions synced to music.</p> */}
                     <Link href={"/login"} className="z-50">
                        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white  px-4 py-2 block lg:hidden mx-auto mt-5  rounded-full">
                           Get Started
                        </button>
                     </Link>
                  </div>
               </div>
               <div className="w-full  mt-[200px] h-[1000px] px-[10%]  flex flex-row ">
                  <Link href={"/blog/artofdanceformations"}>
                     <div className="w-1/2 flex flex-col cursor-pointer">
                        <>
                           <img src="/blogOne.jpeg" className="rounded-xl" alt="" />
                           <p className="text-pink-600 mt-6 ">Why FORMI?</p>
                           <p className="text-3xl mt-2 hover:text-pink-600 transition">
                              Why Are Formations So Important? How Can I Use FORMI to Perfect Them?
                           </p>
                           <p className="mt-4 text-xl text-gray-600 ">
                              Dance formations are an essential part of any dance performance, whether it's a ballet, jazz, contemporary, or hip hop
                              routine. They not only enhance the visual appeal of the performance but also help to convey the mood and message of the
                              dance.
                           </p>
                        </>
                     </div>
                  </Link>
                  <div className="w-1/2"></div>
               </div>
            </div>

            {/* FOOTER */}
            <Footer></Footer>
         </div>
      </>
   );
};
export default home;
