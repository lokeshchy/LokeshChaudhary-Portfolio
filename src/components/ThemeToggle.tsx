'use client';

import { useEffect, useState } from 'react';
import {
  type ThemePreference,
  applyThemeClass,
  getStoredTheme,
  setStoredTheme,
} from '@/lib/theme';

const OPTIONS: { value: ThemePreference; label: string; short: string }[] = [
  { value: 'system', label: 'Match system', short: 'Auto' },
  { value: 'light', label: 'Light', short: 'Light' },
  { value: 'dark', label: 'Dark', short: 'Dark' },
];

type ThemeToggleProps = {
  /** Compact labels for tight headers (e.g. "Auto") */
  compact?: boolean;
  className?: string;
};

export function ThemeToggle({ compact = false, className = '' }: ThemeToggleProps) {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPreference(getStoredTheme());
  }, []);

  function choose(next: ThemePreference) {
    setStoredTheme(next);
    setPreference(next);
    applyThemeClass(next);
  }

  if (!mounted) {
    return (
      <div
        className={`flex rounded-button border border-border bg-surface p-0.5 opacity-0 ${className}`}
        aria-hidden
      >
        <span className="h-8 w-20" />
      </div>
    );
  }

  return (
    <div
      className={`flex rounded-button border border-border bg-surface p-0.5 shadow-soft ${className}`}
      role="group"
      aria-label="Color theme"
    >
      {OPTIONS.map(({ value, label, short }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            title={label}
            aria-pressed={active}
            onClick={() => choose(value)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-[calc(var(--radius-button,12px)-2px)] transition-colors ${
              active
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-foreground hover:bg-background'
            }`}
          >
            {compact ? short : label}
          </button>
        );
      })}
    </div>
  );
}
