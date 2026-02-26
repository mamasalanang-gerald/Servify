import { useCallback, useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'theme';
const THEME_CHANGE_EVENT = 'servify:theme-change';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

const normalizeTheme = (theme) => (theme === DARK_THEME ? DARK_THEME : LIGHT_THEME);

export const getStoredTheme = () => {
  if (typeof window === 'undefined') return LIGHT_THEME;
  return normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
};

export const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle(DARK_THEME, theme === DARK_THEME);
};

export const initializeTheme = () => {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
};

const useTheme = () => {
  const [theme, setTheme] = useState(() => getStoredTheme());

  useEffect(() => {
    const normalizedTheme = normalizeTheme(theme);
    applyTheme(normalizedTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, normalizedTheme);
      window.dispatchEvent(
        new CustomEvent(THEME_CHANGE_EVENT, { detail: normalizedTheme }),
      );
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const syncTheme = (nextTheme) => {
      const normalizedTheme = normalizeTheme(nextTheme);
      setTheme((prevTheme) =>
        prevTheme === normalizedTheme ? prevTheme : normalizedTheme,
      );
    };

    const handleStorage = (event) => {
      if (event.key === THEME_STORAGE_KEY) {
        syncTheme(event.newValue);
      }
    };

    const handleThemeChange = (event) => {
      syncTheme(event.detail);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) =>
      prevTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME,
    );
  }, []);

  return {
    theme,
    isDark: theme === DARK_THEME,
    setTheme,
    toggleTheme,
  };
};

export default useTheme;
