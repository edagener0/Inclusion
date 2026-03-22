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

  const form = useForm({
    defaultValues: { isPrivate } satisfies AccountPrivacy,
    validators: { onChange: AccountPrivacySchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value.isPrivate);
    },
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Account Visibility</CardTitle>
          <CardDescription>
            Choose if you want your profile to be public or private.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form.Field
            name="isPrivate"
            children={field => (
              <label
                htmlFor={field.name}
                className="group flex items-start space-x-4 rounded-lg border border-border p-4 cursor-pointer transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={checked => field.handleChange(!!checked)}
                  disabled={mutation.isPending}
                  className="mt-1 transition-transform group-hover:scale-105"
                />
                <div className="space-y-1.5 leading-none">
                  <span className="text-base font-semibold block">Private Account</span>
                  <p className="text-sm font-normal text-muted-foreground">
                    When private, only your friends can see your posts, incs... This setting
                    protects your profile and personal content.
                  </p>
                </div>
              </label>
            )}
          />
        </CardContent>

        <CardFooter className="flex justify-end border-t bg-muted/50 px-6 py-4">
          <Button size="sm" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
