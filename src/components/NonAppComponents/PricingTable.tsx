import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

export const PricingTable = () => {
   let session = useSession();
   const router = useRouter();
   return (
      <>
         <div className=" ">
            <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
            <div className="bg-[#fafafa] dark:bg-neutral-800 flex flex-col justify-center font-proxima ">
               <section className="bg-white  dark:bg-neutral-900">
                  <div className="py-8 px-4 mx-auto max-w-screen-lg lg:py-16 lg:px-6">
                     <div className="mx-auto   mb-8 lg:mb-12">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-neutral-900 dark:text-neutral-100 ">
                           For individuals, it's free...
                        </h2>
                     </div>
                     <div className="flex flex-row  ">
                        <div className="flex flex-col px-14 py-10  flex-grow   text-neutral-900 bg-white dark:bg-neutral-800 rounded-xl border dark:border-neutral-600 border-neutral-100 shadow mr-5 lg:w-1/2 ">
                           <h3 className="mb-4 text-2xl font-semibold dark:text-neutral-100">Free</h3>
                           <p className=" text-neutral-500 text-sm dark:text-neutral-300 ">
                              Not just a trial, but everything any individual choreographer could need.
                           </p>
                           <div className="flex items-baseline my-8">
                              <span className="mr-2 text-4xl font-extrabold dark:text-neutral-100">Yes, free</span>
                           </div>
                           {/* List */}
                           <ul role="list" className="mb-8  text-left">
                              {[
                                 "Unlimited performances",
                                 "Unlimited audio file uploads",
                                 "Collision detection",
                                 "Video sync",
                                 "Stage commenting",
                                 // "Curved dancer paths",
                                 // "Upload custom stage background",
                                 // "Formation templates",
                                 // "Formation categories",
                                 // "Custom dancer heights",
                                 "Export PDF",
                              ].map((featureDescription) => {
                                 return (
                                    <li className="flex items-center space-x-3 text-sm mb-3">
                                       <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="flex-shrink-0 w-5 h-5 text-pink-600 "
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                       </svg>
                                       <span className="dark:text-neutral-100">{featureDescription}</span>
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
                                 router.push("/api/checkout?price=price_1MvAZ0HvC3w6e8fc2IPfCFJS");
                              }}
                              className="text-white bg-pink-600 mt-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                           >
                              Create a free account
                           </button>
                        </div>
                        {/* Pricing Card */}

                        <div className="flex flex-col px-14 py-10  flex-grow   text-neutral-900 bg-white dark:bg-neutral-800 rounded-xl border dark:border-neutral-600 border-neutral-100 shadow ml-5 lg:w-1/2 ">
                           <h3 className="mb-4 text-2xl font-semibold dark:text-neutral-100">Enterprise</h3>
                           <p className="font-light text-neutral-500  dark:text-neutral-300 text-sm ">
                              For professional dance teams looking for priority support and collaborative features
                           </p>
                           <div className="flex  items-baseline my-8">
                              <span className="mr-2 text-4xl font-extrabold dark:text-neutral-100">$599</span>
                              <span className="text-neutral-500 dark:text-neutral-300 ">/month</span>
                           </div>
                           {/* List */}
                           <ul role="list" className="mb-8  text-left">
                              {["Team sharing", "Collaborative editing", "Custom watermark", "Custom branding", "Priority support"].map(
                                 (featureDescription) => {
                                    return (
                                       <li className="flex items-center mb-3 text-sm space-x-3">
                                          <svg
                                             xmlns="http://www.w3.org/2000/svg"
                                             fill="none"
                                             viewBox="0 0 24 24"
                                             strokeWidth={1.5}
                                             stroke="currentColor"
                                             className="flex-shrink-0 w-5 h-5 text-pink-600 "
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                             />
                                          </svg>

                                          <span className="dark:text-neutral-100">{featureDescription}</span>
                                       </li>
                                    );
                                 }
                              )}
                           </ul>

                           <button
                              onClick={() => {
                                 // if (!session) {
                                 //    router.push("/login");
                                 //    return;
                                 // }
                                 // router.push("/api/checkout?price=price_1MvAZ0HvC3w6e8fc2IPfCFJS");
                              }}
                              className="text-white bg-pink-600 mt-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                           >
                              Contact Us
                           </button>
                        </div>
                     </div>
                  </div>
               </section>
            </div>
         </div>
      </>
   );
};
