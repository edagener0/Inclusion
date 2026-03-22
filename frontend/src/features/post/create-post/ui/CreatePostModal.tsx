import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { RoutedDialog } from '@/shared/ui/routed-dialog';

import { CreatePostForm } from './CreatePostForm';

export function CreatePostModal() {
  return (
    <RoutedDialog>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle className="text-xl">Create new post</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>

        <CreatePostForm />
      </DialogContent>
    </RoutedDialog>
  );
}
