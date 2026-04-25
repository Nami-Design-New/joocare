import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set(["joocare.nami-tec.com"]);

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get("url");

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

  if (!ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    return NextResponse.json({ message: "Host is not allowed." }, { status: 403 });
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/pdf,*/*",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch PDF." },
        { status: response.status },
      );
    }

    const fileBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") ?? "application/pdf";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch PDF." }, { status: 500 });
  }
}
