type Props = {
  total: number;
  currentIndex: number;
};

export function StoryProgress({ total, currentIndex }: Props) {
  const storiesArray = Array.from({ length: total });

  return (
    <div className="pointer-events-auto flex w-full gap-1">
      {storiesArray.map((_, index) => (
        <div key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
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
