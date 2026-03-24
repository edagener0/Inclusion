import type { Profile } from '../model/schema';

export function ProfileInfo({
  biography,
  firstName,
  lastName,
}: Pick<Profile, 'firstName' | 'lastName' | 'biography'>) {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold">
        {firstName} {lastName}
      </h1>
      <p className="text-muted-foreground mt-1">{biography}</p>
    </>
  );
}
