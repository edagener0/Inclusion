import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';

import { UserAvatar } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { FieldError } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { useUpdateAvatar } from '../model/mutation';
import { type UpdateAvatar, createUpdateAvatarSchema } from '../model/schema';

export function UpdateUserAvatarCard({
  currentAvatar,
  username,
}: {
  currentAvatar: string;
  username: string;
}) {
  const mutation = useUpdateAvatar();
  const { t } = useTranslation('common');
  const { t: tU } = useTranslation('user', { keyPrefix: 'avatar' });
  const schema = useMemo(() => createUpdateAvatarSchema(t), [t]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const form = useForm({
    defaultValues: { image: null as unknown as File } satisfies UpdateAvatar,
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value.image);
    },
  });

  return (
    <Card className="overflow-hidden">
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardHeader>
          <CardTitle>{tU('form.title')}</CardTitle>
          <CardDescription>{tU('form.description')}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <UserAvatar
            avatar={previewUrl || currentAvatar}
            username={username}
            className="size-24 sm:size-32 rounded-full border border-border shadow-sm shrink-0"
          />

          <div className="flex flex-col gap-2 w-full max-w-sm">
            <form.Field
              name="image"
              children={field => (
                <>
                  <Label htmlFor={field.name} className="font-semibold">
                    {tU('form.image.label')}
                  </Label>
                  <Input
                    id={field.name}
                    type="file"
                    className="cursor-pointer file:cursor-pointer"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onBlur={field.handleBlur}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.handleChange(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">{tU('form.image.size')}</p>

                  <FieldError errors={field.state.meta.errors} />
                </>
              )}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t bg-muted/50 px-6 py-4 mt-2">
          <form.Subscribe
            selector={state => [state.canSubmit, state.isSubmitting, state.isDirty]}
            children={([canSubmit, isSubmitting, isDirty]) => (
              <Button
                type="submit"
                size="sm"
                disabled={!isDirty || !canSubmit || isSubmitting || mutation.isPending}
              >
                {isSubmitting || mutation.isPending ? t('actions.saving') : t('actions.save')}
              </Button>
            )}
          />
        </CardFooter>
      </form>
    </Card>
  );
}
