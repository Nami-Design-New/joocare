'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type {
  JoocareEngineContent,
  JoocareEngineInstance,
} from '../lib/ai-engine/joocare-ai-engine';
import '../lib/ai-engine/joocare-ai-engine.css';

const ENGINE_LOGO = '/assets/joocare-logo-on-dark.png';
const STEP_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
const FOOTER_KEYS = ['1', '2', '3'] as const;

type AiEngineProps = {
  className?: string;
};

export default function AiEngine({ className }: AiEngineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations('home.ai-engine');
  const locale = useLocale();

  const content = useMemo<JoocareEngineContent>(
    () => ({
      rtl: locale === 'ar',
      topLabel: t('top-label'),
      coreLabel: t('core-label'),
      ariaTitle: t('aria-title'),
      footer: FOOTER_KEYS.map((key) => t(`footer.${key}`)),
      steps: STEP_KEYS.map((key) => ({
        label: [t(`steps.${key}.l1`), t(`steps.${key}.l2`)],
        status: t(`steps.${key}.status`),
      })),
    }),
    [locale, t],
  );

  useEffect(() => {
    let engine: JoocareEngineInstance | null = null;
    let cancelled = false;

    // the engine script touches window on load, so it is only imported in the browser
    import('../lib/ai-engine/joocare-ai-engine.js').then(() => {
      const api = window.JoocareEngine;
      if (cancelled || !ref.current || !api) return;
      engine = api.mount(ref.current, { logo: ENGINE_LOGO, content });
    });

    return () => {
      cancelled = true;
      engine?.destroy();
    };
  }, [content]);

  // dir="ltr": the diagram geometry is fixed; the engine mirrors its own texts for RTL
  return <div ref={ref} dir="ltr" className={className} />;
}
