interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function DescriptionSection({ title, children }: SectionProps) {
  return (
    <div>
      <h4 className="text-foreground mb-2 font-bold">{title}</h4>
      {children}
    </div>
  );
}
