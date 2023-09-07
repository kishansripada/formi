import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
// import type { Database } from '@/lib/database.types'

export async function middleware(req: NextRequest) {
   const res = NextResponse.next();
   try {
      const supabase = createMiddlewareClient({ req, res });
      await supabase.auth.getSession();
      return res;
   } catch {
      res.cookies.delete("sb-dxtxbxkkvoslcrsxbfai-auth-token");
      return NextResponse.redirect("/auth/logout");
   }
}
