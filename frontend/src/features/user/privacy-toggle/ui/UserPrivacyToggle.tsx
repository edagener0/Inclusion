import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Checkbox } from '@/shared/ui/checkbox';

import { useUpdateAccountPrivacy } from '../model/mutation';
import { type AccountPrivacy, AccountPrivacySchema } from '../model/schema';

export function UserPrivacyToggle({ isPrivate }: { isPrivate: boolean }) {
  const mutation = useUpdateAccountPrivacy();
  const { t } = useTranslation(['common', 'user']);

  const form = useForm({
    defaultValues: { isPrivate } satisfies AccountPrivacy,
    validators: { onChange: AccountPrivacySchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value.isPrivate);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{t('user:privacy.form.title')}</CardTitle>
          <CardDescription>{t('user:privacy.form.description')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form.Field
            name="isPrivate"
            children={(field) => (
              <label
                htmlFor={field.name}
                className="group border-border hover:bg-muted/50 flex cursor-pointer items-start space-x-4 rounded-lg border p-4 transition-colors"
              >
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  disabled={mutation.isPending}
                  className="mt-1 transition-transform group-hover:scale-105"
                />
                <div className="space-y-1.5 leading-none">
                  <span className="block text-base font-semibold">
                    {t('user:privacy.form.isPrivate.title')}
                  </span>
                  <p className="text-muted-foreground text-sm font-normal">
                    {t('user:privacy.form.isPrivate.description')}
                  </p>
                </div>
              </label>
            )}
          />
        </CardContent>

        <CardFooter className="bg-muted/50 flex justify-end border-t px-6 py-4">
          <Button size="sm" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? t('common:actions.saving') : t('common:actions.save')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
