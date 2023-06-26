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

         <div className="overflow-hidden relative flex flex-col items-center font-proxima ">
            <div className=" flex flex-row items-center justify-center w-full   lg:py-12 py-8 lg:px-[8%] px-[5%] max-w-2xl lg:max-w-none   relative  ">
               <div className="relative  w-full flex flex-col  items-center  ">
                  <h1
                     style={{
                        lineHeight: 1.15,
                     }}
                     className=" text-4xl lg:text-6xl xl:text-7xl dark:text-neutral-100 z-10 mr-auto  text-neutral-800 w-[80%] "
                  >
                     How you <span className="font-bold text-purple-600">dance</span>, <span className="font-bold text-blue-600">choreograph</span>{" "}
                     and <span className="font-bold text-pink-600">move</span> matters.
                     {/* Visualize your stage formations <span className="italic">before</span> performing */}
                  </h1>
                  <div className="flex flex-row justify-between w-full">
                     <h1
                        style={{
                           lineHeight: 1.15,
                        }}
                        className=" text-4xl lg:text-6xl xl:text-7xl dark:text-neutral-100 z-10   text-neutral-800  "
                     >
                        Do it together with <span className="">FORMI</span>.
                        {/* Visualize your stage formations <span className="italic">before</span> performing */}
                     </h1>
                     <div className="lg:flex hidden flex-row items-center  ">
                        <Link href={"/207/edit"} className="">
                           <button className="  flex-row items-center  mr-3   bg-pink-600 relative z-20 px-4 py-2   border border-pink-600  hidden lg:flex rounded-md text-xl group">
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
                        {/* <Link href={"/login"} className="">
                           <button className="  flex-row items-center border-neutral-800 border   text-neutral-100 relative z-20 px-4 py-2  hidden lg:flex rounded-md  text-xl group">
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
                        </Link> */}
                     </div>
                  </div>

                  {/* <h1 className=" dark:text-neutral-300  text-center text-neutral-700 relative lg:text-xl  z-10 lg:mt-16 mt-8  lg:w-1/2 ">
                     Create, plan, and share stunning 3D dance & cheer formations in minutes
                  </h1> */}
                  <img className="w-full rounded-xl mt-12  " src="/demoFigma.png" alt="" />
                  <div className="block lg:hidden mb-8">
                     <button className="rounded-full bg-pink-600 px-4 py-2 text-white mt-7">Mobile app coming soon </button>
                     <p className="text-xs text-neutral-500 mt-3">To use FORMI, visit our website on your laptop</p>
                  </div>
                  {/* <p className="text-neutral-500  mt-5">Plan out your dance and cheer formations, visualizing the transitions synced to music.</p> */}
               </div>
            </div>

            <div className="lg:px-[8%] px-[5%] border-b-black border-b flex flex-col mt-24">
               <h1 className="text-7xl">Choreography has never been this sweet</h1>
               <div className="flex flex-row ">
                  <div className="w-1/3 mr-5">
                     <p className="mt-12 text-xl">
                        By converting your formations into lifelike 3D models, you can see your dance routine from every angle. Get a bird's-eye view
                        of your pyramid formations or zoom in to fine-tune a wave pattern, giving you unparalleled control over every detail.
                     </p>
                  </div>
                  <div className="w-2/3 pt-12">
                     <img className=" relative rounded-t-xl border-t border-l border-r border-black" src="/threeDdemo.png" alt="" />
                  </div>
               </div>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-900 lg:px-0 px-7 w-full  font-proxima">
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

            <div className="bg-neutral-50 dark:bg-[#191919] w-full  font-proxima lg:px-0 px-7">
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

