import { Button } from '@/shared/ui/button';

import { useSendFriendRequestMutation } from '../model/mutation';

type Props = {
  userId: number;
};

export function SendFriendRequestButton({ userId }: Props) {
  const mutation = useSendFriendRequestMutation();

  return <Button onClick={() => mutation.mutate(userId)}>Send request</Button>;
}
