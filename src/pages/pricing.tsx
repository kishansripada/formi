import Link from "next/link";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { Header } from "../components/NonAppComponents/Header";
import { Footer } from "../components/NonAppComponents/Footer";
import toast, { Toaster } from "react-hot-toast";

const home = () => {
   let session = useSession();
   const router = useRouter();
   return (
      <>
         <Toaster></Toaster>
         <style jsx>{`
            @keyframes sidetoside {
               0% {
                  left: 0%;
               }
               50% {
                  left: 100%;
               }
               100% {
                  left: 0%;
               }
            }

            @keyframes upanddown {
               0% {
                  top: -100px;
               }
               50% {
                  top: 100px;
               }
               100% {
                  top: -100px;
               }
            }
         `}</style>
         <Head>
            <title>FORMI: Online stage performance planning software.</title>
            <meta
               name="description"
               content="Easily build, create and visualize your dance and cheer formations synced to music. Formi is the ultimate choreographer formation tool. Dance formation builder. Cheer formation builder."
            />
            <meta name="keywords" content="dance, choreography, desi, formations, cheer, cheerleading, formation building tool" />
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

         <Header></Header>
         <div className=" ">
            <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
            <div className="bg-[#fafafa]  flex flex-col justify-center font-proxima ">
               <section className="bg-white dark:bg-gray-900">
                  <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                     <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                           Join thousands that use FORMI to master their stage presence
                        </h2>
                     </div>
                     <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                        {/* Pricing Card */}
                        <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-xl border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                           <h3 className="mb-4 text-2xl font-semibold">Starter</h3>
                           <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Try out FORMI</p>
                           <div className="flex justify-center items-baseline my-8">
                              <span className="mr-2 text-5xl font-extrabold">$0</span>
                              <span className="text-gray-500 dark:text-gray-400">/month</span>
                           </div>
                           {/* List */}
                           <ul role="list" className="mb-8 space-y-4 text-left">
                              <li className="flex items-center space-x-3">
                                 {/* Icon */}
                                 <svg
                                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                                 <span>Individual configuration</span>
                              </li>
                              <li className="flex items-center space-x-3">
                                 {/* Icon */}
                                 <svg
                                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                                 <span>
                                    <span className="font-bold">3</span> audio file uploads
                                 </span>
                              </li>
                              <li className="flex items-center space-x-3">
                                 {/* Icon */}
                                 <svg
                                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                                 <span>
                                    {" "}
                                    <span className="font-bold">3</span> performances
                                 </span>
                              </li>
                              <li className="flex items-center space-x-3">
                                 {/* Icon */}
                                 <svg
                                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                                 <span>Unlimited dancers</span>
                              </li>
                              <li className="flex items-center space-x-3">
                                 {/* Icon */}
                                 <svg
                                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                                 <span>Visualize animations synced to music</span>
                              </li>
                              <li className="flex items-center space-x-3">
                                 {/* Icon */}
                                 <svg
                                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                                 <span>Permissions and sharing</span>
                              </li>
                           </ul>
                           <Link href="/login">
                              <button className="text-white bg-pink-600 mt-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900">
                                 Get started
                              </button>
                           </Link>
                        </div>
                        {/* Pricing Card */}
                        <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-xl border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                           <h3 className="mb-4 text-2xl font-semibold">Studio</h3>
                           <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">For dance studios, companies and teams</p>
                           <div className="flex justify-center items-baseline my-8">
                              <span className="mr-2 text-5xl font-extrabold">$74.99</span>
                              <span className="text-gray-500 dark:text-gray-400">/month</span>
                           </div>
                           {/* List */}
                           <ul role="list" className="mb-8 space-y-4 text-left">
                              {[
                                 "Everything in the free plan",
                                 "Unlimited performances",
                                 "Unlimited audio file uploads",
                                 "3D view",
                                 "Collision detection",
                                 "Video sync",
                                 "Curved dancer paths",
                                 "Upload custom stage background",
                                 "Upload avatar images",
                                 "Formation templates",
                                 "Export formations as PDF (Coming soon)",
                                 "Exclusive access to beta features",
                              ].map((featureDescription) => {
                                 return (
                                    <li className="flex items-center space-x-3">
                                       <svg
                                          className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                       >
                                          <path
                                             fillRule="evenodd"
                                             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                             clipRule="evenodd"
                                          />
                                       </svg>
                                       <span>{featureDescription}</span>
                                    </li>
                                 );
                              })}
                           </ul>

                           <button
                              onClick={() => {
                                 if (!session) {
                                    router.push("/login");
                                    return;
                                 }
                                 router.push("/api/checkout?price=price_1Mi4IGHvC3w6e8fcCEjk9RHL");
                              }}
                              className="text-white bg-pink-600 mt-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                           >
                              Start Trial
                           </button>
                        </div>
                        {/* Pricing Card */}
                        <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-xl border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                           <h3 className="mb-4 text-2xl font-semibold">Students & Educators</h3>
                           <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                              For dance students and educators associated with a university
                           </p>
                           <div className="flex justify-center items-baseline my-8">
                              <span className="mr-2 text-5xl font-extrabold">$24.99</span>
                              <span className="text-gray-500 dark:text-gray-400">/month</span>
                           </div>
                           {/* List */}
                           <ul role="list" className="mb-8 space-y-4 text-left">
                              <ul role="list" className="mb-8 space-y-4 text-left">
                                 {["Everything in the studio plan", `Must have a .edu email or contact us`].map((featureDescription) => {
                                    return (
                                       <li className="flex items-center space-x-3">
                                          <svg
                                             className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                             fill="currentColor"
                                             viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg"
                                          >
                                             <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                             />
                                          </svg>
                                          <span>{featureDescription}</span>
                                       </li>
                                    );
                                 })}
                              </ul>
                           </ul>
                           <button
                              onClick={() => {
                                 if (!session) {
                                    router.push("/login");
                                    return;
                                 }
                                 if (!session.user.email?.endsWith(".edu")) {
                                    toast.error("You do not have a university email, contact us if you are a student or educator");
                                    return;
                                 }
                                 router.push("/api/checkout?price=price_1MhxBWHvC3w6e8fcbQgxZh9o");
                              }}
                              className="text-white bg-pink-600 mt-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                           >
                              Start Trial
                           </button>
                        </div>
                     </div>
                  </div>
               </section>
            </div>
         </div>
         <Footer></Footer>
      </>
   );
};
export default home;
