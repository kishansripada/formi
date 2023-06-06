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
            <title>FORMI: the collaborative whiteboard for choreographers.</title>
            <meta
               name="description"
               content="Dance formation and choreography app. Easily build, create and visualize your dance and cheer formations synced to music. FORMI is the ultimate choreographer formation tool."
            />
            <meta
               name="keywords"
               content="dance, choreography, choreographer, formations, cheer, cheerleading, formation building tool, dance formation app, color guard, color guard app, dance formation maker, app for dance formations, formation app for dance"
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

         <div className="overflow-hidden relative ">
            <div className="overflow-hidden dark:bg-[#191919]">
               <div className=" flex flex-row items-center justify-center w-full  text-center py-24 px-[10%] backdrop-blur-sm  relative  ">
                  <div className="absolute w-full opacity-20   h-full left-1/2 -translate-x-1/2   -z-[100] ">
                     {/* <div
                        style={{
                           backgroundImage:
                              "radial-gradient(ellipse 1000px 500px at center, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%)",
                        }}
                        className="absolute w-[1000px] h-[500px] top-0 left-0 bottom-0 right-0"
                     ></div> */}
                     <div
                        className="flex flex-row justify-between  absolute left-1/2 -translate-x-1/2 rounded-xl -z-[100]   "
                        style={{
                           width: 2000,
                           height: 2000,
                        }}
                     >
                        {new Array(50).fill(0).map((_, i) => (
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
                        className="flex flex-col justify-between   rounded-xl left-1/2 -translate-x-1/2 absolute -z-[100]  "
                        style={{
                           width: 2000,
                           height: 2000,
                        }}
                     >
                        {new Array(50).fill(0).map((_, i) => (
                           <div
                              key={i}
                              className={`w-full  bg-neutral-300 `}
                              style={{
                                 height: 1,
                              }}
                           ></div>
                        ))}
                     </div>
                  </div>
                  <div className="  relative lg:w-2/3 w-full  mr-auto  ">
                     {/* <img src="/backgroundIndex.png" className="absolute object-cover  w-full h-full" alt="" /> */}
                     {/* <div className="w-full  bg-opacity-50 mb-8 dark:bg-pink-700 bg-pink-300 text-lg dark:text-neutral-100 text-neutral-700 rounded-xl h-12 lg:flex hidden flex-row items-center justify-center ">
                        FORMI is used by&nbsp;<span className=" dark:text-neutral-100 text-purple-700 font-bold">5000+ dancers&nbsp;</span> and
                        coaches like you
                     </div> */}
                     <div
                        className="pointer-events-none absolute  h-[2000px] overflow-hidden w-[2000px]  "
                        style={{
                           backgroundImage: "radial-gradient(37.66% 48.2% at 50% 50%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                           top: -200,
                           // left: "50%",
                           // transform: "translate(-50%, 0)",
                           opacity: 0.3,
                        }}
                     ></div>
                     <div
                        className="pointer-events-none absolute  h-[2000px] overflow-hidden w-[2000px]  "
                        style={{
                           backgroundImage: "radial-gradient(37.66% 48.2% at 50% 50%, #9333ea 0%, rgba(239, 255, 250, 0) 100%)",
                           top: -200,
                           // left: "50%",
                           right: 0,
                           // transform: "translate(-50%, 0)",
                           opacity: 0.3,
                        }}
                     ></div>
                     <h1
                        style={{
                           lineHeight: 1.15,
                        }}
                        className=" text-4xl lg:text-6xl dark:text-neutral-100 lg:text-left text-center relative z-10 font-bold text-neutral-800 "
                     >
                        Choreography software to execute stunning performances
                        {/* Visualize your stage formations <span className="italic">before</span> performing */}
                     </h1>
                     <h1 className=" dark:text-neutral-300 lg:text-left text-center text-neutral-700 relative  z-10 mt-4 ">
                        Create, plan, and share stunning 3D dance & cheer formations in minutes
                     </h1>
                     {/* <p className="text-neutral-500  mt-5">Plan out your dance and cheer formations, visualizing the transitions synced to music.</p> */}
                     <div className="flex flex-row mt-24 ">
                        <Link href={"/207/edit"} className="">
                           <button className="  flex-row items-center   bg-neutral-800 relative z-20 px-4 py-2  mr-3 border border-black  hidden lg:flex rounded-full text-xl group">
                              <span className="mr-2 text-white ">View demo</span>
                              <span className="relative left-0 group-hover:left-3 transition-all duration-300">
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 stroke-white "
                                 >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                 </svg>
                              </span>
                           </button>
                        </Link>
                        <Link href={"/login"} className="">
                           <button className="  flex-row items-center border-neutral-800 border  text-neutral-100 relative z-20 px-4 py-2  hidden lg:flex rounded-full  text-xl group">
                              <span className="mr-2 text-black ">Start creating</span>
                              <span className="relative left-0 group-hover:left-3 transition-all duration-300">
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 stroke-black "
                                 >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                 </svg>
                              </span>
                           </button>
                        </Link>
                     </div>
                  </div>
                  <div className="w-1/3 lg:static absolute lg:opacity-100 opacity-0 grid place-items-center">
                     <img src="/dancers.png" className="w-full h-full  scale-[2]" alt="" />
                  </div>
               </div>

               {/* <div className=" mt-12 relative">
                  <img
                     className=" max-w-[1000px] lg:block hidden  w-full mx-auto relative -bottom-5 rounded-xl border border-neutral-200 dark:border-neutral-600 shadow-2xl z-10"
                     src="/threeDPreview.png"
                  ></img>

                  <div
                     className="pointer-events-none absolute  h-[2000px] overflow-hidden w-[2000px]  "
                     style={{
                        backgroundImage: "radial-gradient(37.66% 48.2% at 50% 50%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        top: -200,
                        left: "50%",
                        transform: "translate(-50%, 0)",
                        opacity: 1,
                     }}
                  ></div>
               </div> */}
            </div>
            <div className="w-full h-[1px] dark:bg-neutral-700 bg-neutral-300"></div>

            <div className=" bg-neutral-100 font-proxima overflow-hidden relative lg:px-0 px-7 "></div>

            <div className="bg-neutral-50 dark:bg-neutral-900 lg:px-0 px-7  font-proxima">
               <div className="flex lg:flex-row flex-col items-center mx-auto max-w-[1000px] py-8 w-full ">
                  <div className="lg:w-1/2 w-[90%]">
                     <p className="text-3xl font-bold dark:text-neutral-50">Collaborate, communicate</p>
                     <p className="text-lg mt-6 lg:w-[80%] text-neutral-500 dark:text-neutral-300">
                        Directly add comments and annotations on the stage, making collaboration among team members easier and more efficient. Make
                        FORMI a central platform for discussion and feedback, streamlining the choreography process.
                     </p>
                  </div>

                  <div className="lg:w-1/2 w-[90%]">
                     <video
                        autoPlay
                        muted
                        src="/commentdemo.mp4"
                        loop
                        className=" lg:ml-auto lg:w-[90%] border border-neutral-200 rounded-xl relative"
                     />
                  </div>
               </div>
            </div>

            <div className="bg-neutral-50 dark:bg-[#191919]  font-proxima lg:px-0 px-7">
               <div className="flex lg:flex-row flex-col-reverse items-center mx-auto max-w-[1000px] py-8 w-full ">
                  <div className="lg:w-1/2 w-[90%]">
                     <video
                        autoPlay
                        muted
                        src="/curveDemo.mp4"
                        loop
                        className=" lg:mr-auto lg:w-[90%] border border-neutral-200 rounded-xl relative"
                     />
                  </div>
                  <div className="lg:w-1/2 w-[90%] ">
                     <div className="lg:w-[90%] mx-auto">
                        <p className="text-3xl font-bold dark:text-neutral-50">Complex dancer paths</p>
                        <p className="text-lg mt-6  text-neutral-500 dark:text-neutral-300 ">
                           Our non-linear path feature lets you plan complex formations with ease, making your choreography process smoother and more
                           efficient. Say goodbye to old-fashioned, complicated methods and hello to modern, streamlined choreography.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            <div className=" dark:bg-neutral-900   lg:flex flex-col items-center justify-center  hidden py-10  ">
               <div className=" grid grid-cols-4 place-items-center child:mx-8   child:my-8  select-none opacity-60 dark:opacity-70 ">
                  <img
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cornell_University_logo.svg/1280px-Cornell_University_logo.svg.png"
                     className=" w-48  transition duration-500"
                     alt=""
                  />
                  <img
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/University_of_Michigan_logo.svg/2560px-University_of_Michigan_logo.svg.png"
                     className=" w-44  transition duration-500"
                     alt=""
                  />

                  <img
                     src=" https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/University_of_California%2C_Berkeley_logo.svg/2560px-University_of_California%2C_Berkeley_logo.svg.png
               "
                     className=" w-32 transition duration-500"
                     alt=""
                  />
                  <img
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/University_of_Texas_at_Austin_logo.svg/1280px-University_of_Texas_at_Austin_logo.svg.png
               "
                     className=" w-32  transition duration-500"
                     alt=""
                  />
                  <img
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Virginia_Tech_logo.svg/400px-Virginia_Tech_logo.svg.png
               "
                     className=" w-36  transition duration-500"
                     alt=""
                  />
                  <img
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/UT_Knoxville_logo_left.svg/440px-UT_Knoxville_logo_left.svg.png
               "
                     className=" w-40  transition duration-500"
                     alt=""
                  />
                  <img
                     src="https://upload.wikimedia.org/wikipedia/en/thumb/5/58/NYU_logo.svg/440px-NYU_logo.svg.png
               "
                     className=" w-48  transition duration-500"
                     alt=""
                  />
                  <img
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/North_Carolina_State_University_logo.svg/480px-North_Carolina_State_University_logo.svg.png
               "
                     className=" w-48 transition duration-500"
                     alt=""
                  />
               </div>
            </div>
            {/* <div className="w-full h-[1px] dark:bg-neutral-700 bg-neutral-300"></div> */}

            {/* <div className="bg-neutral-50  flex flex-row justify-center items-center font-proxima py-10 dark:bg-neutral-900  ">
               <div className="text-white  bg-pink-600 py-10 rounded-xl w-[70%]">
                  <p className="text-3xl text-center">Build Your First Performance Free</p>
                  <Link href={"/login"} className="">
                     <button className="  flex-row items-center mx-auto  text-neutral-100 px-4 py-2 border border-white  hidden lg:flex rounded-full mt-8 text-xl group">
                        <span className="mr-2 text-white ">Get Started</span>
                     </button>
                  </Link>
               </div>
            </div> */}
            {/* <div className="lg:w-1/2 w-[90%] flex flex-row justify-center items-center "></div> */}

            {/* FOOTER */}
            <div className="w-full h-[1px] dark:bg-neutral-700 bg-neutral-300"></div>
            <Footer></Footer>
         </div>
      </>
   );
};
export default home;
