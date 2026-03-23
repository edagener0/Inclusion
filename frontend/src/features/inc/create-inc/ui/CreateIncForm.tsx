import { useForm } from '@tanstack/react-form';

import { Button } from '@/shared/ui/button';
import { DialogFooter } from '@/shared/ui/dialog';
import { Textarea } from '@/shared/ui/textarea';

import { useCreateIncMutation } from '../model/mutation';
import { type CreateInc, CreateIncSchema } from '../model/schema';

export function CreateIncForm() {
  const mutation = useCreateIncMutation();

  const form = useForm({
    defaultValues: { content: '' } as CreateInc,
    validators: { onChange: CreateIncSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value.content);
    },
  });

  return (
    <form
      className="flex flex-col gap-4 py-4"
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="space-y-4">
        <form.Field
          name="content"
          children={field => (
            <Textarea
              placeholder="What's new?"
              className="min-h-32"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              autoFocus
            />
          )}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </Button>
          )}
        />
      </DialogFooter>
    </form>
  );
}
