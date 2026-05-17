import { authOptions } from "@/auth";
import { Link } from "@/i18n/navigation";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { settingService } from "../services/settings-services";
import BackToTopButton from "./BackToTopButton";
import { getTranslations } from "next-intl/server";

const Footer = async () => {
  const t = await getTranslations();
  const currentYear = new Date().getFullYear();
  const [session, settings] = await Promise.all([
    getServerSession(authOptions),
    settingService().catch(() => null),
  ]);
  const authRole = session?.authRole;
  const isCandidate = authRole === "candidate";
  const isEmployer = authRole === "employer";
  const footerLogo = settings?.footer_logo || "/assets/new-logo-light-dot.svg";
  const footerText =
    settings?.footer_text ||
    t("footer.description");
  const copyrightText =
    settings?.copyright || t("footer.copyright", { year: currentYear });
  const socialLinks = [
    { href: settings?.linkedin, srcImg: "/assets/icons/social-icons/linkedin-footer.svg", label: "LinkedIn" },
    { href: settings?.facebook, srcImg: "/assets/icons/social-icons/facebook-footer.svg", label: "Facebook" },
    { href: settings?.instagram, srcImg: "/assets/icons/social-icons/instagram-footer.svg", label: "Instagram" },
    { href: settings?.twitter, srcImg: "/assets/icons/social-icons/twitter-footer.svg", label: "Twitter" },
    { href: settings?.snapchat, srcImg: "/assets/icons/social-icons/snap-footer.svg", label: "Snapchat" },
  ].filter((item) => Boolean(item.href));

  const candidateLinks = isEmployer
    ? [
      { href: "/jobs", label: t("footer.explore-jobs") },
    ]
    : isCandidate
      ? [
        { href: "/jobs", label: t("footer.explore-jobs") },
        { href: "/faq", label: t("footer.faq") },
      ]
      : [
        { href: "/jobs", label: t("footer.explore-jobs") },
        { href: "/auth/candidate/register", label: t("footer.create-profile") },
        { href: "/faq", label: t("footer.faq") },
      ];

  const employerLinks = isCandidate
    ? []
    : [
      { href: "/for-employers", label: t("footer.for-employers") },
      { href: "/for-employers#how-it-works", label: t("footer.how-it-works") },
    ];

  return (
    <footer className="layout-shell bg-secondary py-12 text-white relative">
      <div className="layout-content relative">
        {/* Top Section: Links & Info */}
        <div className="relative grid grid-cols-1 gap-4 pb-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Image
                src={footerLogo}
                alt={t("footer.logo-alt")}
                width={140}
                height={60}
              />
            </div>
            <p className="max-w-xs text-base leading-relaxed text-gray-300">
              {footerText}
            </p>
          </div>

          {/* Column 2: Candidates */}
          <div className="bg-before">
            <h4>{t("footer.for-candidates")}</h4>
            <ul className="text-md space-y-4 text-gray-300">
              {candidateLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Employers */}
          {employerLinks.length > 0 ? (
            <div className="bg-before">
              <h4>{t("footer.for-employers")}</h4>
              <ul className="text-md space-y-4 text-gray-300">
                {employerLinks.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            null
          )}

          {/* Column 4: Company*/}
          <div className="bg-before">
            <h4>{t("footer.company-trust")}</h4>
            <ul className="text-md mb-8 space-y-4 text-gray-300">
              <li>
                <Link href="/about" className="transition hover:text-white">
                  {t("footer.about-joocare")}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="transition hover:text-white">
                  {t("footer.data-privacy-security")}
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="transition hover:text-white">
                  {t("footer.terms-conditions")}
                </Link>
              </li>

            </ul>
          </div>

          <div className="bg-before">
            <h4>{t("footer.get-in-touch")}</h4>
            <ul className="text-md mb-8 space-y-4 text-gray-300">
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  {t("footer.contact-us")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Socials & Copyright */}
        <div className="relative grid grid-cols-1 gap-4 pb-10 lg:grid-cols-5 lg:gap-12 ">
          {/* Social Icons */}
          <div className="order-last col-span-1 flex items-center justify-center lg:justify-start gap-4 lg:order-first">
            {socialLinks.map(({ href, srcImg, label }) => (
              <Link
                key={label}
                href={href!}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-7 w-7 hover:scale-105 rounded-full"
              >
                <Image src={srcImg} alt={label} width={30} height={30} />
              </Link>
            ))}
          </div>
          <div className="relative col-span-1 h-7 w-full lg:w-[calc(100%+1rem)] lg:col-span-4 ">
            <Image
              src="/assets/footer1.svg"
              alt={t("footer.logo-alt")}
              fill
              className="object-cover w-full lg:left-4.5!"
            />
          </div>{" "}
        </div>
      </div>{" "}
      {/* Copyright */}
      <p className="relative border-t border-[#0D0D0D73] pt-4 text-center text-lg text-white">
        {copyrightText}
      </p>
      <section className="absolute right-4 bottom-22 z-50 md:right-6 md:bottom-6">
        <BackToTopButton />
      </section>
    </footer>
  );
};

export default Footer;
