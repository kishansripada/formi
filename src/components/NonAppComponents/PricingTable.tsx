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
                  <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                     <div className="mx-auto  text-center mb-8 lg:mb-12">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-neutral-900 dark:text-neutral-100 ">
                           Join 5000+ choreographers that use FORMI to perfect their formations
                        </h2>
                     </div>
                     <div className="flex flex-row ">
                        {/* Pricing Card */}

                        <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-neutral-900 bg-white dark:bg-neutral-800 rounded-xl border dark:border-neutral-600 border-neutral-100 shadow   lg:w-1/3 ">
                           <h3 className="mb-4 text-2xl font-semibold dark:text-neutral-100">Students & Educators</h3>
                           <p className="font-light text-neutral-500 sm:text-lg dark:text-neutral-300 ">For dance students and educators</p>
                           <div className="flex justify-center items-baseline my-8">
                              <span className="mr-2 text-5xl font-extrabold dark:text-neutral-100">$9</span>
                              <span className="text-neutral-500 dark:text-neutral-300 ">/month</span>
                           </div>
                           {/* List */}
                           <ul role="list" className="mb-8 space-y-4 text-left">
                              <ul role="list" className="mb-8 space-y-4 text-left">
                                 {[`Must have a .edu email or contact us`, "Unlimited performances", "Unlimited audio file uploads"].map(
                                    (featureDescription) => {
                                       return (
                                          <li className="flex items-center space-x-3">
                                             <svg
                                                className="flex-shrink-0 w-5 h-5 text-green-500 "
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
                                             <span className="dark:text-neutral-100">{featureDescription}</span>
                                          </li>
                                       );
                                    }
                                 )}
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
                                 router.push("/api/checkout?price=price_1MpZJ8HvC3w6e8fc5vvXIhAo");
                              }}
                              className="text-white bg-pink-600 mt-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                           >
                              Start 7 Day Trial
                           </button>
                        </div>
                        {/* Pricing Card */}
                        <div className="flex flex-col p-6  max-w-lg text-center text-neutral-900 bg-white dark:bg-neutral-800 rounded-xl border dark:border-neutral-600 border-neutral-100 shadow mx-3  lg:w-1/3 ">
                           <h3 className="mb-4 text-2xl font-semibold dark:text-neutral-100">Choreographer</h3>
                           <p className="font-light text-neutral-500 sm:text-lg dark:text-neutral-300 ">For individual choreographers</p>
                           <div className="flex justify-center items-baseline my-8">
                              <span className="mr-2 text-5xl font-extrabold dark:text-neutral-100">$29</span>
                              <span className="text-neutral-500 dark:text-neutral-300 ">/month</span>
                           </div>
                           {/* List */}
                           <ul role="list" className="mb-8 space-y-4 text-left">
                              {[
                                 "Unlimited performances",
                                 "Unlimited audio file uploads",
                                 // "Collision detection",
                                 // "Video sync",
                                 // "Stage commenting",
                                 // "Curved dancer paths",
                                 // "Upload custom stage background",
                                 // "Formation templates",
                                 // "Formation categories",
                                 // "Custom dancer heights",
                              ].map((featureDescription) => {
                                 return (
                                    <li className="flex items-center space-x-3">
                                       <svg
                                          className="flex-shrink-0 w-5 h-5 text-green-500 "
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
                                 router.push("/api/checkout?price=price_1MpZIwHvC3w6e8fce8EzvFn8");
                              }}
                              className="text-white bg-pink-600 mt-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                           >
                              Start 7 Day Trial
                           </button>
                        </div>
                        {/* Pricing Card */}

                        <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-neutral-900 bg-white dark:bg-neutral-800 rounded-xl border dark:border-neutral-600 border-neutral-100 shadow   lg:w-1/3 ">
                           <h3 className="mb-4 text-2xl font-semibold dark:text-neutral-100">Studio</h3>
                           <p className="font-light text-neutral-500 sm:text-lg dark:text-neutral-300 ">For dance studios, companies and teams</p>
                           <div className="flex justify-center items-baseline my-8">
                              <span className="mr-2 text-5xl font-extrabold dark:text-neutral-100">$99</span>
                              <span className="text-neutral-500 dark:text-neutral-300 ">/month</span>
                           </div>
                           {/* List */}
                           <ul role="list" className="mb-8 space-y-4 text-left">
                              <ul role="list" className="mb-8 space-y-4 text-left">
                                 {[
                                    "Everything in the choreographer plan",
                                    "Collaborative editing",
                                    `10 individual choreography accounts`,
                                    `Priority support`,
                                 ].map((featureDescription) => {
                                    return (
                                       <li className="flex items-center space-x-3">
                                          <svg
                                             className="flex-shrink-0 w-5 h-5 text-green-500 "
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
                                          <span className="dark:text-neutral-100">{featureDescription}</span>
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

                                 router.push("/api/checkout?price=price_1MpZLNHvC3w6e8fcTPQIBkZm");
                              }}
                              className="text-white bg-pink-600 mt-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                           >
                              Start 7 Day Trial
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
