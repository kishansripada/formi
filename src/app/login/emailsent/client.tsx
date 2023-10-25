"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
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
      try {
         const result = await supabase.auth.setSession({
            access_token: data.session?.access_token,
            refresh_token: data.session?.refresh_token,
         });
      } catch {
         router.push("/logout");
      }

      router.push("/dashboard");
      // console.log(result.data, result.error);
   };

   return (
      <>
         <div className="flex  flex-row  h-screen overflow-hidden relative font-inter">
            <div className="lg:w-[60%] w-0 lg:visible invisible max-h-full relative flex flex-col justify-center">
               <div className="p-4 w-full max-h-full h-full">
                  <div
                     className="h-full w-full rounded-tl-[100px] rounded-br-[100px] bg-cover bg-center	"
                     style={{
                        backgroundImage:
                           "url(https://images.unsplash.com/photo-1535525153412-5a42439a210d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)",
                     }}
                  ></div>
                  {/* <img className="rounded-xl pointer-events-none select-none w-full object-cover" src="" alt="" /> */}
               </div>
            </div>
            <div className="flex flex-col items-center w-full lg:w-[40%] justify-center">
               <div className="flex flex-col items-center w-96">
                  <p className="text-2xl  mb-10 font-bold text-center">Check your email for a verfication code</p>

                  <p>Enter your 6 digit verification code:</p>
                  <input
                     value={code}
                     onChange={(e) => {
                        if (e.target.value.length > 6) return;
                        if (isNaN(Number(e.target.value))) return;

                        setCode(e.target.value);
                     }}
                     style={{
                        borderColor: code.length === 6 ? "green" : "black",
                     }}
                     className="border-2 border-black w-full h-12 rounded-md mt-4 text-center px-3 focus:outline-none text-2xl"
                     type="text"
                  />
                  <button
                     onClick={() => {
                        signInWithCode();
                     }}
                     className="w-full h-12 bg-black text-white rounded-md mt-4 text-sm"
                  >
                     {" "}
                     Sign In
                  </button>
               </div>
            </div>
         </div>
      </>
   );
};
export default Client;
