import { NextRequest, NextResponse } from "next/server";

const DEFAULT_FILE_NAME = "candidate-cv.pdf";

function getAllowedHosts() {
  const values = [
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXT_PUBLIC_BASE_USER_URL,
    process.env.NEXT_PUBLIC_BASE_COMPANY_URL,
  ].filter(Boolean) as string[];

  return new Set(
    values
      .map((value) => {
        try {
          return new URL(value).host;
        } catch {
          return null;
        }
      })
      .filter((host): host is string => Boolean(host)),
  );
}

function buildContentDisposition(fileName: string) {
  const safeFileName = fileName
    .replace(/[^\w.\- ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return `attachment; filename="${safeFileName || DEFAULT_FILE_NAME}"`;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const fileName =
    request.nextUrl.searchParams.get("filename") ?? DEFAULT_FILE_NAME;

  if (!url) {
    return NextResponse.json({ message: "Missing file URL" }, { status: 400 });
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ message: "Invalid file URL" }, { status: 400 });
  }

  const allowedHosts = getAllowedHosts();

  if (allowedHosts.size > 0 && !allowedHosts.has(parsedUrl.host)) {
    return NextResponse.json({ message: "File host is not allowed" }, { status: 403 });
  }

  const response = await fetch(parsedUrl.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "Failed to fetch CV file" },
      { status: response.status },
    );
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    response.headers.get("Content-Type") ?? "application/octet-stream",
  );
  headers.set("Content-Disposition", buildContentDisposition(fileName));

  const contentLength = response.headers.get("Content-Length");
  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new NextResponse(response.body, {
    status: 200,
    headers,
  });
}
