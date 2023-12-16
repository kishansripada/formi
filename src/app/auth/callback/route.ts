import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
// import type { Database } from '@/lib/database.types'

export async function GET(request: NextRequest) {
   const supabase = createRouteHandlerClient({ cookies });

   const requestUrl = new URL(request.url);
   const code = requestUrl.searchParams.get("code");

   if (code) {
      await supabase.auth.exchangeCodeForSession(code);
   }

   const { data } = await supabase
      .from("user_data")
      .select("*")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

   if (!data?.length) {
      return NextResponse.redirect(requestUrl.origin + "/welcome/1");
   }

   // URL to redirect to after sign in process completes
   return NextResponse.redirect(requestUrl.origin + "/dashboard");
}
