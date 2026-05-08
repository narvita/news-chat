export function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-white/50">
      <span className="inline-block w-3 h-3 rounded-full border-2 border-white/30 border-t-white/80 animate-spin flex-shrink-0" />
      <span>{label}</span>
    </div>
  );
}