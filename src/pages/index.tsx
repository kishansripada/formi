import Link from "next/link";
import Head from "next/head";

const home = () => {
   return (
      <>
         <style jsx>{`
            @keyframes sidetoside {
               0% {
                  left: 0%;
               }
               50% {
                  left: 100%;
               }
               100% {
                  left: 0%;
               }
            }

            @keyframes upanddown {
               0% {
                  top: -100px;
               }
               50% {
                  top: 100px;
               }
               100% {
                  top: -100px;
               }
            }
         `}</style>
         <Head>
            <title>Naach: Online dance formation building software</title>

            <meta
               name="description"
               content="Easily build, create and visualize your dance and cheer formations synced to music. Naach is the ultimate choreographer formation tool."
            />
            <meta name="keywords" content="dance, choreography, desi, formations, cheer, cheerleading, formation building tool" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Naach: Online dance formation building software" />
            <meta name="twitter:image" content="https://i.imgur.com/pWxufBF.png" />
            <meta property="og:type" content="song" />
            <meta property="og:title" content="Naach: Online dance formation building software" />
            <meta
               property="og:description"
               content="Easily build, create and visualize your dance and cheer formations synced to music. Naach is the ultimate choreographer formation tool."
            />
            <meta property="og:image" content="https://i.imgur.com/pWxufBF.png" />

            <meta property="og:site_name" content="Naach: Online dance formation building software" />
         </Head>
         <div className="bg-[#fafafa]">
            <div className="font-proxima pt-16 px-[20%] bg-[#fafafa]">
               <nav className="flex flex-row justify-between text-black items-center ">
                  {/* <img src="/newLogo.png" className="w-64 pointer-events-none select-none" alt="" /> */}
                  <h1 className="text-7xl font-bold">NAACH</h1>
                  <Link href={"/login"} className="z-50">
                     <button className="border-black border px-4 py-1  rounded-md ">sign in 🚀</button>
                  </Link>
               </nav>

               <h1 className=" text-black  text-[42px] font-semibold w-[70%] leading-[51px] relative  mt-28 z-10">
                  stage performance planning reimagined.
               </h1>
               <p className="text-gray-500 w-[60%] mt-5">
                  plan out your dance and cheer formations, visualizing the transitions all synced to music.
               </p>

               <Link href={"/207/edit"} className="z-50">
                  <button className="bg-pink-600 text-white px-8 py-4 shadow-xl rounded-full mt-12 text-xl hidden lg:block group">
                     create your first performance <span className="relative left-0 group-hover:left-3 transition-all duration-300">👉</span>
                  </button>
               </Link>
            </div>
            <div className="px-[15%] mt-24 relative overflow-hidden  ">
               <img src="/editDemo.png" className="rounded-xl shadow-2xl z-50 relative pointer-events-none select-none " alt="" />
               <div
                  className="pointer-events-none absolute  h-[1000px] w-[1000px] "
                  style={{
                     backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                     top: 0,
                     right: -300,
                     opacity: 0.5,
                  }}
               ></div>
               <div
                  className="pointer-events-none absolute  h-[1000px] w-[1000px] "
                  style={{
                     backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #9333ea 0%, rgba(239, 255, 250, 0) 100%)",
                     top: 0,
                     left: -300,
                     opacity: 0.5,
                  }}
               ></div>
            </div>
            <div className="h-[200px] bg-[#efefef] flex flex-row items-center justify-center child:mx-8 pointer-events-none select-none">
               <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cornell_University_logo.svg/1280px-Cornell_University_logo.svg.png"
                  className="grayscale w-48 opacity-40"
                  alt=""
               />
               <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/University_of_Michigan_logo.svg/2560px-University_of_Michigan_logo.svg.png"
                  className="grayscale w-48 opacity-40"
                  alt=""
               />
               <img
                  src=" https://images.givelively.org/nonprofits/460ef676-33fe-4637-8b80-d9a31f11d415/logos/desi-dance-network-incorporated_processed_a5bf047c897ca650200a7cc0d546411966e88bb5e6240b4b4ac74b83266fcead_logo.png
               "
                  className="grayscale w-24 opacity-40"
                  alt=""
               />
               <img
                  src=" https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/University_of_California%2C_Berkeley_logo.svg/2560px-University_of_California%2C_Berkeley_logo.svg.png
               "
                  className="grayscale w-32 opacity-40"
                  alt=""
               />
               <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/University_of_Texas_at_Austin_logo.svg/1280px-University_of_Texas_at_Austin_logo.svg.png
               "
                  className="grayscale w-32 opacity-40"
                  alt=""
               />
               <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1341px-Stanford_Cardinal_logo.svg.png
               "
                  className="grayscale w-12 opacity-40"
                  alt=""
               />
            </div>
            <div className="bg-[#efefef] flex flex-row items-center justify-between px-[15%] pt-24 pb-48">
               <div className="w-[50%] relative mr-20">
                  <div
                     style={{
                        position: "absolute",
                        animation: "sidetoside 5s cubic-bezier(0.65, 0, 0.35, 1) infinite",
                     }}
                     className={` rounded-full shadow-xl  flex flex-row justify-center items-center absolute z-[40] mr-auto ml-auto cursor-default w-[41px] h-[41px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 `}
                  >
                     <div className="bg-white rounded-full w-[32px] h-[32px] grid place-items-center select-none cursor-default ">
                        <p data-type={"dancer"} className="select-none font-semibold cursor-default  ">
                           KS
                        </p>
                     </div>
                  </div>
               </div>
               <div className="w-[50%]">
                  <h1 className="font-semibold text-3xl text-gray-800 relative z-10 w-[70%]">
                     drag and drop your dancers, then watch them come to life
                  </h1>
                  <div className="bg-blue-400 relative h-3 opacity-40 top-[-10px]"></div>
                  <p className="text-lg text-gray-400 w-[70%] mt-3">
                     automatically determine if your dancers will <span className="font-bold text-gray-500 ">collide</span> on stage
                  </p>
               </div>
            </div>
         </div>
      </>
   );
};
export default home;
