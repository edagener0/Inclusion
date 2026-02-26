import { useForm } from '@tanstack/react-form';

import { ProfileAvatar } from '@/entities/profile';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { useUpdateAvatar } from '../api/queries';
import { type UpdateAvatar, updateAvatarSchema } from '../model/schema';

export function UpdateUserAvatarCard({
  currentAvatar,
  username,
}: {
  currentAvatar: string;
  username: string;
}) {
  const mutation = useUpdateAvatar();

  const form = useForm({
    defaultValues: { image: null as unknown as File } satisfies UpdateAvatar,
    validators: { onChange: updateAvatarSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value.image);
    },
  });

  return (
    <Card>
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Update your avatar.</CardDescription>
        </CardHeader>

        <CardContent className="flex items-center gap-6">
          <ProfileAvatar size="2xlg" avatar={currentAvatar} username={username} />

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <form.Field
              name="image"
              children={field => (
                <>
                  <Label htmlFor={field.name}>Upload new photo</Label>
                  <Input
                    id={field.name}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onBlur={field.handleBlur}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.handleChange(file);
                      }
                    }}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm font-medium text-destructive">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <form.Subscribe
            selector={state => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                size="sm"
                disabled={!canSubmit || isSubmitting || mutation.isPending}
              >
                {isSubmitting || mutation.isPending ? 'Updating...' : 'Update avatar'}
              </Button>
            )}
          />
        </CardFooter>
      </form>
    </Card>
  );
}
