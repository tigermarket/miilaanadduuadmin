// import createMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";
// import { NextRequest, NextResponse } from "next/server";
// // export function proxy(request: NextRequest) {
// //   return NextResponse.redirect(new URL("/home", request.url));
// // }

// export default createMiddleware(routing);

// export const config = {
//   // matcher: "/api/:function*",
//   // Match all pathnames except for
//   // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
//   // - … the ones containing a dot (e.g. `favicon.ico`)
//   matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
// };
// import createMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";
// import { NextRequest, NextResponse } from "next/server";
// import { updateSession } from "@/(server)/lib";
// const intlMiddleware = createMiddleware(routing);

// export async function proxy(request: NextRequest) {
//   const response = await updateSession(request);
//   return intlMiddleware(request, response);
// }
// export const config = {
//   // matcher: "/api/:function*",
//   // Match all pathnames except for
//   // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
//   // - … the ones containing a dot (e.g. `favicon.ico`)
//   matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
// };
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { decrypt, updateSession } from "@/(server)/lib/session";

// 1. Define protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];

const intlMiddleware = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  // --- Session handling ---
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect authenticated users away from public routes
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // --- Update session and run intl middleware ---
  const response = await updateSession(req);
  return intlMiddleware(req, response);
}

// 2. Matcher config
export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
