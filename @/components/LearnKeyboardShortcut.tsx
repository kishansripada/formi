import React, { useEffect, useState } from "react";
import { HStack, VStack } from "./ui/stacks";

const LearnKeyboardShortcut = ({ action, description, shortcut }: { action: string; description: string; shortcut: string[] }) => {
   return (
      <HStack className="items-start justify-between gap-4 w-full">
         <VStack className=" gap-1">
            <p className="text-pink-500 font-medium">{action}</p>
            <p className="text-xs text-neutral-300">{description}</p>
         </VStack>

         <HStack className="items-center gap-2">
            {shortcut.map((key) => {
               return <div className="grid place-items-center bg-pink-300 px-4 whitespace-nowrap h-10 rounded-md text-black">{key}</div>;
            })}
         </HStack>
      </HStack>
   );
};

export default LearnKeyboardShortcut;
