import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';

import { profileQueries } from '@/entities/user';

import { useInfiniteScroll } from '@/shared/lib/hooks';
import { BaseAvatar } from '@/shared/ui/base-avatar';
import { Button } from '@/shared/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';
import { Spinner } from '@/shared/ui/spinner';

export function ProfileSearch() {
  const { t } = useTranslation('user', { keyPrefix: 'query' });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(searchValue), 400);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...profileQueries.search(debouncedValue),
    enabled: open,
  });

  const { observerTarget } = useInfiniteScroll({ hasNextPage, fetchNextPage, isFetchingNextPage });
  const users = data?.pages?.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="text-muted-foreground relative h-9 w-full max-w-45 justify-start text-sm font-normal shadow-none sm:max-w-none sm:pr-12 md:w-64 lg:w-60"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>{t('placeholder')}</span>
        <kbd className="bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t('placeholder')}
            value={searchValue}
            onValueChange={setSearchValue}
          />

          <CommandList className="max-h-100">
            {isLoading ? (
              <div className="text-muted-foreground flex items-center justify-center py-6 text-sm">
                <Spinner />
              </div>
            ) : (
              <>
                <CommandEmpty className="py-6 text-center text-sm">
                  <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                    <Search className="h-6 w-6" />
                    <p>{t('notFound')}</p>
                  </div>
                </CommandEmpty>

                <CommandGroup className="p-2">
                  <div className="flex flex-col gap-1">
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={`${user.firstName} ${user.lastName} ${user.username}`}
                        onSelect={() => {
                          navigate({ to: '/$username', params: { username: user.username } });
                          setOpen(false);
                        }}
                        className="aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-colors"
                      >
                        <BaseAvatar
                          className="h-9 w-9 shrink-0"
                          alt={user.username}
                          src={user.avatar}
                        />

                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="text-foreground truncate text-sm leading-none font-medium">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-muted-foreground mt-1.5 truncate text-xs">
                            @{user.username}
                          </span>
                        </div>
                      </CommandItem>
                    ))}

                    <div ref={observerTarget} className="h-1 w-full" />

                    {isFetchingNextPage && (
                      <div className="flex items-center justify-center py-4">
                        <Spinner className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
