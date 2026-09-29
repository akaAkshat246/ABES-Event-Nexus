import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, Users, ArrowRight, Clock, Award } from 'lucide-react';
import { IEvent } from '../types';

interface FeaturedEventCardProps {
  event: IEvent;
  onRegisterClick?: (event: IEvent) => void;
}

export const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({
  event,
  onRegisterClick,
}) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Calculate days remaining
  const now = new Date();
  const diffTime = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const defaultPoster =
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="relative rounded-3xl overflow-hidden bg-secondary-900 border border-slate-800 shadow-2xl">
      {/* Background Poster with Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={event.posterUrl || defaultPoster}
          alt={event.name}
          className="w-full h-full object-cover object-center scale-105 filter brightness-50"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultPoster;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-950 via-secondary-950/90 to-secondary-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-950 via-transparent to-transparent" />
      </div>

      {/* Card Content Grid */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Col: Event Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-accent-500 text-secondary-950 shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              SPOTLIGHT EVENT
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-800/90 text-rose-100 border border-primary-600/50 backdrop-blur-md">
              {event.club}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md">
              {event.category}
            </span>

            {diffDays > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                In {diffDays} {diffDays === 1 ? 'Day' : 'Days'}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight drop-shadow-sm">
              {event.name}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl line-clamp-3 font-normal">
              {event.description}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-slate-200">
              <div className="p-2 rounded-xl bg-primary-800/80 text-white shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 font-medium">Date & Time</span>
                <span className="text-xs font-semibold text-white">{formattedDate}</span>
                <span className="text-[11px] text-accent-300 font-medium">{formattedTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-slate-200">
              <div className="p-2 rounded-xl bg-secondary-800 text-sky-300 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 font-medium">Location Venue</span>
                <span className="text-xs font-semibold text-white truncate max-w-[200px]">
                  {event.venue}
                </span>
                <span className="text-[11px] text-slate-400">ABES EC Campus</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => (onRegisterClick ? onRegisterClick(event) : null)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary-800 to-primary-600 hover:from-primary-700 hover:to-primary-500 text-white font-bold text-sm shadow-xl shadow-primary-950/50 hover:shadow-primary-800/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 border border-primary-500/40"
            >
              <span>Register for Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to={`/events/${event._id}`}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <span>View Agenda & Details</span>
            </Link>
          </div>
        </div>

        {/* Right Col: Poster Card preview */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border-2 border-white/15 group">
            <img
              src={event.posterUrl || defaultPoster}
              alt={event.name}
              className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
              <div className="flex items-center gap-2 text-xs font-bold text-accent-300 mb-1">
                <Award className="w-4 h-4" />
                <span>Organized by {event.club}</span>
              </div>
              <p className="text-xs text-slate-200 font-medium line-clamp-2">
                Join {event.registeredCount || 0} students who have already registered!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
