"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { Input } from "../../../@/components/ui/input";
import { ThemeProvider } from "../../../@/components/theme-provider";
import { Button } from "../../../@/components/ui/button";
const Client = () => {
   const router = useRouter();
   const posthog = usePostHog();
   const supabase = createClientComponentClient();
   const [email, setEmail] = useState("");

   const handleLogin = async () => {
      // posthog.identify(session?.user.id, {
      //    email: session?.user.email,
      //    plan,
      // });
      // posthog.capture("sign up", {
      //    performanceId: danceId,
      // });
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
         router.push(`/login/emailsent?email=${email}`);
         return;
      }
      if (error) {
         toast("Too many links requested");
         return;
      }
   }

   return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
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
            className="pointer-events-none absolute  h-[1000px] w-[1000px] z-10"
            style={{
               //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
               backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
               //    right: -400,
               //    top: -400,
               top: 0,
               left: 0,
               opacity: 0.2,
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
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
            <div
               style={{
                  touchAction: "none",
               }}
               className="flex  flex-row bg-neutral-950  text-white h-[calc(100dvh)] overflow-hidden relative font-inter"
            >
               <Toaster></Toaster>
               <div className="flex flex-col items-center w-full  justify-center  ">
                  <div className="flex flex-col  max-w-md px-5  h-full justify-between items-center py-12 ">
                     <img className="w-8" src="/logo.png" alt="" />
                     <div>
                        <p className="text-5xl w-full mb-6 font-semibold text-center">Sign in to FORMI</p>
                        <p className="text-center text-neutral-400 text-sm">Login or register to start choreographing your performances today.</p>

                        <button
                           className="flex flex-row items-center text-white border-gray-300 shadow-sm   h-12 rounded-md bg-pink-600 transition hover:bg-opacity-60 bg-opacity-30 mt-5  justify-center w-full "
                           onClick={(e) => {
                              handleLogin();
                           }}
                        >
                           {/* <img
                              className="w-6 h-6 mr-3 "
                              src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png"
                              alt=""
                           /> */}
                           <p className="mr-3 font-medium">Continue with Google</p>
                        </button>
                        <div className="justify-center text-sm font-medium mt-3 flex flex-row items-center cursor-pointer">
                           <p>or use email instead</p>
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                              <path
                                 fillRule="evenodd"
                                 d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                                 clipRule="evenodd"
                              />
                           </svg>
                        </div>

                        {/* <div className="flex flex-row items-center justify-center py-4 w-full">
                           <div className="w-full h-[1px] bg-neutral-400 my-5"></div>
                           <p className="mx-5  text-neutral-300">or</p>
                           <div className="w-full h-[1px] bg-neutral-400"></div>
                        </div> */}
                        {/* <Input
                           className="bg-neutral-300 ring-1 ring-white"
                           onChange={(e) => {
                              setEmail(e.target.value);
                           }}
                           placeholder="Enter your email address here"
                        ></Input> */}

                        {/* <Button
                           onClick={(e) => {
                              signInWithEmail();
                           }}
                           variant={"secondary"}
                           className=" w-full mt-6"
                        >
                           Continue with email
                        </Button> */}

                        {/* <div className=" text-center">
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
                        </div> */}
                     </div>
                     <div></div>
                  </div>
               </div>

               {/* <div className="lg:w-[60%] w-0 lg:visible invisible max-h-full relative flex flex-col justify-center">
               <div className="p-4 w-full max-h-full h-full">
                  <div
                     className="h-full w-full rounded-tl-[50px] rounded-br-[50px] bg-cover bg-center	"
                     style={{
                        backgroundImage: "url(usingFORMI.png)",
                     }}
                  ></div>
                  
               </div>
            </div> */}
            </div>
         </>
      </ThemeProvider>
   );
};
export default Client;

function isValidEmail(email: string): boolean {
   let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return re.test(email);
}
