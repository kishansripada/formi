"use client";

import * as Sentry from "@sentry/nextjs";
import type { NextPage } from "next";
import type { ErrorProps } from "next/error";
import { useEffect } from "react";
import { Button } from "../../@/components/ui/button";

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
   useEffect(() => {
      Sentry.captureException(error, {
         tags: {
            section: "error.tsx",
         },
      });
      //   Log the error to an error reporting service
      console.error(error);
   }, [error]);
   return (
      <div className="flex flex-col h-screen items-center justify-center gap-4">
         <h2>Oops! Something went wrong</h2>
         <p className="text-sm">This error was reported to us and we are currently investigating </p>
         <p className="text-sm">Email us at: kishansripada@formistudio.app and we will solve it ASAP</p>

         <Button
            onClick={
               // Attempt to recover by trying to re-render the segment
               () => reset()
            }
         >
            Click here to attempt to fix the error
         </Button>
         <p className="border-2 border-red-500 rounded-md p-2 mt-auto fixed bottom-10">{error.message}</p>
      </div>
   );
};

export default Error;
