import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routing);
const candidateProtectedRoute = "/candidate";
const employerProtectedRoute = "/company";
const employerLandingRoute = "/for-employers";

const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

function getDefaultPath(locale: string, authRole?: "candidate" | "employer") {
  if (authRole === "employer") {
    return `/${locale}${employerLandingRoute}`;
  }

  if (authRole === "candidate") {
    return `/${locale}`;
  }

  return `/${locale}`;
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const supportedLocales = routing.locales as readonly string[];
  const preferredLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const normalizedPreferredLocale =
    preferredLocale && supportedLocales.includes(preferredLocale) ? preferredLocale : undefined;

  // Detect locale (/en, /ar, ...)
  const segments = pathname.split("/");
  const requestedLocale = segments[1]; // e.g. "en" or "ar"
  const hasLocalePrefix = supportedLocales.includes(requestedLocale);

  // If the URL does not have a locale, force preferred locale (if set) before next-intl routing.
  if (!hasLocalePrefix && normalizedPreferredLocale) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/" ? `/${normalizedPreferredLocale}` : `/${normalizedPreferredLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const i18nResponse = handleI18nRouting(request);

  // If next-intl wants to redirect (e.g. add locale), still respect the user's preferred locale.
  const i18nLocation = i18nResponse.headers.get("location");
  if (i18nLocation) {
    if (normalizedPreferredLocale) {
      const url = request.nextUrl.clone();
      const redirectedUrl = new URL(i18nLocation, url);
      const redirectedSegments = redirectedUrl.pathname.split("/");
      const redirectedLocale = redirectedSegments[1];
      if (
        supportedLocales.includes(redirectedLocale) &&
        redirectedLocale !== normalizedPreferredLocale
      ) {
        redirectedSegments[1] = normalizedPreferredLocale;
        redirectedUrl.pathname = redirectedSegments.join("/");
        return NextResponse.redirect(redirectedUrl);
      }
    }

    return i18nResponse;
  }

  // Remove locale (/en, /ar, ...)
  const locale = hasLocalePrefix ? requestedLocale : routing.defaultLocale;
  const pathWithoutLocale = hasLocalePrefix ? `/${segments.slice(2).join("/")}` : pathname;

  // If the URL locale differs from the preferred locale, redirect to the preferred locale.
  if (normalizedPreferredLocale && hasLocalePrefix && locale !== normalizedPreferredLocale) {
    const url = request.nextUrl.clone();
    segments[1] = normalizedPreferredLocale;
    url.pathname = segments.join("/");
    return NextResponse.redirect(url);
  }

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
  const isHomeRoute = pathWithoutLocale === "/";
  const isEmployerLandingPage = pathWithoutLocale === employerLandingRoute;
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

  if (isAuth && authRole === "employer" && isHomeRoute) {
    return NextResponse.redirect(new URL(getDefaultPath(locale, authRole), request.url));
  }

  if (isAuth && authRole === "candidate" && isEmployerLandingPage) {
    return NextResponse.redirect(new URL(getDefaultPath(locale, authRole), request.url));
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
