"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
const Client = () => {
   const router = useRouter();
   const supabase = createClientComponentClient();
   const [email, setEmail] = useState("");

   const handleLogin = async () => {
      supabase.auth.signInWithOAuth({
         provider: "google",
         options: {
            redirectTo: `${window.location.origin}/auth/callback`,
         },
      });
   };

   async function signInWithEmail() {
      if (!isValidEmail(email)) {
         toast.error("Invalid email");
         return;
      }
      const { data, error } = await supabase.auth.signInWithOtp({
         email,
         options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
         },
      });
      if (!error) {
         router.push("/login/emailsent");
         return;
      }
      if (error) {
         toast("Too many links requested");
         return;
      }
   }

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
         {/* <div
            className="pointer-events-none absolute  h-[1000px] w-[1000px]"
            style={{
               //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
               backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
               //    right: -400,
               //    top: -400,
               top: 0,
               left: 0,
               opacity: 1,
            }}
         ></div> */}
         {/* <div
            className="pointer-events-none absolute  h-[1000px] w-[1000px]"
            style={{
               //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
               backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
               left: -400,
               bottom: -400,
               opacity: 0.2,
            }}
         ></div> */}
         <div
            style={{
               touchAction: "none",
            }}
            className="flex  flex-row  h-[calc(100dvh)] overflow-hidden relative font-inter"
         >
            <Toaster></Toaster>
            <div className="flex flex-col items-center w-full lg:w-[40%] justify-center">
               <div className="flex flex-col items-center w-96 px-5">
                  <p className="text-5xl w-full mb-6 font-bold">Welcome back!</p>
                  {/* <p className=" ">Log in to your account and start creating</p> */}

                  <button
                     className="flex flex-row items-center text-black border-gray-300 shadow-sm border w-full h-14 rounded-md bg-white mt-5  justify-center "
                     onClick={(e) => {
                        handleLogin();
                     }}
                  >
                     <img
                        className="w-6 h-6 mr-3"
                        src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png"
                        alt=""
                     />
                     <p className="mr-3 text-sm font-bold">Continue with Google</p>
                  </button>
                  <div className="flex flex-row items-center justify-center py-4 w-full">
                     <div className="w-full h-[1px] bg-neutral-200 my-5"></div>
                     <p className="mx-5  text-neutral-600">or</p>
                     <div className="w-full h-[1px] bg-neutral-200"></div>
                  </div>
                  <input
                     onChange={(e) => {
                        setEmail(e.target.value);
                     }}
                     type="text"
                     placeholder="Enter your email address here"
                     style={{
                        borderColor: isValidEmail(email) ? "green" : "black",
                     }}
                     className="w-full px-3 h-12 border-2 border-neutral-200 focus:outline-none  rounded-md placeholder:text-neutral-400 placeholder:text-sm text-sm"
                  />
                  <button
                     onClick={(e) => {
                        signInWithEmail();
                     }}
                     className="w-full h-12 bg-black text-white rounded-md mt-4 text-sm"
                  >
                     Continue with email
                  </button>
                  <div className=" text-center">
                     <p className="text-xs mt-5 ">
                        By proceeding, you agree to our{" "}
                        <Link href="/termsofservice">
                           <span className="text-blue-500 cursor-pointer">Terms </span>
                        </Link>
                        and{" "}
                        <Link href="/privacypolicy">
                           <span className="text-blue-500 cursor-pointer"> Privacy Policy</span>
                        </Link>
                        .
                     </p>
                  </div>
               </div>
            </div>

            <div className="lg:w-[60%] w-0 lg:visible invisible max-h-full relative flex flex-col justify-center">
               <div className="p-4 w-full max-h-full h-full">
                  <div
                     className="h-full w-full rounded-tl-[100px] rounded-br-[100px] bg-cover bg-center	"
                     style={{
                        backgroundImage:
                           "url(https://images.unsplash.com/photo-1604954055722-7f80571fbfc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80)",
                     }}
                  ></div>
                  {/* <img className="rounded-xl pointer-events-none select-none w-full object-cover" src="" alt="" /> */}
               </div>
            </div>
         </div>
      </>
   );
};
export default Client;

function isValidEmail(email: string): boolean {
   let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return re.test(email);
}
