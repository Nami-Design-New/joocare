type InputProps = {
  label?: string;
  placeholder?: string;
};

export function Input({ label, placeholder }: InputProps) {
  return (
    <div>
      <label className="text-foreground mb-2 block text-sm font-semibold">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="border-border bg-muted text-foreground placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary focus:bg-card focus-visible:ring-ring/25 w-full rounded-full border px-4 py-3 text-sm transition-all duration-200 outline-none focus-visible:ring-2"
      />
    </div>
  );
}
