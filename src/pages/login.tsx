import { useState } from "react";
import { supabase } from "../utils/supabase";
import type { NextPage } from "next";

const login = () => {
   const [loading, setLoading] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const handleLogin = async (email) => {
      try {
         setLoading(true);
         const { user, session, error } = await supabase.auth.signIn(
            {
               provider: "google",
            },
            {
               redirectTo: "http://localhost:3000/mydances",
            }
         );
         if (error) throw error;
      } catch (error) {
         alert(error.error_description || error.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="">
         <div className="">
            <h1 className="">Supabase + Next.js</h1>
            <p className="">Sign in via magic link with your email below</p>
            <div>
               <input className="" type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
               <input className="" type="email" placeholder="Your email" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
               <button
                  onClick={(e) => {
                     e.preventDefault();
                     handleLogin(email);
                  }}
                  className=""
                  disabled={loading}
               >
                  <span>{loading ? "Loading" : "Send magic link"}</span>
               </button>
            </div>
         </div>
      </div>
   );
};
export default login;
