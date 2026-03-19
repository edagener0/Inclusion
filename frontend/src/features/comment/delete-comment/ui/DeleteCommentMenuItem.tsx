import { useState } from 'react';

import { Trash } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

import { useDeleteCommentMutation } from '../api/queries';

type Props = {
  entityType: string;
  entityId: number;
  commentId: number;
};

export function DeleteCommentMenuItem({ entityId, entityType, commentId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useDeleteCommentMutation();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    mutation.mutate(
      { entityType, entityId, commentId },
      {
        onSuccess: () => setIsOpen(false),
      },
    );
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={e => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
      >
        <Trash className="mr-2 h-4 w-4" />
        <span>Delete post</span>
      </DropdownMenuItem>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="z-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently deleted from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={mutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {mutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
