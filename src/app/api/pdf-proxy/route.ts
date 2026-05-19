import { getTimeZone } from "@/shared/lib/fetch-manager";
import { NextRequest, NextResponse } from "next/server";

function getAllowedHosts() {
  const values = [
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXT_PUBLIC_BASE_USER_URL,
    process.env.NEXT_PUBLIC_BASE_COMPANY_URL,
    process.env.NEXT_PUBLIC_BASE_API_URL,
    "joocare.nami-tec.com",
    "www.joocare.nami-tec.com",
    "admin.joocare.com",
    "joocare.com",
  ].filter(Boolean) as string[];

  const hosts = new Set<string>();

  for (const value of values) {
    try {
      const normalized = value.startsWith("http") ? value : `https://${value}`;
      const url = new URL(normalized);
      if (url.host) hosts.add(url.host);
      if (url.hostname) hosts.add(url.hostname);
    } catch {
      // ignore invalid values
    }
  }

  return hosts;
}

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get("url");
  const locale =
    request.nextUrl.searchParams.get("locale") ??
    request.headers.get("accept-language") ??
    "en";

  if (!targetUrl) {
    return NextResponse.json({ message: "Missing url parameter." }, { status: 400 });
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return NextResponse.json({ message: "Invalid url parameter." }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json({ message: "Unsupported protocol." }, { status: 400 });
  }

  const allowedHosts = getAllowedHosts();
  if (allowedHosts.size > 0 && !allowedHosts.has(parsedUrl.host) && !allowedHosts.has(parsedUrl.hostname)) {
    return NextResponse.json({ message: "Host is not allowed." }, { status: 403 });
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/pdf,*/*",
        "X-Timezone": getTimeZone(),
        "Accept-Language": locale,

      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch PDF." },
        { status: response.status },
      );
    }

    const contentType = response.headers.get("content-type") ?? "application/pdf";
    const contentLength = response.headers.get("content-length");

    if (!response.body) {
      return NextResponse.json({ message: "Failed to fetch PDF." }, { status: 502 });
    }

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "no-store");
    if (contentLength) headers.set("Content-Length", contentLength);

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch PDF." }, { status: 500 });
  }
}
