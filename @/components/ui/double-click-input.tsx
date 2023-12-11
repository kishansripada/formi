import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const DoubleClickInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
   const [isEditing, setIsEditing] = React.useState(false);
   //    const [value, setValue] = React.useState((props.value as string) || "");

   const handleDoubleClick = () => {
      setIsEditing(true);
   };

   const handleBlur = () => {
      setIsEditing(false);
   };

   return isEditing ? (
      <input
         type={type}
         //  value={value}
         //  onChange={handleChange}
         onBlur={handleBlur}
         className={cn(
            "flex h-4 w-full cursor-default  rounded-md border-2  box-content border-neutral-200 bg-transparent px-3 text-sm  focus:border-pink-600",
            className
         )}
         autoFocus
         ref={ref}
         {...props}
      />
   ) : (
      <span onDoubleClick={handleDoubleClick} className={cn("flex flex-row items-center", className)}>
         {props.value}
      </span>
   );
});

DoubleClickInput.displayName = "Input";

export { DoubleClickInput };
