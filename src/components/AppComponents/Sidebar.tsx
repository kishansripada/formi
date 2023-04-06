import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export const Sidebar: React.FC<{
   setMenuOpen: Function;
   menuOpen: string;
}> = ({ setMenuOpen, menuOpen }) => {
   return (
      <>
         <div className="lg:flex hidden flex-row  w-full  items-center justify-start   bg-neutral-800 min-h-[40px] h-10 px-3 ">
            {/* <button className={` ${menuOpen === "formations" ? "bg-pink-600" : ""} `} onClick={() => setMenuOpen("formations")}>
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
            </button>

            <button className={` ${menuOpen === "dancers" ? "bg-pink-600" : ""} `} onClick={() => setMenuOpen("dancers")}>
               <svg
                  className={` ${menuOpen === "dancers" ? "fill-pink-600" : "fill-white"} scale-75 transition duration-300 ease-in-out w-10 h-10`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 96 960 960"
               >
                  <path d="M0 816v-53q0-38.567 41.5-62.784Q83 676 150.376 676q12.165 0 23.395.5Q185 677 196 678.652q-8 17.348-12 35.165T180 751v65H0Zm240 0v-65q0-32 17.5-58.5T307 646q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-19.861-3.5-37.431Q773 696 765 678.727q11-1.727 22.171-2.227 11.172-.5 22.829-.5 67.5 0 108.75 23.768T960 763v53H780Zm-480-60h360v-6q0-37-50.5-60.5T480 666q-79 0-129.5 23.5T300 751v5ZM149.567 646Q121 646 100.5 625.438 80 604.875 80 576q0-29 20.562-49.5Q121.125 506 150 506q29 0 49.5 20.5t20.5 49.933Q220 605 199.5 625.5T149.567 646Zm660 0Q781 646 760.5 625.438 740 604.875 740 576q0-29 20.562-49.5Q781.125 506 810 506q29 0 49.5 20.5t20.5 49.933Q880 605 859.5 625.5T809.567 646ZM480 576q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600 456q0 50-34.5 85T480 576Zm.351-60Q506 516 523 498.649t17-43Q540 430 522.851 413t-42.5-17Q455 396 437.5 413.149t-17.5 42.5Q420 481 437.351 498.5t43 17.5ZM480 756Zm0-300Z" />
               </svg>
            </button>
            <button className={` ${menuOpen === "audio" ? "bg-pink-600" : ""} `} onClick={() => setMenuOpen("audio")}>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  fill="none"
                  className={`w-6 h-6 stroke-white `}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                  />
               </svg>
            </button>

            <button className={` ${menuOpen === "presets" ? "bg-pink-600" : ""} `} onClick={() => setMenuOpen("presets")}>
               <svg
                  className={`w-8 h-8 transition duration-300  ml-auto mr-auto ${menuOpen === "presets" ? "stroke-[#db2777]" : "stroke-white"}`}
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
            </button>
            <button className={` ${menuOpen === "collisions" ? "bg-pink-600" : ""} `} onClick={() => setMenuOpen("collisions")}>
               <svg
                  className={`w-8 h-8 transition duration-300  ml-auto mr-auto ${menuOpen === "collisions" ? "stroke-[#db2777]" : "stroke-white"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
               </svg>
            </button>

            <button onClick={() => setMenuOpen("stageSettings")} className="mt-auto mb-2">
               <svg
                  className={`w-8 h-8 transition duration-300  ml-auto mr-auto ${menuOpen === "stageSettings" ? "stroke-[#db2777]" : "stroke-white"}`}
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
            </button>
            <button onClick={() => setMenuOpen("settings")} className="">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke=""
                  fill="white"
                  className={`w-8 h-8 transition duration-300  ml-auto mr-auto ${menuOpen === "settings" ? "stroke-[#db2777]" : "stroke-white"}`}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
            </button> */}
            <button
               onClick={() => setMenuOpen("formations")}
               className={` text-xs font-medium mr-3 ${menuOpen === "formations" ? "text-neutral-100" : "text-neutral-400"}`}
            >
               Formation
            </button>
            <button
               onClick={() => setMenuOpen("dancers")}
               className={` text-xs font-medium mr-3 ${menuOpen === "dancers" ? "text-neutral-100" : "text-neutral-400"}`}
            >
               Roster
            </button>
            <button
               onClick={() => setMenuOpen("audio")}
               className={` text-xs font-medium mr-3 ${menuOpen === "audio" ? "text-neutral-100" : "text-neutral-400"}`}
            >
               Media
            </button>
            <button
               className={` text-xs font-medium mr-3 ${menuOpen === "stageSettings" ? "text-neutral-100" : "text-neutral-400"}`}
               onClick={() => setMenuOpen("stageSettings")}
            >
               Stage
            </button>

            <button onClick={() => setMenuOpen("settings")} className="text-neutral-100 text-xs font-medium ml-auto">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke=""
                  fill="none"
                  className={`w-5 h-5  transition duration-300  ${menuOpen === "settings" ? "stroke-[#db2777]" : "stroke-white"}`}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
            </button>
         </div>
      </>
   );
};
