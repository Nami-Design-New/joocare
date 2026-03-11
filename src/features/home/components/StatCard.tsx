import { Plus } from "lucide-react";

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-muted border-border flex flex-col items-center justify-center rounded-2xl border p-8 text-center transition-all hover:shadow-md">
    <span className="text-foreground flex items-center gap-2 text-2xl font-bold md:text-4xl lg:text-5xl">
      <Plus
        color="var(--primary)"
        size={20}
        className="font-extrabold"
        strokeWidth={6}
      />{" "}
      {value}
    </span>
    <p className="text-muted-foreground mt-2 text-sm font-medium">{label}</p>
  </div>
);
export default StatCard;
