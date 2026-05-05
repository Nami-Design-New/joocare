import { routing } from "@/i18n/routing";
import MainProviders from "@/shared/providers/MainProviders";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Noto_Sans, Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

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
  title: "Joocare - Find the best healthcare jobs",
  description: "Discover your ideal healthcare job with Joocare. We connect healthcare professionals with top employers, offering a wide range of opportunities in the medical field. Start your career journey today!",
  icons: {
    icon: "/logo-icon.jfif",
    shortcut: "/logo-icon.jfif",
    apple: "/logo-icon.jfif",
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
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${outfit.variable} ${notoSans.variable}`}
    >
      <body
        className={`antialiased ${locale === "ar" ? notoSans.className : outfit.className}`}
      >
        <MainProviders locale={locale} messages={messages}>
          <main className="min-h-screen">{children}</main>
        </MainProviders>
      </body>
    </html>
  );
}
