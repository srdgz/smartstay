import withAuth from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const authMiddleware = withAuth((request) => intlMiddleware(request as NextRequest), {
  callbacks: {
    authorized: ({ token }) => token != null,
  },
});

const protectedPath = new RegExp(`^/(${routing.locales.join("|")})/users(/.*)?$`);

export default function proxy(request: NextRequest) {
  if (protectedPath.test(request.nextUrl.pathname)) {
    return (authMiddleware as unknown as (request: NextRequest) => Response)(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"],
};
