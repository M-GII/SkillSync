import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy(request: NextRequest) {
  const session = await getSession();
  
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isSignUpPage = request.nextUrl.pathname.startsWith("/sign-up");

  if ((isLoginPage || isSignUpPage) && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}