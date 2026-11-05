"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import "../lib/ai-engine/joocare-ai-engine.css";

type EngineInstance = { destroy: () => void };
type EngineApi = {
  mount: (el: HTMLElement, options: Record<string, unknown>) => EngineInstance | null;
};

const LOGO = "/assets/joocare-logo-on-dark.png";
const STEP_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export default function AiEngine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("home.ai-engine");
  const locale = useLocale();

  const content = {
    rtl: locale === "ar",
    topLabel: t("top-label"),
    coreLabel: t("core-label"),
    ariaTitle: t("aria-title"),
    footer: [t("footer.1"), t("footer.2"), t("footer.3")],
    steps: STEP_KEYS.map((key) => ({
      label: [t(`steps.${key}.l1`), t(`steps.${key}.l2`)],
      status: t(`steps.${key}.status`),
    })),
  };
  const contentKey = JSON.stringify(content);

  useEffect(() => {
    let engine: EngineInstance | null = null;
    let cancelled = false;

    // the engine script touches window on load, so it is only imported in the browser
    import("../lib/ai-engine/joocare-ai-engine.js").then(() => {
      const api = (window as unknown as { JoocareEngine?: EngineApi }).JoocareEngine;
      if (cancelled || !ref.current || !api) return;
      engine = api.mount(ref.current, { logo: LOGO, content: JSON.parse(contentKey) });
    });

    return () => {
      cancelled = true;
      engine?.destroy();
    };
  }, [contentKey]);

  // dir="ltr": the diagram geometry is fixed; the engine mirrors its own texts for RTL
  return <div ref={ref} dir="ltr" className={className} />;
}
