import ApplicantsClient from "@/features/jobs/components/ApplicantsClient";
import CandidatesFilter from "@/features/jobs/components/CandidatesFilter";
import PositionCard from "@/features/jobs/components/PositionCard";
import { Applicant } from "@/features/jobs/types/index.types";

const MOCK_APPLICANTS: Applicant[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: "Ahmed Abdulmajeed Eltatawy",
  email: "Mail@mail.com",
  phone: "966 5462123331",
  date: "21 December 2026, 4:00 AM",
  cvUrl: "/cv/applicant.pdf",
}));

export default function page() {
  return (
    <section className="grid grid-cols-1">
      <PositionCard
        logoSrc="/assets/comp-logo.svg"
        title="Senior Specialist Physician"
        company="Health care"
        employmentType="FULL-TIME"
      />
      <CandidatesFilter />
      <ApplicantsClient applicants={MOCK_APPLICANTS} />
    </section>
  );
}
