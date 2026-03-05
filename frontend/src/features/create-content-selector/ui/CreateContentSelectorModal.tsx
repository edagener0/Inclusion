import { useNavigate } from '@tanstack/react-router';

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { RoutedDialog } from '@/shared/ui/routed-dialog';

import { items } from '../model/types';

export function CreateContentSelectorModal() {
  const navigate = useNavigate();

  return (
    <RoutedDialog>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Create new content</DialogTitle>
          <DialogDescription>Select a content type below to continue.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => navigate({ to: '.', search: { modal: item.modal } })}
              className="flex items-center gap-4 rounded-xl border p-4 text-left transition-all hover:bg-accent hover:border-primary group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background group-hover:border-primary/50">
                <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-base">{item.label}</div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </RoutedDialog>
  );
}
