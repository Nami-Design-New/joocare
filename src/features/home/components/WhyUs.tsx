import { useTranslations } from "next-intl";
import AiEngine from "./AiEngine";
import type { HomeWhyModel } from "../types/home.types";

type Tone = "legacy" | "model";

function TagMark({ tone }: { tone: Tone }) {
  return (
    <span
      className={`size-3 shrink-0 rounded-full border-[1.4px] border-current bg-[radial-gradient(circle,currentColor_0_2.6px,transparent_3.1px)] ${tone === "legacy" ? "text-[#C9806F]" : "text-[#61D174]"}`}
    />
  );
}

function CardIcon({ tone }: { tone: Tone }) {
  const legacy = tone === "legacy";
  return (
    <svg viewBox="0 0 34 34" aria-hidden="true" className="size-[34px] shrink-0">
      <circle
        cx="17"
        cy="17"
        r="15.5"
        fill="none"
        strokeWidth="1.2"
        stroke={legacy ? "rgba(201,128,111,.45)" : "rgba(97,209,116,.5)"}
      />
      <circle
        cx="17"
        cy="17"
        r="11"
        strokeWidth="1"
        fill={legacy ? "rgba(201,128,111,.10)" : "rgba(31,173,54,.16)"}
        stroke={legacy ? "rgba(201,128,111,.35)" : "rgba(97,209,116,.4)"}
      />
      <path
        d={legacy ? "M13.6 13.6l6.8 6.8M20.4 13.6l-6.8 6.8" : "M12.8 17.2l3 3 5.6-5.8"}
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={legacy ? "#DE9886" : "#CEF3D5"}
      />
    </svg>
  );
}

function ModelColumn({
  tone,
  tag,
  title,
  description,
  items,
}: {
  tone: Tone;
  tag: string;
  title: string;
  description: string;
  items: HomeWhyModel[];
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3.5">
      <span className="inline-flex h-[26px] items-center gap-2 self-start rounded-full border border-[rgba(206,243,213,.12)] bg-white/[.025] px-3 text-[10.5px] font-medium tracking-[.14em] text-[rgba(233,241,236,.68)] uppercase rtl:tracking-normal">
        <TagMark tone={tone} />
        {tag}
      </span>
      <h3 className="mt-1.5 text-2xl leading-tight font-semibold">{title}</h3>
      <p className="mb-1.5 text-sm leading-relaxed font-light text-[rgba(233,241,236,.68)]">
        {description}
      </p>
      {items.map((item) => (
        <article
          key={item.id}
          className={`grid grid-cols-[auto_1fr] items-start gap-3.5 rounded-[14px] border p-4 ${tone === "legacy"
            ? "border-[rgba(206,243,213,.12)] bg-[linear-gradient(180deg,rgba(255,255,255,.032),rgba(255,255,255,.012))]"
            : "border-[rgba(97,209,116,.18)] bg-[linear-gradient(180deg,rgba(31,173,54,.07),rgba(31,173,54,.02))]"
            }`}
        >
          <CardIcon tone={tone} />
          <div>
            <h4 className="mt-px mb-1 text-[14.5px] leading-snug font-semibold">{item.title}</h4>
            <p className="text-[12.5px] leading-normal font-light text-[rgba(233,241,236,.68)]">
              {item.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function WhyUs({
  title,
  legacyModelTitle,
  legacyModelDescription,
  legacyModels,
  joocareModelTitle,
  joocareModelDescription,
  joocareModels,
}: {
  title: string;
  legacyModelTitle: string;
  legacyModelDescription: string;
  legacyModels: HomeWhyModel[];
  joocareModelTitle: string;
  joocareModelDescription: string;
  joocareModels: HomeWhyModel[];
}) {
  const t = useTranslations("home");

  return (
    <section className="relative isolate overflow-hidden bg-[#0B1012] bg-[radial-gradient(1200px_780px_at_50%_60%,#17211F_0%,#111819_48%,#0B1012_100%)] text-[#E9F1EC]">
      {/* grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(206,243,213,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(206,243,213,.045)_1px,transparent_1px)] bg-[size:44px_44px] bg-center [mask-image:radial-gradient(ellipse_80%_75%_at_50%_55%,#000_35%,rgba(0,0,0,.5)_100%)]"
      />
      <div className="mx-auto max-w-[1320px] px-4 pt-10 pb-12 md:px-6 md:pt-14 md:pb-16">
        <header className="mx-auto mb-8 max-w-[920px] text-center md:mb-12">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(97,209,116,.26)] bg-[rgba(31,173,54,.06)] px-3.5 py-2 text-xs font-medium tracking-[.2em] text-[#61D174] uppercase rtl:tracking-normal">
            <TagMark tone="model" />
            {t("why-eyebrow")}
          </p>
          <h2 className="mt-4 mb-3.5 text-[clamp(30px,3.6vw,50px)] text-[#E9F1EC] leading-[1.08] font-semibold tracking-[-.02em] rtl:tracking-normal">
            {title}
          </h2>
          <p className="mx-auto max-w-[800px] text-base leading-relaxed font-light text-[rgba(233,241,236,.68)] md:text-[16.5px]">
            {t("why-subtitle")}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(520px,640px)_minmax(0,1fr)]">
          <ModelColumn
            tone="legacy"
            tag={t("legacy-model")}
            title={legacyModelTitle}
            description={legacyModelDescription}
            items={legacyModels}
          />
          {/* the engine's dotted lines stretch to the row height on xl */}
          <AiEngine className="order-first w-full max-w-[720px] min-w-0 justify-self-center md:col-span-2 md:mb-3 xl:order-none xl:col-span-1 xl:mb-0 xl:max-w-none" />
          <ModelColumn
            tone="model"
            tag={t("joocare-model")}
            title={joocareModelTitle}
            description={joocareModelDescription}
            items={joocareModels}
          />
        </div>
      </div>
    </section>
  );
}
