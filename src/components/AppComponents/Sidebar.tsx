import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export const Sidebar: React.FC<{
   setMenuOpen: Function;
   menuOpen: string;
}> = ({ setMenuOpen, menuOpen }) => {
   return (
      <>
         <div className="lg:flex hidden flex-col min-w-[90px] border-r-gray-300 border-r items-center justify-start pt-7 child:pb-3 ">
            <button className="flex flex-col items-center justify-center" onClick={() => setMenuOpen("formations")}>
               <svg width="40" height="40" fill="none">
                  <g filter="url(#a)" fillRule="evenodd" clipRule="evenodd">
                     <path
                        className="transition duration-300 ease-in-out"
                        d="M8 17.6c0-3.3603 0-5.0405.65396-6.3239.57524-1.129 1.49314-2.0469 2.62214-2.62214C12.5595 8 14.2397 8 17.6 8h4.8c3.3603 0 5.0405 0 6.3239.65396 1.129.57524 2.0469 1.49314 2.6221 2.62214C32 12.5595 32 14.2397 32 17.6v4.8c0 3.3603 0 5.0405-.654 6.3239-.5752 1.129-1.4931 2.0469-2.6221 2.6221C27.4405 32 25.7603 32 22.4 32h-4.8c-3.3603 0-5.0405 0-6.3239-.654-1.129-.5752-2.0469-1.4931-2.62214-2.6221C8 27.4405 8 25.7603 8 22.4v-4.8Zm12.5649 2.9183c.1207.294.4656.5283 1.1555.9969l3.8726 2.6304c.8563.5816 1.2845.8725 1.6401.8534.3097-.0166.5964-.1685.7842-.4153.2155-.2835.2155-.8011.2155-1.8362v-5.2609c0-1.0351 0-1.5527-.2155-1.8361-.1878-.2469-.4745-.3988-.7842-.4154-.3556-.0191-.7838.2718-1.6401.8534l-3.8726 2.6304c-.6899.4686-1.0348.7029-1.1555.9969-.1056.2571-.1056.5454 0 .8025Z"
                        fill={menuOpen === "formations" ? "#db2777" : "#C5C7D0"}
                     />
                     <path
                        d="M8 17.6c0-3.3603 0-5.0405.65396-6.3239.57524-1.129 1.49314-2.0469 2.62214-2.62214C12.5595 8 14.2397 8 17.6 8h4.8c3.3603 0 5.0405 0 6.3239.65396 1.129.57524 2.0469 1.49314 2.6221 2.62214C32 12.5595 32 14.2397 32 17.6v4.8c0 3.3603 0 5.0405-.654 6.3239-.5752 1.129-1.4931 2.0469-2.6221 2.6221C27.4405 32 25.7603 32 22.4 32h-4.8c-3.3603 0-5.0405 0-6.3239-.654-1.129-.5752-2.0469-1.4931-2.62214-2.6221C8 27.4405 8 25.7603 8 22.4v-4.8Zm12.5649 2.9183c.1207.294.4656.5283 1.1555.9969l3.8726 2.6304c.8563.5816 1.2845.8725 1.6401.8534.3097-.0166.5964-.1685.7842-.4153.2155-.2835.2155-.8011.2155-1.8362v-5.2609c0-1.0351 0-1.5527-.2155-1.8361-.1878-.2469-.4745-.3988-.7842-.4154-.3556-.0191-.7838.2718-1.6401.8534l-3.8726 2.6304c-.6899.4686-1.0348.7029-1.1555.9969-.1056.2571-.1056.5454 0 .8025Z"
                        fill="url(#b)"
                        fillOpacity=".2"
                     />
                  </g>
                  <g filter="url(#c)">
                     <path
                        d="M18.2453 18.7189c.6898.4686 1.0348.7029 1.1555.9969.1056.2571.1056.5455 0 .8026-.1207.2939-.4657.5282-1.1555.9968l-3.8726 2.6304c-.8564.5817-1.2845.8725-1.6401.8534-.3097-.0166-.5964-.1685-.7842-.4153-.2156-.2834-.2156-.801-.2156-1.8362v-5.2608c0-1.0352 0-1.5528.2156-1.8362.1878-.2469.4745-.3988.7842-.4154.3556-.019.7837.2718 1.6401.8534l3.8726 2.6304Z"
                        fill="#fff"
                     />
                  </g>
                  <defs>
                     <filter id="a" x="8" y="8" width="24" height="24" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy=".5" />
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
                        <feBlend in2="shape" result="effect1_innerShadow" />
                     </filter>
                     <filter
                        id="c"
                        x="9.73285"
                        y="14.2343"
                        width="11.7471"
                        height="13.7657"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                     >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="1" />
                        <feGaussianBlur stdDeviation="1" />
                        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                        <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow" />
                        <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                     </filter>
                     <linearGradient id="b" x1="20" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#fff" />
                        <stop offset="1" stopColor="#fff" stopOpacity="0" />
                     </linearGradient>
                  </defs>
               </svg>
               <p className="text-xs text-gray-500">Formation</p>
            </button>

            <button onClick={() => setMenuOpen("dancers")}>
               <svg
                  height="48"
                  width="48"
                  className={` ${menuOpen === "dancers" ? "fill-pink-600" : "fill-gray-400"} scale-75 transition duration-300 ease-in-out`}
               >
                  <path d="M1.9 40v-4.7q0-1.75.9-3.175Q3.7 30.7 5.3 30q3.65-1.6 6.575-2.3Q14.8 27 17.9 27q3.1 0 6 .7t6.55 2.3q1.6.7 2.525 2.125.925 1.425.925 3.175V40Zm35 0v-4.7q0-3.15-1.6-5.175t-4.2-3.275q3.45.4 6.5 1.175t4.95 1.775q1.65.95 2.6 2.35.95 1.4.95 3.15V40Zm-19-16.05q-3.3 0-5.4-2.1-2.1-2.1-2.1-5.4 0-3.3 2.1-5.4 2.1-2.1 5.4-2.1 3.3 0 5.4 2.1 2.1 2.1 2.1 5.4 0 3.3-2.1 5.4-2.1 2.1-5.4 2.1Zm18-7.5q0 3.3-2.1 5.4-2.1 2.1-5.4 2.1-.55 0-1.225-.075T25.95 23.6q1.2-1.25 1.825-3.075.625-1.825.625-4.075t-.625-3.975Q27.15 10.75 25.95 9.3q.55-.15 1.225-.25t1.225-.1q3.3 0 5.4 2.1 2.1 2.1 2.1 5.4ZM4.9 37h26v-1.7q0-.8-.475-1.55T29.25 32.7q-3.6-1.6-6.05-2.15-2.45-.55-5.3-.55-2.85 0-5.325.55T6.5 32.7q-.7.3-1.15 1.05-.45.75-.45 1.55Zm13-16.05q1.95 0 3.225-1.275Q22.4 18.4 22.4 16.45q0-1.95-1.275-3.225Q19.85 11.95 17.9 11.95q-1.95 0-3.225 1.275Q13.4 14.5 13.4 16.45q0 1.95 1.275 3.225Q15.95 20.95 17.9 20.95Zm0 16.05Zm0-20.55Z" />
               </svg>
               <p className="text-xs text-gray-500">Roster</p>
            </button>
            <button onClick={() => setMenuOpen("audio")}>
               <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="background" opacity="0" cx="20" cy="20" r="20" fill="#9094A5"></circle>
                  <g filter="url(#filter0_i_5002_422651)">
                     <rect
                        className="main transition duration-300 ease-in-out"
                        x="8"
                        y="8"
                        width="24"
                        height="24"
                        rx="7"
                        fill={menuOpen === "audio" ? "#db2777" : "#C5C7D0"}
                     ></rect>
                     <rect x="8" y="8" width="24" height="24" rx="7" fill="url(#paint0_linear_5002_422651)" fillOpacity="0.2"></rect>
                  </g>
                  <g filter="url(#filter1_d_5002_422651)">
                     <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M21 24.4956V16.8823C21 16.378 21.3755 15.9526 21.876 15.89L24.1238 15.609C24.6243 15.5465 24.9998 15.1211 24.9998 14.6168V13.0889C24.9998 12.5033 24.4988 12.043 23.9153 12.0925L21.0025 12.3396C19.9425 12.4295 19.1384 13.3335 19.1726 14.3968L19.4126 21.8526C18.9916 21.6275 18.5107 21.4998 18 21.4998C16.3431 21.4998 15 22.843 15 24.4998C15 26.1567 16.3431 27.4998 18 27.4998C19.6313 27.4998 20.9584 26.1979 20.999 24.5764H21V24.504C21 24.5026 21 24.5012 21 24.4998C21 24.4984 21 24.497 21 24.4956Z"
                        fill="white"
                     ></path>
                  </g>
                  <defs>
                     <filter
                        id="filter0_i_5002_422651"
                        x="8"
                        y="8"
                        width="24"
                        height="24"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                     >
                        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                        <feColorMatrix
                           in="SourceAlpha"
                           type="matrix"
                           values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                           result="hardAlpha"
                        ></feColorMatrix>
                        <feOffset dy="0.5"></feOffset>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"></feColorMatrix>
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_5002_422651"></feBlend>
                     </filter>
                     <filter
                        id="filter1_d_5002_422651"
                        x="13"
                        y="11.0889"
                        width="14"
                        height="19.4111"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                     >
                        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                        <feColorMatrix
                           in="SourceAlpha"
                           type="matrix"
                           values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                           result="hardAlpha"
                        ></feColorMatrix>
                        <feOffset dy="1"></feOffset>
                        <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                        <feComposite in2="hardAlpha" operator="out"></feComposite>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5002_422651"></feBlend>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5002_422651" result="shape"></feBlend>
                     </filter>
                     <linearGradient id="paint0_linear_5002_422651" x1="20" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white"></stop>
                        <stop offset="1" stopColor="white" stopOpacity="0"></stop>
                     </linearGradient>
                  </defs>
               </svg>
               <p className="text-xs text-gray-500">Audio</p>
            </button>

            <button onClick={() => setMenuOpen("presets")} className="">
               <svg
                  className={`w-8 h-8 transition duration-300  ml-auto mr-auto ${menuOpen === "presets" ? "stroke-[#db2777]" : "stroke-[#C5C7D0]"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
               </svg>

               <p className="text-xs text-gray-500">Presets</p>
            </button>

            <button onClick={() => setMenuOpen("stageSettings")} className="mt-auto mb-2">
               <svg
                  className={`w-8 h-8 transition duration-300  ml-auto mr-auto ${
                     menuOpen === "stageSettings" ? "stroke-[#db2777]" : "stroke-[#C5C7D0]"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
               </svg>
               <p className="text-xs text-gray-500">Stage</p>
            </button>
            <button onClick={() => setMenuOpen("settings")} className="">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke=""
                  fill="white"
                  className={`w-8 h-8 transition duration-300  ml-auto mr-auto ${menuOpen === "settings" ? "stroke-[#db2777]" : "stroke-[#C5C7D0]"}`}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <p className="text-xs text-gray-500">Settings</p>
            </button>
         </div>
      </>
   );
};
