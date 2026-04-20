'use client';

import { useEffect } from 'react';
import {
  THEME_STORAGE_KEY,
  applyThemeClass,
  getStoredTheme,
} from '@/lib/theme';

/** Re-applies theme after hydration and listens for system preference + other-tab storage changes. */
export function ThemeSync() {
  useEffect(() => {
    applyThemeClass(getStoredTheme());

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onMediaChange = () => {
      if (getStoredTheme() === 'system') applyThemeClass('system');
    };
    media.addEventListener('change', onMediaChange);

    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY) applyThemeClass(getStoredTheme());
    };
    window.addEventListener('storage', onStorage);

    return () => {
      media.removeEventListener('change', onMediaChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return null;
}
