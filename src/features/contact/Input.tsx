type InputProps = {
  label?: string;
  placeholder?: string;
};

export function Input({ label, placeholder }: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="w-full rounded-full border border-border bg-muted px-4 py-3 text-sm text-foreground transition-all duration-200 outline-none placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary focus:bg-card focus-visible:ring-2 focus-visible:ring-ring/25"
      />
    </div>
  );
}
