interface ListProps {
  items: string[];
  variant?: "disc" | "decimal" | "dashed";
}

export default function ItemList({ items, variant = "disc" }: ListProps) {
  const listClass = {
    disc: "list-disc",
    decimal: "list-decimal",
    dashed: "dashed-list",
  }[variant];

  const Tag = variant === "decimal" ? "ol" : "ul";

  return (
    <Tag className={`${listClass} flex flex-col gap-1.5 ps-7 text-sm`}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  );
}
