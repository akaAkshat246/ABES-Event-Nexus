import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, RefreshCcw, Sparkles } from 'lucide-react';
import { IEvent, RegistrationConfirmation, EventsResponse } from '../types';
import { fetchEvents } from '../api/events';
import { EventCard } from '../components/EventCard';
import { RegistrationModal } from '../components/RegistrationModal';
import { TicketModal } from '../components/TicketModal';

const CATEGORIES: Array<{ label: string; value: string }> = [
  { label: 'All Categories', value: 'all' },
  { label: 'Technical', value: 'Technical' },
  { label: 'Hackathon', value: 'Hackathon' },
  { label: 'Cultural', value: 'Cultural' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Workshop', value: 'Workshop' },
  { label: 'Seminar', value: 'Seminar' },
  { label: 'Other', value: 'Other' },
];

const OFFICIAL_CLUBS = [
  'All Clubs',
  'GFG',
  'Codechef',
  'GDG',
  'IEEE',
  'Drone and Robotics',
  'Arcade-AR/VR',
  'Agora',
  'ACM',
  'ACES',
  'En Passant',
  'Salah',
  'Creative and Tourism',
  'Kalakriti',
  'NSS',
  'Picturesque',
  'Minerva',
  'SYC & Yoga Club',
  'Samvad',
  'E-Cell',
];

export const Events: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParamQ = searchParams.get('q') || '';
  const queryParamCategory = searchParams.get('category') || 'all';
  const queryParamClub = searchParams.get('club') || 'all';
  const queryParamTimeframe = searchParams.get('timeframe') || 'upcoming';
  const queryParamPage = parseInt(searchParams.get('page') || '1', 10);

  const [events, setEvents] = useState<IEvent[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState(queryParamQ);
  const [selectedEventForModal, setSelectedEventForModal] = useState<IEvent | null>(null);
  const [confirmationTicket, setConfirmationTicket] = useState<RegistrationConfirmation | null>(null);

  // Sync internal search input
  useEffect(() => {
    setSearchInput(queryParamQ);
  }, [queryParamQ]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== queryParamQ) {
        updateUrlParams({ q: searchInput });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const updateUrlParams = useCallback(
    (newParams: { [key: string]: string | number }) => {
      const current = Object.fromEntries(searchParams.entries());
      const updated: Record<string, string> = { ...current };

      Object.entries(newParams).forEach(([key, val]) => {
        if (val === '' || val === 'all' || val === undefined) {
          delete updated[key];
        } else {
          updated[key] = String(val);
        }
      });

      if ('q' in newParams || 'category' in newParams || 'timeframe' in newParams || 'club' in newParams) {
        if (!('page' in newParams)) {
          delete updated.page;
        }
      }

      setSearchParams(updated);
    },
    [searchParams, setSearchParams]
  );

  const loadEventsData = useCallback(async () => {
    try {
      setLoading(true);
      const res: EventsResponse = await fetchEvents({
        q: queryParamQ,
        category: queryParamCategory !== 'all' ? queryParamCategory : undefined,
        club: queryParamClub !== 'all' ? queryParamClub : undefined,
        timeframe: queryParamTimeframe as 'upcoming' | 'past' | 'all',
        page: queryParamPage,
        limit: 12,
      });

      if (res.success && res.data) {
        setEvents(res.data);
        setTotalCount(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }, [queryParamQ, queryParamCategory, queryParamClub, queryParamTimeframe, queryParamPage]);

  useEffect(() => {
    loadEventsData();
  }, [loadEventsData]);

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="py-12 bg-cream dark:bg-[#16212C] min-h-screen transition-colors">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="section-eyebrow">ABES Event Nexus · Autonomous</div>
          <h1 className="font-display text-[clamp(28px,4.5vw,44px)] font-bold text-ink dark:text-white tracking-tight">
            Explore Campus Hackathons & Events
          </h1>
          <p className="text-[15px] text-[#3c352d] dark:text-[#9ba6b5] max-w-2xl">
            Filter by problem track, organizing student club (19 official societies), or search across national flagships and workshops.
          </p>
        </div>

        {/* Filter Strip */}
        <div className="bg-paper dark:bg-[#16212C] p-4 sm:p-5 rounded-[4px] border border-line dark:border-[#223040] space-y-4 shadow-sm">
          {/* Search, Club Selector & Timeframe */}
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 dark:text-[#7f8b9b]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search events by name, topic (AI, Robotics), club (GDG, ACM, E-Cell), venue..."
                className="w-full pl-10 pr-4 py-2.5 rounded-[3px] border border-line dark:border-[#2b3b4f] bg-cream/30 dark:bg-[#16212C] text-sm text-ink dark:text-white placeholder:text-[#8c8377] dark:placeholder:text-[#627285] focus:outline-none focus:border-saffron"
              />
            </div>

            {/* Club Filter Dropdown */}
            <div className="w-full lg:w-64">
              <select
                value={queryParamClub}
                onChange={(e) => updateUrlParams({ club: e.target.value })}
                className="w-full px-3 py-2.5 rounded-[3px] border border-line dark:border-[#2b3b4f] bg-cream/30 dark:bg-[#16212C] text-xs font-display font-semibold text-ink dark:text-white focus:outline-none focus:border-saffron"
              >
                {OFFICIAL_CLUBS.map((c) => (
                  <option key={c} value={c === 'All Clubs' ? 'all' : c} className="dark:bg-[#16212C] dark:text-white">
                    {c === 'All Clubs' ? 'Filter by Club: All (19)' : `Club: ${c}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center bg-cream dark:bg-[#16212C] p-1 rounded-[3px] border border-line dark:border-[#2b3b4f] w-full lg:w-auto">
              {['upcoming', 'past', 'all'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => updateUrlParams({ timeframe: tf })}
                  className={`flex-1 lg:flex-initial px-3.5 py-1.5 rounded-[2px] font-display text-xs font-semibold uppercase tracking-wider transition-all ${
                    queryParamTimeframe === tf
                      ? 'bg-ink dark:bg-saffron text-white shadow-sm'
                      : 'text-ink-600 dark:text-[#9ba6b5] hover:text-ink dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-line/60 dark:border-[#223040]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full">
              {CATEGORIES.map((cat) => {
                const isSelected =
                  queryParamCategory.toLowerCase() === cat.value.toLowerCase() ||
                  (cat.value === 'all' && !queryParamCategory);

                return (
                  <button
                    key={cat.value}
                    onClick={() => updateUrlParams({ category: cat.value })}
                    className={`px-3 py-1.5 rounded-[3px] font-display text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-saffron text-white shadow-sm'
                        : 'bg-cream dark:bg-[#16212C] text-ink-600 dark:text-[#9ba6b5] hover:bg-cream2 dark:hover:bg-[#223040] hover:text-ink dark:hover:text-white border border-line dark:border-[#2b3b4f]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {(queryParamCategory !== 'all' || queryParamClub !== 'all' || queryParamQ) && (
                <button
                  onClick={handleClearFilters}
                  className="font-mono text-xs text-saffron hover:underline whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
              <span className="font-mono text-xs text-ink-500 dark:text-[#9ba6b5] shrink-0 hidden md:inline-block">
                Found <strong className="text-ink dark:text-white">{totalCount}</strong> event{totalCount === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid gap-[18px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-[4px] bg-paper dark:bg-[#16212C] animate-pulse border border-line dark:border-[#223040]" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-8">
            <div className="grid gap-[18px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onRegisterClick={(e) => setSelectedEventForModal(e)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => updateUrlParams({ page: queryParamPage - 1 })}
                  disabled={queryParamPage <= 1}
                  className="px-4 py-2 rounded-[3px] border border-line dark:border-[#2b3b4f] bg-paper dark:bg-[#16212C] text-ink dark:text-[#f1ede6] font-display text-xs font-semibold hover:bg-cream dark:hover:bg-[#16212C] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-1 font-mono text-xs font-bold">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateUrlParams({ page: p })}
                      className={`w-8 h-8 rounded-[3px] transition-all ${
                        p === queryParamPage
                          ? 'bg-saffron text-white'
                          : 'bg-paper dark:bg-[#16212C] text-ink dark:text-[#f1ede6] hover:bg-cream dark:hover:bg-[#16212C] border border-line dark:border-[#2b3b4f]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => updateUrlParams({ page: queryParamPage + 1 })}
                  disabled={queryParamPage >= totalPages}
                  className="px-4 py-2 rounded-[3px] border border-line dark:border-[#2b3b4f] bg-paper dark:bg-[#16212C] text-ink dark:text-[#f1ede6] font-display text-xs font-semibold hover:bg-cream dark:hover:bg-[#16212C] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 text-center bg-paper dark:bg-[#16212C] rounded-[4px] border border-line dark:border-[#223040] max-w-md mx-auto space-y-4">
            <Search className="w-10 h-10 text-saffron mx-auto" />
            <h3 className="font-display font-bold text-lg text-ink dark:text-white">No hackathons or events found</h3>
            <p className="text-xs text-[#645b50] dark:text-[#9ba6b5]">
              Try adjusting your search keywords or resetting category filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 rounded-[3px] bg-saffron hover:bg-saffron-hover text-white font-display text-xs font-semibold transition-colors inline-flex items-center gap-2"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        event={selectedEventForModal}
        isOpen={!!selectedEventForModal}
        onClose={() => setSelectedEventForModal(null)}
        onSuccess={(ticket) => {
          setSelectedEventForModal(null);
          setConfirmationTicket(ticket);
        }}
      />

      {/* Ticket Modal */}
      <TicketModal
        confirmation={confirmationTicket}
        onClose={() => setConfirmationTicket(null)}
      />
    </div>
  );
};

