import React from "react";
import JobOverviewItem from "./JobOverviewItem";
import Image from "next/image";

export default function JobEducationAndCertificationsCard() {
  return (
    <div className="card border-border shadow-card min-h-36 rounded-2xl border-2 p-8">
      <h2 className="text-foreground mb-4 text-lg font-semibold">
        Education & Certifications section
      </h2>
      <div className="flex flex-col gap-6">
        <JobOverviewItem
          label="Education Level"
          value="Mid Level"
          icon="/assets/icons/exp.svg"
        />
        <div>
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/case.svg"
                width={20}
                height={20}
                alt="icon"
              />
              <p className="text-muted-foreground text-md">
                Mandatory Certifications
              </p>
            </div>
            <div>
              <ul className="mt-2 flex flex-col gap-2">
                <li className="edu-certificate">Diploma in Medical Billing</li>
                <li className="edu-certificate">
                  Certified Nursing Assistant (CNA)
                </li>
                <li className="edu-certificate">Basic Life Support (BLS)</li>
                <li className="edu-certificate">
                  Advanced Cardiac Life Support (ACLS)
                </li>
                <li className="edu-certificate">Phlebotomy Certification</li>
                <li className="edu-certificate">
                  Registered Health Information Technician (RHIT)
                </li>
              </ul>
            </div>
          </div>
        </div>
        <JobOverviewItem
          label="Availability"
          value="Availabe"
          icon="/assets/icons/case.svg"
        />
      </div>{" "}
    </div>
  );
}
