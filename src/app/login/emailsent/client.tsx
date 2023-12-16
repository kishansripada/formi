"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { AppWrapper } from "../../../../@/components/ui/app-wrapper";
import { Input } from "../../../../@/components/ui/input";
import { Button } from "../../../../@/components/ui/button";
import { ThemeProvider } from "../../../../@/components/theme-provider";
import { Toaster } from "react-hot-toast";
const Client = () => {
   const [code, setCode] = useState("");
   const searchParams = useSearchParams();
   const router = useRouter();
   const email = searchParams?.get("email");
   const supabase = createClientComponentClient();
   const signInWithCode = async () => {
      // console.log(email);
      if (!email) return;
      const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
      if (error) return;

      router.push("/auth/callback");
      // try {
      //    const result = await supabase.auth.setSession({
      //       access_token: data.session?.access_token,
      //       refresh_token: data.session?.refresh_token,
      //    });
      // } catch {
      //    router.push("/logout");
      // }

      // router.push("/dashboard");
      // console.log(result.data, result.error);
   };

   return (
      <AppWrapper
         className={"flex flex-col items-center justify-center h-screen w-full text-white"}
         style={{
            backgroundImage: "linear-gradient(180deg, #3A2C34 0%, #22191E 51.04%, #231A1F 97.92%)",
         }}
      >
         <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <Toaster></Toaster>
            <div className="flex flex-col items-center w-96">
               <p className="text-2xl  mb-5 font-semibold text-center">Check your email for a verfication code</p>

               <p>Enter your 6 digit verification code:</p>
               <Input
                  value={code}
                  onChange={(e) => {
                     if (e.target.value.length > 6) return;
                     if (isNaN(Number(e.target.value))) return;

                     setCode(e.target.value);
                  }}
                  className=" w-full  mt-4 dark:border-neutral-300 border"
                  type="text"
               />
               <Button
                  onClick={() => {
                     signInWithCode();
                  }}
                  className="w-full h-12 bg-black text-white rounded-md mt-4 text-sm"
               >
                  {" "}
                  Sign In
               </Button>
            </div>
         </ThemeProvider>
      </AppWrapper>
   );
};
export default Client;
