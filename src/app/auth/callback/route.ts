import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
// import type { Database } from '@/lib/database.types'

export async function GET(request: NextRequest) {
   const requestUrl = new URL(request.url);
   const code = requestUrl.searchParams.get("code");
   const supabase = createRouteHandlerClient({ cookies });
   if (code) {
      await supabase.auth.exchangeCodeForSession(code);
   }

   // const userData = await supabase
   //    .from("user_data")
   //    .select("*")
   //    .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

   // if (userData?.data?.length) {
   return NextResponse.redirect(requestUrl.origin + "/dashboard");
   // } else {
   // return NextResponse.redirect(requestUrl.origin + "/welcome/1");
   // }

   // URL to redirect to after sign in process completes
}
