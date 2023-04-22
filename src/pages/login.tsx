import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Header } from "../components/NonAppComponents/Header";
import { Session } from "@supabase/supabase-js";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

const Login = () => {
   const router = useRouter();
   const session = useSession();
   const supabase = useSupabaseClient();
   const [email, setEmail] = useState("");
   useEffect(() => {
      if (session) {
         router.push("/dashboard");
      }
   }, [session]);

   const handleLogin = async () => {
      const { data } = await supabase.auth.signInWithOAuth({
         provider: "google",
         options: {
            redirectTo: `${window.location.origin}/dashboard`,
         },
      });
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
         {/* <div
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
            ></div> */}
         <div className="flex  flex-row  h-screen overflow-hidden relative font-proxima">
            <div className="flex flex-col items-center w-full lg:w-[40%] justify-center">
               <div className="flex flex-col items-center w-80">
                  <Link href={"/"}>
                     <div className="w-[150px] cursor-pointer">
                        {/* <h1 className="text-6xl font-bold z-10 relative">naach.app</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[58%]"></div> */}
                        <h1 className="text-4xl font-bold z-10 dark:text-neutral-200 relative">FORMI</h1>

                        <div className="bg-[#E7ADC5] dark:bg-pink-600 relative h-2  top-[-12px] mr-auto w-[100%]"></div>
                     </div>
                  </Link>

                  <p className="text-2xl  font-bold">Welcome back to FORMI</p>
                  <p className=" ">Log in to your account and start creating</p>

                  <button
                     className="flex flex-row items-center text-black border-gray-300 shadow-sm border w-80 h-16 rounded-md bg-white mt-5 "
                     onClick={(e) => {
                        handleLogin();
                     }}
                  >
                     <svg className="fill-black mr-12 ml-6" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                        <path d="M15.003906 3C8.3749062 3 3 8.373 3 15s5.3749062 12 12.003906 12c10.01 0 12.265172-9.293 11.326172-14H15v4h7.738281C21.848702 20.448251 18.725955 23 15 23c-4.418 0-8-3.582-8-8s3.582-8 8-8c2.009 0 3.839141.74575 5.244141 1.96875l2.841797-2.8398438C20.951937 4.1849063 18.116906 3 15.003906 3z" />
                     </svg>
                     <p className="mr-3">Continue with Google</p>
                  </button>
                  <div className="flex flex-row items-center justify-center w-full">
                     <div className="w-full h-[1px] bg-neutral-200 my-5"></div>
                     <p className="mx-5">OR</p>
                     <div className="w-full h-[1px] bg-neutral-200"></div>
                  </div>
                  <input
                     onChange={(e) => {
                        setEmail(e.target.value);
                     }}
                     type="text"
                     placeholder="Enter your email address here"
                     className="w-full px-3 h-12 border border-nuetral-200 rounded-md"
                  />
                  <button
                     onClick={(e) => {
                        async function signInWithEmail() {
                           const { data, error } = await supabase.auth.signInWithOtp({
                              email,
                              // options: {
                              //    emailRedirectTo: "https://example.com/welcome",
                              // },
                           });
                           console.log(data, error);
                        }
                        signInWithEmail();
                     }}
                     className="w-full h-12 bg-pink-600 text-white rounded-md mt-2"
                  >
                     Sign in with email{" "}
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

            <div className="lg:w-[60%] w-0 lg:visible invisible bg-[#fafafa] flex flex-col justify-center ">
               <img
                  className="rounded-xl pointer-events-none select-none relative -right-24 shadow-md border-gray-300 border "
                  src="curveDemo.png"
                  alt=""
               />
            </div>
         </div>
      </>
   );
};
export default Login;

// export const getServerSideProps = async (ctx) => {
//    // Create authenticated Supabase Client
//    const supabase = createServerSupabaseClient(ctx);
//    // Check if we have a session
//    const {
//       data: { session },
//    } = await supabase.auth.getSession();

//    if (session) {
//       return {
//          redirect: {
//             destination: "/dashboard",
//             permanent: false,
//          },
//       };
//    }
//    return { props: { data: null } };
// };
