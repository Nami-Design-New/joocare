import { routing } from "@/i18n/routing";
import {
  createRequestLogContext,
  incrementRouteCounter,
  shouldLogOnly429,
  shouldLogRequests,
} from "@/shared/lib/request-logging";
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

function logProxyRequest(input: {
  request: NextRequest;
  requestId: string;
  status: number;
  startedAt: number;
  details?: Record<string, unknown>;
}) {
  const { routeCount, routePath } = incrementRouteCounter(
    "proxy",
    input.request.url,
  );

  if (!shouldLogRequests()) {
    return;
  }

  if (shouldLogOnly429() && input.status !== 429) {
    return;
  }

  console.log(
    "[proxy]",
    JSON.stringify(
      createRequestLogContext({
        requestId: input.requestId,
        source: "proxy",
        method: input.request.method,
        url: input.request.url,
        status: input.status,
        durationMs: Date.now() - input.startedAt,
        details: {
          routePath,
          routeCount,
          pathname: input.request.nextUrl.pathname,
          search: input.request.nextUrl.search,
          userAgent: input.request.headers.get("user-agent"),
          forwardedFor: input.request.headers.get("x-forwarded-for"),
          ...input.details,
        },
      }),
    ),
  );
}

export default async function proxy(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const pathname = request.nextUrl.pathname;

  const supportedLocales = routing.locales as readonly string[];
  const preferredLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const normalizedPreferredLocale =
    preferredLocale && supportedLocales.includes(preferredLocale) ? preferredLocale : undefined;

  // Detect locale (/en, /ar, ...)
  const segments = pathname.split("/");
  const requestedLocale = segments[1]; // e.g. "en" or "ar"
  const hasLocalePrefix = supportedLocales.includes(requestedLocale);

  // If the URL locale differs from the preferred locale, redirect immediately.
  // This must happen before next-intl middleware runs because it may update the locale cookie
  // based on the URL (which would "undo" the user's chosen language when navigating back/forward).
  if (normalizedPreferredLocale && hasLocalePrefix && requestedLocale !== normalizedPreferredLocale) {
    const url = request.nextUrl.clone();
    segments[1] = normalizedPreferredLocale;
    url.pathname = segments.join("/");
    logProxyRequest({
      request,
      requestId,
      status: 307,
      startedAt,
      details: {
        action: "redirect:preferred-locale:pre-intl",
        redirectTo: url.toString(),
      },
    });
    return NextResponse.redirect(url);
  }
  // console.log("locale ::::: ", preferredLocale, requestedLocale, !hasLocalePrefix && normalizedPreferredLocale);

  // If the URL does not have a locale, force preferred locale (if set) before next-intl routing.
  if (!hasLocalePrefix && normalizedPreferredLocale) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/" ? `/${normalizedPreferredLocale}` : `/${normalizedPreferredLocale}${pathname}`;
    logProxyRequest({
      request,
      requestId,
      status: 307,
      startedAt,
      details: {
        action: "redirect:add-preferred-locale",
        redirectTo: url.toString(),
      },
    });
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
        logProxyRequest({
          request,
          requestId,
          status: 307,
          startedAt,
          details: {
            action: "redirect:normalize-intl-locale",
            redirectTo: redirectedUrl.toString(),
          },
        });
        return NextResponse.redirect(redirectedUrl);
      }
    }

    logProxyRequest({
      request,
      requestId,
      status: 307,
      startedAt,
      details: {
        action: "redirect:i18n",
        redirectTo: i18nLocation,
      },
    });
    return i18nResponse;
  }

  // Remove locale (/en, /ar, ...)
  const locale = hasLocalePrefix ? requestedLocale : routing.defaultLocale;
  const pathWithoutLocale = hasLocalePrefix ? `/${segments.slice(2).join("/")}` : pathname;

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
    logProxyRequest({
      request,
      requestId,
      status: 307,
      startedAt,
      details: {
        action: "redirect:protected-route-login",
        redirectTo: loginUrl.toString(),
      },
    });
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && authRole === "employer" && isHomeRoute) {
    const redirectUrl = new URL(getDefaultPath(locale, authRole), request.url);
    logProxyRequest({
      request,
      requestId,
      status: 307,
      startedAt,
      details: {
        action: "redirect:employer-home",
        authRole,
        redirectTo: redirectUrl.toString(),
      },
    });
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuth && authRole === "candidate" && isEmployerLandingPage) {
    const redirectUrl = new URL(getDefaultPath(locale, authRole), request.url);
    logProxyRequest({
      request,
      requestId,
      status: 307,
      startedAt,
      details: {
        action: "redirect:candidate-employer-landing",
        authRole,
        redirectTo: redirectUrl.toString(),
      },
    });
    return NextResponse.redirect(redirectUrl);
  }

  if (
    isAuth &&
    ((authRole === "candidate" && isEmployerRoute) ||
      (authRole === "employer" && isCandidateRoute))
  ) {
    const redirectUrl = new URL(getDefaultPath(locale, authRole), request.url);
    logProxyRequest({
      request,
      requestId,
      status: 307,
      startedAt,
      details: {
        action: "redirect:role-mismatch",
        authRole,
        redirectTo: redirectUrl.toString(),
      },
    });
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Redirect: Authenticated user trying to access login pages
  //    → Go back to callbackUrl or fallback to "/"
  if (isAuth && isAuthRoute) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const redirectTo = callbackUrl ?? getDefaultPath(locale, authRole);
    const redirectUrl = new URL(redirectTo, request.url);
    logProxyRequest({
      request,
      requestId,
      status: 307,
      startedAt,
      details: {
        action: "redirect:authenticated-auth-route",
        authRole,
        redirectTo: redirectUrl.toString(),
      },
    });
    return NextResponse.redirect(redirectUrl);
  }

  // Allow the request to proceed if no conditions are met
  logProxyRequest({
    request,
    requestId,
    status: i18nResponse.status || 200,
    startedAt,
    details: {
      action: "next",
      authRole,
      isAuth: Boolean(isAuth),
    },
  });
  return i18nResponse;
}

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
