// import { supabase } from "../utils/supabase";
// import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
// import { supabase } from "../utils/supabase";
// import { Header } from "../components/NonAppComponents/Header";
// import demo from "../../public/demo.mp4";
import toast, { Toaster } from "react-hot-toast";
import logo from "../../public/logo.svg";
import Image from "next/image";
import { useScrollYPosition } from "react-use-scroll-position";
import { formation } from "../types/types";
import { homeFormation } from "../../public/formationForHome";
import Link from "next/link";
import Head from "next/head";
const home = () => {
   let router = useRouter();

   const linear = (iStart: number, iEnd: number, oStart: number, oEnd: number, i: number) => {
      if (i < iStart) return oStart;
      if (i > iEnd) return oEnd;
      return ((i - iStart) / (iEnd - iStart)) * (oEnd - oStart) + oStart;
   };

   const scrollY = useScrollYPosition();

   return (
      <>
         <style jsx>{`
            @keyframes gradient {
               0% {
                  background-position: 0% 50%;
               }
               50% {
                  background-position: 100% 50%;
               }
               100% {
                  background-position: 0% 50%;
               }
            }
         `}</style>
         <div
            className="fixed top-0 -z-50 h-full w-full body bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
            style={{
               // backgroundImage:
               // "linear-gradient(\n  115deg,\n  hsl(298deg 100% 51%) 0%,\n  hsl(286deg 90% 59%) 40%,\n  hsl(266deg 74% 69%) 65%,\n  hsl(219deg 51% 76%) 100%\n)",
               // background: "linear-gradient(to right top, #ff34bf, #e93ac2, #d33ec3, #bc42c3, #a545c1)",
               backgroundSize: "400% 400%",
               height: "100vh",
               animation: "gradient 15s ease infinite",
            }}
         ></div>
         <div
            className="fixed top-0 -z-40 h-full w-full body bg-black opacity-50"
            style={{
               backgroundSize: "400% 400%",
               height: "100vh",
            }}
         ></div>
         <nav className="flex flex-row justify-between mt-5 text-gray-500 px-[10%]">
            <Head>
               <title>Naach — The Ultimate Choreography Formation Tool.</title>

               <meta
                  name="description"
                  content="Easily visualize your formations synced to music. Naach is the ultimate choreographer formation tool."
               />
               <meta name="keywords" content="dance, choreography, desi, formations" />
               <meta name="twitter:card" content="summary" />
               <meta name="twitter:title" content="Naach — The Ultimate Choreography Formation Tool" />
               <meta name="twitter:image" content="https://i.imgur.com/pWxufBF.png" />
               <meta property="og:type" content="song" />
               <meta property="og:title" content="Naach — The Ultimate Choreography Formation Tool" />
               <meta
                  property="og:description"
                  content="Easily visualize your formations synced to music. Naach is the ultimate choreographer formation tool."
               />
               <meta property="og:image" content="https://i.imgur.com/pWxufBF.png" />

               <meta property="og:site_name" content="Naach — The Ultimate Choreography Formation Tool." />
            </Head>
            <div></div>
            <ul className="flex flex-col items-center child:mx-3 justify-center child:ease-in-out child:duration-300 text-sm leading-tight displ invisible lg:visible"></ul>
            <Link href={"/login"} className="z-50">
               <button className="bg-pink-500 hover:bg-pink-600 px-4 py-1 rounded-md text-white">login / signup</button>
            </Link>
         </nav>

         {/* <h1 className="text-5xl mt-[-6px] flex flex-row items-center pointer-events-none ">
            <div className="flex flex-row items-end mx-5  rounded-xl  relative "></div>
         </h1> */}
         <div className="flex flex-row justify-center mt-16">
            <img className=" select-none pointer-events-none w-48 lg:w-72" src="/logoWhite.png" />
         </div>
         <h1 className="text-3xl text-white leading-[50px] lg:text-7xl font-space font-semibold text-center px-[15%]  lg:leading-[90px] relative  mt-24 z-10">
            let's reinvent the choreographer toolkit 🕺
         </h1>

         <div className="flex flex-col items-center w-full justify-center ">
            <Link href={"/141/edit"} className="z-50">
               <button className="bg-pink-500 hover:bg-pink-600 px-4 py-1 rounded-md text-white mt-12 text-xl hidden lg:block">
                  launch a playground
               </button>
            </Link>
            <img src="https://i.imgur.com/NBKSDEC.png" className="w-[90%] lg:w-2/3 mt-16 rounded-xl" alt="" />
         </div>

         <div
            className="h-screen w-[2000px] fixed top-0 left-0  pointer-events-none -z-50"
            style={{
               left: "50%",
               transform: " translateX(-50%)",
               opacity: 0.2,
            }}
         >
            <div className="flex flex-row h-full justify-between">
               {new Array(51).fill(0).map((_, i) => (
                  <div
                     key={i}
                     className="h-full bg-gray-300"
                     style={{
                        width: i % 5 === 0 ? (1 / 1) * 2.5 : 1 / 1,
                        // backgroundColor: i === 10 ? "black" : "rgb(209 213 219)",
                        zIndex: i === 10 ? 1 : 0,
                     }}
                  ></div>
               ))}
            </div>
            <div className="flex flex-col h-[800px] justify-between relative top-[-800px]">
               {new Array(21).fill(0).map((_, i) => (
                  <div
                     key={i}
                     className=" w-full bg-gray-300"
                     style={{
                        height: i % 5 === 0 ? (1 / 1) * 2.5 : 1 / 1,
                        // backgroundColor: i === 10 ? "black" : "rgb(209 213 219)",
                        zIndex: i === 10 ? 1 : 0,
                     }}
                  ></div>
               ))}
            </div>
         </div>
      </>
   );
};
export default home;
