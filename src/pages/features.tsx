import Link from "next/link";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "../components/NonAppComponents/Header";
import { Footer } from "../components/NonAppComponents/Footer";
import Image from "next/image";

const features = () => {
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
               content="dance, choreography, desi, formations, cheer, cheerleading, formation building tool, dance formation app, color guard, color guard app, dance formation maker, app for dance formations, formation app for dance"
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
               {/* <img className="w-[800px] right-[-200px]  -rotate-[30deg]" src="/background.png" alt="" /> */}
            </div>

            <div className="overflow-hidden">
               <div className=" flex flex-row items-center justify-center w-full  text-center pt-8 px-[10%] lg:px-[20%]   ">
                  <div className="w-full  ">
                     <p className="text-gray-500 leading-loose mt-12">FEATURES & BENEFITS</p>
                     <h1
                        style={{
                           lineHeight: 1.15,
                        }}
                        className=" text-4xl lg:text-6xl mt-2  font-bold text-gray-900 "
                     >
                        All of your performance needs in{" "}
                        <span className=" text-transparent  bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">one place</span>
                        {/* Visualize your stage formations <span className="italic">before</span> performing */}
                     </h1>
                     {/* <h1 className=" text-xl  text-gray-500 lg:px-[20%]  mt-4 ">
                        Create and plan stunning 3D dance formations in minutes, saving time in rehearsals
                     </h1> */}
                     {/* <p className="text-gray-500  mt-5">Plan out your dance and cheer formations, visualizing the transitions synced to music.</p> */}
                  </div>
               </div>
            </div>
            <div className="w-full h-[4000px] flex flex-row mt-[200px]">
               <div className="w-[20%] hidden lg:flex flex-col justify-center  items-center relative">
                  {/* <div className="fixed child:mt-3  z-50 top-1/2 -translate-y-1/2 -translate-x-1/2">
                     <p className="font-bold">View only</p>
                     <p>Commenting</p>
                     <p>3D View</p>
                  </div> */}
               </div>
               <div className="lg:w-[80%] w-full  h-full flex flex-col items-center justify center px-[6%]">
                  <div className=" rounded-2xl  w-full shadow-2xl flex flex-col px-[6%] py-[6%]">
                     <img className=" rounded-xl border border-gray-300" src="/viewOnly.png" alt="" />
                     <div className="rounded-full mt-8  bg-gray-100 text-pink-600 w-fit flex flex-row items-center px-3 justify-center py-1">
                        <p className=" text-sm">COMMUNICATION & COLLABORATION</p>
                     </div>
                     <p className="text-gray-800 mt-4  text-3xl">Share "view only" performances with all of your dancers</p>
                     <p className="text-gray-700 font-light mt-2">
                        FORMI enables you to prepare formations in advnace of rehearsals, and share them with your dancers. This allows for more
                        productive rehearsals, saving time and money.
                     </p>
                  </div>
                  <div className=" mt-14 rounded-2xl  w-full shadow-2xl flex flex-col px-[6%] py-[6%]">
                     <img className="rounded-xl border border-gray-300" src="/comment.png" alt="" />
                     <div className="rounded-full mt-8  bg-gray-100 text-pink-600 w-fit flex flex-row items-center px-3 justify-center py-1">
                        <p className=" text-sm">COMMUNICATION & COLLABORATION</p>
                     </div>
                     <p className="text-gray-800 mt-4  text-3xl">Leave comments and annotations directly on the stage</p>
                     <p className="text-gray-700 font-light mt-2">
                        Directly add comments and annotations on the stage, making collaboration among team members easier and more efficient. Make
                        FORMI a central platform for discussion and feedback, streamlining the choreography process.
                     </p>
                  </div>
                  <div className=" mt-14 rounded-2xl  w-full shadow-2xl flex flex-col px-[6%] py-[6%]">
                     <img className="rounded-xl border border-gray-300" src="/threeDFeature.png" alt="" />
                     <div className="rounded-full mt-8  bg-gray-100 text-pink-600 w-fit flex flex-row items-center px-3 justify-center py-1">
                        <p className=" text-sm">PROFESSIONAL FEATURES</p>
                     </div>
                     <p className="text-gray-800 mt-4  text-3xl">View dancers from all angles in three dimensions</p>
                     <p className="text-gray-700 font-light mt-2">
                        Limitations of current choreography software are that you cannot see what formations look like from a true audience
                        perspective. FORMI enables you to view formations from any angle, even a judges perspective.
                     </p>
                  </div>
               </div>
            </div>
            <Footer></Footer>
         </div>
      </>
   );
};
export default features;
