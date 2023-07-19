import Link from "next/link";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "../components/NonAppComponents/Header";
import { Footer } from "../components/NonAppComponents/Footer";
import Image from "next/image";
import dynamic from "next/dynamic";
import { localSettings, cloudSettings } from "../types/types";

const ThreeD = dynamic(() => import("../components/AppComponents/ThreeD").then((mod) => mod.ThreeD), {
   loading: () => <p className="text-black ">Loading...</p>,
});
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
         {/* <Header></Header> */}
         <div className="bg-neutral-800/50 backdrop-blur-3xl py-1 px-1  w-[66vw] left-1/2 -translate-x-1/2 z-[60] rounded-full h-12 fixed top-[100px] flex flex-row items-center">
            {/* <img src="/logobg.png" className="h-full" alt="" /> */}
            <p className="text-white ml-4 font-bold">FORMI</p>
            <Link href={"/207/edit"} className="">
               <button className="bg-neutral-700/50 h-full rounded-full px-6 hover:text-white transition text-neutral-400 ml-auto">View Demo</button>
            </Link>
            <Link href={"/login"} className="">
               <button className="bg-neutral-400/50 h-full rounded-full px-6 text-white transition ml-2">Log In</button>
            </Link>
         </div>
         <div className="overflow-hidden relative flex flex-col items-center ">
            <div className="h-14 w-full border-b border-neutral-800 bg-neutral-900 text-neutral-300 flex flex-row items-center justify-center">
               Follow <span className="text-pink-300 mx-2 "> @formistudio.app </span> on TikTok{" "}
               <span className="text-xs text-neutral-500 ml-2 hidden lg:block">and discover what's new on our platform</span>
            </div>
            <div className="bg-neutral-900 w-full text-white h-screen relative flex flex-col pointer-events-none ">
               <div className=" absolute -translate-x-1/2 left-1/2 top-[170px] text-center w-[full] z-50 ">
                  {/* <div className="bg-neutral-500/50 w-full rounded-full h-16"></div> */}
                  <p className="  lg:text-5xl  text-2xl font-semibold mt-5  ">FORMI, a place to design and plan stunning choreography.</p>
                  <Link href={"/login"} className="">
                     <button className="bg-pink-600 px-6 z-50 relative py-3 rounded-md mt-10 pointer-events-auto hidden lg:inline-block">
                        <a className=" flex flex-row items-center justify-around">
                           <span className="font-semibold">Get started</span> — it’s free{" "}
                           <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 8.5H3m11 0-3 3m3-3-3-3" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"></path>
                           </svg>
                        </a>
                     </button>
                  </Link>
               </div>

               {/* <p className=" absolute bottom-12 w-full text-center  text-7xl  ">Choreography has never been easier.</p> */}
               <div className="w-full h-full pointer-events-auto absolute top-36 z-0 ">
                  <ThreeD
                     items={[]}
                     props={[]}
                     setIsThreeDancerDragging={() => null}
                     isThreeDancerDragging={false}
                     isPlaying={false}
                     currentFormationIndex={0}
                     percentThroughTransition={0}
                     dancers={dancers}
                     position={0}
                     shiftHeld={false}
                     setShiftHeld={() => null}
                     stageFlipped={false}
                     soundCloudTrackId={null}
                     zoom={1}
                     setZoom={() => null}
                     isCommenting={false}
                     setIsCommenting={() => null}
                     localSettings={{
                        gridSnap: 1,
                        previousFormationView: "ghostDancersAndPaths",
                        dancerStyle: "solid",
                        viewCollisions: false,
                        stageFlipped: false,
                        viewingThree: true,
                        viewingTwo: false,
                        collisionRadius: 1,
                        fullScreen: false,
                        isDarkMode: true,
                        autoScroll: false,
                     }}
                     pushChange={() => null}
                     undo={() => null}
                     addToStack={() => null}
                     player={null}
                     draggingDancerId={null}
                     setDraggingDancerId={() => null}
                     songDuration={60}
                     viewOnly={false}
                     setSelectedFormation={() => null}
                     formations={formations}
                     selectedFormation={6}
                     setFormations={() => null}
                     selectedDancers={[]}
                     setSelectedDancers={() => null}
                     setIsPlaying={() => null}
                     setPixelsPerSecond={() => null}
                     cloudSettings={{
                        backgroundUrl:
                           "https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/stagebackgrounds/f30197ba-cf06-4234-bcdb-5d40d83c7999/IMG_6842-removebg-preview.png",
                        collisionRadius: 0.49640000000005985,
                        stageBackground: "grid",
                        stageDimensions: { width: 36, height: 18 },
                        gridSubdivisions: 7,
                     }}
                     coordsToPosition={coordsToPosition}
                     isIntro={true}
                  ></ThreeD>
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

