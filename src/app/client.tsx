"use client";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "../components/NonAppComponents/Footer";
const Client = () => {
   return (
      <>
         {/* <Head>
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
         </Head> */}
         {/* <Header></Header> */}
         <div className="bg-neutral-800/50 backdrop-blur-3xl py-1 px-1  w-[90vw] left-1/2 -translate-x-1/2 z-[60] rounded-full h-12 fixed top-[100px] hidden lg:flex flex-row items-center">
            {/* <img src="/logobg.png" className="h-full" alt="" /> */}
            <p className="text-white ml-4 font-bold">FORMI</p>

            <Link
               href={"/207/edit"}
               className="bg-neutral-700/50 h-full rounded-full px-6 hover:text-white transition grid place-items-center text-neutral-400 ml-auto"
            >
               View Demo
            </Link>

            <Link href={"/login"} className="bg-neutral-400/50 grid place-items-center h-full rounded-full px-6 text-white transition ml-2">
               Log In
            </Link>
         </div>
         <div className="overflow-hidden relative bg-neutral-50 flex flex-col items-center ">
            <div className="h-14 w-full border-b border-neutral-800 bg-black text-neutral-300 flex flex-row items-center justify-center">
               Follow{" "}
               <a href="https://www.tiktok.com/@formistudio.app/" target="_blank" className="text-pink-300 mx-2 ">
                  {" "}
                  @formistudio.app{" "}
               </a>{" "}
               on TikTok <span className="text-xs text-neutral-500 ml-2 hidden lg:block">and discover what's new on our platform</span>
            </div>
            <div className="bg-black w-full text-white  relative flex flex-col pointer-events-none ">
               <div className=" mt-[120px] top-[170px] text-center flex flex-col items-center justify-center z-50 ">
                  {/* <div className="bg-neutral-500/50 w-full rounded-full h-16"></div> */}
                  <p className="  lg:text-6xl  text-2xl font-semibold mt-5 w-2/3  ">FORMI, a place to design and plan stunning choreography.</p>

                  <div className=" bg-white text-black w-[250px]   px-6 z-50 relative py-3 rounded-md mt-10 pointer-events-auto">
                     <Link href={"/login"} className=" ">
                        <div className=" lg:flex flex-row items-center justify-around hidden">
                           <span className="font-semibold">Get started</span> — it’s free{" "}
                           <svg className="stroke-black" width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 8.5H3m11 0-3 3m3-3-3-3" stroke-linecap="round" stroke-linejoin="round"></path>
                           </svg>
                        </div>
                        <div className="  flex-row items-center justify-around lg:hidden flex">Mobile app coming soon</div>
                     </Link>
                  </div>
               </div>
               <div className="w-full flex flex-row justify-center mt-[100px] relative ">
                  <div className=" lg:h-[800px] h-[200px]  ">
                     <Image fill={true} objectFit="contain" className="w-2/3 z-10 relative " src="/desktop.png" alt="" />
                  </div>

                  <div
                     className="pointer-events-none absolute left-1/2 hidden lg:block  -translate-x-1/2  h-[1000px] w-[1700px]"
                     style={{
                        //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        //    right: -400,
                        //    top: -400,
                        top: -200,
                        opacity: 0.5,
                     }}
                  ></div>
               </div>
               {/* <p className=" absolute bottom-12 w-full text-center  text-7xl  ">Choreography has never been easier.</p> */}

               {/* <div className="w-full h-full  absolute top-36 z-0 pointer-events-none lg:pointer-events-auto ">
                  <ThreeD
                     items={[]}
                     props={[]}
                     setIsThreeDancerDragging={() => null}
                     isThreeDancerDragging={false}
                     isPlaying={false}
                     currentFormationIndex={0}
                     percentThroughTransition={0}
                     dancers={dancers}
                     position={0}
                     shiftHeld={false}
                     setShiftHeld={() => null}
                     stageFlipped={false}
                     soundCloudTrackId={null}
                     zoom={1}
                     setZoom={() => null}
                     isCommenting={false}
                     setIsCommenting={() => null}
                     localSettings={{
                        gridSnap: 1,
                        previousFormationView: "ghostDancersAndPaths",
                        dancerStyle: "solid",
                        viewCollisions: false,
                        stageFlipped: false,
                        viewingThree: true,
                        viewingTwo: false,
                        collisionRadius: 1,
                        fullScreen: false,
                        isDarkMode: true,
                        autoScroll: false,
                     }}
                     pushChange={() => null}
                     undo={() => null}
                     addToStack={() => null}
                     player={null}
                     draggingDancerId={null}
                     setDraggingDancerId={() => null}
                     songDuration={60}
                     viewOnly={false}
                     setSelectedFormation={() => null}
                     formations={formations}
                     selectedFormation={selectedFormation}
                     setFormations={() => null}
                     selectedDancers={[]}
                     setSelectedDancers={() => null}
                     setIsPlaying={() => null}
                     setPixelsPerSecond={() => null}
                     cloudSettings={{
                        backgroundUrl:
                           "https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/stagebackgrounds/f30197ba-cf06-4234-bcdb-5d40d83c7999/IMG_6842-removebg-preview.png",
                        collisionRadius: 0.49640000000005985,
                        stageBackground: "grid",
                        stageDimensions: { width: 36, height: 18 },
                        gridSubdivisions: 7,
                     }}
                     coordsToPosition={coordsToPosition}
                     isIntro={true}
                  ></ThreeD>
               </div> */}
            </div>

            <p className="text-center font-bold text-3xl mt-12 ">Trusted by</p>
            <div className="lg:h-40 w-1/4  lg:w-full bg-neutral-50 flex lg:flex-row flex-col justify-center py-10 lg:child:mx-10 child:my-5 lg:child:my-0 ">
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
            <div className="bg-neutral-50 dark:bg-neutral-900 lg:px-0 px-7 w-full  font-proxima">
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

            <div className="bg-neutral-50 dark:bg-[#191919] w-full  font-proxima lg:px-0 px-7">
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
            <div className=" dark:bg-neutral-900   lg:flex flex-col items-center justify-center  hidden py-10  ">
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
            {/* <div className="w-full h-[1px] dark:bg-neutral-700 bg-neutral-300"></div> */}

            {/* <div className="bg-neutral-50  flex flex-row justify-center items-center font-proxima py-10 dark:bg-neutral-900  ">
               <div className="text-white  bg-pink-600 py-10 rounded-xl w-[70%]">
                  <p className="text-3xl text-center">Build Your First Performance Free</p>
                  <Link href={"/login"} className="">
                     <button className="  flex-row items-center mx-auto  text-neutral-100 px-4 py-2 border border-white  hidden lg:flex rounded-full mt-8 text-xl group">
                        <span className="mr-2 text-white ">Get Started</span>
                     </button>
                  </Link>
               </div>
            </div> */}
            {/* <div className="lg:w-1/2 w-[90%] flex flex-row justify-center items-center "></div> */}

            {/* FOOTER */}
            <div className="w-full h-[1px] dark:bg-neutral-700 bg-neutral-300"></div>
            <Footer></Footer>
         </div>
      </>
   );
};
export default Client;