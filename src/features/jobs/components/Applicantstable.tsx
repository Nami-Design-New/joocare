import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Applicant } from "../types/index.types";
import ApplicantRow from "./ApplicantRow";

// ─── Types ────────────────────────────────────────────────────────────────────
type applicantsTableProps = {
  applicants: Applicant[];
  onDownload?: (applicant: Applicant) => void;
  onView?: (applicant: Applicant) => void;
};

export default function ApplicantsTable({
  applicants,
  onDownload,
  onView,
}: applicantsTableProps) {
  return (
    <section>
      <div className="border-border mt-4 w-full overflow-x-auto rounded-2xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-border border-b bg-white hover:bg-white">
              {["#", "Name", "Email", "Phone", "Date", "Cv"].map((col) => (
                <TableHead
                  key={col}
                  className="text-foreground px-4 py-5 text-sm font-semibold"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {applicants.map((applicant, index) => (
              <ApplicantRow
                key={applicant.id}
                applicant={applicant}
                onDownload={onDownload}
                onView={onView}
                index={index}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
