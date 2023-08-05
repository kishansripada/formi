import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";
const getServerSideProps = async () => {
   const supabase = createServerComponentClient(
      { cookies },
      {
         supabaseKey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
         supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
      }
   );

   // Check if we have a session
   const {
      data: { session },
      error,
   } = await supabase.auth.getSession();

   if (error) {
      throw error;
   }
   // if (session) {
   //    redirect("/dashboard");
   // }
};
export default async function Page({}) {
   const _ = await getServerSideProps();
   return (
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
               <p className="text-2xl  mb-10 font-bold">Check your email for a login link </p>
               {/* <p className=" ">Log in to your account and start creating</p> */}
            </div>
         </div>
      </div>
   );
}
