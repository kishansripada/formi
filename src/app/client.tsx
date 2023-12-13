"use client";
import Link from "next/link";
import { Footer } from "./_components/Footer";
import { motion } from "framer-motion";
import { Header } from "./_components/Header";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "../../@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { HDivider } from "../../@/components/ui/hdivider";

const Client = () => {
   return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
         <div className="overflow-hidden flex flex-col items-center  ">
            <Header></Header>

            <div className=" w-full text-white pb-10  flex flex-col ">
               <motion.div
                  initial={{ opacity: 0, scale: 1, y: -25 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className=" mt-[50px] top-[170px] text-center flex flex-col items-center justify-center z-50 "
               >
                  <div className="rounded-full  px-5 text-xs font-medium  text-neutral-200 py-2 border border-neutral-700">
                     <p>Join 25,000+ dancers and choreographers</p>
                  </div>
                  <p className="lg:text-7xl  text-4xl font-light mt-5 lg:w-[60%] w-[90%]">
                     The{" "}
                     <span className="bg-gradient-to-r from-purple-500 to-pink-600 font-medium  bg-clip-text text-transparent">collaborative</span>{" "}
                     choreography design tool
                  </p>
                  <p className="text-neutral-400 mt-8 text-base lg:text-base max-w-xs lg:max-w-lg ">
                     Collaborate to plan formations and blocking for your performance, synced to music.
                  </p>

                  <Link href={"/login"} className=" mt-7">
                     <Button>
                        <div className=" lg:flex flex-row items-center justify-center hidden text-sm">
                           <span className="font-semibold">Get started</span>
                           <span className="px-1">—</span>
                           <span>it’s free</span>
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition"
                           >
                              <path
                                 fillRule="evenodd"
                                 d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                 clipRule="evenodd"
                              />
                           </svg>
                        </div>
                        <div className=" lg:text-base text-sm  flex-row items-center justify-around lg:hidden flex">Launch mobile web app</div>
                     </Button>
                  </Link>
               </motion.div>

               <div className="w-full flex flex-row justify-center mt-[0px] relative pointer-events-none select-none ">
                  {/* <div className=" lg:h-[800px] h-[200px] text-center  "> */}
                  <motion.img
                     initial={{ opacity: 0, scale: 0.8, y: 0 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     // transform: "perspective(500px) rotateX(10deg)"
                     transition={{ duration: 0.5 }}
                     className="z-10 w-[80%] relative mt-20 rounded-lg border border-neutral-700 "
                     src="/chromewindow.jpg"
                     alt=""

                     // https://res.cloudinary.com/dxavpfwki/image/upload/q_auto:low/v1695307271/IMG_0533_afnzcf.png
                  />

                  <div
                     className="pointer-events-none absolute left-[-1000px] top-0   h-[1000px] w-[1700px]"
                     style={{
                        //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        // right: -400,
                        top: -700,
                        // top: -150,

                        opacity: 0.2,
                     }}
                  ></div>
                  <div
                     className="pointer-events-none absolute right-[-1000px] top-0   h-[1000px] w-[1700px]"
                     style={{
                        //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #9333ea 0%, rgba(239, 255, 250, 0) 100%)",
                        // right: -400,
                        top: -200,
                        // top: -150,

                        opacity: 0.3,
                     }}
                  ></div>
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
                  <div
                     className="pointer-events-none absolute right-[-200px] top-0   h-[1000px] w-[1700px]"
                     style={{
                        //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #9333ea 0%, rgba(239, 255, 250, 0) 100%)",
                        // right: -400,
                        top: 1500,
                        right: -1000,
                        // top: -150,

                        opacity: 0.1,
                     }}
                  ></div>
                  <div
                     className="pointer-events-none absolute right-[-200px] top-0   h-[1000px] w-[1700px]"
                     style={{
                        //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #335BEA 0%, rgba(35, 77, 228, 0) 100%)",
                        // right: -400,
                        top: 1200,
                        left: -1000,
                        // top: -150,

                        opacity: 0.1,
                     }}
                  ></div>
               </div>
            </div>
            <HDivider></HDivider>
            <div className="py-24 text-center md:text-2xl text-base z-10 flex flex-col gap-1 pointer-events-none select-none ">
               <p className="text-neutral-400">Powering the world’s greatest performance teams. </p>
               <p>From small dance studios to established enterprises.</p>

               <div className="flex md:flex-row flex-col items-center justify-between w-full mt-10 gap-10 ">
                  {["disney.png", "miami-heat.png", "la-lakers.png", "florida-panthers.png"].map((image) => {
                     return (
                        <div className=" md:w-24 w-16">
                           <img src={"/trusted-by/" + image} alt="" />
                        </div>
                     );
                  })}
               </div>
            </div>
            <HDivider></HDivider>
            <div className="py-24 text-center items-center  z-10 flex flex-col gap-8 pointer-events-none select-none  ">
               <div className="md:w-[600px] px-4">
                  <p className="md:text-5xl text-2xl ">Unlike any tool you've used before</p>
                  <p className="text-neutral-400 mt-2 md:text-xl text-sm">
                     Designed to the last pixel and engineered with unforgiving precision, FORMI combines UI elegance with world-class performance.
                  </p>
               </div>

               <div className="flex md:flex-row md:items-start items-center flex-col  justify-between w-full mt-10 gap-36 ">
                  <div className="md:w-1/2 text-lg flex flex-col gap-3  text-neutral-300">
                     <div className="flex flex-row items-center gap-4">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-6 h-6"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
                           />
                        </svg>

                        <p>Three dimensional view</p>
                     </div>
                     <div className="flex flex-row items-center gap-4">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-6 h-6"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                           />
                        </svg>

                        <p>Collaborate in real-time</p>
                     </div>

                     <div className="flex flex-row items-center gap-4">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-6 h-6"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                           />
                        </svg>

                        <p>Leave comments</p>
                     </div>
                     <div className="flex flex-row items-center gap-4">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-6 h-6"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                           />
                        </svg>

                        <p>Sync to music</p>
                     </div>
                     <Link href={"/login"} className=" mt-36 pointer-events-auto mr-auto">
                        <Button>
                           <div className=" lg:flex flex-row items-center justify-center hidden text-sm">
                              <span className="font-semibold">Get started</span>
                              <span className="px-1">—</span>
                              <span>it’s free</span>
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20"
                                 fill="currentColor"
                                 className="w-5 h-5 ml-2 group-hover:translate-x-1 transition"
                              >
                                 <path
                                    fillRule="evenodd"
                                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                    clipRule="evenodd"
                                 />
                              </svg>
                           </div>
                           <div className=" lg:text-base text-sm  flex-row items-center justify-around lg:hidden flex">Launch mobile web app</div>
                        </Button>
                     </Link>
                  </div>
                  <div className="md:w-1/2">
                     <img src="/dalle_collab.png" className="w-[500px] rounded-md border border-neutral-700" alt="" />
                  </div>
               </div>
            </div>
            <HDivider></HDivider>

            <Footer></Footer>
         </div>
      </ThemeProvider>
   );
};
export default Client;
