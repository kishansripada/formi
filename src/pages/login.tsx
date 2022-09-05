// import { supabase } from "../utils/supabase";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { Header } from "../components/NonAppComponents/Header";

const Login = ({ session, setSession }) => {
   const router = useRouter();

   useEffect(() => {
      if (router.isReady) {
         console.log(session);
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
            redirectTo: "http://localhost:3000/mydances",
         }
      );
   };

   return (
      <div className="flex flex-row h-screen overflow-hidden relative">
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
               right: -400,
               bottom: -400,
               opacity: 0.2,
            }}
         ></div>

         <div className="flex flex-col items-center w-[60%] justify-center h-full">
            <button
               className="flex flex-row items-center text-white  px-2 py-1 rounded-md bg-pink-600 hover:bg-pink-700"
               onClick={(e) => {
                  handleLogin();
               }}
            >
               <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                  <path d="M15.003906 3C8.3749062 3 3 8.373 3 15s5.3749062 12 12.003906 12c10.01 0 12.265172-9.293 11.326172-14H15v4h7.738281C21.848702 20.448251 18.725955 23 15 23c-4.418 0-8-3.582-8-8s3.582-8 8-8c2.009 0 3.839141.74575 5.244141 1.96875l2.841797-2.8398438C20.951937 4.1849063 18.116906 3 15.003906 3z" />
               </svg>
               <p className="ml-3">login with google</p>
            </button>
         </div>
         <div className="flex flex-row w-[40%]">
            <div className="flex flex-col items-center h-full">
               <div className="bg-black w-[2px] h-full"></div>
               <div className="w-[2px] h-[100px]"></div>
               <p className="text-3xl">
                  naach <span className="text-xs">early access</span>
               </p>
               <div className="w-[2px] h-[100px]"></div>
               <div className="bg-black w-[2px] h-full"></div>
            </div>
         </div>
      </div>
   );
};
export default Login;
