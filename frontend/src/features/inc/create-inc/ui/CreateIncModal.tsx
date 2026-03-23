import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { RoutedDialog } from '@/shared/ui/routed-dialog';

import { CreateIncForm } from './CreateIncForm';

export function CreateIncModal() {
  return (
    <RoutedDialog>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create new inc</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>

        <CreateIncForm />
      </DialogContent>
    </RoutedDialog>
  );
}
