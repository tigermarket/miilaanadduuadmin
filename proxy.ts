import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
// export function proxy(request: NextRequest) {
//   return NextResponse.redirect(new URL("/home", request.url));
// }

export default createMiddleware(routing);

export const config = {
  // matcher: "/api/:function*",
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
