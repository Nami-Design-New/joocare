import React from "react";
import { JobFormData } from "../validation/job-post-schema";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { Link } from "@/i18n/navigation";
import JobOverviewCard from "./JobOverviewCard";
import JobLocationAndSalaryCard from "./JobLocationAndSalaryCard";
import JobEducationAndCertificationsCard from "./JobEducationAndCertificationsCard";

export default function JobReviewPanel({ data }: { data: JobFormData }) {
  return (
    <section>
      <div className="mt-5 flex items-center gap-6 p-4">
        <Image
          src="/assets/comp-logo.svg"
          alt="Company logo"
          width={96}
          height={86}
        />

        <div>
          <h6 className="text-foreground text-2xl font-semibold">
            Senior Specialist Physician
          </h6>
          <p>
            <span className="text-muted-foreground text-lg font-normal">
              at Health care
            </span>{" "}
            <Badge size="md" className="rounded-sm bg-[#0BA02C]">
              FULL-TIME
            </Badge>{" "}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-3">
        <div className="font-noto-sans col-span-2 text-[#212529]">
          <h3 className="text-primary mb-4 text-xl font-bold">
            Job description
          </h3>
          <div className="">
            <h4 className="text-foreground mb-2 font-bold">Qualifications</h4>
            <p className="mb-5 text-sm font-normal">
              We are seeking a dedicated and skilled Physician Assistant to join
              our growing healthcare team at St. Jude's Hospital. The Physician
              Assistant will work closely with our physicians and provide
              comprehensive medical care to patients. The ideal candidate will
              have a strong clinical background, excellent communication skills,
              and a passion for delivering high-quality patient care. This role
              involves conducting physical examinations, ordering and
              interpreting tests, diagnosing and treating illnesses, and
              providing patient education.
            </p>
            <p className="mb-5 text-sm font-normal">
              The Physician Assistant will be responsible for performing
              comprehensive physical examinations, assessing patient health
              status, and developing treatment plans in collaboration with
              physicians. They will also order and interpret diagnostic tests,
              prescribe medications, and administer treatments. Additionally,
              the Physician Assistant will provide patient education and
              counseling on preventive care and disease management. They will
              also document patient information accurately and maintain
              confidentiality.
            </p>

            <Link
              href="/"
              className="block w-full border-b pb-5 text-[#1C7ED6]"
            >
              Learn more about our benefits
            </Link>
          </div>

          <ul className="my-5 flex list-disc flex-col gap-1.5 ps-7 text-sm">
            <li>Current state license as a Physician Assistant</li>
            <li>
              Graduate from an accredited Physician Assistant program with
              national certification and 3+ years of experience in internal
              medicine
            </li>
            <li>Excellent communication and interpersonal skills</li>
          </ul>
          <div className="mb-4">
            <h4 className="text-foreground mb-2 font-bold">Benefits</h4>
            <ol className="mt-5 flex list-decimal flex-col gap-1.5 ps-7 text-sm">
              <li>Competitive salary and benefits package</li>
              <li>Paid time off and holidays</li>
              <li>Professional development opportunities</li>
              <li>Supportive and collaborative work environment</li>
            </ol>
          </div>
          <div>
            <h3 className="text-primary font-outfit text-xl font-bold">
              Skills:
            </h3>
            <ul className="dashed-list mt-5 flex flex-col gap-1.5 ps-7 text-sm">
              <li>Strong leadership and management abilities.</li>
              <li>
                Expertise in patient care coordination across multiple
                facilities.
              </li>
              <li>Excellent communication and relationship-building skills.</li>
              <li>
                Experience moderating committee meetings or similar
                collaborative initiatives.
              </li>
            </ul>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-8">
          <JobLocationAndSalaryCard />
          <JobOverviewCard />
          <JobEducationAndCertificationsCard />
        </div>
      </div>
    </section>
  );
}
