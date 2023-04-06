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
            <title>FORMI: Blog</title>
            <meta
               name="description"
               content="Read up on the latest news and knowledge hub on dance and cheer formations. Formi is the ultimate choreographer formation tool. Dance formation builder. Cheer formation builder."
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
         <div className="absolute w-[1000px] opacity-60  h-[500px] left-1/2 -translate-x-1/2 -z-[100] top-[300px]">
            <div
               style={{
                  backgroundImage:
                     "radial-gradient(ellipse 1000px 500px at center, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%)",
               }}
               className="absolute w-[1000px] h-[500px] top-0 left-0 bottom-0 right-0"
            ></div>
            <div
               className="flex flex-row h-full justify-between rounded-xl -z-[100] relative  "
               style={{
                  width: 1000,
               }}
            >
               {new Array(25).fill(0).map((_, i) => (
                  <div
                     key={i}
                     className={`h-full bg-neutral-300 `}
                     style={{
                        width: 1,
                     }}
                  ></div>
               ))}
            </div>
            <div
               className="flex flex-col justify-between  rounded-xl relative -z-[100]  "
               style={{
                  height: 500,
                  top: -500,
               }}
            >
               {new Array(12).fill(0).map((_, i) => (
                  <div
                     key={i}
                     className={`w-full bg-neutral-300 `}
                     style={{
                        height: 1,
                     }}
                  ></div>
               ))}
            </div>
         </div>
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
                        className=" text-4xl lg:text-6xl   font-bold text-neutral-900 "
                     >
                        Latest news & knowledge hub
                        {/* Visualize your stage formations <span className="italic">before</span> performing */}
                     </h1>
                     <h1 className=" text-xl  text-neutral-500 px-[20%]  mt-4 ">Know more, do more.</h1>
                     {/* <p className="text-neutral-500  mt-5">Plan out your dance and cheer formations, visualizing the transitions synced to music.</p> */}
                     <Link href={"/login"} className="z-50">
                        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white  px-4 py-2 block lg:hidden mx-auto mt-5  rounded-full">
                           Get Started
                        </button>
                     </Link>
                  </div>
               </div>
               <div className="w-full  mt-[200px] h-[1000px] px-[10%]  flex flex-row ">
                  <div className="w-1/2 mr-4">
                     <Link href={"/blog/1"}>
                        <div className=" flex flex-col cursor-pointer">
                           <>
                              <img src="/blogOne.jpeg" className="rounded-xl" alt="" />
                              <p className="text-pink-600 mt-6 ">Why FORMI?</p>
                              <p className="text-3xl mt-2 hover:text-pink-600 transition">
                                 Why Are Formations So Important? How Can I Use FORMI to Perfect Them?
                              </p>
                              <p className="mt-4  text-neutral-600 ">
                                 Dance formations are an essential part of any dance performance, whether it's a ballet, jazz, contemporary, or hip
                                 hop routine. They not only enhance the visual appeal of the performance but also help to convey the mood and message
                                 of the dance.
                              </p>
                           </>
                        </div>
                     </Link>
                  </div>

                  <div className="w-1/2 ml-4">
                     <Link href={"/blog/2"}>
                        <div className=" flex flex-row cursor-pointer">
                           <img
                              src="https://images.unsplash.com/photo-1621976498727-9e5d56476276?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80"
                              className="rounded-xl w-32 h-32"
                              alt=""
                           />
                           <div className="flex flex-col ml-3">
                              <p className="text-pink-600 text-sm ">Why FORMI?</p>
                              <p className="text-xl mt-1 hover:text-pink-600 transition">
                                 Mastering the Art of Dance Formations: Tips for Creating Stunning Visuals with FORMI
                              </p>
                              <p className="mt-2 text-sm text-neutral-600 ">
                                 Dance is a beautiful form of expression, and one of the key elements that makes a performance truly captivating is
                                 the choreography. The ability to create intricate and stunning dance formations can make all the difference when it
                                 comes to captivating your audience.
                              </p>
                           </div>
                        </div>
                     </Link>
                  </div>
               </div>
            </div>

            {/* FOOTER */}
            <Footer></Footer>
         </div>
      </>
   );
};
export default home;
