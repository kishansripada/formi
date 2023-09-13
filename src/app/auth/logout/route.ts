import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
   try {
      cookies().delete("sb-dxtxbxkkvoslcrsxbfai-auth-token");

      const requestUrl = new URL(request.url);
      // console.log(requestUrl);
      const supabase = createRouteHandlerClient({ cookies });

      await supabase.auth.signOut();

      return NextResponse.redirect(`${requestUrl.origin}/login`, {
         status: 301,
      });
   } catch {
      // res.cookies.delete("my-auth-token-name");
   }
}
