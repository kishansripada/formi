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
            <div className="bg-[#fafafa]  flex flex-col justify-center font-proxima ">
               <section className="bg-white ">
                  <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                     <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 ">
                           Join thousands that use FORMI to master their stage presence
                        </h2>
                     </div>
                     <div className="space-y-8 lg:grid lg:grid-cols-4 sm:gap-6 xl:gap-5 lg:space-y-0">
                        {/* Pricing Card */}
                        <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-xl border border-gray-100 shadow  xl:p-8 ">
                           <h3 className="mb-4 text-2xl font-semibold">Starter</h3>
                           <p className="font-light text-gray-500 sm:text-lg ">Try out FORMI</p>
                           <div className="flex justify-center items-baseline my-8">
                              <span className="mr-2 text-5xl font-extrabold">$0</span>
                              <span className="text-gray-500 ">/month</span>
                           </div>
                           {/* List */}
                           <ul role="list" className="mb-8 space-y-4 text-left">
                              <li className="flex items-center space-x-3">
                                 {/* Icon */}
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
                                 <span>Individual configuration</span>
                              </li>
                              <li className="flex items-center space-x-3">
                                 {/* Icon */}
                                 <svg
                                    className="flex-shrink-0 w-5 h-5 text-green-500"
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
                                    <span className="font-bold">1</span> audio file upload
                                 </span>
                              </li>
                              <li className="flex items-center space-x-3">
                                 {/* Icon */}
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
                                 <span>
                                    {" "}
                                    <span className="font-bold">2</span> performances
                                 </span>
                              </li>
                              <li className="flex items-center space-x-3">
                                 {/* Icon */}
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
                                 <span>Unlimited dancers</span>
                              </li>
                              <li className="flex items-center space-x-3">
                                 {/* Icon */}
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
                                 <span>Visualize animations synced to music</span>
                              </li>
                              <li className="flex items-center space-x-3">
                                 {/* Icon */}
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
                                 <span>Permissions and sharing</span>
                              </li>
                           </ul>
                           <Link href="/login">
                              <button className="text-white bg-pink-600 mt-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                                 Get started
                              </button>
                           </Link>
                        </div>
                        <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-xl border border-gray-100 shadow  xl:p-8 ">
                           <h3 className="mb-4 text-2xl font-semibold">Students & Teachers</h3>
                           <p className="font-light text-gray-500 sm:text-lg ">For dance students and educators </p>
                           <div className="flex justify-center items-baseline my-8">
                              <span className="mr-2 text-5xl font-extrabold">$10</span>
                              <span className="text-gray-500 ">/month</span>
                           </div>
                           {/* List */}
                           <ul role="list" className="mb-8 space-y-4 text-left">
                              <ul role="list" className="mb-8 space-y-4 text-left">
                                 {["Everything in the studio plan", `Must have a .edu email or contact us`].map((featureDescription) => {
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
                                 router.push("/api/checkout?price=price_1Mi7thHvC3w6e8fcinMUgaZn");
                              }}
                              className="text-white bg-pink-600 mt-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                           >
                              Start 7 Day Trial
                           </button>
                        </div>
                        {/* Pricing Card */}
                        <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-xl border border-gray-100 shadow  xl:p-8 ">
                           <h3 className="mb-4 text-2xl font-semibold">Studio</h3>
                           <p className="font-light text-gray-500 sm:text-lg ">For dance studios, companies and teams</p>
                           <div className="flex justify-center items-baseline my-8">
                              <span className="mr-2 text-5xl font-extrabold">$50</span>
                              <span className="text-gray-500 ">/month</span>
                           </div>
                           {/* List */}
                           <ul role="list" className="mb-8 space-y-4 text-left">
                              {[
                                 "Unlimited performances",
                                 "Unlimited audio file uploads",
                                 "Collision detection",
                                 "Video sync",
                                 "Stage commenting",
                                 "Curved dancer paths",
                                 "Upload custom stage background",
                                 "Formation templates",
                                 "Formation categories",
                                 "Custom dancer heights",
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
                                 router.push("/api/checkout?price=price_1Mi7wXHvC3w6e8fclZq1OsNA");
                              }}
                              className="text-white bg-pink-600 mt-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                           >
                              Start 7 Day Trial
                           </button>
                        </div>
                        <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-xl border border-gray-100 shadow  xl:p-8 ">
                           <h3 className="mb-4 text-2xl font-semibold">Enterprise</h3>
                           <p className="font-light text-gray-500 sm:text-lg ">For cooperate dance teams</p>
                           <div className="flex justify-center items-baseline my-8">
                              <span className="mr-2 text-5xl font-extrabold">$199</span>
                              <span className="text-gray-500 ">/month</span>
                           </div>
                           {/* List */}
                           <ul role="list" className="mb-8 space-y-4 text-left">
                              <ul role="list" className="mb-8 space-y-4 text-left">
                                 {["Everything in the studio plan", `Must have a .edu email or contact us`].map((featureDescription) => {
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
                                 router.push("/api/checkout?price=price_1Mi7thHvC3w6e8fcinMUgaZn");
                              }}
                              className="text-white bg-pink-600 mt-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                           >
                              Start 7 Day Trial
                           </button>
                        </div>
                        {/* Pricing Card */}
                     </div>
                  </div>
               </section>
            </div>
         </div>
      </>
   );
};
