"use client";

import { motion } from "framer-motion";
import { AuthSession } from "@supabase/supabase-js";
import { Input } from "../../../../@/components/ui/input";
import { ThemeProvider } from "../../../../@/components/theme-provider";
import { Button } from "../../../../@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AppWrapper } from "../../../../@/components/ui/app-wrapper";
export default function Client({ session }: { session: AuthSession }) {
   const router = useRouter();

   const firstName = session?.user?.user_metadata?.full_name ? session.user.user_metadata.full_name.split(" ")[0] : "";
   const email = session?.user?.email;
   return (
      <AppWrapper>
         <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <div className=" h-screen flex flex-col overflow-hidden bg-neutral-900 text-white items-center justify-center ">
               <motion.div
                  className="z-10"
                  initial={{ opacity: 0, scale: 1, y: -25 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
               >
                  <div className="lg:max-w-md max-w-xs flex flex-col  ">
                     <p className="text-3xl font-medium">This 1 minute tutorial should give you the fundamentals!</p>
                     <p className="mt-3 text-neutral-300 text-sm">Otherwise feel free to skip</p>

                     <div className="flex flex-col gap-4 mt-10 items-center">
                        <div className="rounded-md overflow-hidden">
                           <iframe
                              className="md:h-[533px] md:w-[300px] w-[200px] h-[354px] "
                              src="https://player.vimeo.com/video/895024118?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                              // frameborder="0"
                              allow="autoplay; fullscreen; picture-in-picture"
                              title="8c4caaa3d1b64eb08ea2677768472cfe"
                           ></iframe>
                        </div>
                        <script src="https://player.vimeo.com/api/player.js"></script>
                        <Button
                           className="w-full"
                           onClick={async () => {
                              router.push("/dashboard");
                              const response = await fetch("/api/send", {
                                 method: "POST", // *GET, POST, PUT, DELETE, etc.
                                 mode: "cors", // no-cors, *cors, same-origin
                                 credentials: "same-origin", // include, *same-origin, omit
                                 headers: {
                                    "Content-Type": "application/json",
                                 },
                                 body: JSON.stringify({ firstName, to: email }), // body data type must match "Content-Type" header
                              });
                           }}
                        >
                           Get started
                        </Button>
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
      </AppWrapper>
   );
}
