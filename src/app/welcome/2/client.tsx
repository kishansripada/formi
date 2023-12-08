"use client";

import Link from "next/link";
// import { PerformancePreview } from "./_components/PerformancePreview";
import { motion } from "framer-motion";
import { AuthSession } from "@supabase/supabase-js";
import { Input } from "../../../../@/components/ui/input";
import { ThemeProvider } from "../../../../@/components/theme-provider";
import { Button } from "../../../../@/components/ui/button";
export default function Client({ session }: { session: AuthSession }) {
   return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
         <div className=" h-screen flex flex-col overflow-hidden bg-neutral-950 text-white items-center justify-center ">
            <motion.div
               className="z-10"
               initial={{ opacity: 0, scale: 1, y: -25 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 0.5 }}
            >
               <div className="lg:max-w-3xl max-w-xs flex flex-col items-center  ">
                  <p className="text-4xl font-semibold">Watch a short tutorial before diving in?</p>
                  <iframe
                     className="mt-10 rounded-lg"
                     width="250"
                     height="450"
                     src="https://www.youtube.com/embed/uiTwpkpsL1E"
                     title="YouTube video player"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                     allowFullScreen
                  ></iframe>

                  <div className="flex flex-col gap-4 mt-10 w-full">
                     <Link href={"/dashboard"}>
                        <Button className="w-full">Get Started</Button>
                     </Link>
                  </div>
                  <div className="flex flex-row items-center justify-between p-5"></div>
               </div>
            </motion.div>
            <div className="relative">
               <div
                  className="pointer-events-none absolute left-[-1400px] top-0   h-[1000px] w-[1700px] "
                  style={{
                     //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                     backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                     // right: -400,
                     top: -1000,
                     // top: -150,

                     opacity: 0.2,
                  }}
               ></div>
               <div
                  className="pointer-events-none absolute right-[-1300px]   h-[1000px] w-[1700px] "
                  style={{
                     //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                     backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #9333ea 0%, rgba(239, 255, 250, 0) 100%)",
                     // right: -400,
                     bottom: -500,
                     // top: -150,

                     opacity: 0.2,
                  }}
               ></div>
            </div>
         </div>
      </ThemeProvider>
   );
}
