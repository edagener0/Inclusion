import { Heart } from 'lucide-react';

import { Button } from '@/shared/ui/button';

type Props = {
  count: number;
  isLiked: boolean;
  isLoading?: boolean;
  onToggle: () => void;
};

export function LikeButton({ count, isLiked, isLoading, onToggle }: Props) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      disabled={isLoading}
      className={`gap-2 transition-colors ${
        isLiked
          ? 'text-red-500 hover:text-red-600 hover:bg-red-500/10'
          : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
      }`}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      {count}
    </Button>
  );
}
