"use client";

import useGetCompanyProfile from "@/features/company-profile/hooks/useGetCompanyProfile";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import { useSession } from "next-auth/react";

const HeaderLayout = ({
  navLinks,
}: {
  navLinks: { href: string; label: string }[];
}) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const role = session?.authRole;
  const shouldLoadCompanyProfile = role === "employer";
  const { data: companyProfileData } = useGetCompanyProfile({
    token: shouldLoadCompanyProfile ? token : "",
  });

  const filteredNavLinks =
    shouldLoadCompanyProfile && companyProfileData?.status === "Draft"
      ? navLinks.slice(2, 3)
      : navLinks;
  return (
    <header className="w-full rounded-full p-2 shadow sm:w-fit sm:pe-0 bg-white
    ">
      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        slidesPerView="auto"
        spaceBetween={8}
        className="flex items-center justify-center"
      >
        {filteredNavLinks.map(({ href, label }) => {
          const isActive = pathname === href;

          return (
            <SwiperSlide key={href} className="!w-auto">
              <Link
                href={href}
                className={`${buttonVariants({
                  variant: isActive ? "default" : "outline",
                  size: "pill",
                })}`}
              >
                {label}
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </header>
  );
};

export default HeaderLayout;
