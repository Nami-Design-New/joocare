import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default function Home() {
  const t = useTranslations("HomePage");
  return <div>Start home page</div>;
}
