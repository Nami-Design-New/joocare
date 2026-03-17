import { Link } from "@/i18n/navigation";
import DescriptionSection from "./DescriptionSection";
import ItemList from "./ItemList";

export default function JobDescriptionCard() {
  const qualificationItems = [
    "Current state license as a Physician Assistant",
    "Graduate from an accredited Physician Assistant program with national certification and 3+ years of experience in internal medicine",
    "Excellent communication and interpersonal skills",
  ];

  const benefitItems = [
    "Competitive salary and benefits package",
    "Paid time off and holidays",
    "Professional development opportunities",
    "Supportive and collaborative work environment",
  ];

  const skillItems = [
    "Strong leadership and management abilities.",
    "Expertise in patient care coordination across multiple facilities.",
    "Excellent communication and relationship-building skills.",
    "Experience moderating committee meetings or similar collaborative initiatives.",
  ];

  return (
    <div className="card font-noto-sans col-span-2 rounded-2xl bg-white p-7 text-[#212529]">
      <h3 className="text-primary mb-4 text-xl font-bold">Job description</h3>

      <DescriptionSection title="Qualifications">
        <p className="mb-5 text-sm font-normal">
          We are seeking a dedicated and skilled Physician Assistant to join our
          growing healthcare team at St. Jude&apos;s Hospital. The Physician
          Assistant will work closely with our physicians and provide
          comprehensive medical care to patients. The ideal candidate will have
          a strong clinical background, excellent communication skills, and a
          passion for delivering high-quality patient care. This role involves
          conducting physical examinations, ordering and interpreting tests,
          diagnosing and treating illnesses, and providing patient education.
        </p>
        <p className="mb-5 text-sm font-normal">
          The Physician Assistant will be responsible for performing
          comprehensive physical examinations, assessing patient health status,
          and developing treatment plans in collaboration with physicians. They
          will also order and interpret diagnostic tests, prescribe medications,
          and administer treatments. Additionally, the Physician Assistant will
          provide patient education and counseling on preventive care and
          disease management. They will also document patient information
          accurately and maintain confidentiality.
        </p>
        <Link href="/" className="block w-full border-b pb-5 text-[#1C7ED6]">
          Learn more about our benefits
        </Link>
        <ItemList items={qualificationItems} variant="disc" />
      </DescriptionSection>

      <div className="my-4">
        <DescriptionSection title="Benefits">
          <ItemList items={benefitItems} variant="decimal" />
        </DescriptionSection>
      </div>

      <div>
        <h3 className="text-primary font-outfit text-xl font-bold">Skills:</h3>
        <ItemList items={skillItems} variant="dashed" />
      </div>
    </div>
  );
}
