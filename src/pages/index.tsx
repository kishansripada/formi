import Link from "next/link";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "../components/NonAppComponents/Header";
import { Footer } from "../components/NonAppComponents/Footer";
// import { Stage, Grid, OrbitControls } from "@react-three/drei";
// import { ThreeDancer } from "../components/AppComponents/ThreeDancer";
// import { Canvas } from "@react-three/fiber";
// import Image from "next/image";

const home = () => {
   const videoRef = useRef();
   let router = useRouter();

   const [position, setPosition] = useState(0);
   useEffect(() => {
      const intervalId = setInterval(() => {
         setPosition((position) => position + 0.06);
      }, 16);

      return () => clearInterval(intervalId);
   }, []);

   return (
      <>
         <Head>
            <title>FORMI: Online stage performance planning software.</title>
            <meta
               name="description"
               content="Dance formation app. Easily build, create and visualize your dance and cheer formations synced to music. Formi is the ultimate choreographer formation tool. Dance formation builder. Cheer formation builder."
            />
            <meta
               name="keywords"
               content="dance, choreography, desi, formations, cheer, cheerleading, formation building tool, dance formation app"
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
         {/* {router.query.ref === "naach" ? (
            <>
               <div className="fixed top-0 left-0 z-[100] flex h-screen w-screen items-center justify-center font-proxima ">
                  <div className="flex  w-[700px] flex-col rounded-xl bg-white border border-black">
                     <div className="flex flex-col rounded-xl px-10 py-10 h-full text-center">
                        <div className="flex flex-col mt-auto text-5xl">naach is now FORMI!</div>
                     </div>
                  </div>
               </div>
            </>
         ) : (
            <></>
         )} */}
         <Header></Header>

         <div className="bg-[#fafafa] overflow-hidden ">
            <div className="overflow-hidden">
               <div className=" flex flex-row items-center justify-center w-full  text-center pt-12 px-[10%] lg:px-[20%] bg-[#fafafa]  ">
                  <div className="w-full  ">
                     <h1 className=" text-4xl lg:text-6xl  leading-10  font-bold text-gray-900 ">
                        Create stunning performances that impress your audience.
                        {/* Visualize your stage formations <span className="italic">before</span> performing */}
                     </h1>
                     <h1 className="font-bold  text-2xl text-gray-600  mt-4 ">Three dimensional. Synced to music.</h1>
                     {/* <p className="text-gray-500  mt-5">Plan out your dance and cheer formations, visualizing the transitions synced to music.</p> */}
                     <Link href={"/login"} className="z-50">
                        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white  px-4 py-2 block lg:hidden mx-auto mt-5  rounded-full">
                           Get Started
                        </button>
                     </Link>
                     <Link href={"/207/edit"} className="">
                        <button className=" bg-gradient-to-r from-purple-500 to-pink-500 flex-row items-center   text-white px-4 py-2  mx-auto hidden lg:flex rounded-full mt-8 text-xl group">
                           <span className="mr-2  ">View Demo</span>
                           <span className="relative left-0 group-hover:left-3 transition-all duration-300">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-6 h-6"
                              >
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                              </svg>
                           </span>
                        </button>
                     </Link>
                  </div>
               </div>

               <div className=" mt-12 relative">
                  <img
                     className=" max-w-[1000px]  w-full mx-auto relative -bottom-11 rounded-xl border border-gray-200 shadow-xl z-10"
                     src="/threePreview.png"
                  ></img>

                  <div
                     className="pointer-events-none absolute  h-[2000px] overflow-hidden w-[2000px]  "
                     style={{
                        backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        top: -200,
                        left: "50%",
                        transform: "translate(-50%, 0)",
                        opacity: 0.8,
                     }}
                  ></div>
               </div>
            </div>

            <div className=" bg-white  font-proxima overflow-hidden relative ">
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

               <video className="rounded-xl w-full mx-auto max-w-[1000px] my-5 border border-gray-300" autoPlay muted loop src="/threeD.mp4"></video>
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
            <hr />
            <div className="bg-white  font-proxima">
               <div className="flex lg:flex-row flex-col items-center mx-auto max-w-[1000px] py-8 w-full ">
                  <div className="lg:w-1/2 w-[90%]">
                     <p className="text-3xl font-bold">Collaborate, communicate</p>
                     <p className="text-lg mt-6 lg:w-[80%] text-gray-500">
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
                        className=" lg:ml-auto lg:w-[90%] border border-gray-200 rounded-xl relative"
                     />
                  </div>
               </div>
            </div>

            <div className="bg-white  font-proxima">
               <div className="flex lg:flex-row flex-col-reverse items-center mx-auto max-w-[1000px] py-8 w-full ">
                  <div className="lg:w-1/2 w-[90%]">
                     <video autoPlay muted src="/curveDemo.mp4" loop className=" lg:mr-auto lg:w-[90%] border border-gray-200 rounded-xl relative" />
                  </div>
                  <div className="lg:w-1/2 w-[90%] ">
                     <div className="lg:w-[90%] mx-auto">
                        <p className="text-3xl font-bold">Complex dancer paths</p>
                        <p className="text-lg mt-6  text-gray-500">
                           Our non-linear path feature lets you plan complex formations with ease, making your choreography process smoother and more
                           efficient. Say goodbye to old-fashioned, complicated methods and hello to modern, streamlined choreography.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* FOOTER */}
            <Footer></Footer>
         </div>
      </>
   );
};
export default home;
