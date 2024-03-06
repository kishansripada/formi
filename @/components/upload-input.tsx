"use client";

import { cn } from "@/lib/utils";
import debounce from "lodash.debounce";
import { forwardRef, useEffect, useMemo, useState } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   debounceDelay?: number; // Optional delay in milliseconds
   onUpdate: (value: string) => void; // Update function
}

const UploadInput = forwardRef<HTMLInputElement, InputProps>(({ className, debounceDelay = 500, onUpdate, ...props }, ref) => {
   const [value, setValue] = useState(props.value);
   const [saved, setSaved] = useState(true);

   const debouncedUpdate = useMemo(
      () =>
         debounce(async (newValue: string) => {
            console.log("upload");

            const x = await onUpdate(newValue);
            setSaved(true);
            console.log("saved");
         }, debounceDelay),
      [onUpdate, debounceDelay]
   );

   useEffect(() => {
      setSaved(false);
      debouncedUpdate(value);
   }, [value, debouncedUpdate]);

   return (
      <input
         className={cn(
            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md py-2  text-sm transition-[padding] file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border focus:px-3 focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
         )}
         style={{
            borderColor: saved ? "" : "orange",
         }}
         ref={ref}
         value={value} // Controlled component
         onChange={(e) => {
            setValue(e.target.value);
         }}
         //  {...props}
      />
   );
});
UploadInput.displayName = "UploadInput";

export { UploadInput };
