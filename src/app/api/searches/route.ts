import { NextRequest, NextResponse } from "next/server";
import { getPopularSearchesPage } from "@/features/home/services/home-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? "1");
  const limitPerPage = Number(searchParams.get("limit_per_page") ?? "10");
  const locale = searchParams.get("locale") ?? request.headers.get("accept-language") ?? "en";

  try {
    const data = await getPopularSearchesPage({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limitPerPage:
        Number.isFinite(limitPerPage) && limitPerPage > 0 ? limitPerPage : 10,
      locale,
    });

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load popular searches.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