const coordsToPosition = (coords: { x: number; y: number }) => {
   if (!coords) return null;
   let { x, y } = coords;
   return {
      left: (PIXELS_PER_SQUARE * cloudSettings.stageDimensions.width) / 2 + PIXELS_PER_SQUARE * x,
      top: (PIXELS_PER_SQUARE * cloudSettings.stageDimensions.height) / 2 + PIXELS_PER_SQUARE * -y,
   };
};
const dancers = [
   { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", name: "Amelie Snow", color: "#03a9f4", height: 182.9, instagramUsername: "" },
   { id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de", name: "Asher Knight", color: "#03a9f4", height: 180.3, instagramUsername: "" },
   { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", name: "Isabella", color: "#673ab7", height: 182.9, instagramUsername: "" },
   { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", name: "Finnegan Reed", color: "#b10dc9", height: 172.7, instagramUsername: "" },
   { id: "6e9d90f2-608f-4598-a855-76efc5298568", name: "Cecilia Bloom", color: "#4caf50", height: 165.1, instagramUsername: "" },
   { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", name: "Aurelia Rosewood", color: "#4caf50", height: 185.4, instagramUsername: "" },
   { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", name: "Jasper Wilde", height: 165.1, instagramUsername: "" },
   { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", name: "Magnolia Finch", color: "#d81b60", height: 195.6, instagramUsername: "" },
   { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", name: "Phoenix Brooks", color: "#3f51b5", height: 177.8, instagramUsername: "" },
   { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", name: "Evangeline Grey", color: "#f44336", height: 182.9, instagramUsername: "" },
   { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", name: "Cassius Blackwell", color: "#f44336", shape: "square", height: 175.3, instagramUsername: "" },
   { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", name: "Scarlett Sinclair", color: "#3f51b5", height: 182.9, instagramUsername: "" },
];

const formations = [
   {
      id: "d8eb12d2-ee75-41c5-9222-82c728c78a28",
      name: "Intro",
      notes: "These are the notes for formation number 1",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      comments: [
         {
            id: "94dec9c8-3593-4b94-8368-c7bfea680689",
            user: {
               id: "f30197ba-cf06-4234-bcdb-5d40d83c7999",
               name: "Kishan Sripada",
               avatar_url: "https://lh3.googleusercontent.com/a/AGNmyxZOaSsT0GlQsYvFDomh428vvRYPFzZ6IliUILbeNZg=s96-c",
            },
            content: "Make sure this part is rehearsed super well! This really needs to be on point!",
            position: { x: 2.9966436908947953, y: 6.012153113660072 },
         },
      ],
      positions: [
         { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", position: { x: -1, y: 1 } },
         { id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de", position: { x: -3, y: 1 } },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -1, y: -1 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: -3, y: -1 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 3, y: -1 } },
         { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", position: { x: 1, y: -1 } },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -1, y: -3 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -3, y: -3 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: 1, y: -3 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 3, y: 1 } },
         { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", position: { x: 1, y: 1 } },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: 3, y: -3 } },
      ],
      transition: { durationSeconds: 5 },
      durationSeconds: 1.1,
   },
   {
      id: "ee58eceb-9548-46a8-bfba-e35687ae7593",
      name: "Initial Circle",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      comments: [
         {
            id: "3270c580-61f1-44b6-a2eb-378cad63c6b9",
            user: {
               id: "f30197ba-cf06-4234-bcdb-5d40d83c7999",
               name: "Kishan Sripada",
               avatar_url: "https://lh3.googleusercontent.com/a/AGNmyxZOaSsT0GlQsYvFDomh428vvRYPFzZ6IliUILbeNZg=s96-c",
            },
            content: "Make sure this part is rehearsed super well! This really needs to be on point!",
            position: { x: 11.25704692379578, y: 4.912391595622981 },
         },
      ],
      positions: [
         { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", position: { x: -4, y: 4 } },
         { id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de", position: { x: -2, y: 5 } },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -6, y: -2 } },
         {
            id: "0d7c570d-8284-46b6-94a7-b6d4255a0841",
            position: { x: -6, y: 1 },
            transitionType: "linear",
            controlPointEnd: { x: -4.166666666666667, y: 1.1875 },
            controlPointStart: { x: -4.833333333333333, y: 0.8125 },
         },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 6, y: -2 } },
         { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", position: { x: 6, y: 1 } },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -2, y: -6 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -5, y: -4 }, transitionType: "linear" },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: 2, y: -6 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 5, y: 4 } },
         { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", position: { x: 2, y: 5 } },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: 5, y: -5 } },
      ],
      transition: { durationSeconds: 2.09 },
      durationSeconds: 0.01,
   },
   {
      id: "ff043ca2-45b8-4b41-9951-cfc562bab0ba",
      name: "Tight Circle",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      comments: [
         {
            id: "e8dbf82a-5858-4e22-abc3-90d82d2d1799",
            user: {
               id: "f30197ba-cf06-4234-bcdb-5d40d83c7999",
               name: "Kishan Sripada",
               avatar_url: "https://lh3.googleusercontent.com/a/AAcHTtfj5XdPvHDCjOb3DS56K2eUA0-YNlvq3ce2punUsvA=s96-c",
            },
            content: "Let's move these dancers",
            position: { x: -14.62, y: 6.61 },
         },
      ],
      positions: [
         { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", position: { x: -3, y: 4 } },
         { id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de", position: { x: -1, y: 5 } },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -4, y: 0 } },
         {
            id: "0d7c570d-8284-46b6-94a7-b6d4255a0841",
            position: { x: -4, y: 2 },
            transitionType: "linear",
            controlPointEnd: { x: -5.540865384615367, y: 11.229296235679202 },
            controlPointStart: { x: -8.665353927986912, y: -3.5517184942716855 },
         },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 4, y: 0 } },
         { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", position: { x: 4, y: 2 } },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -1, y: -3 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -3, y: -2 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: 1, y: -3 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 3, y: 4 } },
         { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", position: { x: 1, y: 5 } },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: 3, y: -2 } },
      ],
      transition: { durationSeconds: 1.9 },
      durationSeconds: 1.76,
   },
   {
      id: "d0eba1a9-0516-4793-8704-58684fd53325",
      name: "Triangle 1",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", width: 8.432330827067666, position: { x: -15, y: 8 } }],
      positions: [
         { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", position: { x: -6, y: -2 } },
         { id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de", position: { x: -2, y: -2 } },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -4, y: 1 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: -8, y: 1 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 8, y: 0 } },
         { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", position: { x: 4, y: 0 } },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: 2, y: -3 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -10, y: -2 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: 6, y: -3 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 6, y: 3 } },
         { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", position: { x: -6, y: 4 } },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: 10, y: -3 } },
      ],
      transition: { durationSeconds: 0.51 },
      durationSeconds: 1.02,
   },
   {
      id: "d528c8e5-545f-4068-a452-a2b1869623ae",
      name: "Move Triangle Back",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      comments: [
         {
            id: "53bd6bd2-2c8b-4996-b8cc-c742153deef3",
            user: {
               id: "f30197ba-cf06-4234-bcdb-5d40d83c7999",
               name: "Kishan Sripada",
               avatar_url: "https://lh3.googleusercontent.com/a/AGNmyxZOaSsT0GlQsYvFDomh428vvRYPFzZ6IliUILbeNZg=s96-c",
            },
            content: "New comment...",
            position: { x: -10.758547579298835, y: 6.177061769616018 },
         },
         {
            id: "bc8bc31b-a8fc-4005-939d-598d61f69496",
            user: {
               id: "f30197ba-cf06-4234-bcdb-5d40d83c7999",
               name: "Kishan Sripada",
               avatar_url: "https://lh3.googleusercontent.com/a/AAcHTtf8CgIrDJOxtX767JTMMg9k4af6HlVAug-qP5X72nXuvrbm=s96-c",
            },
            content: "We shoud move this danxcer",
            position: { x: 1.23, y: 3.12 },
         },
      ],
      positions: [
         { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", position: { x: -6, y: -6 } },
         { id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de", position: { x: -2, y: -6 } },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", itemId: "f8057788-6f15-41ae-a41e-ef33bc7c7619", position: { x: -4, y: -3 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", itemId: "f8057788-6f15-41ae-a41e-ef33bc7c7619", position: { x: -8, y: -3 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 8, y: -4 } },
         { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", position: { x: 4, y: -4 } },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: 2, y: -7 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -10, y: -6 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: 6, y: -7 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 6, y: -1 } },
         { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", position: { x: -6, y: 0 } },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: 10, y: -7 } },
      ],
      transition: { durationSeconds: 1.37 },
      durationSeconds: 1.59,
   },
   {
      id: "d60d5081-e853-442c-9db8-e216e899608e",
      name: "Triangle Cross",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      comments: [
         {
            id: "8b465e6d-7cee-4a24-9656-586f65264d45",
            user: {
               id: "f30197ba-cf06-4234-bcdb-5d40d83c7999",
               name: "Kishan Sripada",
               avatar_url: "https://lh3.googleusercontent.com/a/AAcHTtfj5XdPvHDCjOb3DS56K2eUA0-YNlvq3ce2punUsvA=s96-c",
            },
            content: "New comment...",
            position: { x: -11.988106923751097, y: 5.01022787028922 },
         },
      ],
      positions: [
         { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", position: { x: 6, y: -2 } },
         { id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de", position: { x: 10, y: -2 } },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: 8, y: 1 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 4, y: 1 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: -4, y: 0 } },
         { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", position: { x: -8, y: 0 } },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -10, y: -3 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: 2, y: -2 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -5, y: -3 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: -6, y: 3 } },
         { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", position: { x: 6, y: 4 } },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -1, y: -3 } },
      ],
      transition: { durationSeconds: 0.31 },
      durationSeconds: 1.48,
   },
   {
      id: "fcd4f68d-868c-485b-ab90-0e445e3e5d63",
      name: "Hexagon Turn",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      positions: [
         { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", position: { x: -4, y: 2 } },
         { id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de", position: { x: -2, y: 5 } },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -7, y: -2 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 7, y: -2 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 4, y: 2 } },
         { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", position: { x: 2, y: -1 } },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -2, y: -1 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: 2, y: 5 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -10, y: 6 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 7, y: 2 } },
         { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", position: { x: 10, y: 6 } },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -7, y: 2 } },
      ],
      transition: { durationSeconds: 2.29 },
      durationSeconds: 0.03,
   },
   {
      id: "802606f1-faf2-4e2a-9e44-dfafec77bb33",
      name: "Tight Box",
      props: [
         { id: "d69aa439-928a-4fea-827c-7287ee1583ef", width: 4, position: { x: -13, y: 2 } },
         { id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: -14, y: 7 } },
      ],
      comments: [
         {
            id: "d9412bd0-99a5-426c-adda-2524ed3d038e",
            user: {
               id: "f30197ba-cf06-4234-bcdb-5d40d83c7999",
               name: "Kishan Sripada",
               avatar_url: "https://lh3.googleusercontent.com/a/AGNmyxZOaSsT0GlQsYvFDomh428vvRYPFzZ6IliUILbeNZg=s96-c",
            },
            content: "We shoudl space tehse dancers",
            position: { x: 7.654899490820447, y: 4.398317397941897 },
         },
      ],
      positions: [
         { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", position: { x: -2, y: -5 } },
         { id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de", position: { x: 2, y: -5 } },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: 5, y: -3 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 5, y: 3 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: -5, y: -3 } },
         { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", position: { x: -5, y: 3 } },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -2, y: 5 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: 2, y: 5 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -2, y: 1 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: -2, y: -2 } },
         { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", position: { x: 2, y: -2 } },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: 2, y: 2 } },
      ],
      transition: { durationSeconds: 1.11 },
      durationSeconds: 0.53,
   },
   {
      id: "cf0312b6-7c69-40df-9c69-850816efa10a",
      name: "Open Box",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 15, y: 8 } }],
      comments: [
         {
            id: "ff3e54c9-b893-40d6-9ab8-ef761b853742",
            user: {
               id: "f30197ba-cf06-4234-bcdb-5d40d83c7999",
               name: "Kishan Sripada",
               avatar_url: "https://lh3.googleusercontent.com/a/AGNmyxZOaSsT0GlQsYvFDomh428vvRYPFzZ6IliUILbeNZg=s96-c",
            },
            content: "Love the way you organized these dancers",
            position: { x: -11.888586432925567, y: 6.113121924429413 },
         },
      ],
      positions: [
         { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", position: { x: -5, y: -5 } },
         { id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de", position: { x: 5, y: -5 } },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: 10, y: -2 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 10, y: 3 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: -10, y: -2 } },
         { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", position: { x: -10, y: 3 } },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -5, y: 6 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: 5, y: 6 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -2, y: 3 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: -2, y: -1 } },
         { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", position: { x: 2, y: -1 } },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: 2, y: 3 } },
      ],
      transition: { durationSeconds: 0.31 },
      durationSeconds: 2.57,
   },
   {
      id: "b91b4b0a-1628-46b1-8edf-10dd38e838d4",
      name: "Three lines",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      comments: [
         {
            id: "a2966f34-a145-4f4b-b05f-6629fb2ff82a",
            user: {
               id: "f30197ba-cf06-4234-bcdb-5d40d83c7999",
               name: "Kishan Sripada",
               avatar_url: "https://lh3.googleusercontent.com/a/AGNmyxZOaSsT0GlQsYvFDomh428vvRYPFzZ6IliUILbeNZg=s96-c",
            },
            content: "New comment...",
            position: { x: 4.4858999156871535, y: 4.331855378663887 },
         },
      ],
      positions: [
         { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", position: { x: 1, y: 3 } },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: { x: 5, y: 3 },
            transitionType: "cubic",
            controlPointEnd: { x: 3.241467304625194, y: 2.126634768740027 },
            controlPointStart: { x: 0.38947368421052636, y: 2.9999999999999996 },
         },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -7, y: -3 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 5, y: -3 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 1, y: -3 } },
         { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", position: { x: -3, y: -3 } },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -7, y: 3 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -3, y: 3 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -1, y: 0 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 3, y: 0 } },
         { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", position: { x: 7, y: 0 } },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -3, y: 0 } },
      ],
      transition: { durationSeconds: 1.52 },
      durationSeconds: 1.22,
   },
   {
      id: "11954fdf-2391-48ce-901d-68e57e03ea42",
      name: "Saap Drop",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      positions: [
         { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", position: { x: 6, y: -4 } },
         { id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de", position: { x: 10, y: -4 } },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -2, y: -4 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 2, y: -4 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: -6, y: -4 } },
         { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", position: { x: -10, y: -4 } },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -2, y: 4 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: 2, y: 4 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -10, y: 4 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 10, y: 4 } },
         { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", position: { x: 6, y: 4 } },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -6, y: 4 } },
      ],
      transition: { durationSeconds: 0.31 },
      durationSeconds: 0.83,
   },
   {
      id: "431c3569-f503-46ea-bf76-f5267e69f33f",
      name: "Khunde Beginning",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      positions: [
         { id: "267a3dd5-8016-4b5b-85ef-30c1addca819", position: { x: -2, y: 4 } },
         { id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de", position: { x: 2, y: 4 } },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -10, y: -3 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 10, y: -3 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 2, y: -2 } },
         { id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee", position: { x: -2, y: -2 } },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -4, y: 1 } },
         {
            id: "d59fa5d0-91a1-440f-8795-6223a8446c86",
            position: { x: 4, y: 1 },
            transitionType: "linear",
            controlPointEnd: { x: 4.125, y: 2.5555555555555554 },
            controlPointStart: { x: 1.875, y: 2.4444444444444446 },
         },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -7, y: 3 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 10, y: 1 } },
         { id: "4eb89916-67ad-4b94-8a89-79f004a074a3", position: { x: 7, y: 3 } },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -10, y: 1 } },
      ],
      transition: { durationSeconds: 3.04 },
      durationSeconds: 0.5,
   },
   {
      id: "84a92ced-4051-4834-bae7-eaea9e026572",
      name: "Hexagon Again",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: { x: -5, y: 0 },
            transitionType: "cubic",
            controlPointEnd: { x: -5.765721888992134, y: 6.545606995015638 },
            controlPointStart: { x: -2.638202247191011, y: 7.231912646785485 },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: { x: 5, y: 0 },
            transitionType: "linear",
            controlPointEnd: { x: 4.226315789473682, y: 4.134210526315789 },
            controlPointStart: { x: 0.38947368421052636, y: 2.9999999999999996 },
         },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -10, y: -5 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 10, y: -5 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 5, y: -5 } },
         {
            id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee",
            position: { x: 8, y: -5 },
            transitionType: "cubic",
            controlPointEnd: { x: 2.8552631578947367, y: -3.898355263157894 },
            controlPointStart: { x: 2.3605263157894742, y: -3.8305921052631575 },
         },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -7, y: -5 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -5, y: -5 }, transitionType: "teleport" },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -2, y: -2 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 2, y: 3 } },
         {
            id: "4eb89916-67ad-4b94-8a89-79f004a074a3",
            position: { x: 2, y: -2 },
            transitionType: "cubic",
            controlPointEnd: { x: 5.034706908433112, y: -1.0959674467066547 },
            controlPointStart: { x: 6.6322368421052635, y: -0.2956140350877192 },
         },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -2, y: 3 } },
      ],
      transition: { durationSeconds: 0.31 },
      durationSeconds: 1.36,
   },
   {
      id: "16757551-d62e-4ffe-b057-e4559643c9e7",
      name: "Mini Triangles",
      notes: "For the pyramid formation, Amelie, you're at the apex. Don't forget your positioning in relation to Finnegan and Cecilia.\n\nCecilia, when transitioning from the 'V' formation to the line, keep your movements fluid and graceful.",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      comments: [
         {
            id: "a178c061-675b-47d0-bd6c-fb726b38a4bd",
            user: {
               id: "f30197ba-cf06-4234-bcdb-5d40d83c7999",
               name: "Kishan Sripada",
               avatar_url: "https://lh3.googleusercontent.com/a/AAcHTtfj5XdPvHDCjOb3DS56K2eUA0-YNlvq3ce2punUsvA=s96-c",
            },
            content: "Asher, ensure to maintain your line alignment with Finnegan during the twirl sequence.",
            position: { x: 6.33, y: 5.984848484848488 },
         },
      ],
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: { x: -5, y: 5 },
            transitionType: "linear",
            controlPointEnd: { x: -3.0048872180451127, y: 4.234210526315788 },
            controlPointStart: { x: -1.7714285714285714, y: 4.792105263157895 },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: { x: 5, y: 5 },
            transitionType: "linear",
            controlPointEnd: { x: 4.226315789473682, y: 4.134210526315789 },
            controlPointStart: { x: 0.38947368421052636, y: 2.9999999999999996 },
         },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -10, y: 0 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 10, y: 0 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 5, y: 0 } },
         {
            id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee",
            position: { x: 8, y: -3 },
            transitionType: "linear",
            controlPointEnd: { x: 2.8552631578947367, y: -3.898355263157894 },
            controlPointStart: { x: 2.3605263157894742, y: -3.8305921052631575 },
         },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -7, y: -3 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -5, y: 0 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -2, y: 2 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 2, y: 7 } },
         {
            id: "4eb89916-67ad-4b94-8a89-79f004a074a3",
            position: { x: 2, y: 2 },
            transitionType: "linear",
            controlPointEnd: { x: 5.001973684210526, y: -1.128070175438597 },
            controlPointStart: { x: 6.6322368421052635, y: -0.2956140350877192 },
         },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -2, y: 7 } },
      ],
      transition: { durationSeconds: 1.43 },
      durationSeconds: 3.94,
   },
   {
      id: "38d2c32a-bfcf-45e4-baf0-54e4b1f84582",
      name: "Start of Big Triangle",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: { x: -2, y: -1 },
            transitionType: "linear",
            controlPointEnd: { x: -3.0048872180451127, y: 4.234210526315788 },
            controlPointStart: { x: -1.7714285714285714, y: 4.792105263157895 },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: { x: 2, y: -1 },
            transitionType: "cubic",
            controlPointEnd: { x: 3, y: 1.875 },
            controlPointStart: { x: 7.883569386206473, y: -6.03485927214168 },
         },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -10, y: -3 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 10, y: -3 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 7, y: 0 } },
         {
            id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee",
            position: { x: 7, y: -5 },
            transitionType: "linear",
            controlPointEnd: { x: 2.8552631578947367, y: -3.898355263157894 },
            controlPointStart: { x: 2.3605263157894742, y: -3.8305921052631575 },
         },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -6, y: -5 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -6, y: 0 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -2, y: 2 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 2, y: 5 } },
         {
            id: "4eb89916-67ad-4b94-8a89-79f004a074a3",
            position: { x: 2, y: 2 },
            transitionType: "linear",
            controlPointEnd: { x: 5.001973684210526, y: -1.128070175438597 },
            controlPointStart: { x: 6.6322368421052635, y: -0.2956140350877192 },
         },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -2, y: 5 } },
      ],
      transition: { durationSeconds: 1.13 },
      durationSeconds: 1.11,
   },
   {
      id: "28c40b4d-c883-4119-9f5e-3b72f3f6d4a5",
      name: "Almost there",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: { x: -2, y: -1 },
            transitionType: "linear",
            controlPointEnd: { x: -3.0048872180451127, y: 4.234210526315788 },
            controlPointStart: { x: -1.7714285714285714, y: 4.792105263157895 },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: { x: 2, y: -1 },
            transitionType: "linear",
            controlPointEnd: { x: 4.226315789473682, y: 4.134210526315789 },
            controlPointStart: { x: 0.38947368421052636, y: 2.9999999999999996 },
         },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -10, y: -1 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 10, y: -1 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 6, y: 2 } },
         {
            id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee",
            position: { x: 6, y: -1 },
            transitionType: "linear",
            controlPointEnd: { x: 2.8552631578947367, y: -3.898355263157894 },
            controlPointStart: { x: 2.3605263157894742, y: -3.8305921052631575 },
         },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -6, y: -1 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -6, y: 2 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -2, y: 2 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 2, y: 5 } },
         {
            id: "4eb89916-67ad-4b94-8a89-79f004a074a3",
            position: { x: 2, y: 2 },
            transitionType: "linear",
            controlPointEnd: { x: 5.001973684210526, y: -1.128070175438597 },
            controlPointStart: { x: 6.6322368421052635, y: -0.2956140350877192 },
         },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -2, y: 5 } },
      ],
      transition: { durationSeconds: 1.53 },
      durationSeconds: 0.12,
   },
   {
      id: "e0bff574-d82c-42ca-9aa5-8790bec38970",
      name: "Drop",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: { x: -2, y: 1 },
            transitionType: "linear",
            controlPointEnd: { x: -3.0048872180451127, y: 4.234210526315788 },
            controlPointStart: { x: -1.7714285714285714, y: 4.792105263157895 },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: { x: 2, y: 1 },
            transitionType: "linear",
            controlPointEnd: { x: 4.226315789473682, y: 4.134210526315789 },
            controlPointStart: { x: 0.38947368421052636, y: 2.9999999999999996 },
         },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -10, y: 1 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 10, y: 1 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 6, y: 4 } },
         {
            id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee",
            position: { x: 6, y: 1 },
            transitionType: "linear",
            controlPointEnd: { x: 2.8552631578947367, y: -3.898355263157894 },
            controlPointStart: { x: 2.3605263157894742, y: -3.8305921052631575 },
         },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -6, y: 1 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -6, y: 4 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -2, y: 4 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 2, y: 7 } },
         {
            id: "4eb89916-67ad-4b94-8a89-79f004a074a3",
            position: { x: 2, y: 4 },
            transitionType: "linear",
            controlPointEnd: { x: 5.001973684210526, y: -1.128070175438597 },
            controlPointStart: { x: 6.6322368421052635, y: -0.2956140350877192 },
         },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -2, y: 7 } },
      ],
      transition: { durationSeconds: 0.43 },
      durationSeconds: 0.41,
   },
   {
      id: "9d1728f8-9245-45cf-a966-9eeffe4b8107",
      name: "Drop-Off",
      notes: "During the 'Cross' formation, Finnegan, you intersect at the center. Timing is key here to prevent collisions.",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      comments: [
         {
            id: "79447e40-8ac9-4f84-9bec-87693eb0a957",
            user: {
               id: "f30197ba-cf06-4234-bcdb-5d40d83c7999",
               name: "Kishan Sripada",
               avatar_url: "https://lh3.googleusercontent.com/a/AAcHTtfj5XdPvHDCjOb3DS56K2eUA0-YNlvq3ce2punUsvA=s96-c",
            },
            content: "Finnegan, remember to take your starting position slightly to the left for better stage balance.",
            position: { x: -10.52, y: 6.05 },
         },
      ],
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: { x: -2, y: -5 },
            transitionType: "linear",
            controlPointEnd: { x: -3.0048872180451127, y: 4.234210526315788 },
            controlPointStart: { x: -1.7714285714285714, y: 4.792105263157895 },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: { x: 2, y: -5 },
            transitionType: "linear",
            controlPointEnd: { x: 4.226315789473682, y: 4.134210526315789 },
            controlPointStart: { x: 0.38947368421052636, y: 2.9999999999999996 },
         },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -11, y: 1 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 11, y: 1 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 6, y: -5 } },
         {
            id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee",
            position: { x: 11, y: -3 },
            transitionType: "linear",
            controlPointEnd: { x: 2.8552631578947367, y: -3.898355263157894 },
            controlPointStart: { x: 2.3605263157894742, y: -3.8305921052631575 },
         },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -6, y: -5 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -11, y: -3 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -2, y: 6 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 11, y: 4 } },
         {
            id: "4eb89916-67ad-4b94-8a89-79f004a074a3",
            position: { x: 2, y: 6 },
            transitionType: "linear",
            controlPointEnd: { x: 4.735553772070613, y: 7.9125200642054665 },
            controlPointStart: { x: -3.881621187800964, y: 2.4871589085072126 },
         },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -11, y: 4 } },
      ],
      transition: { durationSeconds: 1.15 },
      durationSeconds: 0.01,
   },
   {
      id: "43c8e7a8-d7b6-4b6c-acfb-ae0c296a2765",
      name: "Gen Seg Beginning",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: { x: -9, y: -4 },
            transitionType: "linear",
            controlPointEnd: { x: -3.0048872180451127, y: 4.234210526315788 },
            controlPointStart: { x: -1.7714285714285714, y: 4.792105263157895 },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: { x: 10, y: -4 },
            transitionType: "linear",
            controlPointEnd: { x: 4.226315789473682, y: 4.134210526315789 },
            controlPointStart: { x: 0.38947368421052636, y: 2.9999999999999996 },
         },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -3, y: 1 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 4, y: 1 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 4, y: 0 } },
         {
            id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee",
            position: { x: 7, y: -2 },
            transitionType: "linear",
            controlPointEnd: { x: 2.8552631578947367, y: -3.898355263157894 },
            controlPointStart: { x: 2.3605263157894742, y: -3.8305921052631575 },
         },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -6, y: -2 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -3, y: 0 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -9, y: 6 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 7, y: 3 } },
         {
            id: "4eb89916-67ad-4b94-8a89-79f004a074a3",
            position: { x: 10, y: 6 },
            transitionType: "linear",
            controlPointEnd: { x: 5.001973684210526, y: -1.128070175438597 },
            controlPointStart: { x: 6.6322368421052635, y: -0.2956140350877192 },
         },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -6, y: 3 } },
      ],
      transition: { durationSeconds: 1.02 },
      durationSeconds: 0.46,
   },
   {
      id: "c317ad30-eeaf-48fb-80bf-563b3b2ef629",
      name: "Right X",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: { x: -9, y: -6 },
            transitionType: "linear",
            controlPointEnd: { x: -3.0048872180451127, y: 4.234210526315788 },
            controlPointStart: { x: -1.7714285714285714, y: 4.792105263157895 },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: { x: 8, y: -6 },
            transitionType: "linear",
            controlPointEnd: { x: 4.226315789473682, y: 4.134210526315789 },
            controlPointStart: { x: 0.38947368421052636, y: 2.9999999999999996 },
         },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -3, y: 2 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 2, y: 2 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 2, y: -2 } },
         {
            id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee",
            position: { x: 5, y: -4 },
            transitionType: "linear",
            controlPointEnd: { x: 2.8552631578947367, y: -3.898355263157894 },
            controlPointStart: { x: 2.3605263157894742, y: -3.8305921052631575 },
         },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -6, y: -4 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -3, y: -2 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -9, y: 7 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 5, y: 4 } },
         {
            id: "4eb89916-67ad-4b94-8a89-79f004a074a3",
            position: { x: 8, y: 7 },
            transitionType: "linear",
            controlPointEnd: { x: 5.001973684210526, y: -1.128070175438597 },
            controlPointStart: { x: 6.6322368421052635, y: -0.2956140350877192 },
         },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -6, y: 4 } },
      ],
      transition: { durationSeconds: 1.31 },
      durationSeconds: 1.22,
   },
   {
      id: "81fe6590-effb-4a26-bec7-4cb4564bcb44",
      name: "Left X",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: { x: -7, y: -5 },
            transitionType: "linear",
            controlPointEnd: { x: -3.0048872180451127, y: 4.234210526315788 },
            controlPointStart: { x: -1.7714285714285714, y: 4.792105263157895 },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: { x: 8, y: -5 },
            transitionType: "linear",
            controlPointEnd: { x: 4.226315789473682, y: 4.134210526315789 },
            controlPointStart: { x: 0.38947368421052636, y: 2.9999999999999996 },
         },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -1, y: 1 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: 2, y: 1 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 2, y: -1 } },
         {
            id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee",
            position: { x: 5, y: -3 },
            transitionType: "linear",
            controlPointEnd: { x: 2.8552631578947367, y: -3.898355263157894 },
            controlPointStart: { x: 2.3605263157894742, y: -3.8305921052631575 },
         },
         { id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd", position: { x: -4, y: -3 } },
         { id: "d59fa5d0-91a1-440f-8795-6223a8446c86", position: { x: -1, y: -1 } },
         { id: "c3550447-1304-4dd2-9ef5-ddc024541fd0", position: { x: -7, y: 6 } },
         { id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51", position: { x: 5, y: 3 } },
         {
            id: "4eb89916-67ad-4b94-8a89-79f004a074a3",
            position: { x: 8, y: 6 },
            transitionType: "linear",
            controlPointEnd: { x: 5.001973684210526, y: -1.128070175438597 },
            controlPointStart: { x: 6.6322368421052635, y: -0.2956140350877192 },
         },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -4, y: 3 } },
      ],
      transition: { durationSeconds: 0.31 },
      durationSeconds: 2.43,
   },
   {
      id: "b1752b98-f2fc-4637-88af-a57a35731de0",
      name: "Double Line V",
      props: [{ id: "60fb8d2c-adc8-4b25-812a-84f26d0203c7", position: { x: 0, y: 0 } }],
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: { x: -1, y: 2 },
            transitionType: "cubic",
            controlPointEnd: { x: -1.8516818732223865, y: -3.8313804173354846 },
            controlPointStart: { x: -1.8652818844864931, y: -3.8403522852073917 },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: { x: 1, y: 2 },
            transitionType: "cubic",
            controlPointEnd: { x: 1.678597476838164, y: -3.3072906986567525 },
            controlPointStart: { x: 3.33201754385965, y: -4.437969924812029 },
         },
         { id: "a914e5a7-e2c8-4348-a9ec-d56f20be20a0", position: { x: -6, y: 2 } },
         { id: "0d7c570d-8284-46b6-94a7-b6d4255a0841", position: { x: -3, y: 4 } },
         { id: "6e9d90f2-608f-4598-a855-76efc5298568", position: { x: 3, y: 4 } },
         {
            id: "eb67a09b-7ef9-48f8-88c9-7b032ecb1fee",
            position: { x: 6, y: 2 },
            transitionType: "linear",
            controlPointEnd: { x: 2.8552631578947367, y: -3.898355263157894 },
            controlPointStart: { x: 2.3605263157894742, y: -3.8305921052631575 },
         },
         {
            id: "cab70372-6dc2-40a4-90ff-0d85c331c5dd",
            position: { x: -1, y: 5 },
            transitionType: "cubic",
            controlPointEnd: { x: -1.4403508771929812, y: 0.5983552631578951 },
            controlPointStart: { x: -1.4807017543859655, y: 0.31217105263157907 },
         },
         {
            id: "d59fa5d0-91a1-440f-8795-6223a8446c86",
            position: { x: 1, y: 5 },
            transitionType: "cubic",
            controlPointEnd: { x: -0.2735955056179772, y: 1.819213060741742 },
            controlPointStart: { x: 0.7368421052631577, y: 2.030263157894737 },
         },
         {
            id: "c3550447-1304-4dd2-9ef5-ddc024541fd0",
            position: { x: -6, y: -1 },
            transitionType: "linear",
            controlPointEnd: { x: 2.2945772226021424, y: 0.5171713633590196 },
            controlPointStart: { x: -6.744736842105263, y: 3.247523219814241 },
         },
         {
            id: "d2f03e5d-a6c4-47ad-9e25-a4bbd8558d51",
            position: { x: 3, y: 1 },
            transitionType: "cubic",
            controlPointEnd: { x: 3.824233336149361, y: 2.429824561403509 },
            controlPointStart: { x: 4.405263157894737, y: 2.8333333333333335 },
         },
         {
            id: "4eb89916-67ad-4b94-8a89-79f004a074a3",
            position: { x: 6, y: -1 },
            transitionType: "cubic",
            controlPointEnd: { x: 7.402044436935039, y: 2.726470588235294 },
            controlPointStart: { x: 7.1, y: 3.323529411764706 },
         },
         { id: "2f863457-26bf-4ae6-b84a-e20993dc930b", position: { x: -3, y: 1 } },
      ],
      transition: { durationSeconds: 0.3 },
      durationSeconds: 3.97,
   },
];
