import { Link } from "@/i18n/navigation";
import Image from "next/image";

interface JobProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  timeLabel: string;
  image: string;
  updated_at: string;
}

const JobCard = ({ title, company, location, type, timeLabel, id, image, updated_at }: JobProps) => (
  <Link href={`/jobs/${id}`} className="group bg-card border-border group hover:border-primary/50 relative rounded-xl border p-5 transition-all hover:shadow-sm">
    <section className="flex items-start gap-4">
      <Image
        src={image || "/assets/recent-job-image.svg"}
        width={57}
        height={50}
        alt={`${company} logo`}
      />
      <div className="flex-1">
        <h3 className="text-secondary group-hover:text-primary text-xl font-bold transition-all">
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-1 text-gray-500">
          <span className="text-md text-foreground font-semibold">{company}</span>
          <span className="flex items-center gap-0.5 text-sm">{location}</span>
        </div>{" "}
        <footer className="mt-4 flex items-center gap-1">
          <span className="bg-muted text-muted-foreground rounded-xl px-2.5 py-1 text-xs font-medium tracking-wider">
            {type}
          </span>
          <time
            className="bg-muted text-muted-foreground rounded-xl px-2.5 py-1 text-xs font-medium tracking-wider"
            dateTime={updated_at}
          >
            {updated_at}
          </time>
        </footer>
      </div>
    </section>
  </Link>
);

export default JobCard;
