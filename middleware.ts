import { updateSession } from "@/supabase/utils/middleware";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|register|login|auth|chat|$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
