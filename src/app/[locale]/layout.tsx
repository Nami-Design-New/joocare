import { routing } from "@/i18n/routing";
import { settingService } from "@/shared/services/settings-services";
import MainProviders from "@/shared/providers/MainProviders";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
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

  const settings = await settingService(locale);
  const shareLinkImage =
    settings?.share_link_image || "/logo-icon.jfif";

  // Convert to absolute URL when possible (share platforms prefer absolute URLs).
  const imageUrl = shareLinkImage.startsWith("http")
    ? shareLinkImage
    : metadataBase
      ? new URL(shareLinkImage, metadataBase).toString()
      : shareLinkImage;

  // console.log("url image:::::", settings, shareLinkImage, imageUrl);

  return {
    metadataBase,
    title: "Joocare - Find the best healthcare jobs",
    description:
      "Discover your ideal healthcare job with Joocare. We connect healthcare professionals with top employers, offering a wide range of opportunities in the medical field. Start your career journey today!",
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
          url: imageUrl,
          alt: "Joocare",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Joocare - Find the best healthcare jobs",
      description:
        "Discover your ideal healthcare job with Joocare. We connect healthcare professionals with top employers, offering a wide range of opportunities in the medical field. Start your career journey today!",
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
