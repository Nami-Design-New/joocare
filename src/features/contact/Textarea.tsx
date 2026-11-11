export function Textarea() {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground">
        Message
      </label>
      <textarea
        className="h-32 w-full rounded-3xl border border-border bg-muted px-4 py-3 text-sm text-foreground transition-all duration-200 outline-none placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary focus:bg-card focus-visible:ring-2 focus-visible:ring-ring/25"
        placeholder="Message goes here..."
      />
    </div>
  );
}
