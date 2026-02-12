"use client";

import { usePathname } from 'next/navigation';
import { useMemo, type ReactNode } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import { useAuth } from '@/context/auth-context';

type NavbarProps = {
  title?: string;
  rightSlot?: ReactNode;
};

export const Navbar = ({ title, rightSlot }: NavbarProps) => {
  const { user } = useAuth();
  const pathname = usePathname();

  const fullName = useMemo(() => {
    if (!user) return null;
    const value = `${user.first_name} ${user.last_name}`.trim().toLowerCase();
    return value.length ? value : null;
  }, [user]);

  const initials = useMemo(() => {
    const first = user?.first_name?.trim()?.[0] ?? '';
    const last = user?.last_name?.trim()?.[0] ?? '';
    const value = `${first}${last}`.toUpperCase();
    return value.length ? value : 'U';
  }, [user]);

  const derivedTitle = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const value = segments[segments.length - 1] ?? '';
    if (!value) return '';
    if (value === 'dashboard') return 'Dashboard';
    return value
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }, [pathname]);

  const displayTitle = title ?? derivedTitle;

  return (
    <header className="sticky top-0 z-20 w-full bg-background transition-colors duration-300">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          {displayTitle ? (
            <div className="text-xs font-bold text-foreground tracking-tight truncate">
              {displayTitle}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {rightSlot}
          <ModeToggle />
          <div className="flex items-center gap-3 rounded-xl px-3 py-1.5 bg-accent/50 hover:bg-accent transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
              {initials}
            </div>
            <div className="hidden sm:block leading-tight min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">
                {fullName ?? 'account'}
              </div>
              <div className="text-[10px] font-medium text-muted-foreground truncate">{user ? 'Signed in' : 'Loading'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
