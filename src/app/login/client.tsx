"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "../../../@/components/ui/input";
import { Button } from "../../../@/components/ui/button";
import { AppWrapper } from "../../../@/components/ui/app-wrapper";
import { VStack } from "../../../@/components/ui/stacks";
import { HDivider } from "../../../@/components/ui/hdivider";
import { ThemeProvider } from "../../../@/components/theme-provider";
const Client = () => {
   const router = useRouter();
   const supabase = createClientComponentClient();
   const [email, setEmail] = useState("");

   const handleLogin = async () => {
      supabase.auth.signInWithOAuth({
         provider: "google",

         options: {
            redirectTo: `${window.location.origin}/auth/callback`,
         },
      });
   };

   async function signInWithEmail() {
      if (!isValidEmail(email)) {
         toast.error("Invalid email");
         return;
      }
      const { data, error } = await supabase.auth.signInWithOtp({
         email,
         options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
         },
      });
      if (!error) {
         router.push(`/login/emailsent?email=${email}`);
         return;
      }
      if (error) {
         toast("Too many links requested");
         return;
      }
   }

   const [isUsingEmail, setIsUsingEmail] = useState(false);

   return (
      <AppWrapper
         className={"flex flex-col items-center justify-center h-screen w-full text-white"}
         style={{
            backgroundImage: "linear-gradient(180deg, #3A2C34 0%, #22191E 51.04%, #231A1F 97.92%)",
         }}
      >
         <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <Toaster></Toaster>
            <VStack className="max-w-[330px] w-[330px] items-center gap-6">
               <img className="w-8" src="/logo.png" alt="" />
               <p className="text-xl w-full  font-semibold text-center">Sign in to FORMI</p>

               <VStack className="w-full gap-3">
                  <Button onClick={() => handleLogin()} className="dark:bg-[#BA598D] dark:text-white dark:hover:bg-[#8F436C] w-full">
                     <p>Continue with Google</p>
                  </Button>
                  {isUsingEmail && (
                     <>
                        <HDivider></HDivider>
                        <Input
                           value={email}
                           onChange={(e) => {
                              setEmail(e.target.value);
                           }}
                           placeholder="Enter your email address..."
                           className="bg-transparent text-white"
                        ></Input>
                     </>
                  )}

                  <Button
                     onClick={() => {
                        if (isUsingEmail) {
                           signInWithEmail();
                        } else {
                           setIsUsingEmail(true);
                        }
                     }}
                     className="dark:bg-[#382735] dark:text-white dark:hover:bg-[#5C4158] w-full"
                  >
                     <p>Continue with email</p>
                  </Button>
               </VStack>
            </VStack>
         </ThemeProvider>
      </AppWrapper>
   );
};
export default Client;

function isValidEmail(email: string): boolean {
   let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return re.test(email);
}
