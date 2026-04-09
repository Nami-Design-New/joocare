import QualificationCard from "./QualificationCard";
import type { QualificationViewModel } from "../../types/qualification.types";

export default function QualificationsList({
  qualifications,
}: {
  qualifications: QualificationViewModel[];
}) {
  if (qualifications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-white px-6 py-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-black">No qualifications added yet</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Use the add button above to create your first qualification entry.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {qualifications.map((qualification) => (
        <QualificationCard key={qualification.id} qualification={qualification} />
      ))}
    </div>
  );
}
