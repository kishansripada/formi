"use client";

import * as Sentry from "@sentry/nextjs";
import type { NextPage } from "next";
import type { ErrorProps } from "next/error";
import { useEffect } from "react";
import { Button } from "../../@/components/ui/button";

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
   useEffect(() => {
      Sentry.captureException(error);
      //   Log the error to an error reporting service
      console.error(error);
   }, [error]);
   return (
      <div className="flex flex-col h-screen items-center justify-center gap-4">
         <h2>Something went wrong!</h2>
         <Button
            onClick={
               // Attempt to recover by trying to re-render the segment
               () => reset()
            }
         >
            Try again
         </Button>
      </div>
   );
};

export default Error;
