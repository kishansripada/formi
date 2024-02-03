"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>>(
   ({ className, ...props }, ref) => (
      <SwitchPrimitives.Root
         className={cn(
            "peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-900  dark:focus-visible:ring-neutral-300 dark:focus-visible:ring-offset-neutral-950  dark:bg-neutral-800",
            className
         )}
         {...props}
         ref={ref}
      >
         <SwitchPrimitives.Thumb
            className={cn(
               "pointer-events-none  h-7 w-7 grid place-items-center rounded-full data-[state=checked]:bg-pink-600 data-[state=unchecked]:bg-neutral-950  shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
            )}
         >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 777 621">
               <mask id="a" fill="#fff">
                  <rect width="612" height="454" x="165" rx="62" />
               </mask>
               <rect width="612" height="454" x="165" stroke="white" stroke-width="158" mask="url(#a)" rx="62" />
               <path fill="white" fill-rule="evenodd" d="M629 542H79V119H0v440c0 34.242 27.758 62 62 62h567v-79Z" clip-rule="evenodd" />
            </svg>
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
               <path d="M14 1.75a.75.75 0 0 0-.89-.737l-7.502 1.43a.75.75 0 0 0-.61.736v2.5c0 .018 0 .036.002.054V9.73a1 1 0 0 1-.813.983l-.58.11a1.978 1.978 0 0 0 .741 3.886l.603-.115c.9-.171 1.55-.957 1.55-1.873v-1.543l-.001-.043V6.3l6-1.143v3.146a1 1 0 0 1-.813.982l-.584.111a1.978 1.978 0 0 0 .74 3.886l.326-.062A2.252 2.252 0 0 0 14 11.007V1.75Z" />
            </svg> */}
         </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
   )
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
