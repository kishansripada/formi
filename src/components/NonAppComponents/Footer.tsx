import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import logo from "../../../public/logo.svg";
import Image from "next/image";
export const Footer = () => {
   return (
      <>
         <div className="bg-[#fafafa]  pt-6 pb-6 px-12 dark:bg-[#111111] w-full ">
            <div className="w-[150px] cursor-pointer">
               {/* <h1 className="text-6xl font-bold z-10 relative">naach.app</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[58%]"></div> */}
               <h1 className="text-4xl font-bold dark:text-white z-10 relative ">FORMI</h1>

               <div className="bg-[#E7ADC5] relative h-2  dark:bg-pink-600 top-[-10px] mr-auto w-[100%]"></div>
            </div>
            <p className="text-sm dark:text-neutral-200 text-neutral-500">© 2023 The Sripada Company, LLC. All Rights Reserved</p>
            <p className="text-neutral-500  max-w-[300px] text-sm mt-2">Contact us at: kishansripada@formistudio.app</p>
            <p className="text-neutral-400 max-w-[300px] text-sm mt-2">
               All trademarks, logos, and brand names are the property of their respective owners.
            </p>

            <div className=" flex flex-row  mt-12 ">
               <svg
                  className="ml-auto opacity-40 dark:fill-white fill-black"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width={200}
                  viewBox="0 0 1004 135"
               >
                  <path d="M13.5643 134.909c-2.4886 0-4.6661-.207-6.53252-.621-1.86642-.345-3.31808-.69-4.35499-1.035-.96777-.344-1.45166-.517-1.45166-.517l-.311067-.724c.138257-.759.276507-2 .414757-3.725.20738-1.793.3802-3.656.51845-5.587.20738-1.931.31107-3.449.31107-4.552l3.62916-.518c0 4.553.76039 7.76 2.28118 9.623 1.52079 1.862 4.11302 2.793 7.77672 2.793 2.6269 0 4.8389-.586 6.6362-1.759 1.7973-1.172 2.6959-2.621 2.6959-4.345 0-1.173-.3456-2.242-1.0369-3.208-.6912-.965-1.9009-2.035-3.6291-3.207-1.7282-1.173-4.1822-2.587-7.362-4.242-3.94023-2-6.80899-4.035-8.60628-6.104-1.7973-2.07-2.69595-4.346-2.69595-6.829 0-2.8281.82952-5.3457 2.48857-7.5529 1.65904-2.2073 3.94022-3.9317 6.84356-5.1732 2.9033-1.3106 6.1523-1.9658 9.7469-1.9658 2.8341 0 5.2536.2759 7.2583.8277l3.1107.8277.2073.5173s-.1382.5863-.4147 1.7589c-.2074 1.1726-.4839 2.7245-.8295 4.6559-.2765 1.8623-.5185 3.9316-.7259 6.2074l-3.8365.311s.0346-.38.1037-1.1383c.0691-.7588.1037-1.3795.1037-1.8624 0-2.4831-.6913-4.2765-2.0738-5.3801-1.3134-1.1726-3.4564-1.7589-6.4288-1.7589-2.3503 0-4.355.5518-6.014 1.6554-1.58995 1.1037-2.38491 2.4487-2.38491 4.0351 0 1.6555.69127 3.2074 2.07381 4.6562 1.4517 1.448 3.7674 3 6.9472 4.656 3.7329 1.931 6.6362 3.69 8.71 5.276 2.1429 1.518 3.6292 3.001 4.4587 4.449.8986 1.449 1.3479 3.035 1.3479 4.76 0 2.621-.8986 5.069-2.6959 7.345-1.7282 2.277-4.0439 4.104-6.9472 5.484-2.8342 1.311-5.9449 1.966-9.3321 1.966ZM85.1461 129.943c2.0738-.207 3.4563-.863 4.1476-1.966.6912-1.173 1.0369-3.38 1.0369-6.622V98.593c0-2.2762-.3111-3.8971-.9332-4.8628-.6222-.9656-1.6245-1.4485-3.007-1.4485-.5531 0-1.0715.069-1.5554.207-.4148.0689-.6221.1034-.6221.1034l-.5185-.7242.3111-3.2074c2.1429-.4138 4.2858-.8622 6.4288-1.345 2.1429-.4828 3.9402-.8967 5.3919-1.2416 1.4516-.3449 2.1774-.5173 2.1774-.5173l.7259.6208-.3111 1.6554c-.1382 1.1036-.2765 2.4831-.4148 4.1386-.1382 1.5864-.2073 3.2073-.2073 4.8627l.4147.3104c2.143-3.2418 4.597-5.8974 7.362-7.9667 2.765-2.0692 5.185-3.1039 7.258-3.1039 1.175 0 2.005.069 2.489.2069l.726.207.311.4138s-.069.4829-.208 1.4485c-.138.8967-.311 2.1038-.518 3.6213-.207 1.4484-.415 3.0349-.622 4.7593-.138 1.7244-.242 3.3803-.311 4.9663l-4.044.31c0-2.8277-.173-4.69-.519-5.5867-.345-.9657-1.106-1.4485-2.281-1.4485-1.521 0-3.145.6208-4.873 1.8623-1.728 1.2416-3.3183 2.966-4.77 5.1729 0 0-.0345.656-.1037 1.966-.0691 1.242-.1382 2.828-.2073 4.759-.0692 1.932-.1383 3.932-.2074 6.001-.0692 2.001-.1383 3.794-.2074 5.381-.0691 1.517-.1037 2.517-.1037 3 0 2.345.3456 3.932 1.0369 4.759.6913.828 2.0046 1.242 3.9406 1.242.76 0 1.693-.035 2.799-.104 1.175-.069 1.763-.103 1.763-.103l.104.414-.934 4.552s-.345-.034-1.036-.103h-2.696c-1.106 0-2.282-.035-3.5258-.104h-3.3181c-2.0047 0-3.8366.035-5.4956.104-1.659.069-2.9724.138-3.9402.207-.9678.069-1.4517.103-1.4517.103l.5185-4.138ZM164.761 134.909l.414-4.242c2.074-.552 3.56-1.345 4.459-2.38.899-1.103 1.348-2.552 1.348-4.345V97.6619c0-1.9314-.311-3.3454-.933-4.2421-.622-.8966-1.59-1.345-2.904-1.345-.553 0-1.14.069-1.762.2069-.553.138-.83.207-.83.207l.415-3.8282c1.728-.2759 3.456-.5863 5.184-.9312 1.798-.3448 3.422-.6552 4.874-.9311 1.452-.3449 2.627-.6208 3.525-.8277.899-.207 1.348-.3104 1.348-.3104l.519 1.2415c-.277.6898-.588 2.2417-.933 4.6559-.277 2.3452-.519 5.2422-.726 8.6905-.208 3.38-.38 7.105-.519 11.175-.138 4-.207 8.035-.207 12.105 0 2 .276 3.483.829 4.449.553.896 1.487 1.345 2.8 1.345.622 0 1.383-.035 2.281-.104.899-.069 1.348-.103 1.348-.103l.208.414-.83 4.449s-.311-.035-.933-.104c-.553 0-1.314-.034-2.281-.103-.899 0-1.901-.035-3.007-.104h-3.007c-1.452 0-3.007.104-4.666.311-1.659.207-3.077.414-4.252.62-1.175.207-1.762.311-1.762.311Zm9.124-61.4577c-1.728 0-3.007-.5518-3.836-1.6554-.83-1.1036-1.244-2.3107-1.244-3.6212 0-1.6554.587-3.0694 1.762-4.242 1.175-1.2416 2.627-1.8624 4.355-1.8624 1.659 0 2.904.5518 3.733 1.6554.899 1.0347 1.348 2.2418 1.348 3.6213 0 1.6554-.588 3.1039-1.763 4.3454-1.106 1.1726-2.557 1.7589-4.355 1.7589ZM275.623 125.164c6.083-1.106 10.092-2.696 12.028-4.77 1.935-2.213 2.903-6.292 2.903-12.238l.207-87.1134c0-4.4249-.553-7.3978-1.659-8.9188-.967-1.5211-2.972-2.28159-6.013-2.28159-1.383 0-2.765.06913-4.148.20739-1.382.1383-2.35.2074-2.903.2074l-.415-.82962 1.452-9.126221c1.659.138274 4.769.276552 9.332.414835 4.562.138274 9.124.207409 13.686.207409 4.285 0 9.124-.069135 14.515-.207409 5.53-.276557 9.401-.48397 11.613-.622244 14.377 0 25.368 3.18034 32.971 9.54104 7.604 6.36071 11.405 15.48691 11.405 27.37871 0 7.7434-2.281 15.1412-6.843 22.1933-4.424 6.9138-10.299 12.5139-17.626 16.8005-7.327 4.2865-14.999 6.4298-23.018 6.4298h-17.418l-.415 20.3269c0 6.637.207 11.407.622 14.311.415 2.766 1.175 4.633 2.281 5.6 1.244.83 3.318 1.245 6.221 1.245 2.35 0 4.562-.069 6.636-.207 2.212-.139 3.732-.277 4.562-.415l.415.829-1.867 9.541c-1.382-.138-3.94-.276-7.672-.414-3.595-.139-7.396-.208-11.406-.208-5.529 0-12.027.208-19.492.622-7.327.415-11.129.761-11.405 1.037l1.451-9.541Zm52.464-51.8531c8.295-1.3828 14.516-4.7705 18.663-10.1633 4.286-5.3927 6.429-12.7905 6.429-22.1933 0-10.6472-3.18-18.3907-9.539-23.2304-6.221-4.9779-16.037-7.4669-29.446-7.4669-2.489 0-4.009.1383-4.562.4149-.553.2765-.899 1.1062-1.037 2.4889-1.244 17.5611-2.074 36.574-2.489 57.0389l21.981 3.1112ZM528.899 133.461l.622-7.467c5.806-.415 9.677-1.037 11.613-1.867 2.073-.829 3.11-2.212 3.11-4.148 0-2.212-.484-4.563-1.451-7.052l-4.977-15.9709c-2.765-.1383-8.502-.2074-17.212-.2074-4.009 0-9.953.4148-17.833 1.2445l-5.806 15.3488c-.968 3.18-1.452 5.116-1.452 5.807 0 2.213.76 3.803 2.281 4.771 1.521.968 4.009 1.452 7.465 1.452h8.917l.622.829-1.244 7.882c-1.382-.138-4.562-.345-9.539-.622-4.838-.277-9.608-.415-14.308-.415-4.424 0-8.433.069-12.027.208-3.457.138-5.807.207-7.051.207l1.244-8.504c3.042-.415 5.461-1.452 7.258-3.111 1.797-1.798 3.594-4.771 5.392-8.919l32.556-82.3434 14.723-2.6964 1.452.2074c0 .5531 3.11 11.477 9.331 32.7715 6.36 21.2945 12.028 38.9247 17.004 52.8909 1.383 4.01 3.111 6.844 5.184 8.504 2.212 1.521 5.669 2.489 10.369 2.903l.415.83-1.037 7.467c-1.383 0-3.94-.069-7.673-.207-3.732-.139-7.465-.208-11.198-.208-5.668 0-11.059.208-16.174.622-5.115.415-8.433.692-9.954.83l-.622-1.037Zm-8.709-45.2163c4.838 0 9.884-.2765 15.137-.8296l-12.649-40.2384h-1.451l-15.138 41.068h14.101ZM733.107 134.913c-1.798-.277-5.461-.691-10.991-1.245-5.391-.414-9.953-.622-13.686-.622-3.594 0-7.534.208-11.82.622-4.286.554-7.05.968-8.295 1.245l1.037-8.712c4.977-.829 8.364-2.212 10.161-4.148 1.797-1.936 2.696-5.116 2.696-9.541l.207-65.9575c0-3.4569-.414-5.7385-1.244-6.8447-.829-1.2444-2.419-1.8667-4.769-1.8667-1.244 0-2.42.0691-3.526.2074-1.105.1383-1.866.2074-2.281.2074l-.414-1.037 1.244-7.8818c1.382 0 3.871.0692 7.465.2074 3.733.1383 7.465.2075 11.198.2075 4.977 0 10.092-.0692 15.345-.2075 5.253-.2765 8.848-.4148 10.783-.4148 11.06 0 20.806 2.005 29.239 6.015s14.93 9.6793 19.492 17.008c4.701 7.1903 7.051 15.6252 7.051 25.3045 0 10.7855-2.627 20.534-7.88 29.2458-5.115 8.711-12.166 15.625-21.152 20.741-8.986 4.978-18.939 7.467-29.86 7.467Zm-7.88-96.0328c-2.212 0-3.733.2765-4.562.8296-.692.4149-1.106 1.3828-1.245 2.9038-1.659 38.8556-2.488 61.6714-2.488 68.4464 0 3.734.553 6.638 1.659 8.712 1.106 1.936 3.041 3.318 5.806 4.148 2.765.691 6.843 1.037 12.235 1.037 11.612 0 20.667-3.803 27.165-11.408 6.636-7.605 9.953-18.2522 9.953-31.9415 0-13.9659-4.147-24.544-12.442-31.7344-8.294-7.3286-20.321-10.9929-36.081-10.9929ZM957.257 133.461l.622-7.467c5.806-.415 9.677-1.037 11.613-1.867 2.073-.829 3.11-2.212 3.11-4.148 0-2.212-.484-4.563-1.452-7.052l-4.976-15.9709c-2.765-.1383-8.502-.2074-17.212-.2074-4.009 0-9.953.4148-17.833 1.2445l-5.807 15.3488c-.967 3.18-1.451 5.116-1.451 5.807 0 2.213.76 3.803 2.281 4.771 1.521.968 4.009 1.452 7.465 1.452h8.917l.622.829-1.244 7.882c-1.383-.138-4.562-.345-9.539-.622-4.839-.277-9.608-.415-14.308-.415-4.424 0-8.433.069-12.028.208-3.456.138-5.806.207-7.05.207l1.244-8.504c3.041-.415 5.461-1.452 7.258-3.111 1.797-1.798 3.594-4.771 5.391-8.919l32.557-82.3434 14.723-2.6964 1.452.2074c0 .5531 3.11 11.477 9.331 32.7715 6.359 21.2945 12.027 38.9247 17.004 52.8909 1.383 4.01 3.111 6.844 5.184 8.504 2.212 1.521 5.668 2.489 10.369 2.903l.41.83-1.03 7.467c-1.38 0-3.942-.069-7.675-.207-3.733-.139-7.465-.208-11.198-.208-5.668 0-11.059.208-16.174.622-5.116.415-8.433.692-9.954.83l-.622-1.037Zm-8.71-45.2163c4.839 0 9.885-.2765 15.138-.8296l-12.649-40.2384h-1.452l-15.137 41.068h14.1Z" />
               </svg>
            </div>
         </div>
      </>
   );
};
