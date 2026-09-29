import React, { useState, useEffect } from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { EventCategory } from '../types';

interface SearchFilterBarProps {
  searchQuery: string;
  selectedCategory: string;
  selectedTimeframe?: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onTimeframeChange?: (timeframe: string) => void;
  totalResults?: number;
}

const CATEGORIES: Array<{ label: string; value: string }> = [
  { label: 'All Categories', value: 'all' },
  { label: 'Technical', value: 'Technical' },
  { label: 'Cultural', value: 'Cultural' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Workshop', value: 'Workshop' },
  { label: 'Hackathon', value: 'Hackathon' },
  { label: 'Seminar', value: 'Seminar' },
  { label: 'Other', value: 'Other' },
];

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  selectedCategory,
  selectedTimeframe = 'upcoming',
  onSearchChange,
  onCategoryChange,
  onTimeframeChange,
  totalResults,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync internal state if prop changes (e.g. from URL popstate)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounced search trigger (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, searchQuery, onSearchChange]);

  const handleClear = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  return (
    <div className="bg-white dark:bg-[#16212C] rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 dark:border-[#223040] space-y-4 transition-colors">
      {/* Top Row: Search Input & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search events by name, club (TEDx, Genero, etc.), or venue..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-[#2b3b4f] focus:border-saffron focus:ring-2 focus:ring-saffron/20 outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all bg-slate-50/50 dark:bg-[#16212C] hover:bg-white dark:hover:bg-[#0f1620] focus:bg-white dark:focus:bg-[#0f1620]"
          />
          {localSearch && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Timeframe Filter (Upcoming / Past / All) */}
        {onTimeframeChange && (
          <div className="flex items-center bg-slate-100 dark:bg-[#16212C] p-1 rounded-xl shrink-0 w-full sm:w-auto border border-transparent dark:border-[#2b3b4f]">
            <button
              onClick={() => onTimeframeChange('upcoming')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTimeframe === 'upcoming'
                  ? 'bg-white dark:bg-saffron text-secondary-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-[#9ba6b5] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => onTimeframeChange('past')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTimeframe === 'past'
                  ? 'bg-white dark:bg-saffron text-secondary-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-[#9ba6b5] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => onTimeframeChange('all')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTimeframe === 'all'
                  ? 'bg-white dark:bg-saffron text-secondary-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-[#9ba6b5] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
          </div>
        )}
      </div>

      {/* Bottom Row: Category Chip Filter Pills */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-[#223040]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none w-full">
          <span className="text-xs font-bold text-slate-500 dark:text-[#9ba6b5] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1 hidden sm:flex">
            <Filter className="w-3 h-3 text-saffron" />
            Category:
          </span>

          {CATEGORIES.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.value.toLowerCase() ||
              (cat.value === 'all' && !selectedCategory);

            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-saffron text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#16212C] text-slate-600 dark:text-[#9ba6b5] hover:bg-slate-200/80 dark:hover:bg-[#223040] hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-[#2b3b4f]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {typeof totalResults === 'number' && (
          <span className="text-xs font-medium text-slate-500 dark:text-[#9ba6b5] shrink-0 hidden md:inline-block">
            Found <strong className="text-slate-800 dark:text-white">{totalResults}</strong> event{totalResults === 1 ? '' : 's'}
          </span>
        )}
      </div>
    </div>
  );
};

