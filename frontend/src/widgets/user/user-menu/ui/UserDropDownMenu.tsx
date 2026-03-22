import { useNavigate } from '@tanstack/react-router';
import { LogOut, Settings, User } from 'lucide-react';

import { useSession } from '@/entities/session';
import { UserAvatar } from '@/entities/user';
import { useSignOutMutation } from '@/features/auth/sign-out';
import { ThemeSwitcherDropDownMenuSub } from '@/features/theme-switcher';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export function UserDropDownMenu() {
  const user = useSession();
  const navigate = useNavigate();
  const mutation = useSignOutMutation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <UserAvatar avatar={user.avatar} username={user.username} className="h-10 w-10" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.firstName} {user.lastName}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate({ to: `/$username`, params: { username: user.username } })}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate({ to: '.', search: { modal: 'user-settings' } })}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <ThemeSwitcherDropDownMenuSub />

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-950/50"
          onClick={() => mutation.mutate()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
