import Link from "next/link";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
const home = () => {
   const videoRef = useRef();
   let router = useRouter();
   // const [scrollPosition, setScrollPosition] = useState(0);
   // const handleScroll = () => {
   //    let position = window.pageYOffset;
   //    // setScrollPosition(position);
   //    position = Math.round(position / 10) * 10;
   //    // if (!videoRef?.current?.currentTime) return;
   //    videoRef.current.currentTime = (position / 900) * 4;
   // };

   // useEffect(() => {
   //    window.addEventListener("scroll", handleScroll, { passive: true });

   //    return () => {
   //       window.removeEventListener("scroll", handleScroll);
   //    };
   // }, []);

   // useEffect(() => {
   //    console.log(scrollPosition)
   //    videoRef.current.currentTime = (scrollPosition / 900) * 4;
   // }, [scrollPosition]);

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
            <title>FORMI: Online performance planning software.</title>
            <meta
               name="description"
               content="Easily build, create and visualize your dance and cheer formations synced to music. Formi is the ultimate choreographer formation tool."
            />
            <meta name="keywords" content="dance, choreography, desi, formations, cheer, cheerleading, formation building tool" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="FORMI: Online performance planning software." />
            <meta name="twitter:image" content="https://i.imgur.com/83VsfSG.png" />
            <meta property="og:type" content="song" />
            <meta property="og:title" content="FORMI: Online performance planning software." />
            <meta
               property="og:description"
               content="Easily build, create and visualize your dance and cheer formations synced to music. Formi is the ultimate choreographer formation tool."
            />
            <meta property="og:image" content="https://i.imgur.com/83VsfSG.png" />

            <meta property="og:site_name" content="FORMI: Online performance planning software." />
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
         <div className="bg-[#fafafa]">
            <div className="font-proxima pt-16 px-[10%] lg:px-[20%] bg-[#fafafa] ">
               <nav className="flex flex-row lg:justify-between text-black items-center justify-center ">
                  <div className="w-[250px]">
                     {/* <h1 className="text-6xl font-bold z-10 relative">naach.app</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[58%]"></div> */}
                     <h1 className="text-6xl font-bold z-10 relative">FORMI</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[100%]"></div>
                  </div>
                  {/* <div>
                     <h1 className="text-7xl font-bold z-10 relative">n</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-full"></div>
                  </div> */}
                  <div className="flex flex-row items-center justify-center">
                     {/* <Link href={"/upgrade"} className="z-50">
                        <button className=" border-pink-600 border-2 mr-3 px-4 py-1 hidden lg:block  rounded-md ">pricing</button>
                     </Link> */}
                     <Link href={"/login"} className="z-50">
                        <button className="border-black border px-4 py-1 hidden lg:block  rounded-md ">sign in</button>
                     </Link>
                  </div>
               </nav>

               <div className=" flex flex-row items-center justify-center lg:justify-between text-center lg:text-left">
                  <div className="lg:w-[70%]">
                     <h1 className=" text-black text-5xl md:text-[42px] lg:text-[42px] font-semibold lg:leading-[51px] relative  mt-28 z-10">
                        collaborative performance planning for the web.
                     </h1>
                     <p className="text-gray-500 lg:w-[85%] mt-5">
                        plan out your dance and cheer formations, visualizing the transitions synced to music.
                     </p>

                     <Link href={"/207/edit"} className="">
                        <button className="border-4  flex-row items-center  border-pink-600  px-8 py-4  hidden lg:flex rounded-full mt-12 text-xl group">
                           <span className="mr-2 ">view demo</span>{" "}
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

                  <div className="w-[30%] hidden lg:block ">
                     {/* <img
                        className="w-[400px]  absolute right-[250px] top-[60px] pointer-events-none select-none"
                        src="
                        https://purepng.com/public/uploads/large/dancer-8yz.png"
                        alt=""
                     /> */}
                  </div>
               </div>
            </div>
            <div className="lg:px-[15%] px-[5%] mt-24 relative overflow-hidden  ">
               {/* <img src="/editDemo.png" className="rounded-xl shadow-2xl z-50 relative pointer-events-none select-none " alt="" /> */}
               <video
                  ref={videoRef}
                  playsinline="true"
                  webkit-playsinline="true"
                  preload="auto"
                  muted={true}
                  autoPlay
                  loop
                  className="rounded-xl shadow-2xl z-50 relative pointer-events-none select-none"
               >
                  <source src="/videoScroll.mp4" type="video/mp4"></source>
               </video>
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
            <hr />
            <div className=" bg-[#efefef]  flex-wrap flex flex-row items-center justify-center child:mx-8 child:my-8  select-none   ">
               <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cornell_University_logo.svg/1280px-Cornell_University_logo.svg.png"
                  className="grayscale w-48 opacity-40 hover:grayscale-0 hover:opacity-100 transition duration-500"
                  alt=""
               />
               <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/University_of_Michigan_logo.svg/2560px-University_of_Michigan_logo.svg.png"
                  className="grayscale w-48 opacity-40 hover:grayscale-0 hover:opacity-100 transition duration-500"
                  alt=""
               />
               {/* <img
                  src=" https://images.givelively.org/nonprofits/460ef676-33fe-4637-8b80-d9a31f11d415/logos/desi-dance-network-incorporated_processed_a5bf047c897ca650200a7cc0d546411966e88bb5e6240b4b4ac74b83266fcead_logo.png
               "
                  className="grayscale w-24 opacity-40 hover:grayscale-0 hover:opacity-100 transition duration-500"
                  alt=""
               /> */}
               <img
                  src=" https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/University_of_California%2C_Berkeley_logo.svg/2560px-University_of_California%2C_Berkeley_logo.svg.png
               "
                  className="grayscale w-32 opacity-40 hover:grayscale-0 hover:opacity-100 transition duration-500"
                  alt=""
               />
               <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/University_of_Texas_at_Austin_logo.svg/1280px-University_of_Texas_at_Austin_logo.svg.png
               "
                  className="grayscale w-32 opacity-40 hover:grayscale-0 hover:opacity-100 transition duration-500"
                  alt=""
               />
               <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1341px-Stanford_Cardinal_logo.svg.png
               "
                  className="grayscale w-12 opacity-40 hover:grayscale-0 hover:opacity-100 transition duration-500"
                  alt=""
               />
            </div>
            <hr />
            <div className="bg-white flex flex-col font-proxima items-center relative overflow-hidden ">
               <p className="tracking-widest text-pink-600 mt-24 px-10 text-center">VISUALIZE DANCE FORMATIONS RIGHT IN YOUR BROWSER</p>
               <h1 className=" text-5xl lg:text-6xl text-center mt-12">full-featured. not complicated</h1>

               <img
                  className="w-[95%] lg:w-[60%] rounded-xl shadow-2xl mt-16 relative z-50 mb-0 pointer-events-none select-none"
                  src="/curveDemo.png"
                  alt=""
               />

               <div
                  className="pointer-events-none absolute  h-[1000px] w-[1000px] "
                  style={{
                     backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #00FFFF 0%, rgba(239, 255, 250, 0) 100%)",
                     top: 100,
                     left: -300,
                     opacity: 0.5,
                  }}
               ></div>
               <div
                  className="pointer-events-none absolute  h-[1000px] w-[1000px] "
                  style={{
                     backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #00A36C	 0%, rgba(239, 255, 250, 0) 100%)",
                     top: 100,
                     right: -300,
                     opacity: 0.5,
                  }}
               ></div>
            </div>
            <hr />
            <div className="bg-[#fafafa]  flex flex-col items-center justify-center  px-[20%] py-16 font-proxima ">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 stroke-pink-600"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
               </svg>

               <p className="text-4xl text-center lg:w-1/2 mt-8">edit and share polished plans with your performers.</p>
               <p className="mt-5 lg:w-1/2 text-center">
                  with a few clicks share a view only experience of your polished choreography, making rehersal more efficient
               </p>
               <div></div>
            </div>

            {/* FOOTER */}
            <div className="bg-[#fafafa]">
               <div className="pt-6 pb-6 px-12 flex flex-row bg-[#fafafa] ">
                  <svg className="ml-auto opacity-40" fill="none" xmlns="http://www.w3.org/2000/svg" width={200} viewBox="0 0 1004 135">
                     <path
                        d="M13.5643 134.909c-2.4886 0-4.6661-.207-6.53252-.621-1.86642-.345-3.31808-.69-4.35499-1.035-.96777-.344-1.45166-.517-1.45166-.517l-.311067-.724c.138257-.759.276507-2 .414757-3.725.20738-1.793.3802-3.656.51845-5.587.20738-1.931.31107-3.449.31107-4.552l3.62916-.518c0 4.553.76039 7.76 2.28118 9.623 1.52079 1.862 4.11302 2.793 7.77672 2.793 2.6269 0 4.8389-.586 6.6362-1.759 1.7973-1.172 2.6959-2.621 2.6959-4.345 0-1.173-.3456-2.242-1.0369-3.208-.6912-.965-1.9009-2.035-3.6291-3.207-1.7282-1.173-4.1822-2.587-7.362-4.242-3.94023-2-6.80899-4.035-8.60628-6.104-1.7973-2.07-2.69595-4.346-2.69595-6.829 0-2.8281.82952-5.3457 2.48857-7.5529 1.65904-2.2073 3.94022-3.9317 6.84356-5.1732 2.9033-1.3106 6.1523-1.9658 9.7469-1.9658 2.8341 0 5.2536.2759 7.2583.8277l3.1107.8277.2073.5173s-.1382.5863-.4147 1.7589c-.2074 1.1726-.4839 2.7245-.8295 4.6559-.2765 1.8623-.5185 3.9316-.7259 6.2074l-3.8365.311s.0346-.38.1037-1.1383c.0691-.7588.1037-1.3795.1037-1.8624 0-2.4831-.6913-4.2765-2.0738-5.3801-1.3134-1.1726-3.4564-1.7589-6.4288-1.7589-2.3503 0-4.355.5518-6.014 1.6554-1.58995 1.1037-2.38491 2.4487-2.38491 4.0351 0 1.6555.69127 3.2074 2.07381 4.6562 1.4517 1.448 3.7674 3 6.9472 4.656 3.7329 1.931 6.6362 3.69 8.71 5.276 2.1429 1.518 3.6292 3.001 4.4587 4.449.8986 1.449 1.3479 3.035 1.3479 4.76 0 2.621-.8986 5.069-2.6959 7.345-1.7282 2.277-4.0439 4.104-6.9472 5.484-2.8342 1.311-5.9449 1.966-9.3321 1.966ZM85.1461 129.943c2.0738-.207 3.4563-.863 4.1476-1.966.6912-1.173 1.0369-3.38 1.0369-6.622V98.593c0-2.2762-.3111-3.8971-.9332-4.8628-.6222-.9656-1.6245-1.4485-3.007-1.4485-.5531 0-1.0715.069-1.5554.207-.4148.0689-.6221.1034-.6221.1034l-.5185-.7242.3111-3.2074c2.1429-.4138 4.2858-.8622 6.4288-1.345 2.1429-.4828 3.9402-.8967 5.3919-1.2416 1.4516-.3449 2.1774-.5173 2.1774-.5173l.7259.6208-.3111 1.6554c-.1382 1.1036-.2765 2.4831-.4148 4.1386-.1382 1.5864-.2073 3.2073-.2073 4.8627l.4147.3104c2.143-3.2418 4.597-5.8974 7.362-7.9667 2.765-2.0692 5.185-3.1039 7.258-3.1039 1.175 0 2.005.069 2.489.2069l.726.207.311.4138s-.069.4829-.208 1.4485c-.138.8967-.311 2.1038-.518 3.6213-.207 1.4484-.415 3.0349-.622 4.7593-.138 1.7244-.242 3.3803-.311 4.9663l-4.044.31c0-2.8277-.173-4.69-.519-5.5867-.345-.9657-1.106-1.4485-2.281-1.4485-1.521 0-3.145.6208-4.873 1.8623-1.728 1.2416-3.3183 2.966-4.77 5.1729 0 0-.0345.656-.1037 1.966-.0691 1.242-.1382 2.828-.2073 4.759-.0692 1.932-.1383 3.932-.2074 6.001-.0692 2.001-.1383 3.794-.2074 5.381-.0691 1.517-.1037 2.517-.1037 3 0 2.345.3456 3.932 1.0369 4.759.6913.828 2.0046 1.242 3.9406 1.242.76 0 1.693-.035 2.799-.104 1.175-.069 1.763-.103 1.763-.103l.104.414-.934 4.552s-.345-.034-1.036-.103h-2.696c-1.106 0-2.282-.035-3.5258-.104h-3.3181c-2.0047 0-3.8366.035-5.4956.104-1.659.069-2.9724.138-3.9402.207-.9678.069-1.4517.103-1.4517.103l.5185-4.138ZM164.761 134.909l.414-4.242c2.074-.552 3.56-1.345 4.459-2.38.899-1.103 1.348-2.552 1.348-4.345V97.6619c0-1.9314-.311-3.3454-.933-4.2421-.622-.8966-1.59-1.345-2.904-1.345-.553 0-1.14.069-1.762.2069-.553.138-.83.207-.83.207l.415-3.8282c1.728-.2759 3.456-.5863 5.184-.9312 1.798-.3448 3.422-.6552 4.874-.9311 1.452-.3449 2.627-.6208 3.525-.8277.899-.207 1.348-.3104 1.348-.3104l.519 1.2415c-.277.6898-.588 2.2417-.933 4.6559-.277 2.3452-.519 5.2422-.726 8.6905-.208 3.38-.38 7.105-.519 11.175-.138 4-.207 8.035-.207 12.105 0 2 .276 3.483.829 4.449.553.896 1.487 1.345 2.8 1.345.622 0 1.383-.035 2.281-.104.899-.069 1.348-.103 1.348-.103l.208.414-.83 4.449s-.311-.035-.933-.104c-.553 0-1.314-.034-2.281-.103-.899 0-1.901-.035-3.007-.104h-3.007c-1.452 0-3.007.104-4.666.311-1.659.207-3.077.414-4.252.62-1.175.207-1.762.311-1.762.311Zm9.124-61.4577c-1.728 0-3.007-.5518-3.836-1.6554-.83-1.1036-1.244-2.3107-1.244-3.6212 0-1.6554.587-3.0694 1.762-4.242 1.175-1.2416 2.627-1.8624 4.355-1.8624 1.659 0 2.904.5518 3.733 1.6554.899 1.0347 1.348 2.2418 1.348 3.6213 0 1.6554-.588 3.1039-1.763 4.3454-1.106 1.1726-2.557 1.7589-4.355 1.7589ZM275.623 125.164c6.083-1.106 10.092-2.696 12.028-4.77 1.935-2.213 2.903-6.292 2.903-12.238l.207-87.1134c0-4.4249-.553-7.3978-1.659-8.9188-.967-1.5211-2.972-2.28159-6.013-2.28159-1.383 0-2.765.06913-4.148.20739-1.382.1383-2.35.2074-2.903.2074l-.415-.82962 1.452-9.126221c1.659.138274 4.769.276552 9.332.414835 4.562.138274 9.124.207409 13.686.207409 4.285 0 9.124-.069135 14.515-.207409 5.53-.276557 9.401-.48397 11.613-.622244 14.377 0 25.368 3.18034 32.971 9.54104 7.604 6.36071 11.405 15.48691 11.405 27.37871 0 7.7434-2.281 15.1412-6.843 22.1933-4.424 6.9138-10.299 12.5139-17.626 16.8005-7.327 4.2865-14.999 6.4298-23.018 6.4298h-17.418l-.415 20.3269c0 6.637.207 11.407.622 14.311.415 2.766 1.175 4.633 2.281 5.6 1.244.83 3.318 1.245 6.221 1.245 2.35 0 4.562-.069 6.636-.207 2.212-.139 3.732-.277 4.562-.415l.415.829-1.867 9.541c-1.382-.138-3.94-.276-7.672-.414-3.595-.139-7.396-.208-11.406-.208-5.529 0-12.027.208-19.492.622-7.327.415-11.129.761-11.405 1.037l1.451-9.541Zm52.464-51.8531c8.295-1.3828 14.516-4.7705 18.663-10.1633 4.286-5.3927 6.429-12.7905 6.429-22.1933 0-10.6472-3.18-18.3907-9.539-23.2304-6.221-4.9779-16.037-7.4669-29.446-7.4669-2.489 0-4.009.1383-4.562.4149-.553.2765-.899 1.1062-1.037 2.4889-1.244 17.5611-2.074 36.574-2.489 57.0389l21.981 3.1112ZM528.899 133.461l.622-7.467c5.806-.415 9.677-1.037 11.613-1.867 2.073-.829 3.11-2.212 3.11-4.148 0-2.212-.484-4.563-1.451-7.052l-4.977-15.9709c-2.765-.1383-8.502-.2074-17.212-.2074-4.009 0-9.953.4148-17.833 1.2445l-5.806 15.3488c-.968 3.18-1.452 5.116-1.452 5.807 0 2.213.76 3.803 2.281 4.771 1.521.968 4.009 1.452 7.465 1.452h8.917l.622.829-1.244 7.882c-1.382-.138-4.562-.345-9.539-.622-4.838-.277-9.608-.415-14.308-.415-4.424 0-8.433.069-12.027.208-3.457.138-5.807.207-7.051.207l1.244-8.504c3.042-.415 5.461-1.452 7.258-3.111 1.797-1.798 3.594-4.771 5.392-8.919l32.556-82.3434 14.723-2.6964 1.452.2074c0 .5531 3.11 11.477 9.331 32.7715 6.36 21.2945 12.028 38.9247 17.004 52.8909 1.383 4.01 3.111 6.844 5.184 8.504 2.212 1.521 5.669 2.489 10.369 2.903l.415.83-1.037 7.467c-1.383 0-3.94-.069-7.673-.207-3.732-.139-7.465-.208-11.198-.208-5.668 0-11.059.208-16.174.622-5.115.415-8.433.692-9.954.83l-.622-1.037Zm-8.709-45.2163c4.838 0 9.884-.2765 15.137-.8296l-12.649-40.2384h-1.451l-15.138 41.068h14.101ZM733.107 134.913c-1.798-.277-5.461-.691-10.991-1.245-5.391-.414-9.953-.622-13.686-.622-3.594 0-7.534.208-11.82.622-4.286.554-7.05.968-8.295 1.245l1.037-8.712c4.977-.829 8.364-2.212 10.161-4.148 1.797-1.936 2.696-5.116 2.696-9.541l.207-65.9575c0-3.4569-.414-5.7385-1.244-6.8447-.829-1.2444-2.419-1.8667-4.769-1.8667-1.244 0-2.42.0691-3.526.2074-1.105.1383-1.866.2074-2.281.2074l-.414-1.037 1.244-7.8818c1.382 0 3.871.0692 7.465.2074 3.733.1383 7.465.2075 11.198.2075 4.977 0 10.092-.0692 15.345-.2075 5.253-.2765 8.848-.4148 10.783-.4148 11.06 0 20.806 2.005 29.239 6.015s14.93 9.6793 19.492 17.008c4.701 7.1903 7.051 15.6252 7.051 25.3045 0 10.7855-2.627 20.534-7.88 29.2458-5.115 8.711-12.166 15.625-21.152 20.741-8.986 4.978-18.939 7.467-29.86 7.467Zm-7.88-96.0328c-2.212 0-3.733.2765-4.562.8296-.692.4149-1.106 1.3828-1.245 2.9038-1.659 38.8556-2.488 61.6714-2.488 68.4464 0 3.734.553 6.638 1.659 8.712 1.106 1.936 3.041 3.318 5.806 4.148 2.765.691 6.843 1.037 12.235 1.037 11.612 0 20.667-3.803 27.165-11.408 6.636-7.605 9.953-18.2522 9.953-31.9415 0-13.9659-4.147-24.544-12.442-31.7344-8.294-7.3286-20.321-10.9929-36.081-10.9929ZM957.257 133.461l.622-7.467c5.806-.415 9.677-1.037 11.613-1.867 2.073-.829 3.11-2.212 3.11-4.148 0-2.212-.484-4.563-1.452-7.052l-4.976-15.9709c-2.765-.1383-8.502-.2074-17.212-.2074-4.009 0-9.953.4148-17.833 1.2445l-5.807 15.3488c-.967 3.18-1.451 5.116-1.451 5.807 0 2.213.76 3.803 2.281 4.771 1.521.968 4.009 1.452 7.465 1.452h8.917l.622.829-1.244 7.882c-1.383-.138-4.562-.345-9.539-.622-4.839-.277-9.608-.415-14.308-.415-4.424 0-8.433.069-12.028.208-3.456.138-5.806.207-7.05.207l1.244-8.504c3.041-.415 5.461-1.452 7.258-3.111 1.797-1.798 3.594-4.771 5.391-8.919l32.557-82.3434 14.723-2.6964 1.452.2074c0 .5531 3.11 11.477 9.331 32.7715 6.359 21.2945 12.027 38.9247 17.004 52.8909 1.383 4.01 3.111 6.844 5.184 8.504 2.212 1.521 5.668 2.489 10.369 2.903l.41.83-1.03 7.467c-1.38 0-3.942-.069-7.675-.207-3.733-.139-7.465-.208-11.198-.208-5.668 0-11.059.208-16.174.622-5.116.415-8.433.692-9.954.83l-.622-1.037Zm-8.71-45.2163c4.839 0 9.885-.2765 15.138-.8296l-12.649-40.2384h-1.452l-15.137 41.068h14.1Z"
                        fill="#000000"
                     />
                  </svg>
               </div>
            </div>
         </div>
      </>
   );
};
export default home;
