export function WordlePreview() {
  return (
    <div className="flex gap-1">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="bg-muted h-6 w-6 rounded border" />
      ))}
    </div>
  );
}
