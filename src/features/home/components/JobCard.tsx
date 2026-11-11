import { Link } from '@/i18n/navigation';
import Image from 'next/image';

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

const JobCard = ({
  title,
  company,
  location,
  type,
  timeLabel,
  id,
  image,
  updated_at,
}: JobProps) => (
  <Link
    href={`/jobs/${id}`}
    className="group relative rounded-xl border border-white bg-card p-4 shadow-[-10px_-10px_24px_rgba(0,0,0,0.09)] transition-all hover:border-primary/50 sm:p-5"
  >
    <section className="flex items-start gap-4">
      <Image
        src={image || '/assets/recent-job-image.svg'}
        width={57}
        height={50}
        alt={`${company} logo`}
        className="h-12 w-14 rounded-2xl"
      />
      <div className="flex-1">
        <h3 className="text-sm font-bold text-secondary transition-all group-hover:text-primary md:text-xl">
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-1 text-gray-500">
          <span className="text-sm font-semibold text-foreground md:text-base">
            {company}
          </span>
          <span className="flex items-center gap-0.5 text-xs md:text-sm">
            {location}
          </span>
        </div>{' '}
        <footer className="mt-4 flex items-center gap-1">
          <span className="rounded-xl bg-muted px-2.5 py-1 text-[10px] font-medium tracking-wider text-muted-foreground md:text-xs">
            {type}
          </span>
          <time
            className="rounded-xl bg-muted px-2.5 py-1 text-[10px] font-medium tracking-wider text-muted-foreground md:text-xs"
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
