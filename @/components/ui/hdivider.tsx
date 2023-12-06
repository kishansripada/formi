import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const HDivider = React.forwardRef<HTMLInputElement>(({ ...props }, ref) => {
   return <div className={cn("h-[1px] w-full bg-neutral-700")} ref={ref} {...props} />;
});

HDivider.displayName = "HDivider";

export { HDivider };
