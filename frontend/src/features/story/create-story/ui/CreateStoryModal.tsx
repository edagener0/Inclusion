import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { RoutedDialog } from '@/shared/ui/routed-dialog';

import { CreateStoryForm } from './CreateStoryForm';

export function CreateStoryModal() {
  return (
    <RoutedDialog>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create story</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <CreateStoryForm />
      </DialogContent>
    </RoutedDialog>
  );
}
