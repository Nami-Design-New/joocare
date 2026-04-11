import { Link } from "@/i18n/navigation";
import { JobDetails } from "../types/jobs.types";
import DescriptionSection from "./DescriptionSection";
import ItemList from "./ItemList";

export default function JobDescriptionCard({ job }: { job: JobDetails }) {


  return (
    <div className="card font-noto-sans col-span-2 rounded-2xl bg-white p-7 text-[#212529]">
      <h3 className="text-primary mb-4 text-xl font-bold">Job description</h3>

      <DescriptionSection title="Qualifications">
        <p className="mb-5 text-sm font-normal">
          {job.description}
        </p>
        <Link href="/" className="block w-full border-b pb-5 text-[#1C7ED6]">
          Learn more about our benefits
        </Link>
        {/* <ItemList items={qualificationItems} variant="disc" /> */}
      </DescriptionSection>

      <div className="my-4">
        {/* <DescriptionSection title="Benefits"> */}
        {/* <ItemList items={benefitItems} variant="decimal" /> */}
        {/* </DescriptionSection> */}
      </div>

      <div>
        <h3 className="text-primary font-outfit text-xl font-bold">Skills:</h3>
        <ItemList items={job.skills} variant="dashed" />
      </div>
    </div>
  );
}
