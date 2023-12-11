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
         <>
            <div className="overflow-hidden flex flex-col items-center bg-neutral-900 ">
               <Header></Header>
               <div className=" w-full text-white pb-10  flex flex-col ">
                  <motion.div
                     initial={{ opacity: 0, scale: 1, y: -25 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     transition={{ duration: 0.5 }}
                     className=" mt-[50px] top-[170px] text-center flex flex-col items-center justify-center z-50 "
                  >
                     <div className="rounded-full  px-5 text-xs font-medium  text-neutral-200 py-2 border border-neutral-700">
                        <p>Join 10,000+ dancers and choreographers</p>
                     </div>
                     <p className="lg:text-7xl  text-4xl font-light mt-5 lg:w-[60%] w-[90%]">
                        The{" "}
                        <span className="bg-gradient-to-r from-purple-500 to-pink-600 font-medium  bg-clip-text text-transparent">collaborative</span>{" "}
                        choreography design tool
                     </p>
                     <p className="text-neutral-300 mt-8 text-base lg:text-base max-w-xs lg:max-w-lg ">
                        Collaborate to plan formations and blocking for all types of choreography, synced to music.
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

                     {/* <div className=" bg-white text-black whitespace-nowrap px-6  group  z-50 relative py-2 lg:py-3 rounded-full mt-10 pointer-events-auto">
                     <Link href={"/login"} className=" ">
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
                     </Link>
                  </div> */}
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
                     {/* <Image fill={true} objectFit="contain" className="w-2/3 z-10 relative " src="/desktop.png" alt="" /> */}
                     {/* </div> */}

                     {/* <div
                     className="pointer-events-none absolute left-1/2 hidden lg:block  -translate-x-1/2  h-[1000px] w-[1700px]"
                     style={{
                        //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        //    right: -400,
                        //    top: -400,
                        top: -150,
                        opacity: 0.7,
                     }}
                  ></div> */}
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
                  </div>
               </div>
               <HDivider></HDivider>
               <div className="py-24 text-center text-2xl z-10 flex flex-col gap-1 pointer-events-none select-none ">
                  <p className="text-neutral-400">Powering the world’s greatest performance teams. </p>
                  <p>From small dance studios to established enterprises.</p>

                  <div className="flex md:flex-row flex-col items-center justify-between w-full mt-10 gap-10 ">
                     {["disney.png", "miami-heat.png", "la-lakers.png", "florida-panthers.png"].map((image) => {
                        return (
                           <div className=" w-24">
                              <img src={"/trusted-by/" + image} alt="" />
                           </div>
                        );
                     })}
                  </div>
               </div>
               <HDivider></HDivider>

               {/* <div className="lg:h-40 w-full bg-neutral-900 flex lg:flex-row flex-col justify-center py-20  gap-10  ">
                  <img
                     className="   h-full opacity-80 object-cover"
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/1200px-Los_Angeles_Lakers_logo.svg.png"
                     alt=""
                  />
                  <img
                     className="   h-full opacity-80 object-cover"
                     src="https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Florida_Panthers_2016_logo.svg/1200px-Florida_Panthers_2016_logo.svg.png"
                     alt=""
                  />
                  <img
                     className="   h-full opacity-80 object-cover"
                     src="https://upload.wikimedia.org/wikipedia/en/thumb/f/fb/Miami_Heat_logo.svg/1200px-Miami_Heat_logo.svg.png"
                     alt=""
                  />
                  <img
                     className="   h-full opacity-80 object-cover"
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Disney_wordmark.svg/1200px-Disney_wordmark.svg.png"
                     alt=""
                  />
               </div> */}

               <Footer></Footer>
            </div>
         </>
      </ThemeProvider>
   );
};
export default Client;
