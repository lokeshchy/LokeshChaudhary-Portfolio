export const THEME_STORAGE_KEY = 'portfolio-theme';

export type ThemePreference = 'system' | 'light' | 'dark';

/** Runs before paint — keep in sync with getStoredTheme / effectiveIsDark logic. */
export const themeBootstrapInlineScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var p=localStorage.getItem(k);var s=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=p==='dark'||(p!=='light'&&s);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export function getStoredTheme(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    /* private mode */
  }
  return 'system';
}

export function setStoredTheme(preference: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* ignore */
  }
}

export function effectiveIsDark(preference: ThemePreference): boolean {
  if (preference === 'dark') return true;
  if (preference === 'light') return false;
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyThemeClass(preference: ThemePreference): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', effectiveIsDark(preference));
}
