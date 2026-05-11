import { routing } from "@/i18n/routing";
import MainProviders from "@/shared/providers/MainProviders";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Noto_Sans, Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

function getMetadataBase() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    return undefined;
  }

  try {
    return new URL(baseUrl.replace(/\/api\/?$/, ""));
  } catch {
    return undefined;
  }
}

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-sans",
});
export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "Joocare - Find the best healthcare jobs",
  description: "Discover your ideal healthcare job with Joocare. We connect healthcare professionals with top employers, offering a wide range of opportunities in the medical field. Start your career journey today!",
  icons: {
    icon: "/logo-icon.jfif",
    shortcut: "/logo-icon.jfif",
    apple: "/logo-icon.jfif",
  },
  openGraph: {
    title: "Joocare - Find the best healthcare jobs",
    description:
      "Discover your ideal healthcare job with Joocare. We connect healthcare professionals with top employers, offering a wide range of opportunities in the medical field. Start your career journey today!",
    siteName: "Joocare",
    type: "website",
    images: [
      {
        url: "/logo-icon.jfif",
        alt: "Joocare logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joocare - Find the best healthcare jobs",
    description:
      "Discover your ideal healthcare job with Joocare. We connect healthcare professionals with top employers, offering a wide range of opportunities in the medical field. Start your career journey today!",
    images: ["/logo-icon.jfif"],
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for next-intl
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${outfit.variable} ${notoSans.variable}`}>
      <body className={`antialiased ${outfit.className}`}>
        <MainProviders locale={locale}>
          <main className="min-h-screen">{children}</main>
        </MainProviders>
      </body>
    </html>
  );
}
