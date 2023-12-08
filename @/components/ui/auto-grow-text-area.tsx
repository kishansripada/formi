import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const AutoGrowTextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, value, ...props }) => {
   return (
      <div className="flex flex-row items-center  relative w-full h-min">
         <div className="text-xs  w-full flex-grow py-1 pointer-events-none opacity-0  ">
            {(value || "").split("\n").map((line) => {
               return <p className={cn("", className)}>{line || "p"}</p>;
            })}
         </div>
         <textarea
            value={value}
            className={cn(
               "w-full cursor-default min-h-[15px] py-1 absolute   focus:outline-none  overflow-hidden rounded-none bg-neutral-900 resize-none h-full text-xs  bg-transparent text-white",
               className
            )}
            {...props}
         ></textarea>
      </div>
   );
});

AutoGrowTextArea.displayName = "AutoGrowTextArea";

export { AutoGrowTextArea };
