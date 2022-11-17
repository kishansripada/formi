import type { NextPage } from "next";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Script from "next/script";

const Upgrade: NextPage = () => {
   const session = useSession();
   const supabase = useSupabaseClient();

   return (
      <>
         <Script strategy="lazyOnload" src="https://js.stripe.com/v3/pricing-table.js" />

         <div className="h-screen flex flex-col justify-center">
            <stripe-pricing-table
               pricing-table-id="prctbl_1M45ACHvC3w6e8fcZrfIEjeZ"
               publishable-key="pk_live_51Laj5tHvC3w6e8fcTNgLYosshdlXBG9tELw1GacJuZQwzb7DwGSCRv8jx1pbJtf6jOR16cSb5it0Jk7Js2TSd03y00uKhclRcz"
            ></stripe-pricing-table>
         </div>
      </>
   );
};

export default Upgrade;
