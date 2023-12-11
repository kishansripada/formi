import * as React from "react";

import { cn } from "@/lib/utils";

export const ColorSplotch = React.forwardRef<HTMLDivElement>(({ className, color, style, ...props }, ref) => {
   return (
      <div
         style={{
            backgroundImage: `radial-gradient(50% 50% at 50% 50%, ${hexToRgba(color, 50)} 0%, ${hexToRgba(color, 0)} 100%)`,
            opacity: 0.2,
            ...style,
         }}
         className="h-[1200px] w-[1200px] absolute pointer-events-none select-none translate-y-1/2 translate-x-1/2 "
      ></div>
      //       <div
      //       className="pointer-events-none absolute right-[-1000px] top-0   h-[1000px] w-[1700px]"
      //       style={{
      //          //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
      //          backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #9333ea 0%, rgba(239, 255, 250, 0) 100%)",
      //          // right: -400,
      //          top: -200,
      //          // top: -150,

      //          opacity: 0.3,
      //       }}
      //    ></div>
   );
});

function hexToRgba(hex: string, opacity: number): string {
   // Ensure the hex code is valid and opacity is within the correct range
   if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex) || opacity < 0 || opacity > 100) {
      throw new Error("Invalid hex color or opacity value");
   }

   let r: number, g: number, b: number;

   if (hex.length === 4) {
      // 3-digit hex code
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
   } else {
      // 6-digit hex code
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
   }

   // Convert opacity to 0-1 range
   const alpha = opacity / 100;

   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
