import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const HStack = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
   return <div className={cn("flex flex-row  items-center", className)} ref={ref} {...props} />;
});

HStack.displayName = "HStack";

const VStack = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
   return <div className={cn("flex flex-col ", className)} ref={ref} {...props} />;
});

VStack.displayName = "VStack";
export { HStack, VStack };
