import Link from "next/link";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "../components/NonAppComponents/Header";
import { Footer } from "../components/NonAppComponents/Footer";
import Image from "next/image";

const features = () => {
   const [scrollPosition, setScrollPosition] = useState(0);
   const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
   };

   useEffect(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);
   return (
      <>
         <Head>
            <title>FORMI: Features</title>
            <meta
               name="description"
               content="We have a variety of features to help you plan your stage performances. From formations to transitions, we have you covered."
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

         <div className="absolute w-[1000px] opacity-60  h-[500px] left-1/2 -translate-x-1/2 -z-[100] top-[100px]">
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
                     className={`h-full bg-gray-300 `}
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
                     className={`w-full bg-gray-300 `}
                     style={{
                        height: 1,
                     }}
                  ></div>
               ))}
            </div>
         </div>

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
            <div className="w-full  flex flex-row mt-[200px]">
               <div className="w-[20%] hidden lg:flex flex-col justify-center  items-center relative">
                  <div
                     style={{
                        opacity: (scrollPosition - 300) / 300,
                     }}
                     className="fixed child:mt-3  z-50 top-1/2 -translate-y-1/2 left-22"
                  >
                     <p
                        style={{
                           fontWeight: scrollPosition > 300 && scrollPosition < 900 ? 700 : 400,
                        }}
                     >
                        View only
                     </p>
                     <p
                        style={{
                           fontWeight: scrollPosition > 900 && scrollPosition < 1700 ? 700 : 400,
                        }}
                     >
                        Commenting
                     </p>
                     <p
                        style={{
                           fontWeight: scrollPosition > 1700 && scrollPosition < 2500 ? 700 : 400,
                        }}
                     >
                        3D View
                     </p>
                     <p
                        style={{
                           fontWeight: scrollPosition > 2500 && scrollPosition < 3300 ? 700 : 400,
                        }}
                     >
                        Collision detection
                     </p>
                     <p
                        style={{
                           fontWeight: scrollPosition > 3300 && scrollPosition < 5000 ? 700 : 400,
                        }}
                     >
                        Curved paths
                     </p>
                  </div>
               </div>
               <div className="lg:w-[80%] w-full  h-full flex flex-col items-center justify center px-[6%] relative z-10">
                  <div className=" rounded-2xl   w-full shadow-2xl flex flex-col px-[6%] py-[6%]">
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
                  <div className=" mt-14 rounded-2xl  w-full shadow-2xl flex flex-col px-[6%] py-[6%]">
                     <img className="rounded-xl border border-gray-300" src="/collisions.png" alt="" />
                     <div className="rounded-full mt-8  bg-gray-100 text-pink-600 w-fit flex flex-row items-center px-3 justify-center py-1">
                        <p className=" text-sm">PROFESSIONAL FEATURES</p>
                     </div>
                     <p className="text-gray-800 mt-4  text-3xl">Determine if dancers will collide BEFORE you perform</p>
                     <p className="text-gray-700 font-light mt-2">
                        With adjustable sensitivity, FORMI will alert you if dancers will collide during a performance. This allows you to be
                        proactive in preventing collisions, and avoid potential injuries.
                     </p>
                  </div>
                  <div className=" mt-14 rounded-2xl  w-full shadow-2xl flex flex-col px-[6%] py-[6%]">
                     <img className="rounded-xl border border-gray-300" src="/nonlinear.png" alt="" />
                     <div className="rounded-full mt-8  bg-gray-100 text-pink-600 w-fit flex flex-row items-center px-3 justify-center py-1">
                        <p className=" text-sm">PROFESSIONAL FEATURES</p>
                     </div>
                     <p className="text-gray-800 mt-4  text-3xl">Create non-linear, curved dancer paths to avoid collisions</p>
                     <p className="text-gray-700 font-light mt-2">
                        FORMI goes beyond simple linear dancer paths, which are so often not the case in real life. Move your dancers in the path that
                        they will actually follow to avoid collisions with other dancers.
                     </p>
                  </div>
               </div>
            </div>
            <hr className="mt-24" />
            <Footer></Footer>
         </div>
      </>
   );
};
export default features;
