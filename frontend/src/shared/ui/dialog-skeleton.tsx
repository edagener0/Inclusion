import { Loader2 } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog';

export function DialogSkeleton() {
  return (
    <Dialog open={true}>
      <DialogContent className="flex h-50 w-full items-center justify-center">
        <DialogTitle className="sr-only">Loading data...</DialogTitle>
        <DialogDescription>.</DialogDescription>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </DialogContent>
    </Dialog>
  );
}
