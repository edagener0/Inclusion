import { Trash2 } from 'lucide-react';

import { useChatBotStore } from '@/entities/chat-bot';

import { Button } from '@/shared/ui/button';

export function ClearHistory() {
  const clearAll = useChatBotStore((s) => s.clearAll);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive"
      onClick={() => clearAll()}
    >
      <Trash2 className="h-5 w-5" />
    </Button>
  );
}