const TikTokEmbed1 = () => {
   const tiktokContainerRef = useRef(null);

   useEffect(() => {
      // Load TikTok script
      const script = document.createElement("script");
      script.setAttribute("src", "https://www.tiktok.com/embed.js");
      script.setAttribute("async", true);
      document.body.appendChild(script);

      return () => {
         // Clean up script to avoid multiple instances
         document.body.removeChild(script);
      };
   }, []);

   return (
      <div style={{ maxWidth: "350px", minWidth: "350px" }} ref={tiktokContainerRef}>
         <blockquote
            className="tiktok-embed"
            cite="https://www.tiktok.com/@formistudio.app/video/7231301456270347562"
            data-video-id="7231301456270347562"
            style={{ maxWidth: "605px", minWidth: "350px" }}
         >
            <section>
               <a target="_blank" rel="noopener noreferrer" title="@formistudio.app" href="https://www.tiktok.com/@formistudio.app?refer=embed">
                  @formistudio.app
               </a>
               <p>check it out at https://formistudio.app</p>
               <a
                  target="_blank"
                  rel="noopener noreferrer"
                  title="♬ stream escapism - #1 worth it. stan"
                  href="https://www.tiktok.com/music/stream-escapism-7162468425431157510?refer=embed"
               >
                  ♬ stream escapism - #1 worth it. stan
               </a>
            </section>
         </blockquote>
      </div>
   );
};

const TikTokEmbed2 = () => {
   const tiktokContainerRef = useRef(null);

   useEffect(() => {
      // Load TikTok script
      const script = document.createElement("script");
      script.setAttribute("src", "https://www.tiktok.com/embed.js");
      script.setAttribute("async", true);
      document.body.appendChild(script);

      return () => {
         // Clean up script to avoid multiple instances
         document.body.removeChild(script);
      };
   }, []);

   return (
      <div style={{ maxWidth: "350px", minWidth: "350px" }} ref={tiktokContainerRef}>
         <blockquote
            className="tiktok-embed"
            cite="https://www.tiktok.com/@lizenlair/video/7241294169652677894"
            data-video-id="7241294169652677894"
            style={{ maxWidth: "605px", minWidth: "350px" }}
         >
            {" "}
            <section>
               {" "}
               <a target="_blank" title="@lizenlair" href="https://www.tiktok.com/@lizenlair?refer=embed">
                  @lizenlair
               </a>{" "}
               if anyone needs this for their snowflake rehersals let me know and ill link it in my bio (@FORMI){" "}
               <a title="ballettok" target="_blank" href="https://www.tiktok.com/tag/ballettok?refer=embed">
                  #ballettok
               </a>{" "}
               <a title="balletteacher" target="_blank" href="https://www.tiktok.com/tag/balletteacher?refer=embed">
                  #balletteacher
               </a>{" "}
               <a title="nutcrackerrehearsal" target="_blank" href="https://www.tiktok.com/tag/nutcrackerrehearsal?refer=embed">
                  #nutcrackerrehearsal
               </a>{" "}
               <a title="choreography" target="_blank" href="https://www.tiktok.com/tag/choreography?refer=embed">
                  #choreography
               </a>{" "}
               <a title="danceformation" target="_blank" href="https://www.tiktok.com/tag/danceformation?refer=embed">
                  #danceformation
               </a>{" "}
               <a title="balletdancer" target="_blank" href="https://www.tiktok.com/tag/balletdancer?refer=embed">
                  #balletdancer
               </a>{" "}
               <a title="balletclass" target="_blank" href="https://www.tiktok.com/tag/balletclass?refer=embed">
                  #balletclass
               </a>{" "}
               <a title="ballettechnique" target="_blank" href="https://www.tiktok.com/tag/ballettechnique?refer=embed">
                  #ballettechnique
               </a>{" "}
               <a title="waltzofthesnowflakes" target="_blank" href="https://www.tiktok.com/tag/waltzofthesnowflakes?refer=embed">
                  #waltzofthesnowflakes
               </a>{" "}
               <a title="snowflakes" target="_blank" href="https://www.tiktok.com/tag/snowflakes?refer=embed">
                  #snowflakes
               </a>{" "}
               <a
                  target="_blank"
                  title="♬ Waltz Of The Snowflakes - San Francisco Ballet"
                  href="https://www.tiktok.com/music/Waltz-Of-The-Snowflakes-6786423811492284418?refer=embed"
               >
                  ♬ Waltz Of The Snowflakes - San Francisco Ballet
               </a>{" "}
            </section>{" "}
         </blockquote>{" "}
      </div>
   );
};
