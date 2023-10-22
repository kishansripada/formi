"use client";

import { motion } from "framer-motion";
import { AuthSession } from "@supabase/supabase-js";
import { Input } from "../../../../@/components/ui/input";
import { ThemeProvider } from "../../../../@/components/theme-provider";
import { Button } from "../../../../@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
export default function Client({ session }: { session: AuthSession }) {
   const [selectedUses, setSelectedUses] = useState<string[]>([]);
   const [name, setName] = useState<string>(session?.user?.user_metadata?.full_name ? session.user.user_metadata.full_name.split(" ")[0] : "");
   const supabase = createClientComponentClient();
   const router = useRouter();
   return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
         <div className=" h-screen flex flex-col overflow-hidden bg-neutral-950 text-white items-center justify-center ">
            <motion.div
               className="z-10"
               initial={{ opacity: 0, scale: 1, y: -25 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 0.5 }}
            >
               <div className="lg:max-w-md max-w-xs flex flex-col  ">
                  <p className="text-3xl font-medium">
                     Welcome to FORMI {session.user.user_metadata.full_name ? `, ${session.user.user_metadata.full_name.split(" ")[0]}!` : "!"}
                  </p>

                  <div className="flex flex-col gap-4 mt-10">
                     <div>
                        <p className="text-sm font-medium mb-1">What should we call you?</p>
                        <Input
                           value={name}
                           className="bg-transparent"
                           onChange={(e) => {
                              setName(e.target.value);
                           }}
                        ></Input>
                     </div>
                     <div>
                        <p className="text-sm font-medium mb-1">What do you plan on using FORMI for? (select all that apply)</p>
                        <div className="flex flex-row flex-wrap mb-6 mt-3	 gap-4">
                           {[
                              "🕺 Dance Company",
                              "🩰 Ballet",
                              "🪩 Hip Hop",
                              " 🎭 Theater/Stage Management",
                              "👯‍♀️ Contemp",
                              "📣 Cheer/Pom",
                              "🇰🇷 K-pop",
                              "🇮🇳 Desi Dance",
                              "⛳️ Color Guard",
                              "⛸️ Ice Skating",
                              "🥢 Baton twirling",
                           ].map((d) => {
                              return (
                                 // <div>
                                 <button
                                    onClick={() => {
                                       if (selectedUses.includes(d)) {
                                          setSelectedUses(selectedUses.filter((s) => s !== d));
                                       } else {
                                          setSelectedUses([...selectedUses, d]);
                                       }
                                    }}
                                    style={{
                                       borderColor: selectedUses.includes(d) ? "#db2777" : "inherit",
                                    }}
                                    className="flex flex-row justify-center border-2 border-pink-100 border-opacity-40 px-3 py-2 whitespace-nowrap rounded-full text-sm font-medium"
                                 >
                                    <p className=" text-center">{d}</p>
                                 </button>
                              );
                           })}
                        </div>
                     </div>

                     <Button
                        onClick={async () => {
                           const _ = await supabase.from("user_data").insert({ user_id: session.user.id, response_data: { selectedUses }, name });
                           router.push("/dashboard?onboarded=true");
                        }}
                     >
                        Next
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
   );
}
