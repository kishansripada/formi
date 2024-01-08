"use client";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "../_components/Footer";
import { Header } from "../_components/Header";
import { ColorSplotch } from "../../../@/components/ui/color-splotch";
import { HDivider } from "../../../@/components/ui/hdivider";

const Client = () => {
   return (
      <>
         <Header></Header>
         <HDivider></HDivider>
         <div className="  flex flex-col items-center relative ">
            <div className=" z-10  w-full text-white  relative flex flex-col justify-center items-center  ">
               <div className="  text-center flex flex-col items-center justify-center z-50  ">
                  <p className="text-center tracking-widest text-pink-500 mt-24 font-bold">PRICING</p>
                  <p className="  lg:text-6xl  text-2xl font-semibold  w-full  ">Want more performances?</p>
                  <p className="  lg:text-xl  text-xl font-semibold  w-full mt-5  ">Early Bird Pricing</p>
               </div>
               <div className="lg:max-w-5xl  w-full mt-24  lg:h-[450px] mb-52 ">
                  <div className="flex lg:flex-row flex-col h-full justify-center w-full ">
                     <div className=" border border-neutral-800 rounded-xl w-1/3 mx-3 py-5 px-6  flex flex-col  ">
                        <div className="flex flex-row justify-between items-center">
                           <p className="text-emerald-300 font-medium ">Starter</p>
                        </div>
                        <p className="text-4xl mt-3 font-medium">Free</p>
                        <p className="text-sm mt-1 font-medium">no credit card required</p>
                        <div className="mt-3">
                           {["Up to three performances"].map((text) => {
                              return (
                                 <div className="flex flex-row items-center mt-3">
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                       className="w-4 h-4 mr-2 stroke-emerald-300"
                                    >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>

                                    <p className="text-sm text-neutral-300">{text}</p>
                                 </div>
                              );
                           })}
                        </div>
                        <button className="w-full mt-auto bg-neutral-600 py-2 text-sm bg-opacity-30 rounded-md">Get started for free </button>
                     </div>
                     <div className=" border-2 border-pink-500 rounded-xl w-1/3 mx-3 py-5 px-6  flex flex-col  ">
                        <div className="flex flex-row justify-between items-center">
                           <p className="text-pink-500 font-medium ">Choreographer</p>
                        </div>
                        <p className="text-4xl mt-3 font-medium">$4.99</p>
                        <p className="text-sm mt-1 font-medium">per month</p>
                        <div className="mt-3">
                           {[
                              "Unlimited performances",
                              "Unlimited media uploads",
                              "Export PDF",
                              "Access to 100+ curated formation templates",
                              "Save roster",
                           ].map((text) => {
                              return (
                                 <div className="flex flex-row items-center mt-3">
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                       className="w-4 h-4 mr-2 stroke-pink-500"
                                    >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>

                                    <p className="text-sm text-neutral-300">{text}</p>
                                 </div>
                              );
                           })}
                        </div>
                        <a
                           href={"/upgrade/checkout/price_1ODBDgHvC3w6e8fcLHwIA71e"}
                           //    onClick={() => {
                           //       if (!session) {
                           //          router.push("/login");
                           //          return;
                           //       }
                           //       router.push("/api/checkout?price=price_1MvAZ0HvC3w6e8fc2IPfCFJS");
                           //    }}
                           // prefetch={true}
                           className="w-full mt-auto bg-pink-500 py-2 text-sm  text-center rounded-md"
                        >
                           Get Started
                        </a>
                     </div>
                     <div className=" border border-neutral-800 rounded-xl w-1/3 mx-3 py-5 px-6  flex flex-col  ">
                        <div className="flex flex-row justify-between items-center">
                           <p className="text-blue-300 font-medium ">Studio</p>
                        </div>
                        <p className="text-4xl mt-3 font-medium">$4</p>
                        <p className="text-sm mt-1 font-medium">per editor/month</p>
                        <div className="mt-3">
                           {[
                              // "Everything in choreographer",
                              // "Shared performances and assets",
                              "Minimum 2 editors",
                              "Collaborative editing",
                              "Org-wide libraries",

                              "Accounts for you and your team",
                              "Unified admin and billing",
                           ].map((text) => {
                              return (
                                 <div className="flex flex-row items-center mt-3">
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                       className="w-4 h-4 mr-2 stroke-blue-300"
                                    >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>

                                    <p className="text-sm text-neutral-400">{text}</p>
                                 </div>
                              );
                           })}
                        </div>
                        <a
                           href="mailto:inquiries@formistudio.app"
                           className="w-full mt-auto bg-neutral-600 py-2 flex flex-row justify-center text-sm bg-opacity-30 rounded-md"
                        >
                           Contact us
                        </a>
                        <p className="text-center text-xs text-neutral-300 mt-2">inquiries@formistudio.app</p>
                     </div>
                     {/* <div className=" border border-neutral-800 rounded-xl w-1/3 mx-3 py-5 px-6  flex flex-col  ">
                        <div className="flex flex-row justify-between items-center">
                           <p className="text-blue-300 font-medium ">Get lifetime access</p>
                        </div>
                        <p className="text-4xl mt-3 font-medium">Free</p>
                        <p className="text-sm mt-1 font-medium">Get 5000+ likes</p>
                        <div className="mt-3">
                           {[
                              "Make a post on TikTok or Instagram",
                              "Promote FORMI in the post",
                              "Tag @formi.dance",
                              "Get 5000+ likes",
                              "Send us a link to your post",
                              "Get lifetime access to Choreography tier",
                           ].map((text) => {
                              return (
                                 <div className="flex flex-row items-center mt-3">
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                       className="w-4 h-4 mr-2 stroke-blue-300"
                                    >
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>

                                    <p className="text-xs text-neutral-400">{text}</p>
                                 </div>
                              );
                           })}
                        </div>
                        <button className="w-full mt-auto bg-neutral-600 py-2 text-sm bg-opacity-30 rounded-md">Contact us</button>
                     </div> */}
                  </div>
               </div>
               <p className="text-5xl">All features included for free</p>
               <div className="w-2/3 grid grid-cols-4 py-20">
                  {[
                     "Synced to video or audio",
                     // "Export PDF",
                     `Assign performer "props"`,
                     "Custom stage background",
                     "Custom set pieces",
                     "Collision detection",
                     "Commenting",
                     "Real-time collaboration",
                     "3D view",
                     "Number line",
                     "Custom stage size and format",
                     "Custom dancer shapes",
                     "Manage collaborators",
                     "Formation notes",
                  ].map((text) => {
                     return (
                        <div className="flex flex-row items-center mt-3">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 mr-2 stroke-blue-300"
                           >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                           </svg>

                           <p className="text-sm text-neutral-300">{text}</p>
                        </div>
                     );
                  })}
               </div>
            </div>

            {/* <div
               className="pointer-events-none absolute left-[-1000px] top-0   h-[1000px] w-[1700px]"
               style={{
                  //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                  backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                  // right: -400,
                  top: -700,
                  // top: -150,

                  opacity: 0.2,
               }}
            ></div> */}
            {/* <div
               className="pointer-events-none absolute right-[-1000px] top-0   h-[1000px] w-[1700px]"
               style={{
                  //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                  backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #9333ea 0%, rgba(239, 255, 250, 0) 100%)",
                  // right: -400,
                  top: -200,
                  // top: -150,

                  opacity: 0.3,
               }}
            ></div> */}

            <div
               className="pointer-events-none absolute right-[-200px] top-0   h-[1000px] w-[1700px]"
               style={{
                  //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                  backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #9333ea 0%, rgba(239, 255, 250, 0) 100%)",
                  // right: -400,
                  top: 500,
                  // top: -150,

                  opacity: 0.1,
               }}
            ></div>
            <ColorSplotch
               style={{
                  right: -100,
                  top: -600,
                  opacity: 0.1,
               }}
               color={"#FEA3E5"}
            ></ColorSplotch>
            {/* FOOTER */}
            <div className="w-full h-[1px] dark:bg-neutral-700 bg-neutral-300"></div>
            <Footer></Footer>
         </div>
      </>
   );
};
export default Client;
