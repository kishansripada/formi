import Link from "next/link";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "../components/NonAppComponents/Header";
import { Footer } from "../components/NonAppComponents/Footer";
import Image from "next/image";

const home = () => {
   return (
      <>
         <Head>
            <title>FORMI: the collaborative whiteboard for choreographers.</title>
            <meta
               name="description"
               content="Dance formation and choreography app. Easily build, create and visualize your dance and cheer formations synced to music. FORMI is the ultimate choreographer formation tool."
            />
            <meta
               name="keywords"
               content="dance, choreography, choreographer, formations, cheer, cheerleading, formation building tool, dance formation app, color guard, color guard app, dance formation maker, app for dance formations, formation app for dance"
            />
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

         <div className="overflow-hidden relative ">
            <div className="absolute w-[1000px] opacity-50  h-[500px] left-0  -translate-x-1/2  -z-[100] top-[100px]">
               <div
                  style={{
                     backgroundImage:
                        "radial-gradient(ellipse 1000px 500px at center, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%)",
                  }}
                  className="absolute w-[1000px] h-[500px] top-0 left-0 bottom-0 right-0"
               ></div>
               <div
                  className="flex flex-row h-full justify-between rounded-xl -z-[100] relative  "
                  style={{
                     width: 1000,
                  }}
               >
                  {new Array(25).fill(0).map((_, i) => (
                     <div
                        key={i}
                        className={`h-full bg-neutral-300 `}
                        style={{
                           width: 1,
                        }}
                     ></div>
                  ))}
               </div>
               <div
                  className="flex flex-col justify-between  rounded-xl relative -z-[100]  "
                  style={{
                     height: 500,
                     top: -500,
                  }}
               >
                  {new Array(12).fill(0).map((_, i) => (
                     <div
                        key={i}
                        className={`w-full  bg-neutral-300 `}
                        style={{
                           height: 1,
                        }}
                     ></div>
                  ))}
               </div>
            </div>

            <div className="absolute w-[1000px] opacity-50  h-[500px] right-0  translate-x-1/2  -z-[100] top-[100px]">
               <div
                  style={{
                     backgroundImage:
                        "radial-gradient(ellipse 1000px 500px at center, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%)",
                  }}
                  className="absolute w-[1000px] h-[500px] top-0 left-0 bottom-0 right-0"
               ></div>
               <div
                  className="flex flex-row h-full justify-between rounded-xl -z-[100] relative  "
                  style={{
                     width: 1000,
                  }}
               >
                  {new Array(25).fill(0).map((_, i) => (
                     <div
                        key={i}
                        className={`h-full bg-neutral-300 `}
                        style={{
                           width: 1,
                        }}
                     ></div>
                  ))}
               </div>
               <div
                  className="flex flex-col justify-between  rounded-xl relative -z-[100]  "
                  style={{
                     height: 500,
                     top: -500,
                  }}
               >
                  {new Array(12).fill(0).map((_, i) => (
                     <div
                        key={i}
                        className={`w-full  bg-neutral-300 `}
                        style={{
                           height: 1,
                        }}
                     ></div>
                  ))}
               </div>
            </div>
            <div className="absolute -z-10 left-[-150px] top-[200px] opacity-10">
               {/* <img className="w-[800px] right-[-200px]  -rotate-[30deg]" src="/background.png" alt="" /> */}
            </div>

            <div className="overflow-hidden dark:bg-[#191919]">
               <div className=" flex flex-row items-center justify-center w-full  text-center pt-8 px-[10%] lg:px-[20%]   ">
                  <div className="w-full  ">
                     <div className="w-full  bg-opacity-50 mb-8 dark:bg-pink-700 bg-pink-300 text-lg dark:text-neutral-100 text-neutral-700 rounded-xl h-12 lg:flex hidden flex-row items-center justify-center ">
                        FORMI is used by&nbsp;<span className=" dark:text-neutral-100 text-purple-700 font-bold">5000+ dancers&nbsp;</span> and
                        coaches like you
                     </div>
                     <h1
                        style={{
                           lineHeight: 1.15,
                        }}
                        className=" text-4xl lg:text-6xl dark:text-neutral-100   font-bold text-neutral-800 "
                     >
                        Collaborative whiteboarding for choreographers
                        {/* Visualize your stage formations <span className="italic">before</span> performing */}
                     </h1>
                     <h1 className=" dark:text-neutral-300  text-neutral-500 lg:px-[20%]    mt-4 ">
                        Create, plan, and share stunning 3D dance & cheer formations in minutes
                     </h1>
                     {/* <p className="text-neutral-500  mt-5">Plan out your dance and cheer formations, visualizing the transitions synced to music.</p> */}
                     <Link href={"/login"} className="z-50">
                        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-neutral-100 px-4 py-2 block lg:hidden mx-auto mt-5  rounded-full">
                           Get Started
                        </button>
                     </Link>
                     <div className="flex flex-col mx-auto justify-center">
                        <Link href={"/207/edit"} className="">
                           <button className="  flex-row items-center mx-auto  text-neutral-100 px-4 py-2 border border-pink-600  hidden lg:flex rounded-full mt-8 text-xl group">
                              <span className="mr-2 text-pink-600 ">View Demo</span>
                              <span className="relative left-0 group-hover:left-3 transition-all duration-300">
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 stroke-pink-600"
                                 >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                 </svg>
                              </span>
                           </button>
                        </Link>
                     </div>
                  </div>
               </div>

               <div className=" mt-12 relative">
                  {/* <Image width={"1000"} height={"1000"} src={"/threeDPreview.png"}></Image> */}
                  <img
                     className=" max-w-[1000px] lg:block hidden  w-full mx-auto relative -bottom-5 rounded-xl border border-neutral-200 dark:border-neutral-600 shadow-2xl z-10"
                     src="/threeDPreview.png"
                  ></img>

                  <div
                     className="pointer-events-none absolute  h-[2000px] overflow-hidden w-[2000px]  "
                     style={{
                        backgroundImage: "radial-gradient(37.66% 48.2% at 50% 50%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        top: -200,
                        left: "50%",
                        transform: "translate(-50%, 0)",
                        opacity: 1,
                     }}
                  ></div>
               </div>
            </div>
            <div className="w-full h-[1px] dark:bg-neutral-700 bg-neutral-300"></div>
            <div className=" dark:bg-[#191919]   lg:flex flex-col items-center justify-center  hidden py-10  ">
               {/* <p className=" text-2xl mx-auto text-center font-proxima font-semibold mt-10 ">Trusted by 5000+ dance teams</p> */}

               <div className=" grid grid-cols-4 place-items-center child:mx-8   child:my-8  select-none opacity-60 dark:opacity-70 ">
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
            <div className=" bg-neutral-100 font-proxima overflow-hidden relative lg:px-0 px-7 ">
               <div className="absolute top-12 w-full px-4 -translate-x-1/2 left-1/2">
                  {/* <p className="font-bold w-full text-3xl">Bring your dancers to life.</p> */}
               </div>
               {/* <div
                  className="pointer-events-none absolute  h-[2000px]  w-[2000px]  "
                  style={{
                     backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #0284c7 0%, rgba(239, 255, 250, 0) 100%)",
                     // top: -200,
                     left: -1000,

                     opacity: 0.2,
                  }}
               ></div>
               <div
                  className="pointer-events-none absolute  h-[2000px]  w-[2000px]  "
                  style={{
                     backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #10b981 0%, rgba(239, 255, 250, 0) 100%)",
                     // top: -200,
                     right: -1000,

                     opacity: 0.2,
                  }}
               ></div> */}

               {/* <div className="flex  flex-col items-center mx-auto max-w-[1000px] py-8 w-full  ">
                  <div className="text-center w-full">
                     <p className="text-3xl font-bold">Bring your dancers to life in 3D</p>
                     <p className="text-lg mt-6  text-neutral-500">
                        Save precious time in practices by designing stage formation in advance so you are ready to go during rehearsals.
                     </p>
                  </div>

                  <div className="w-[85%] ">
                     <img className=" rounded-xl mt-10" src="/threeD.png" alt="" />
                  </div>
               </div> */}

               {/* <video className="rounded-xl w-full mx-auto max-w-[1000px] my-5 border border-neutral-300" autoPlay muted loop src="/threeD.mp4"></video> */}
               {/* <Canvas
                  className="h-[700px] relative bottom-0 w-full "
                  gl={{ logarithmicDepthBuffer: true }}
                  camera={{ position: [15, 15, 15], fov: 40 }}
               >
                 
                  <Stage
                     position={[10, 0, 0]}
                    
                     environment="apartment"
                   
                     adjustCamera={false}
                  ></Stage>
                  <Grid
                     renderOrder={-1}
                     position={[0, 0, 0]}
                     args={[40 / 2, 30 / 2]}
                     cellSize={0.5}
                     cellThickness={0.5}
                     sectionSize={2.5}
                     sectionThickness={1.5}
                     sectionColor={[0.5, 0.5, 10]}
                    
                  />

                  {formations[0].positions.map((dancerPosition) => {
                     return (
                        <ThreeDancer
                           isPlaying={true}
                           currentFormationIndex={currentFormationIndex}
                           percentThroughTransition={percentThroughTransition}
                           dancers={dancers}
                           position={position}
                           dancerPosition={dancerPosition}
                           formations={formations}
                        ></ThreeDancer>
                     );
                  })}

                  <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
                  
               </Canvas> */}
            </div>
            {/* <div className="w-full h-[1px] dark:bg-neutral-700 bg-neutral-300"></div> */}
            <div>
               <p className="text-5xl text-center px-[20%] py-12">
                  The <span className=" text-transparent  bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">all-in-one platform </span> to
                  plan and excecute the best performances
               </p>
            </div>
            {/* <div className="w-full h-[1px] dark:bg-neutral-700 bg-neutral-300"></div> */}
            <div className="bg-neutral-50 dark:bg-[#191919] lg:px-0 px-7  font-proxima">
               <div className="flex lg:flex-row flex-col items-center mx-auto max-w-[1000px] py-8 w-full ">
                  <div className="lg:w-1/2 w-[90%]">
                     <p className="text-3xl font-bold dark:text-neutral-50">Collaborate, communicate</p>
                     <p className="text-lg mt-6 lg:w-[80%] text-neutral-500 dark:text-neutral-300">
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

            <div className="bg-neutral-50 dark:bg-[#191919]  font-proxima lg:px-0 px-7">
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
                        <p className="text-3xl font-bold dark:text-neutral-50">Complex dancer paths</p>
                        <p className="text-lg mt-6  text-neutral-500 dark:text-neutral-300 ">
                           Our non-linear path feature lets you plan complex formations with ease, making your choreography process smoother and more
                           efficient. Say goodbye to old-fashioned, complicated methods and hello to modern, streamlined choreography.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="w-full h-[1px] dark:bg-neutral-700 bg-neutral-300"></div>

            <div className="bg-neutral-50  flex flex-row justify-center font-proxima py-10  ">
               <div className="text-white  bg-pink-600 py-10 rounded-xl">
                  <p className="text-4xl">Build Your First Performance Free</p>
               </div>
               {/* <p className="text-3xl font-bold dark:text-neutral-50">No Credit Card Required</p>
                     <p className="text-lg mt-6 lg:w-[80%]  dark:text-neutral-300 text-neutral-500">
                        Start free today without a credit card. Create all of your dance formations, view in 3D and upload your own audio completely
                        free.
                     </p>
                     <Link href={"/login"} className="z-50">
                        <button className="bg-pink-600 mt-8 text-neutral-100 px-4 py-2 hidden lg:block  rounded-full">
                           Build Your First Performance Free
                        </button>
                     </Link> */}

               <div className="lg:w-1/2 w-[90%] flex flex-row justify-center items-center "></div>
            </div>

            {/* FOOTER */}
            <div className="w-full h-[1px] dark:bg-neutral-700 bg-neutral-300"></div>
            <Footer></Footer>
         </div>
      </>
   );
};
export default home;
