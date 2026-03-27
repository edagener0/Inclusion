type Props = {
  total: number;
  currentIndex: number;
};

export function StoryProgress({ total, currentIndex }: Props) {
  const storiesArray = Array.from({ length: total });

  return (
    <div className="flex gap-1 w-full pointer-events-auto">
      {storiesArray.map((_, index) => (
        <div key={index} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
          <div
            className={`h-full w-full transition-colors duration-200 ${
              index <= currentIndex ? 'bg-white' : 'bg-transparent'
            }`}
          />
        </div>
      ))}
    </div>
  );
}
