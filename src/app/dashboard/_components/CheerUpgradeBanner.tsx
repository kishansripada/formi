"use client";

import Link from "next/link";
import { HStack, VStack } from "../../../../@/components/ui/stacks";

export const CheerUpgradeBanner = ({ setCookies, createNewDance }: { setCookies: Function; createNewDance: Function }) => {
   return (
      <HStack className="rounded-md border border-neutral-700 p-7 relative  max-h-[250px] min-h-[250px] overflow-hidden hidden xl:flex ">
         <VStack className="w-1/3">
            <p className="text-2xl font-medium text-[#FEA3E5]">Since you do cheer,</p>
            <p className="text-xl  text-neutral-100">Check out our official cheer template</p>
            <HStack className="mt-14 items-center gap-5">
               <button
                  onClick={() => {
                     createNewDance(null, null, null, 53922);
                  }}
                  className=" rounded-md  px-5 py-2 text-black bg-[#FEA3E5] text-sm font-medium"
               >
                  New performance from template
               </button>

               <a href="/upgrade" className="text-xs text-neutral-300">
                  Learn more
               </a>
            </HStack>
         </VStack>

         <VStack className="w-1/3 ml-auto  ">
            <img className="h-full" src="/cheerTemplate.png" alt="" />
         </VStack>
         <VStack className="w-[15%]  ">{/* <img className="h-full" src="/cheerTemplate.png" alt="" /> */}</VStack>
      </HStack>
   );
};
