import { useForm } from '@tanstack/react-form';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { useUpdateFullName } from '../api/queries';
import { type UpdateFullName, updateFullNameSchema } from '../model/schema';

export function UpdateUserFullNameCard({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const mutation = useUpdateFullName();

  const form = useForm({
    defaultValues: { firstName, lastName } satisfies UpdateFullName,
    validators: { onChange: updateFullNameSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
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
      <Card>
        <CardHeader>
          <CardTitle>Full Name</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <form.Field
              name="firstName"
              children={field => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>First Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />

            <form.Field
              name="lastName"
              children={field => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>Last Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button size="sm" type="submit">
            Save
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
