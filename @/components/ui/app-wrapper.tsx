"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export const AppWrapper = ({ className, children, style, ...props }) => {
   React.useEffect(() => {
      let vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty("--vh", `${vh}px`);
   }, []);
   return (
      <div
         className={cn(" overflow-hidden select-none full-screen overscroll-none", className)}
         style={{
            touchAction: "none",
            ...style,
         }}
         {...props}
      >
         <style>
            {`
               html,
               body {
                  overscroll-behavior: none;
                  overscroll-behavior-y: none;
                  overflow-y: overlay;
                  background-color: black;
                  // overscroll-behavior-x: none;
               }
               .full-screen {
                  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
                  height: calc(var(--vh, 1vh) * 100);
               }
            `}
         </style>
         <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
         {children}
      </div>
   );
};

// AppWrapper.displayName = "AppWrapper";
