import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export const Sidebar: React.FC<{
   setMenuOpen: Function;
   menuOpen: string;
   viewOnly: boolean;
}> = ({ setMenuOpen, menuOpen, viewOnly }) => {
   return (
      <>
         <div className="lg:flex hidden flex-col  h-full  items-center  text-[10px] dark:bg-black  text-black bg-neutral-100  child:mb-5   w-20 min-w-20 border-r border-neutral-300 dark:border-neutral-700">
            {/* <button onClick={() => setMenuOpen("formations")}>
               <svg
                  className={` ${
                     menuOpen === "formations" ? "stroke-pink-600" : "dark:stroke-white stroke-neutral-600"
                  } transition duration-300 ease-in-out  w-7 h-7`}
                  fill="none"
                  viewBox="0 0 40 40"
               >
                  <g filter="url(#a)">
                     <path d="M8 17.6c0-3.3603 0-5.0405.65396-6.3239.57524-1.129 1.49314-2.0469 2.62214-2.62214C12.5595 8 14.2397 8 17.6 8h4.8c3.3603 0 5.0405 0 6.3239.65396 1.129.57524 2.0469 1.49314 2.6221 2.62214C32 12.5595 32 14.2397 32 17.6v4.8c0 3.3603 0 5.0405-.654 6.3239-.5752 1.129-1.4931 2.0469-2.6221 2.6221C27.4405 32 25.7603 32 22.4 32h-4.8c-3.3603 0-5.0405 0-6.3239-.654-1.129-.5752-2.0469-1.4931-2.62214-2.6221C8 27.4405 8 25.7603 8 22.4v-4.8Zm12.5649 2.9183c.1207.294.4656.5283 1.1555.9969l3.8726 2.6304c.8563.5816 1.2845.8725 1.6401.8534.3097-.0166.5964-.1685.7842-.4153.2155-.2835.2155-.8011.2155-1.8362v-5.2609c0-1.0351 0-1.5527-.2155-1.8361-.1878-.2469-.4745-.3988-.7842-.4154-.3556-.0191-.7838.2718-1.6401.8534l-3.8726 2.6304c-.6899.4686-1.0348.7029-1.1555.9969-.1056.2571-.1056.5454 0 .8025Z" />
                     <path
                        fill="url(#b)"
                        d="M8 17.6c0-3.3603 0-5.0405.65396-6.3239.57524-1.129 1.49314-2.0469 2.62214-2.62214C12.5595 8 14.2397 8 17.6 8h4.8c3.3603 0 5.0405 0 6.3239.65396 1.129.57524 2.0469 1.49314 2.6221 2.62214C32 12.5595 32 14.2397 32 17.6v4.8c0 3.3603 0 5.0405-.654 6.3239-.5752 1.129-1.4931 2.0469-2.6221 2.6221C27.4405 32 25.7603 32 22.4 32h-4.8c-3.3603 0-5.0405 0-6.3239-.654-1.129-.5752-2.0469-1.4931-2.62214-2.6221C8 27.4405 8 25.7603 8 22.4v-4.8Zm12.5649 2.9183c.1207.294.4656.5283 1.1555.9969l3.8726 2.6304c.8563.5816 1.2845.8725 1.6401.8534.3097-.0166.5964-.1685.7842-.4153.2155-.2835.2155-.8011.2155-1.8362v-5.2609c0-1.0351 0-1.5527-.2155-1.8361-.1878-.2469-.4745-.3988-.7842-.4154-.3556-.0191-.7838.2718-1.6401.8534l-3.8726 2.6304c-.6899.4686-1.0348.7029-1.1555.9969-.1056.2571-.1056.5454 0 .8025Z"
                     />
                  </g>
                  <g filter="url(#c)">
                     <path
                        fill="#fff"
                        d="M18.2453 18.7189c.6898.4686 1.0348.7029 1.1555.9969.1056.2571.1056.5455 0 .8026-.1207.2939-.4657.5282-1.1555.9968l-3.8726 2.6304c-.8564.5817-1.2845.8725-1.6401.8534-.3097-.0166-.5964-.1685-.7842-.4153-.2156-.2834-.2156-.801-.2156-1.8362v-5.2608c0-1.0352 0-1.5528.2156-1.8362.1878-.2469.4745-.3988.7842-.4154.3556-.019.7837.2718 1.6401.8534l3.8726 2.6304Z"
                     />
                  </g>
               </svg>
            </button> */}

            <button
               className="flex flex-col items-center dark:text-neutral-300 font-semibold text-neutral-600   "
               onClick={() => setMenuOpen("formations")}
            >
               <svg
                  className={` ${
                     menuOpen === "formations" ? "stroke-pink-600" : "dark:stroke-neutral-300 stroke-neutral-400"
                  } transition duration-300 ease-in-out  w-7 h-7 mt-4`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
               </svg>
               <p className=" mt-1">Formation</p>
            </button>

            <button
               className="flex flex-col items-center dark:text-neutral-300 font-semibold text-neutral-600   "
               onClick={() => setMenuOpen("dancers")}
            >
               <svg
                  className={` ${
                     menuOpen === "dancers" ? "stroke-pink-600" : "dark:stroke-neutral-300 stroke-neutral-400"
                  } transition duration-300 ease-in-out  w-7 h-7`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
               </svg>
               <p className=" mt-1">Roster</p>
            </button>
            <button
               className="flex flex-col items-center dark:text-neutral-300 font-semibold text-neutral-600   "
               onClick={() => setMenuOpen("audio")}
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  fill="none"
                  className={`w-7 h-7 ${menuOpen === "audio" ? "stroke-pink-600" : "dark:stroke-neutral-300 stroke-neutral-400"} `}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                  />
               </svg>
               <p className=" mt-1">Media</p>
            </button>
            <button
               className="flex flex-col items-center dark:text-neutral-300 font-semibold text-neutral-600   "
               onClick={() => setMenuOpen("collisions")}
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-7 h-7 ${menuOpen === "collisions" ? "stroke-pink-600" : "dark:stroke-neutral-300 stroke-neutral-400"} `}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
               </svg>
               <p className=" mt-1">Collisions</p>
            </button>
            <button
               className="flex flex-col items-center dark:text-neutral-300 font-semibold text-neutral-600   "
               onClick={() => setMenuOpen("props")}
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-7 h-7 ${menuOpen === "props" ? "stroke-pink-600" : "dark:stroke-neutral-300 stroke-neutral-400"} `}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                  />
               </svg>

               <p className=" mt-1">Scenery</p>
               <p className="bg-pink-600 py-[0.5px] px-2 text-white rounded-full  mt-1">BETA</p>
            </button>

            {/* <button
               className="flex flex-col items-center dark:text-neutral-300 font-semibold text-neutral-600   "
               onClick={() => setMenuOpen("collisions")}
            >
               <svg
                  className={`w-7 h-7 transition duration-300  ml-auto mr-auto ${
                     menuOpen === "collisions" ? "stroke-pink-600" : "dark:stroke-white stroke-neutral-600"
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
                     d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
               </svg>
               <p className=" mt-1">Collisions</p>
            </button> */}

            <button
               className="flex flex-col mt-auto mb-2 items-center dark:text-neutral-300 font-semibold text-neutral-600   "
               onClick={() => setMenuOpen("stageSettings")}
            >
               <svg
                  className={`w-7 h-7 transition duration-300  ml-auto mr-auto ${
                     menuOpen === "stageSettings" ? "stroke-pink-600" : "dark:stroke-neutral-300 stroke-neutral-400"
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
               <p className=" mt-1">Stage</p>
            </button>
            <button
               className="flex flex-col items-center dark:text-neutral-300 font-semibold text-neutral-600   "
               onClick={() => setMenuOpen("settings")}
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke=""
                  fill="none"
                  className={`w-7 h-7 transition duration-300  ml-auto mr-auto ${
                     menuOpen === "settings" ? "stroke-pink-600" : "dark:stroke-neutral-300 stroke-neutral-400"
                  }`}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <p className=" mt-1">Settings</p>
            </button>
            {/* <button
               onClick={() => setMenuOpen("formations")}
               className={`  font-medium mr-3 ${menuOpen === "formations" ? "text-neutral-100" : "text-neutral-400"}`}
            >
               <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40">
                  <g>
                     <path
                        fill="white"
                        d="M8 17.6c0-3.3603 0-5.0405.65396-6.3239.57524-1.129 1.49314-2.0469 2.62214-2.62214C12.5595 8 14.2397 8 17.6 8h4.8c3.3603 0 5.0405 0 6.3239.65396 1.129.57524 2.0469 1.49314 2.6221 2.62214C32 12.5595 32 14.2397 32 17.6v4.8c0 3.3603 0 5.0405-.654 6.3239-.5752 1.129-1.4931 2.0469-2.6221 2.6221C27.4405 32 25.7603 32 22.4 32h-4.8c-3.3603 0-5.0405 0-6.3239-.654-1.129-.5752-2.0469-1.4931-2.62214-2.6221C8 27.4405 8 25.7603 8 22.4v-4.8Zm12.5649 2.9183c.1207.294.4656.5283 1.1555.9969l3.8726 2.6304c.8563.5816 1.2845.8725 1.6401.8534.3097-.0166.5964-.1685.7842-.4153.2155-.2835.2155-.8011.2155-1.8362v-5.2609c0-1.0351 0-1.5527-.2155-1.8361-.1878-.2469-.4745-.3988-.7842-.4154-.3556-.0191-.7838.2718-1.6401.8534l-3.8726 2.6304c-.6899.4686-1.0348.7029-1.1555.9969-.1056.2571-.1056.5454 0 .8025Z"
                     />
                     <path
                        fill="white"
                        fill-opacity=".2"
                        d="M8 17.6c0-3.3603 0-5.0405.65396-6.3239.57524-1.129 1.49314-2.0469 2.62214-2.62214C12.5595 8 14.2397 8 17.6 8h4.8c3.3603 0 5.0405 0 6.3239.65396 1.129.57524 2.0469 1.49314 2.6221 2.62214C32 12.5595 32 14.2397 32 17.6v4.8c0 3.3603 0 5.0405-.654 6.3239-.5752 1.129-1.4931 2.0469-2.6221 2.6221C27.4405 32 25.7603 32 22.4 32h-4.8c-3.3603 0-5.0405 0-6.3239-.654-1.129-.5752-2.0469-1.4931-2.62214-2.6221C8 27.4405 8 25.7603 8 22.4v-4.8Zm12.5649 2.9183c.1207.294.4656.5283 1.1555.9969l3.8726 2.6304c.8563.5816 1.2845.8725 1.6401.8534.3097-.0166.5964-.1685.7842-.4153.2155-.2835.2155-.8011.2155-1.8362v-5.2609c0-1.0351 0-1.5527-.2155-1.8361-.1878-.2469-.4745-.3988-.7842-.4154-.3556-.0191-.7838.2718-1.6401.8534l-3.8726 2.6304c-.6899.4686-1.0348.7029-1.1555.9969-.1056.2571-.1056.5454 0 .8025Z"
                     />
                  </g>
                  <g fill="white">
                     <path
                        fill="white"
                        d="M18.2453 18.7189c.6898.4686 1.0348.7029 1.1555.9969.1056.2571.1056.5455 0 .8026-.1207.2939-.4657.5282-1.1555.9968l-3.8726 2.6304c-.8564.5817-1.2845.8725-1.6401.8534-.3097-.0166-.5964-.1685-.7842-.4153-.2156-.2834-.2156-.801-.2156-1.8362v-5.2608c0-1.0352 0-1.5528.2156-1.8362.1878-.2469.4745-.3988.7842-.4154.3556-.019.7837.2718 1.6401.8534l3.8726 2.6304Z"
                     />
                  </g>
               </svg>
            </button>
            <button
               onClick={() => setMenuOpen("dancers")}
               className={`  font-medium mr-3 ${menuOpen === "dancers" ? "text-neutral-100" : "text-neutral-400"}`}
            >
               Roster
            </button>
            {!viewOnly ? (
               <>
                  {" "}
                  <button
                     onClick={() => setMenuOpen("audio")}
                     className={`  font-medium mr-3 ${menuOpen === "audio" ? "text-neutral-100" : "text-neutral-400"}`}
                  >
                     Media
                  </button>
                  <button
                     className={`  font-medium mr-3 ${menuOpen === "stageSettings" ? "text-neutral-100" : "text-neutral-400"}`}
                     onClick={() => setMenuOpen("stageSettings")}
                  >
                     Stage
                  </button>
               </>
            ) : null}

            <button onClick={() => setMenuOpen("settings")} className="text-neutral-100  font-medium ml-auto">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke=""
                  fill="none"
                  className={`w-5 h-5  transition duration-300  ${menuOpen === "settings" ? "stroke-white" : "stroke-neutral-400"}`}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
            </button> */}
         </div>
      </>
   );
};
