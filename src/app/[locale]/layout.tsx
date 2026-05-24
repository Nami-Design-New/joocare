import { routing } from "@/i18n/routing";
import { settingService } from "@/shared/services/settings-services";
import MainProviders from "@/shared/providers/MainProviders";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Noto_Sans, Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { headers } from "next/headers";


async function getMetadataBase(): Promise<URL> {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    if (host) return new URL(`https://${host}`);
  } catch {
    // static generation — headers() مش متاحة
  }

  // ✅ fallback للـ env
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (baseUrl) {
    return new URL(baseUrl.replace(/\/api\/?$/, ""));
  }

  return new URL("https://www.joocare.com");
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
  const metadataBase = await getMetadataBase();
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return { metadataBase };
  }

  const settings = await settingService(locale);

  const title = "Joocare - Find the best healthcare jobs";
  const description = "Discover your ideal healthcare job with Joocare.";

  const rawImage = settings?.share_link_image || "/tab-icon.png";
  const imageUrl = rawImage.startsWith("http")
    ? rawImage
    : new URL(rawImage, metadataBase).toString();

  return {
    metadataBase,
    title,
    description,
    icons: {
      icon: "/tab-icon.png",
      shortcut: "/tab-icon.png",
      apple: "/tab-icon.png",
    },
    openGraph: {
      title,
      description,
      siteName: "Joocare",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
