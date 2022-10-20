// import { supabase } from "../utils/supabase";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { Header } from "../components/NonAppComponents/Header";
import { Session } from "@supabase/supabase-js";

const Login = ({ session, setSession }: { session: Session; setSession: Function }) => {
   const router = useRouter();

   useEffect(() => {
      if (router.isReady) {
         // console.log(session);
         if (session) {
            router.push("/mydances");
         }
      }
   }, [router, session]);

   const handleLogin = async () => {
      await supabase.auth.signIn(
         {
            provider: "google",
         },
         {
            redirectTo: "https://www.naach.app/mydances",
         }
      );
   };

   return (
      <>
         {" "}
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
            className="fixed top-0 -z-50 h-full w-full body"
            style={{
               backgroundImage:
                  "linear-gradient(\n  115deg,\n  hsl(298deg 100% 51%) 0%,\n  hsl(286deg 90% 59%) 40%,\n  hsl(266deg 74% 69%) 65%,\n  hsl(219deg 51% 76%) 100%\n)",
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
         <div className="flex  flex-col justify-center  h-screen overflow-hidden relative">
            <div
               className="pointer-events-none absolute  h-[1000px] w-[1000px]"
               style={{
                  //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                  backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                  right: -400,
                  top: -400,
                  opacity: 0.2,
               }}
            ></div>
            <div
               className="pointer-events-none absolute  h-[1000px] w-[1000px]"
               style={{
                  //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                  backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                  left: -400,
                  bottom: -400,
                  opacity: 0.2,
               }}
            ></div>
            <div className="flex flex-row w-full items-center justify-center ">
               {/* <div className="bg-white w-full h-[2px]"></div>
               <div className="h-[2px] w-[100px]"></div> */}
               <div className="text-3xl flex flex-col items-center justify-center text-white">
                  <img src="https://i.imgur.com/MgHYste.png" className="w-16 h-16 rounded-xl" alt="" />
                  <p className="mt-3"> welcome to naach 🎉</p>
                  <p className="  italic text-xs">
                     the ultimate choreography tool <span className="not-italic">😏</span>
                  </p>
                  <p className="text-sm mt-4">we missed you </p>
               </div>
               {/* <div className="h-[2px] w-[100px]"></div>
               <div className="bg-white w-full h-[2px]"></div> */}
            </div>

            <div className="flex flex-col items-center  justify-center mt-[50px] z-[100]">
               <button
                  className="flex flex-row items-center text-black  px-2 py-1 rounded-md bg-white"
                  onClick={(e) => {
                     handleLogin();
                  }}
               >
                  <svg className="fill-black" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                     <path d="M15.003906 3C8.3749062 3 3 8.373 3 15s5.3749062 12 12.003906 12c10.01 0 12.265172-9.293 11.326172-14H15v4h7.738281C21.848702 20.448251 18.725955 23 15 23c-4.418 0-8-3.582-8-8s3.582-8 8-8c2.009 0 3.839141.74575 5.244141 1.96875l2.841797-2.8398438C20.951937 4.1849063 18.116906 3 15.003906 3z" />
                  </svg>
                  <p className="ml-3">sign up or sign in with google</p>
               </button>
            </div>
         </div>
      </>
   );
};
export default Login;
