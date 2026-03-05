import Image from "next/image";

interface JobProps {
  title: string;
  company: string;
  location: string;
  type: string;
  time: string;
}

const glassConfig = {
  blur: 0.4, // Frost: 4   → low diffusion, almost clear
  contrast: 1.8, // Refraction: 80 → strong lens-like bending
  brightness: 0.8, // Light: 80% → slightly dimmed highlight
  saturation: 1.5, // Dispersion: 50 → vivid chromatic spread
  shadowIntensity: 0.2, // Depth: 20  → subtle but present shadow
  elasticity: 0, // Splay: 0   → no edge elasticity
  borderRadius: 20,
};
const JobCard = ({ title, company, location, type, time }: JobProps) => (
  //   <LiquidGlass
  //     blur={glassConfig.blur}
  //     contrast={glassConfig.contrast}
  //     brightness={glassConfig.brightness}
  //     saturation={glassConfig.saturation}
  //     shadowIntensity={glassConfig.shadowIntensity}
  //     elasticity={glassConfig.elasticity}
  //     borderRadius={glassConfig.borderRadius}
  //     className="glass-element"
  //   >

  <article className="group bg-card border-border group hover:border-primary/50 relative rounded-xl border p-5 transition-all hover:shadow-sm">
    <section className="flex items-start gap-4">
      <Image
        src="/assets/comp-logo.svg"
        width={57}
        height={50}
        alt={`${company} logo`}
      />
      <div className="flex-1">
        <h3 className="text-secondary group-hover:text-primary text-xl font-bold transition-all">
          {title}
        </h3>
        <div className="flex items-center gap-1 text-gray-500">
          <span className="text-md text-foreground">{company}</span>
          <span className="flex items-center gap-0.5 text-sm">{location}</span>
        </div>{" "}
        <footer className="mt-4 flex items-center gap-1">
          <span className="bg-muted text-muted-foreground rounded-xl px-2.5 py-1 text-xs font-medium tracking-wider">
            {type}
          </span>
          <time
            className="bg-muted text-muted-foreground rounded-xl px-2.5 py-1 text-xs font-medium tracking-wider"
            dateTime={time}
          >
            {time} ago
          </time>
        </footer>
      </div>
    </section>
  </article>
  //   {/* </LiquidGlass> */}
);

export default JobCard;
