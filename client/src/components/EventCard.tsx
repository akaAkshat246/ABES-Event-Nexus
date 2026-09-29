import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Tag, Sparkles } from 'lucide-react';
import { IEvent } from '../types';

interface EventCardProps {
  event: IEvent;
  onRegisterClick?: (event: IEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRegisterClick }) => {
  const evDate = new Date(event.date);
  const formattedDate = evDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = evDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const isPast = evDate < new Date();
  const registered = event.registeredCount || 0;
  const isSoldOut = event.capacity ? registered >= event.capacity : false;

  const defaultPoster =
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="flex flex-col overflow-hidden rounded-[4px] border border-line dark:border-[#223040] bg-paper dark:bg-[#16212C] shadow-sm dark:shadow-hack-card-dark hover:border-saffron/80 dark:hover:border-saffron transition-all group">
      {/* Aspect 1.9 Poster Container */}
      <Link
        to={`/events/${event._id}`}
        className="relative block aspect-[1.9] w-full bg-[#14100b] overflow-hidden"
      >
        <img
          src={event.posterUrl || defaultPoster}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultPoster;
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-[2px] bg-navy/90 text-white backdrop-blur-sm border border-white/20">
            {event.club}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-[2px] bg-white/95 text-ink shadow-sm">
              {event.category}
            </span>
            {event.featured && (
              <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-[2px] bg-saffron text-white shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 fill-current" />
                Spotlight
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-3 px-[22px] pb-6 pt-5">
        <h3 className="font-display m-0 text-[18px] sm:text-[19px] font-bold leading-[1.3] text-ink dark:text-[#f1ede6]">
          <Link
            to={`/events/${event._id}`}
            className="text-inherit hover:text-saffron transition-colors line-clamp-2"
          >
            {event.name}
          </Link>
        </h3>

        <div className="text-[14px] leading-[1.6] text-[#3c352d] dark:text-[#9ba6b5] space-y-0.5">
          <div>
            <strong className="font-semibold text-ink dark:text-[#f1ede6]">{formattedDate}</strong>
            <span className="text-ink-500 dark:text-[#7f8b9b] text-xs ml-1.5 font-mono">({formattedTime})</span>
          </div>
          <div className="text-xs text-ink-500 dark:text-[#9ba6b5] flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-saffron shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Capacity / Registered Info */}
        <div className="pt-1 flex items-center justify-between text-xs text-ink-500 dark:text-[#9ba6b5] border-t border-line/60 dark:border-[#223040]">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Users className="w-3 h-3 text-saffron" />
            <span>{registered} registered</span>
          </span>
          {event.capacity ? (
            <span className="font-mono text-[11px] text-ink-600 dark:text-slate-300 font-semibold">
              Cap: {event.capacity}
            </span>
          ) : (
            <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Open Entry</span>
          )}
        </div>

        {/* Bottom CTA Button */}
        {isPast ? (
          <span className="font-display mt-auto inline-flex items-center justify-center rounded-[3px] bg-cream2 dark:bg-[#16212C] px-[22px] py-3 text-[14px] font-semibold text-ink-500 dark:text-[#7f8b9b] cursor-not-allowed">
            Registration ended
          </span>
        ) : isSoldOut ? (
          <span className="font-display mt-auto inline-flex items-center justify-center rounded-[3px] bg-rose-100 dark:bg-rose-950/60 px-[22px] py-3 text-[14px] font-semibold text-rose-700 dark:text-rose-300 cursor-not-allowed border border-transparent dark:border-rose-900/50">
            Capacity full
          </span>
        ) : (
          <button
            onClick={() => (onRegisterClick ? onRegisterClick(event) : null)}
            className="font-display mt-auto inline-flex items-center justify-center rounded-[3px] bg-saffron hover:bg-saffron-hover px-[22px] py-3 text-[14.5px] font-semibold text-white transition-colors shadow-sm"
          >
            <span>Participate now →</span>
          </button>
        )}
      </div>
    </div>
  );
};

