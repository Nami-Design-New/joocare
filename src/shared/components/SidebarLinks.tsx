// "use client";

// import { LucideIcon } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// interface ILinkItem {
//   label: string;
//   href: string;
//   icon?: LucideIcon;
//   image?: string;
// }

// interface ILinksProps {
//   links: ILinkItem[];
// }

// const SidebarLinks = ({ links }: ILinksProps) => {
//   const pathname = usePathname();
//   const normalizedPathname = pathname.replace(/^\/[a-z]{2}/, "");

//   return (
//     <nav aria-label="Company navigation">
//       <ul className="flex flex-col gap-5">
//         {links.map(({ label, href, image, icon: Icon }) => {
//           const isActive = normalizedPathname === href;

//           const iconBgClass = isActive
//             ? "bg-primary"
//             : "bg-black group-hover:bg-primary";

//           return (
//             <li key={href}>
//               <Link
//                 href={href}
//                 className={`group flex items-center gap-3 rounded-full border-l-2 px-4 py-2 text-lg font-semibold transition-all ${
//                   isActive
//                     ? "border-primary bg-primary-bg text-primary"
//                     : "text-muted-foreground hover:border-primary hover:bg-primary-bg hover:text-primary border-transparent"
//                 } `}
//               >
//                 {image && (
//                   <div
//                     className={`h-5 w-5 transition-colors ${iconBgClass}`}
//                     style={{
//                       WebkitMaskImage: `url(${image})`,
//                       WebkitMaskRepeat: "no-repeat",
//                       WebkitMaskPosition: "center",
//                       WebkitMaskSize: "contain",
//                       maskImage: `url(${image})`,
//                       maskRepeat: "no-repeat",
//                       maskPosition: "center",
//                       maskSize: "contain",
//                     }}
//                   />
//                 )}

//                 {Icon && (
//                   <Icon
//                     className={`size-5 shrink-0 transition-colors ${
//                       isActive
//                         ? "text-primary"
//                         : "text-muted-foreground group-hover:text-primary"
//                     } `}
//                   />
//                 )}

//                 <span>{label}</span>
//               </Link>
//             </li>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// };

// export default SidebarLinks;
"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ILinkItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  image?: string;
}

interface ILinksProps {
  links: ILinkItem[];
}

const SidebarLinks = ({ links }: ILinksProps) => {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}/, "");

  return (
    <>
      {/* ── Mobile / Tablet — horizontal scroll strip ─────────────────────── */}
      <nav aria-label="Company navigation" className="lg:hidden">
        <ul className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
          {links.map(({ label, href, image, icon: Icon }) => {
            const isActive = normalizedPathname === href;

            const iconBgClass = isActive
              ? "bg-primary"
              : "bg-black group-hover:bg-primary";

            return (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${isActive
                      ? "border-primary bg-primary-bg text-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:bg-primary-bg hover:text-primary"
                    }`}
                >
                  {image && (
                    <div
                      className={`h-4 w-4 shrink-0 transition-colors ${iconBgClass}`}
                      style={{
                        WebkitMaskImage: `url(${image})`,
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskImage: `url(${image})`,
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        maskSize: "contain",
                      }}
                    />
                  )}

                  {Icon && (
                    <Icon
                      className={`size-4 shrink-0 transition-colors ${isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary"
                        }`}
                    />
                  )}

                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Desktop — original vertical sidebar ───────────────────────────── */}
      <nav aria-label="Company navigation" className="hidden lg:block">
        <ul className="flex flex-col gap-5">
          {links.map(({ label, href, image, icon: Icon }) => {
            const isActive = normalizedPathname === href;

            const iconBgClass = isActive
              ? "bg-primary"
              : "bg-black group-hover:bg-primary";

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex items-center gap-3 rounded-full border-l-2 px-4 py-2 text-lg font-semibold transition-all ${isActive
                      ? "border-primary bg-primary-bg text-primary"
                      : "text-muted-foreground hover:border-primary hover:bg-primary-bg hover:text-primary border-transparent"
                    }`}
                >
                  {image && (
                    <div
                      className={`h-5 w-5 transition-colors ${iconBgClass}`}
                      style={{
                        WebkitMaskImage: `url(${image})`,
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskImage: `url(${image})`,
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        maskSize: "contain",
                      }}
                    />
                  )}

                  {Icon && (
                    <Icon
                      className={`size-5 shrink-0 transition-colors ${isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary"
                        }`}
                    />
                  )}

                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default SidebarLinks;
