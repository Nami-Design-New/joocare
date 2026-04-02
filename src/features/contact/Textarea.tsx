export function Textarea() {
  return (
    <div>
      <label className="text-foreground mb-2 block text-sm font-semibold">
        Message
      </label>
      <textarea
        className="border-border bg-muted text-foreground placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary focus:bg-card focus-visible:ring-ring/25 h-32 w-full rounded-3xl border px-4 py-3 text-sm transition-all duration-200 outline-none focus-visible:ring-2"
        placeholder="Message goes here..."
      />
    </div>
  );
}
