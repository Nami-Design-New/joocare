import { JobDetails } from "../types/jobs.types";
import DescriptionSection from "./DescriptionSection";
import ItemList from "./ItemList";
import { getTranslations } from "next-intl/server";

export default async function JobDescriptionCard({ job }: { job: JobDetails }) {
  const t = await getTranslations();


  return (
    <div className="card font-noto-sans col-span-2 rounded-2xl bg-white  p-4 md:p-7 text-[#212529]">
      <h3 className="text-primary mb-4 text-xl font-bold">{t("jobDetailsPage.job-description")}</h3>

      <DescriptionSection title={t("jobDetailsPage.qualifications")}>
        <div
          className="prose prose-sm max-w-none border-b pb-5 text-sm md:text-base"
          dangerouslySetInnerHTML={{
            __html:
              job.description ||
              `<p>${t("jobDetailsPage.no-description-available")}</p>`,
          }}
        />
        {/* <Link href="/" className="block w-full border-b pb-5 text-[#1C7ED6]">
          Learn more about our benefits
        </Link> */}
        {/* <ItemList items={qualificationItems} variant="disc" /> */}
      </DescriptionSection>

      <div className="my-4">
        {/* <DescriptionSection title="Benefits"> */}
        {/* <ItemList items={benefitItems} variant="decimal" /> */}
        {/* </DescriptionSection> */}
      </div>

      <div>
        <h3 className="text-primary font-outfit text-xl font-bold">{t("jobDetailsPage.skills")}</h3>
        <ItemList items={job?.skills} variant="dashed" />
      </div>
    </div>
  );
}
