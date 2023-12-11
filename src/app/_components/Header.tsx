import { useSession, useSessionContext } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Header = () => {
   const router = useRouter();
   const { isLoading, session, error } = useSessionContext();

   console.log(session);
   return (
      <div className="  lg:pt-7 lg:pb-5 pt-8  w-full lg:px-36 px-10 gap-5 flex flex-row items-center">
         <Link href={"/"}>
            <img className="lg:h-10 h-8 " src="/logo.png" alt="" />
         </Link>

         <div className="lg:flex hidden flex-row items-center gap-6 ml-6 text-sm">
            <Link className=" text-neutral-300 hover:text-white transition " href={"#features"}>
               Features
            </Link>
            <Link className="text-neutral-300 hover:text-white transition" href={"/upgrade"}>
               Pricing
            </Link>
         </div>

         {/* <button
            onClick={() => {
               router.push("/207/edit");
            }}
            className="text-neutral-400 hidden lg:flex hover:text-white transition ml-auto text-sm"
         >
            View Demo
         </button> */}

         <Link
            href={"/login"}
            className="bg-neutral-700/50 group hover:bg-neutral-600/50 ml-auto  text-neutral-200 py-2 flex flex-row items-center text-sm h-full rounded-full px-3  transition  "
         >
            {}
            <p className="mr-2 ml-2">{session ? "Dashboard" : "Log in"}</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition">
               <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
               />
            </svg>
         </Link>
      </div>
   );
};
