import { MoreHorizontal } from 'lucide-react';

import { DeleteStoryMenuItem } from '@/features/story/delete-story';

import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

type Props = {
  storyId: number;
};

export function StoryActions({ storyId }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-max min-w-(--radix-dropdown-menu-trigger-width)"
      >
        <DeleteStoryMenuItem id={storyId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
