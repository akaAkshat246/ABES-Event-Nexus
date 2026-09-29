import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  isAutoScheduled: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  resetToAuto: () => void;
  getTimeBasedTheme: (date?: Date) => Theme;
}

const SESSION_OVERRIDE_KEY = 'abes_theme_manual_override';

/**
 * Global Time-Based Theme Schedule:
 * - Light Theme: 7:00 AM (07:00:00.000) to 6:59:59 PM (18:59:59.999)
 * - Dark Theme:  7:00 PM (19:00:00.000) to 6:59:59 AM (06:59:59.999)
 */
export const getTimeBasedTheme = (now: Date = new Date()): Theme => {
  const hours = now.getHours(); // 0 to 23
  if (hours >= 7 && hours < 19) {
    return 'light';
  }
  return 'dark';
};

/**
 * Calculates milliseconds remaining until the exact next 7:00 AM or 7:00 PM transition boundary.
 */
export const getMsUntilNextTransition = (now: Date = new Date()): number => {
  const hours = now.getHours();
  const next = new Date(now);

  if (hours < 7) {
    // Transition to Light at 7:00:00 AM today
    next.setHours(7, 0, 0, 0);
  } else if (hours < 19) {
    // Transition to Dark at 7:00:00 PM today
    next.setHours(19, 0, 0, 0);
  } else {
    // Transition to Light at 7:00:00 AM tomorrow
    next.setDate(next.getDate() + 1);
    next.setHours(7, 0, 0, 0);
  }

  const diff = next.getTime() - now.getTime();
  return Math.max(500, diff);
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check if session has a manual override
  const getInitialState = (): { theme: Theme; isAutoScheduled: boolean } => {
    try {
      const sessionOverride = sessionStorage.getItem(SESSION_OVERRIDE_KEY);
      if (sessionOverride === 'light' || sessionOverride === 'dark') {
        return { theme: sessionOverride, isAutoScheduled: false };
      }
    } catch {
      // sessionStorage unavailable
    }
    return { theme: getTimeBasedTheme(), isAutoScheduled: true };
  };

  const [themeState, setThemeState] = useState<{ theme: Theme; isAutoScheduled: boolean }>(getInitialState);
  const { theme, isAutoScheduled } = themeState;

  // Apply theme to document root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      root.setAttribute('data-theme', 'light');
    }
    root.setAttribute('data-theme-mode', isAutoScheduled ? 'auto' : 'manual');
  }, [theme, isAutoScheduled]);

  // Synchronize and schedule automatic transitions
  const syncScheduledTheme = useCallback(() => {
    if (!isAutoScheduled) return;
    const currentExpectedTheme = getTimeBasedTheme();
    setThemeState((prev) => {
      if (prev.isAutoScheduled && prev.theme !== currentExpectedTheme) {
        return { theme: currentExpectedTheme, isAutoScheduled: true };
      }
      return prev;
    });
  }, [isAutoScheduled]);

  useEffect(() => {
    if (!isAutoScheduled) return;

    // 1. Initial check
    syncScheduledTheme();

    // 2. Precise timeout for the next 7:00 AM / 7:00 PM boundary
    let timeoutId: number | undefined;
    const scheduleNextTransition = () => {
      const ms = getMsUntilNextTransition();
      timeoutId = window.setTimeout(() => {
        syncScheduledTheme();
        scheduleNextTransition();
      }, ms + 50); // small 50ms buffer to ensure past the second boundary
    };
    scheduleNextTransition();

    // 3. Periodic safety interval (every 10s) for clock shifts / background sleep
    const intervalId = window.setInterval(syncScheduledTheme, 10000);

    // 4. Tab visibility and window focus handlers (for sleep wake-up & background tab returning)
    const handleWakeOrFocus = () => {
      if (document.visibilityState === 'visible') {
        syncScheduledTheme();
      }
    };

    document.addEventListener('visibilitychange', handleWakeOrFocus);
    window.addEventListener('focus', handleWakeOrFocus);
    window.addEventListener('pageshow', handleWakeOrFocus);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleWakeOrFocus);
      window.removeEventListener('focus', handleWakeOrFocus);
      window.removeEventListener('pageshow', handleWakeOrFocus);
    };
  }, [isAutoScheduled, syncScheduledTheme]);

  // Manual toggle (active for current session only)
  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    try {
      sessionStorage.setItem(SESSION_OVERRIDE_KEY, newTheme);
    } catch {}
    setThemeState({ theme: newTheme, isAutoScheduled: false });
  };

  // Manual specific theme set (active for current session only)
  const setTheme = (newTheme: Theme) => {
    try {
      sessionStorage.setItem(SESSION_OVERRIDE_KEY, newTheme);
    } catch {}
    setThemeState({ theme: newTheme, isAutoScheduled: false });
  };

  // Reset to automatic time-based schedule
  const resetToAuto = () => {
    try {
      sessionStorage.removeItem(SESSION_OVERRIDE_KEY);
    } catch {}
    const autoTheme = getTimeBasedTheme();
    setThemeState({ theme: autoTheme, isAutoScheduled: true });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isAutoScheduled,
        toggleTheme,
        setTheme,
        resetToAuto,
        getTimeBasedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
