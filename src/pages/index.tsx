// import { supabase } from "../utils/supabase";
// import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
// import { supabase } from "../utils/supabase";
// import { Header } from "../components/NonAppComponents/Header";
// import demo from "../../public/demo.mp4";
import { useScrollYPosition } from "react-use-scroll-position";
import { formation } from "../types/types";
import { homeFormation } from "../../public/formationForHome";
import Link from "next/link";
import Head from "next/head";
const home = () => {
   let router = useRouter();
   useEffect(() => {
      if (router.isReady) {
         router.push("/login");
      }
   }, [router]);

   const animate = (formations: formation[], position: number, id: string): { left: number; top: number } => {
      let sum = 0;
      let currentFormationIndex = null;
      let isInTransition;
      let percentThroughTransition;
      for (let i = 0; i < formations.length; i++) {
         sum = sum + formations[i].durationSeconds + formations[i]?.transition.durationSeconds;
         if (position < sum) {
            currentFormationIndex = i;
            let durationThroughTransition = position - (sum - formations[i]?.transition?.durationSeconds);

            if (durationThroughTransition > 0) {
               isInTransition = true;
               percentThroughTransition = durationThroughTransition / formations[i]?.transition?.durationSeconds;
            } else {
               isInTransition = false;
            }
            break;
         }
      }

      // if the position is beyond all the formation, return off stage
      if (currentFormationIndex === null) {
         return coordsToPosition(20, 20);
      }

      const inThisFormation = formations?.[currentFormationIndex]?.positions.find((dancer) => dancer.id === id);

      let inNextFormation = formations[currentFormationIndex + 1]
         ? formations[currentFormationIndex + 1].positions.find((dancerPosition) => dancerPosition.id === id)
         : false;

      let from;
      let to;

      if (isInTransition) {
         if (inThisFormation) {
            if (inNextFormation) {
               // transition between current and next
               // requires animation don't return yet
               from = inThisFormation.position;
               to = inNextFormation.position;
            } else {
               // transition between current and exit strategy specified in current
               // requires animation don't return yet
               from = inThisFormation.position;
               to = (() => {
                  if (inThisFormation.exitStrategy === "closest") {
                     if (from.x >= 0) return { x: 20, y: from.y };
                     if (from.x < 0) return { x: -20, y: from.y };
                  }
                  if (inThisFormation.exitStrategy === "right") {
                     return { x: 20, y: from.y };
                  }
                  if (inThisFormation.exitStrategy === "left") {
                     return { x: -20, y: from.y };
                  }
               })();
            }
         } else {
            if (inNextFormation) {
               // transition between enter strategy specified in next and position in next
               // requires animation don't return yet
               to = inNextFormation.position;

               from = (() => {
                  if (inNextFormation.enterStrategy === "closest") {
                     if (to.x >= 0) return { x: 20, y: to.y };
                     if (to.x < 0) return { x: -20, y: to.y };
                  }
                  if (inNextFormation.enterStrategy === "right") {
                     return { x: 20, y: to.y };
                  }
                  if (inNextFormation.enterStrategy === "left") {
                     return { x: -20, y: to.y };
                  }
               })();
            } else {
               // return off stage
               return coordsToPosition(20, 20);
            }
         }
      } else {
         if (inThisFormation) {
            // return position from this formation
            return coordsToPosition(inThisFormation.position.x, inThisFormation.position.y);
         } else {
            // return off stage
            return coordsToPosition(20, 20);
         }
      }

      return coordsToPosition(from.x + (to.x - from.x) * percentThroughTransition, from.y + (to.y - from.y) * percentThroughTransition);
   };

   const coordsToPosition = (x: number, y: number) => {
      return { left: 47 + 80 * x, top: 470 + 40 * -y };
   };

   const linear = (iStart: number, iEnd: number, oStart: number, oEnd: number, i: number) => {
      if (i < iStart) return oStart;
      if (i > iEnd) return oEnd;
      return ((i - iStart) / (iEnd - iStart)) * (oEnd - oStart) + oStart;
   };

   const quadratic = (iStart: number, iEnd: number, oStart: number, oEnd: number, i: number) => {
      if (i < iStart) return oStart;
      if (i > iEnd) return oEnd;
      return Math.sqrt((i - iStart) / (iEnd - iStart)) * (oEnd - oStart) + oStart;
   };
   const scrollY = useScrollYPosition();

   return (
      <>
         <nav className="flex flex-row justify-between mt-5 text-gray-500 px-[10%]">
            <Head>
               <title> Naach</title>
            </Head>
            <div></div>
            <ul className="flex flex-row child:mx-3 justify-center child:ease-in-out child:duration-300">
               {/* <button className="hover:bg-slate-100 hover:text-pink-500 px-2 py-1 rounded-md  ">about</button>
               <button className="hover:bg-slate-100 hover:text-pink-500 px-2 py-1 rounded-md">try it</button>
               <button className="hover:bg-slate-100 hover:text-pink-500 px-2 py-1 rounded-md">pricing</button> */}
            </ul>
            <Link href={"/login"} className="z-50">
               <button className="bg-pink-500 hover:bg-pink-600 px-4 py-1 rounded-md text-white">login</button>
            </Link>
         </nav>

         <h1 className="text-5xl mt-[-6px] flex flex-row items-center pointer-events-none ">
            <div className="h-[2px] bg-black w-[10%]"></div>
            <div className="flex flex-row items-end mx-5  rounded-xl bg-white relative top-[-30px]">
               <p className="">naach</p>
               <span className="text-sm ml-3"> beta</span>
            </div>

            <div className="h-[2px] bg-black w-full"></div>
         </h1>

         <h1 className="text-4xl lg:text-7xl font-space font-semibold text-center px-[15%]  lg:leading-[90px] relative  mt-24 z-10">
            taking care of the
            <span className=" -rotate-3 inline-block text-pink-600 bg-pink-200 py-1 px-3 rounded-xl">formations,</span> so you can focus on your
            <span className=" rotate-3 inline-block text-blue-600 bg-blue-200 py-1 px-3 rounded-xl"> dancers.</span>
         </h1>

         <h1
            className="text-6xl lg:text-7xl font-space fixed text-center"
            style={{
               left: "50%",
               transform: "translateX(-50%)",
               top: linear(200, 500, 0, 175, scrollY),
               opacity: linear(200, 500, 0, 1, scrollY),
            }}
         >
            bring your formations to life
         </h1>

         {/* <h1
            className="text-7xl font-space fixed text-center text-orange-600 ml-auto mr-auto"
            style={{
               right: 0,
               top: 200,
               transform: "translate(-50%, -50%)",

               left: linear(900, 1000, -700, 700, scrollY),
            }}
         >
            synced to SoundCloud
         </h1> */}

         {/* riya */}
         <div
            className={`w-[50px] h-[50px] fixed rounded-full grid place-items-center  z-[40] mr-auto ml-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pointer-events-none`}
            style={{
               transform: "translate(-50%, -50%)",
               right: 0,
               ...animate(homeFormation, scrollY, "0546a8df-95b8-4892-a040-3162c65fc450"),
            }}
         >
            <img
               className="w-[45px] h-[45px] rounded-full"
               src="https://media-exp1.licdn.com/dms/image/C4E03AQEV84sdBaTGNw/profile-displayphoto-shrink_400_400/0/1649656691847?e=1668643200&v=beta&t=Wa7z_F4E2bFHdLwRHNpKVM_-a5y74nQGGYz7qEAKrjM"
               alt=""
            />
         </div>

         {/* aadi */}
         <div
            className={`w-[50px] h-[50px] fixed rounded-full grid place-items-center  z-[40] mr-auto ml-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pointer-events-none`}
            style={{
               transform: "translate(-50%, -50%)",
               right: 0,
               ...animate(homeFormation, scrollY, "fdd73b3e-9759-47da-bda5-a26721c0de53"),
            }}
         >
            <img
               className="w-[45px] h-[45px] rounded-full"
               src="https://media-exp1.licdn.com/dms/image/C5603AQE9_VYACed8aw/profile-displayphoto-shrink_400_400/0/1554756878025?e=1668643200&v=beta&t=fuv9dgEZ30lsxo98APD9X1yU9gT3TLH-z8o9Fuf5pOM"
               alt=""
            />
         </div>

         {/* nandan */}
         <div
            className={`w-[50px] h-[50px] fixed rounded-full grid place-items-center  z-[40] mr-auto ml-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pointer-events-none`}
            style={{
               transform: "translate(-50%, -50%)",
               right: 0,
               ...animate(homeFormation, scrollY, "f19a2a06-9c32-4937-a5a2-e854835bd2b1"),
            }}
         >
            <img
               className="w-[45px] h-[45px] rounded-full"
               src="https://media-exp1.licdn.com/dms/image/C4E03AQF5Cj8kpiygOA/profile-displayphoto-shrink_400_400/0/1615169034858?e=1668643200&v=beta&t=tnhbngy_GAgRg1JaG2i0fFZdy1TcJHJ7SbH3DPKLGF4"
               alt=""
            />
         </div>

         {/* sasha */}
         <div
            className={`w-[50px] h-[50px] fixed rounded-full grid place-items-center  z-[40] mr-auto ml-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pointer-events-none`}
            style={{
               transform: "translate(-50%, -50%)",
               right: 0,
               ...animate(homeFormation, scrollY, "7f0bf2cf-f835-4a2a-b21a-81faee4cfb49"),
            }}
         >
            <img
               className="w-[45px] h-[45px] rounded-full"
               src="https://media-exp1.licdn.com/dms/image/C4D03AQFHCtAKpvhINg/profile-displayphoto-shrink_400_400/0/1645427187748?e=1668038400&v=beta&t=Pa9FKP6T3wndcrLvdi50vsOtWuvjv3hoWNhBzwajlIM"
               alt=""
            />
         </div>

         {/* gargi */}
         <div
            className={`w-[50px] h-[50px] fixed rounded-full grid place-items-center  z-[40] mr-auto ml-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pointer-events-none`}
            style={{
               transform: "translate(-50%, -50%)",
               right: 0,
               ...animate(homeFormation, scrollY, "f718074c-26f8-4862-b087-260b2c4a0134"),
            }}
         >
            <img
               className="w-[45px] h-[45px] rounded-full"
               src="https://media-exp1.licdn.com/dms/image/C5603AQG7eLEuz7W9_g/profile-displayphoto-shrink_400_400/0/1646707662869?e=1668038400&v=beta&t=1HpBjVTRbdc17LaPzFpmu50G8sLO0_E9xYJi6U8WsTU"
               alt=""
            />
         </div>

         {/* ME */}
         <div
            className={`w-[50px] h-[50px] fixed rounded-full grid place-items-center  z-[40] mr-auto ml-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pointer-events-none`}
            style={{
               transform: "translate(-50%, -50%)",
               right: 0,
               ...animate(homeFormation, scrollY, "1655c2fd-fedc-49b9-b655-14b02f9cc5f7"),
            }}
         >
            <img
               className="w-[45px] h-[45px] rounded-full"
               src="https://media-exp1.licdn.com/dms/image/C4E03AQH0s4csZL4s5A/profile-displayphoto-shrink_400_400/0/1649337837468?e=1668038400&v=beta&t=MBFDE9ia0WqsVfDoDTTZ0Fx_2mLVsk08AdqDer97JuE"
               alt=""
            />
         </div>

         <div className="h-[6000px]"></div>

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
