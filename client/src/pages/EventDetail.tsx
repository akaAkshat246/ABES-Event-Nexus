import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
  Sparkles,
  Award,
  CheckCircle,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { IEvent, RegistrationConfirmation } from '../types';
import { fetchEventById } from '../api/events';
import { RegistrationForm } from '../components/RegistrationForm';
import { TicketModal } from '../components/TicketModal';
import { useToast } from '../context/ToastContext';

export const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationTicket, setConfirmationTicket] = useState<RegistrationConfirmation | null>(null);
  const { info } = useToast();

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetchEventById(id);
        if (res.success && res.data) {
          setEvent(res.data);
        }
      } catch (err) {
        console.error('Failed to load event detail:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.name || 'ABES Event',
        text: event?.description || 'Check out this event at ABES Engineering College!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      info('Event link copied to clipboard!', 'Link Copied');
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-cream dark:bg-[#16212C] min-h-screen">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 animate-pulse space-y-6">
          <div className="h-8 w-48 bg-line dark:bg-[#223040] rounded-[3px]" />
          <div className="h-96 bg-line dark:bg-[#223040] rounded-[4px]" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-24 bg-cream dark:bg-[#16212C] min-h-screen text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <ShieldAlert className="w-16 h-16 text-rose-600 mx-auto" />
          <h2 className="font-display font-bold text-2xl text-ink dark:text-white">Hackathon Not Found</h2>
          <p className="text-sm text-[#645b50] dark:text-[#9ba6b5]">The event or hackathon you requested is currently unavailable.</p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-[3px] bg-saffron px-5 py-2.5 text-white font-display text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Hackathons</span>
          </Link>
        </div>
      </div>
    );
  }

  const evDate = new Date(event.date);
  const formattedDate = evDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
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
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="py-10 bg-cream dark:bg-[#16212C] min-h-screen space-y-8 transition-colors">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <Link
            to="/events"
            className="font-display inline-flex items-center gap-2 text-xs font-semibold text-ink-600 dark:text-[#9ba6b5] hover:text-saffron dark:hover:text-saffron transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Hackathons & Events</span>
          </Link>

          <button
            onClick={handleShare}
            className="font-display inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-paper dark:bg-[#16212C] border border-line dark:border-[#223040] text-ink dark:text-[#f1ede6] hover:text-saffron dark:hover:text-saffron text-xs font-semibold shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Event</span>
          </button>
        </div>

        {/* HackIndia Style Banner Card */}
        <div className="relative rounded-[4px] overflow-hidden bg-[#14100b] border border-line dark:border-[#223040] text-white shadow-sm">
          <div className="relative aspect-[2.4] w-full overflow-hidden max-h-[360px]">
            <img
              src={event.posterUrl || defaultPoster}
              alt={event.name}
              className="w-full h-full object-cover brightness-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14100b] via-[#14100b]/40 to-transparent" />
          </div>

          <div className="p-6 sm:p-8 space-y-4 -mt-20 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1 bg-saffron text-white rounded-[2px]">
                {event.club}
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1 bg-white/20 text-white rounded-[2px] border border-white/20">
                {event.category}
              </span>
              {event.featured && (
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1 bg-emerald-700 text-white rounded-[2px]">
                  Spotlight Event
                </span>
              )}
            </div>

            <h1 className="font-display text-[clamp(26px,4.5vw,46px)] font-bold text-white leading-tight">
              {event.name}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-saffron shrink-0" />
                <span className="font-semibold">{formattedDate}</span>
                <span className="font-mono text-xs text-saffron">({formattedTime})</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-saffron shrink-0" />
                <span>{event.venue} (ABES EC Campus)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Details on Left, Registration Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: About & Guidelines */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-[4px] border border-line dark:border-[#223040] bg-paper dark:bg-[#16212C] space-y-4">
              <div className="section-eyebrow">Overview</div>
              <h2 className="font-display text-xl font-bold text-ink dark:text-[#f1ede6]">About this Hackathon / Event</h2>
              <p className="text-[15px] text-[#3c352d] dark:text-[#9ba6b5] leading-[1.65] whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-[4px] border border-line dark:border-[#223040] bg-paper dark:bg-[#16212C] space-y-4">
              <div className="section-eyebrow">Eligibility & Rules</div>
              <h3 className="font-display text-lg font-bold text-ink dark:text-[#f1ede6]">Participation Guidelines</h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#3c352d] dark:text-[#9ba6b5]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Open to all B.Tech, MCA, and MBA students of ABES Engineering College and external participants.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Bring your college ID card along with your digital ticket E-pass.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Verified E-Certificates and AKTU Activity Points awarded to all registered attendees.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-[4px] bg-navy dark:bg-[#16212C] text-white border border-navy-800 dark:border-[#2b3b4f] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-saffron font-bold uppercase tracking-wider block">
                  Organizing Society
                </span>
                <h4 className="font-display font-bold text-lg text-white">{event.club}</h4>
                <p className="text-xs text-[#a99f92]">ABES Engineering College (Autonomous)</p>
              </div>
              <Link
                to={`/events?club=${encodeURIComponent(event.club)}`}
                className="font-display text-xs font-semibold rounded-[3px] bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 text-white transition-all"
              >
                More from Club →
              </Link>
            </div>
          </div>

          {/* Right: Registration Form Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="p-6 sm:p-8 rounded-[4px] border border-line dark:border-[#223040] bg-paper dark:bg-[#16212C] shadow-sm space-y-5">
              <div className="border-b border-line dark:border-[#223040] pb-4">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-saffron block mb-1">
                  Participant Pass
                </span>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display font-bold text-2xl text-ink dark:text-[#f1ede6]">Free Entry Pass</h3>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-[2px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/60">
                    100% Free
                  </span>
                </div>
                <p className="text-xs text-[#645b50] dark:text-[#9ba6b5] mt-1">Instant digital ticket pass with QR verification.</p>
              </div>

              {event.capacity && (
                <div className="p-3 rounded-[3px] bg-cream dark:bg-[#16212C] border border-line dark:border-[#2b3b4f] space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between font-semibold text-ink dark:text-[#f1ede6]">
                    <span>Seats Registered:</span>
                    <span>{registered} / {event.capacity}</span>
                  </div>
                  <div className="w-full h-2 bg-line dark:bg-[#223040] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isSoldOut ? 'bg-rose-600' : 'bg-saffron'}`}
                      style={{ width: `${Math.min(100, (registered / event.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {isPast ? (
                <div className="p-6 text-center bg-cream dark:bg-[#16212C] rounded-[3px] text-xs text-[#645b50] dark:text-[#9ba6b5] border border-line dark:border-[#223040]">
                  This event or hackathon has already concluded.
                </div>
              ) : isSoldOut ? (
                <div className="p-6 text-center bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-semibold rounded-[3px]">
                  Maximum seat capacity has been reached for this event.
                </div>
              ) : (
                <RegistrationForm
                  event={event}
                  onSuccess={(ticket) => {
                    setConfirmationTicket(ticket);
                    if (event._id) {
                      fetchEventById(event._id).then((r) => r.success && setEvent(r.data));
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      <TicketModal
        confirmation={confirmationTicket}
        onClose={() => setConfirmationTicket(null)}
      />
    </div>
  );
};

