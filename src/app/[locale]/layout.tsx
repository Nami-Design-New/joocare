import { routing } from "@/i18n/routing";
import { settingService } from "@/shared/services/settings-services";
import MainProviders from "@/shared/providers/MainProviders";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Noto_Sans, Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { getSharedOgImage } from "@/shared/util/metadata";

function getMetadataBase() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return undefined;

  try {
    return new URL(siteUrl);
  } catch {
    return undefined;
  }
}
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const metadataBase = getMetadataBase();
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return { metadataBase };
  }

  const imageUrl = await getSharedOgImage(locale);

  return {
    metadataBase,
    title: "Joocare - Find the best healthcare jobs",
    description: "Discover your ideal healthcare job with Joocare...",
    icons: { icon: "/tab-icon.png", shortcut: "/tab-icon.png", apple: "/tab-icon.png" },
    openGraph: {
      title: "Joocare - Find the best healthcare jobs",
      description: "Discover your ideal healthcare job with Joocare...",
      siteName: "Joocare",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "Joocare" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Joocare - Find the best healthcare jobs",
      description: "Discover your ideal healthcare job with Joocare...",
      images: [imageUrl],
    },
  };
}
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
  const [messages, initialSettings] = await Promise.all([
    getMessages(),
    settingService(locale).catch(() => null),
  ]);


  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${outfit.variable} ${notoSans.variable}`}
    >
      <body className={`antialiased ${outfit.className}`}>
        <MainProviders
          locale={locale}
          messages={messages}
          initialSettings={initialSettings}
        >
          <main className="min-h-screen">{children}</main>
        </MainProviders>
      </body>
    </html>
  );
}
