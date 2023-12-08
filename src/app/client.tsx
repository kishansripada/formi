"use client";
import Link from "next/link";
import { Footer } from "./_components/Footer";
import { motion } from "framer-motion";
import { Header } from "./_components/Header";
import { useSession } from "@supabase/auth-helpers-react";
import Image from "next/image";

const Client = () => {
   return (
      <>
         <div className="overflow-hidden  bg-neutral-50 flex flex-col items-center ">
            <Header></Header>
            <div className="bg-neutral-950 w-full text-white   flex flex-col ">
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
                  <p className="text-neutral-400 mt-8 text-base lg:text-base max-w-xs lg:max-w-lg ">
                     Collaborate to plan formations and blocking for all types of choreography, synced to music.
                  </p>
                  <div className=" bg-white text-black whitespace-nowrap px-6  group  z-50 relative py-2 lg:py-3 rounded-full mt-10 pointer-events-auto">
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
                  </div>
               </motion.div>

               <div className="w-full flex flex-row justify-center mt-[0px] relative ">
                  {/* <div className=" lg:h-[800px] h-[200px] text-center  "> */}
                  <motion.img
                     initial={{ opacity: 0, scale: 0.8, y: 0 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     // transform: "perspective(500px) rotateX(10deg)"
                     transition={{ duration: 0.5 }}
                     className="z-10 w-[80%] relative mt-20 rounded-lg "
                     src="/hellacompressed.jpg"
                     alt=""
                  />
                  {/* <div className="w-[80%] mt-20 relative rounded-lg overflow-hidden z-10 ">
                     <Image
                        alt="Mountains"
                        src={"/chromewindow.jpg"}
                        // placeholder="blur"
                        // width={1000}
                        quality={100}
                        fill
                        // sizes="100vw"
                        style={{
                           objectFit: "cover",
                           // width: "80%",
                        }}
                     />
                  </div> */}

                  {/* // https://res.cloudinary.com/dxavpfwki/image/upload/q_auto:low/v1695307271/IMG_0533_afnzcf.png */}
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
               </div>

               {/* <div id="features" className="flex flex-col justify-center items-center py-20">
                  <p className="lg:text-7xl text-3xl mb-24 ">Edit formations on the go</p>
                  <div className="flex lg:flex-row  lg:px-24 flex-col items-center">
                     {" "}
                     <img
                        className="rounded-xl w-1/2"
                        src="https://res.cloudinary.com/dxavpfwki/image/upload/q_auto:eco/v1693416380/IMG_8303_kk6to4.png"
                        alt="w-1/2"
                     />
                     <img
                        className="w-1/2"
                        src="https://res.cloudinary.com/dxavpfwki/image/upload/q_auto:eco/v1693484313/IMG_5131_zbj7c0.png"
                        alt=""
                     />
                  </div>
               </div>
               <div className="flex flex-col justify-center items-center py-40">
                  <p className="lg:text-7xl text-3xl mb-24 font-light">Collaborate in real-time</p>
                  <img className="rounded-xl xl:max-w-4xl max-w-md" src="/realtime.png" alt="" />
               </div> */}
               <div className="flex flex-row items-center justify-center py-20 gap-10">
                  <div className="flex flex-col items-center justify-center gap-3">
                     <img className="w-72 rounded-lg" src="/ballet.webp" alt="" />
                     <p className="text-neutral-200  text-lg">Ballet</p>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3">
                     <img className="w-72 rounded-lg" src="/umich.webp" alt="" />
                     <p className="text-neutral-200  text-lg">Cheerleading</p>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3">
                     <img className="w-72 rounded-lg" src="/theater.webp" alt="" />
                     <p className="text-neutral-200  text-lg">Stage Management</p>
                  </div>
               </div>
               <div className="flex lg:flex-row flex-col px-[15%] rounded-lg py-10 h-[500px] gap-10  ">
                  <div className="lg:w-1/2 flex flex-row justify-center">
                     <img className="max-h-full max-w-full object-contain rounded-lg block" src="/collabKorean.webp" alt="" />
                  </div>
                  <div className="lg:w-1/2 flex flex-col justify-center gap-3">
                     <p className="font-medium text-4xl">Collaborate</p>
                     <p className="text-neutral-400">
                        Collaborate on the same choreography file in real-time, just like Google Docs. Let all your dancers watch changes to their
                        choreography live.
                     </p>
                  </div>
               </div>
               <div className="flex lg:flex-row flex-col px-[15%] rounded-lg py-10 h-[500px] gap-10 ">
                  <div className="lg:w-1/2 flex flex-col justify-center gap-3">
                     <p className="font-medium text-4xl">Cheerleading</p>
                     <p className="text-neutral-400">
                        Design dynamic routines, keep track of eight counts and plan all formations seamlessly. FORMI ensures your squad shines
                        brighter than ever. Elevate your performance, one move at a time.{" "}
                     </p>
                  </div>
                  <div className="lg:w-1/2 flex flex-row justify-center">
                     <img className="max-h-full max-w-full object-contain rounded-lg block" src="/umich.webp" alt="" />
                  </div>
               </div>
            </div>

            <p className="text-center font-bold text-3xl mt-12 ">Trusted by</p>
            <div className="lg:h-40 w-1/4  lg:w-full bg-neutral-50 flex lg:flex-row flex-col justify-center py-10  gap-10  ">
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
            </div>
            <div className="bg-neutral-50  lg:px-0 px-7 w-full  ">
               <div className="flex lg:flex-row flex-col items-center mx-auto max-w-[1000px] py-8 w-full ">
                  <div className="lg:w-1/2 w-[90%]">
                     <p className="text-3xl font-bold ">Collaborate, communicate</p>
                     <p className="text-lg mt-6 lg:w-[80%] text-neutral-500 ">
                        Directly add comments and annotations on the stage, making collaboration among team members easier and more efficient. Make
                        FORMI a central platform for discussion and feedback, streamlining the choreography process.
                     </p>
                  </div>

                  <div className="lg:w-1/2 w-[90%]">
                     <video
                        autoPlay
                        muted
                        src="/commentdemo.mp4"
                        loop
                        className=" lg:ml-auto lg:w-[90%] border border-neutral-200 rounded-xl relative"
                     />
                  </div>
               </div>
            </div>

            <div className="bg-neutral-50  w-full  font-proxima lg:px-0 px-7">
               <div className="flex lg:flex-row flex-col-reverse items-center mx-auto max-w-[1000px] py-8 w-full ">
                  <div className="lg:w-1/2 w-[90%]">
                     <video
                        autoPlay
                        muted
                        src="/curveDemo.mp4"
                        loop
                        className=" lg:mr-auto lg:w-[90%] border border-neutral-200 rounded-xl relative"
                     />
                  </div>
                  <div className="lg:w-1/2 w-[90%] ">
                     <div className="lg:w-[90%] mx-auto">
                        <p className="text-3xl font-bold ">Complex dancer paths</p>
                        <p className="text-lg mt-6  text-neutral-500 ">
                           Our non-linear path feature lets you plan complex formations with ease, making your choreography process smoother and more
                           efficient. Say goodbye to old-fashioned, complicated methods and hello to modern, streamlined choreography.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="   lg:flex flex-col items-center justify-center  hidden py-10  ">
               <div className=" grid grid-cols-4 place-items-center child:mx-8   child:my-8  select-none opacity-60 ">
                  <img
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cornell_University_logo.svg/1280px-Cornell_University_logo.svg.png"
                     className=" w-48  transition duration-500"
                     alt=""
                  />
                  <img
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/University_of_Michigan_logo.svg/2560px-University_of_Michigan_logo.svg.png"
                     className=" w-44  transition duration-500"
                     alt=""
                  />

                  <img
                     src=" https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/University_of_California%2C_Berkeley_logo.svg/2560px-University_of_California%2C_Berkeley_logo.svg.png
               "
                     className=" w-32 transition duration-500"
                     alt=""
                  />
                  <img
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/University_of_Texas_at_Austin_logo.svg/1280px-University_of_Texas_at_Austin_logo.svg.png
               "
                     className=" w-32  transition duration-500"
                     alt=""
                  />
                  <img
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Virginia_Tech_logo.svg/400px-Virginia_Tech_logo.svg.png
               "
                     className=" w-36  transition duration-500"
                     alt=""
                  />
                  <img
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/UT_Knoxville_logo_left.svg/440px-UT_Knoxville_logo_left.svg.png
               "
                     className=" w-40  transition duration-500"
                     alt=""
                  />
                  <img
                     src="https://upload.wikimedia.org/wikipedia/en/thumb/5/58/NYU_logo.svg/440px-NYU_logo.svg.png
               "
                     className=" w-48  transition duration-500"
                     alt=""
                  />
                  <img
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/North_Carolina_State_University_logo.svg/480px-North_Carolina_State_University_logo.svg.png
               "
                     className=" w-48 transition duration-500"
                     alt=""
                  />
               </div>
            </div>

            <div className="w-full h-[1px]  bg-neutral-300"></div>
            <Footer></Footer>
         </div>
      </>
   );
};
export default Client;
