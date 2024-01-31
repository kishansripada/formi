"use client";

import Link from "next/link";
import { HStack, VStack } from "../../../../@/components/ui/stacks";

export const UpgradeBanner = ({ setCookies }: { setCookies: Function }) => {
   return (
      <HStack className="rounded-md bg-neutral-800 p-7 relative min-h-[250px] overflow-hidden hidden xl:flex ">
         <VStack className="w-1/3">
            <p className="text-2xl font-medium text-[#FEA3E5]">Let FORMI come up with formations</p>
            <p className="text-xl  text-neutral-100">Enjoy the full FORMI experience</p>
            <HStack className="mt-14 items-center gap-5">
               <a href={"/upgrade/checkout/price_1Nv8jbHvC3w6e8fcE6maAFjv?utm_content=dashboard_idea_banner"}>
                  <button className=" rounded-md  px-5 py-2 text-black bg-[#FEA3E5] text-sm font-medium">Upgrade now — $5/month</button>
               </a>

               <Link href={"/upgrade"} className="text-xs text-neutral-300">
                  Learn more
               </Link>
            </HStack>
         </VStack>
         <HStack className="w-1/4">
            <VStack className="w-full gap-5 justify-center">
               <HStack className="items-center gap-2 text-neutral-400 justify-end">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                     />
                  </svg>

                  <p className="text-xs">100+ of formation templates</p>
               </HStack>
               <HStack className="items-center gap-2 text-neutral-400 justify-end">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                     />
                  </svg>

                  <p className="text-xs">Unlimited performances</p>
               </HStack>
               <HStack className="items-center gap-2 text-neutral-400 justify-end">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                     />
                  </svg>

                  <p className="text-xs">Unlimited editors</p>
               </HStack>

               {/* <HStack className="items-center gap-2 text-neutral-400 justify-end">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                     />
                  </svg>

                  <p className="text-xs">Realtime collaboration</p>
               </HStack> */}
               <HStack className="items-center gap-2 text-neutral-400 justify-end">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                     />
                  </svg>

                  <p className="text-xs">Unlimited audio files</p>
               </HStack>
            </VStack>
            {/* <VStack className="w-1/2 items-end text-neutral-300">
               <button
                  onClick={() => {
                     setCookies((cookies) => {
                        return { ...cookies, hideUpgradeBanner: true };
                     });
                  }}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </VStack> */}
         </HStack>
         <VStack className="w-1/3 absolute right-0  ">
            <img className="w-56" src="/templates.png" alt="" />
         </VStack>
      </HStack>
   );
};
