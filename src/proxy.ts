import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routing);
const candidateProtectedRoute = "/candidate";
const employerProtectedRoute = "/company";

function getDefaultPath(locale: string, authRole?: "candidate" | "employer") {
  if (authRole === "employer") {
    return `/${locale}${employerProtectedRoute}/for-employers`;
  }

  if (authRole === "candidate") {
    return `/${locale}`;
  }

  return `/${locale}`;
}

export default async function proxy(request: NextRequest) {
  const i18nResponse = handleI18nRouting(request);

  if (i18nResponse.headers.get("location")) {
    return i18nResponse;
  }

  const pathname = request.nextUrl.pathname;

  // Remove locale (/en, /ar, ...)
  const segments = pathname.split("/");
  const locale = segments[1]; // e.g. "en" or "ar"
  const pathWithoutLocale = `/${segments.slice(2).join("/")}`;

  // 1. Get the user token (session)
  const isAuth = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 2. Define your route logic
  const protectedRoutes = [employerProtectedRoute, candidateProtectedRoute];
  const isAuthRoute = pathWithoutLocale.startsWith("/auth");
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );
  const isEmployerRoute = pathWithoutLocale.startsWith(employerProtectedRoute);
  const isCandidateRoute = pathWithoutLocale.startsWith(candidateProtectedRoute);
  const authRole = isAuth?.authRole as "candidate" | "employer" | undefined;

  // 3. Redirect: Unauthenticated user trying to access a protected route
  //    → Save the original URL as callbackUrl
  if (!isAuth && isProtectedRoute) {
    const loginPath = isEmployerRoute
      ? `/${locale}/auth/employer/login`
      : `/${locale}/auth/candidate/login`;
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    isAuth &&
    ((authRole === "candidate" && isEmployerRoute) ||
      (authRole === "employer" && isCandidateRoute))
  ) {
    return NextResponse.redirect(new URL(getDefaultPath(locale, authRole), request.url));
  }

  // 4. Redirect: Authenticated user trying to access login pages
  //    → Go back to callbackUrl or fallback to "/"
  if (isAuth && isAuthRoute) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const redirectTo = callbackUrl ?? getDefaultPath(locale, authRole);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Allow the request to proceed if no conditions are met
  return i18nResponse;
}

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
