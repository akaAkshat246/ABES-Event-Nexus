import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center justify-center p-2 rounded-[4px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron border ${
        isDark
          ? 'bg-[#16212C] hover:bg-[#223040] text-amber-400 border-[#2b3b4f]'
          : 'bg-[#f5f0e8] hover:bg-[#e6e0d5] text-ink-700 border-[#d7d0c5]'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transform transition-transform duration-300 rotate-0 scale-100 animate-in spin-in-180" />
        ) : (
          <Moon className="w-4 h-4 text-ink-800 transform transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>

      {showLabel && (
        <span className="ml-2 font-display text-xs font-semibold select-none">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};
