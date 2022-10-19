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
               <button className="bg-pink-500 hover:bg-pink-600 px-4 py-1 rounded-md text-white">get started</button>
            </Link>
         </nav>

         <h1 className="text-5xl mt-[-6px] flex flex-row items-center pointer-events-none ">
            <div className="h-[2px] bg-black w-[10%]"></div>
            <div className="flex flex-row items-end mx-5  rounded-xl bg-white relative ">
               <Image className="scale-[5] select-none pointer-events-none" src={logo} width={200} height={60} />
            </div>

            <div className="h-[2px] bg-black w-full"></div>
         </h1>

         <h1 className="text-3xl leading-[50px] lg:text-7xl font-space font-semibold text-center px-[15%]  lg:leading-[90px] relative  mt-24 z-10">
            taking care of the
            <span className=" -rotate-3 inline-block text-pink-600 bg-pink-200 py-1 px-3 rounded-xl">formations,</span> so you can focus on your
            <span className=" rotate-3 inline-block text-blue-600 bg-blue-200 py-1 px-3 rounded-xl"> dancers.</span>
         </h1>

         <div className="flex flex-col items-center w-full justify-center ">
            <Link href={"/141/edit"} className="z-50">
               <button className="bg-pink-500 hover:bg-pink-600 px-4 py-1 rounded-md text-white mt-12 text-xl hidden lg:block">view a demo</button>
            </Link>
            <img src="https://i.imgur.com/NBKSDEC.png" className="w-2/3 mt-16" alt="" />
         </div>

         <div
            className="h-screen w-[2000px] fixed top-0 left-0  pointer-events-none -z-50"
            style={{
               left: "50%",
               transform: " translateX(-50%)",
               opacity: linear(200, 400, 0, 0.4, scrollY),
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

let test = {
   anyoneCanView: false,
   canView: [],
   canEdit: [],
};
