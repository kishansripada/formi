import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
// import type { Database } from '@/lib/database.types'

export async function middleware(req: NextRequest) {
   // try {
   const res = NextResponse.next();
   const supabase = createMiddlewareClient({ req, res });
   await supabase.auth.getSession();
   return res;
   // } catch {
   // return NextResponse.redirect("/auth/logout");
   // }
}
