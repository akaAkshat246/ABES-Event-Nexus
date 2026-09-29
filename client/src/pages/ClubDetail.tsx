import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Mail,
  Award,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { getClubBySlug, CLUBS_DIRECTORY, IClubDetails } from '../data/clubsData';
import { IEvent, RegistrationConfirmation } from '../types';
import { fetchEvents } from '../api/events';
import { EventCard } from '../components/EventCard';
import { RegistrationModal } from '../components/RegistrationModal';
import { TicketModal } from '../components/TicketModal';

export const ClubDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [club, setClub] = useState<IClubDetails | null>(null);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventForModal, setSelectedEventForModal] = useState<IEvent | null>(null);
  const [confirmationTicket, setConfirmationTicket] = useState<RegistrationConfirmation | null>(null);

  useEffect(() => {
    if (!slug) return;
    const foundClub = getClubBySlug(slug);
    if (!foundClub) {
      setClub(null);
      setLoading(false);
      return;
    }

    setClub(foundClub);

    // Fetch events hosted by this club
    const loadClubEvents = async () => {
      try {
        setLoading(true);
        const res = await fetchEvents({ club: foundClub.name });
        if (res.success && res.data) {
          setEvents(res.data);
        } else {
          // Fallback check matching without strict case
          const allRes = await fetchEvents({});
          if (allRes.success && allRes.data) {
            const filtered = allRes.data.filter(
              (e) =>
                e.club.toLowerCase() === foundClub.name.toLowerCase() ||
                e.club.toLowerCase().includes(foundClub.name.toLowerCase()) ||
                foundClub.fullName.toLowerCase().includes(e.club.toLowerCase())
            );
            setEvents(filtered);
          }
        }
      } catch (err) {
        console.error('Failed to load club events:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClubEvents();
  }, [slug]);

  if (!club && !loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-saffron/10 text-saffron text-2xl font-bold font-mono">
          404
        </div>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-white">
          Society Not Found
        </h1>
        <p className="text-ink-600 dark:text-[#9ba6b5] max-w-md mx-auto">
          The requested student club or society profile could not be located in the ABES Event Nexus directory.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-[3px] bg-saffron hover:bg-saffron-hover px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Nexus Home</span>
        </Link>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="h-64 rounded-[6px] bg-cream dark:bg-[#16212C] animate-pulse" />
      </div>
    );
  }

  const otherClubs = CLUBS_DIRECTORY.filter((c) => c.slug !== club.slug);

  return (
    <div className="space-y-0 pb-16">
      {/* 1. HERO BANNER & BREADCRUMB */}
      <div className="relative bg-navy text-white border-b border-navy-800">
        {/* Background Image overlay */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <img
            src={club.bannerImage}
            alt={club.fullName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy" />
        </div>

        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 space-y-6">
          {/* Breadcrumb & Category Badge */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#a99f92]">
            <Link to="/" className="hover:text-saffron transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/events" className="hover:text-saffron transition-colors">
              Clubs
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">{club.name}</span>

            <span className="ml-2 px-2.5 py-0.5 rounded-[2px] bg-saffron/20 text-saffron border border-saffron/30 font-sans font-semibold text-[11px]">
              {club.category}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[4px] bg-white/10 border border-white/20 flex items-center justify-center p-2 shrink-0">
                  <img
                    src="/assets/abes-logo.png"
                    alt="ABES Crest"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                    {club.name}
                  </h1>
                  <p className="font-mono text-xs sm:text-sm text-saffron tracking-wider uppercase mt-0.5">
                    {club.fullName}
                  </p>
                </div>
              </div>

              <p className="text-base sm:text-lg text-[#d7d0c5] leading-relaxed max-w-3xl">
                {club.description}
              </p>

              {/* Stats badges */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
                <div className="px-3.5 py-2 rounded-[3px] bg-white/10 border border-white/15 flex items-center gap-2 text-white">
                  <Users className="w-4 h-4 text-saffron" />
                  <span>
                    Active Members: <strong>{club.memberCount}</strong>
                  </span>
                </div>

                <div className="px-3.5 py-2 rounded-[3px] bg-white/10 border border-white/15 flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4 text-saffron" />
                  <span>
                    Established: <strong>{club.established}</strong>
                  </span>
                </div>

                <div className="px-3.5 py-2 rounded-[3px] bg-white/10 border border-white/15 flex items-center gap-2 text-white">
                  <Layers className="w-4 h-4 text-saffron" />
                  <span>
                    Focus Area: <strong>{club.tag}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Contact / Leadership Box */}
            <div className="rounded-[4px] bg-white/5 border border-white/15 p-5 space-y-4 backdrop-blur-sm">
              <h3 className="font-display font-bold text-sm tracking-wider uppercase text-saffron border-b border-white/10 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Leadership & Contact</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#a99f92] block">Faculty Advisor:</span>
                  <span className="text-white font-medium">{club.facultyAdvisor}</span>
                </div>

                <div>
                  <span className="text-[#a99f92] block">Student Lead:</span>
                  <span className="text-white font-medium">{club.studentLead}</span>
                </div>

                <div>
                  <span className="text-[#a99f92] block">Official Inquiries:</span>
                  <a
                    href={`mailto:${club.contactEmail}`}
                    className="text-saffron hover:underline flex items-center gap-1 mt-0.5 font-mono"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{club.contactEmail}</span>
                  </a>
                </div>
              </div>

              <a
                href={`mailto:${club.contactEmail}?subject=Joining%20Inquiry%20-%20${encodeURIComponent(club.name)}`}
                className="w-full font-display inline-flex items-center justify-center rounded-[3px] bg-saffron hover:bg-saffron-hover px-4 py-2.5 text-xs font-semibold text-white transition-colors"
              >
                <span>Contact Club Leads →</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pt-10 space-y-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left 2 Cols: About + Key Activities */}
          <div className="lg:col-span-2 space-y-10">
            {/* About Section */}
            <section className="space-y-3">
              <div className="section-eyebrow">Society Overview</div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink dark:text-white">
                About {club.name}
              </h2>
              <p className="text-base leading-relaxed text-[#3c352d] dark:text-[#9ba6b5] bg-paper dark:bg-[#16212C] p-6 rounded-[4px] border border-line dark:border-[#223040]">
                {club.about}
              </p>
            </section>

            {/* Signature Activities & Offerings */}
            <section className="space-y-4">
              <div className="section-eyebrow">Flagship Initiatives</div>
              <h2 className="font-display text-2xl font-bold text-ink dark:text-white">
                Key Activities & Masterclasses
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {club.activities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-[4px] bg-paper dark:bg-[#16212C] border border-line dark:border-[#223040]"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-ink dark:text-[#f1ede6] leading-snug">
                      {activity}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Campus Atmosphere & Society Culture */}
            <section className="space-y-4 pt-2">
              <div className="section-eyebrow">Society Life & Infrastructure</div>
              <h2 className="font-display text-2xl font-bold text-ink dark:text-white">
                Campus Environment & Peer Learning
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[6px] overflow-hidden border border-line dark:border-[#223040] bg-[#16212C] group">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={
                        club.category === 'Technical' || club.category === 'Hardware & XR'
                          ? '/assets/campus/coding-lab-mentorship.jpg'
                          : '/assets/campus/nukkad-natak-courtyard.jpg'
                      }
                      alt={`${club.name} Campus Environment`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="font-mono text-[10px] uppercase font-bold text-saffron tracking-wider block">
                        Hands-On Workspaces
                      </span>
                      <span className="text-xs font-semibold">
                        {club.category === 'Technical' || club.category === 'Hardware & XR'
                          ? 'Central Computer Lab & Mentorship'
                          : 'Outdoor Courtyard & Rehearsal Grounds'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[6px] overflow-hidden border border-line dark:border-[#223040] bg-[#16212C] group">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={
                        club.category === 'Literary & Discourse' || club.category === 'Social & Impact'
                          ? '/assets/campus/club-team-outdoors.jpg'
                          : '/assets/campus/cyberquest-auditorium.jpg'
                      }
                      alt={`${club.name} Presentations`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="font-mono text-[10px] uppercase font-bold text-saffron tracking-wider block">
                        Keynote & Symposia
                      </span>
                      <span className="text-xs font-semibold">
                        {club.category === 'Literary & Discourse' || club.category === 'Social & Impact'
                          ? 'Society Leadership & Community'
                          : 'Bhabha Auditorium State-of-the-Art Stage'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Live Events Hosted by this Club */}
            <section className="space-y-5 pt-4 border-t border-line dark:border-[#223040]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="section-eyebrow">Society Schedule</div>
                  <h2 className="font-display text-2xl font-bold text-ink dark:text-white mt-1">
                    Events & Hackathons by {club.name}
                  </h2>
                </div>
                <Link
                  to={`/events?club=${encodeURIComponent(club.name)}`}
                  className="text-xs font-semibold text-saffron hover:underline font-mono"
                >
                  Filter on Events Page →
                </Link>
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-64 rounded-[4px] bg-cream dark:bg-[#16212C] animate-pulse" />
                  <div className="h-64 rounded-[4px] bg-cream dark:bg-[#16212C] animate-pulse" />
                </div>
              ) : events.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  {events.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onRegisterClick={(e) => setSelectedEventForModal(e)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-[4px] bg-cream/60 dark:bg-[#16212C] border border-dashed border-line dark:border-[#223040] text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-saffron mx-auto" />
                  <h3 className="font-display font-bold text-lg text-ink dark:text-white">
                    No active registrations right now
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-600 dark:text-[#9ba6b5] max-w-md mx-auto">
                    {club.name} is currently curating their upcoming workshops and competitions. Explore other college hackathons or check back soon!
                  </p>
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-1.5 font-display text-xs font-semibold text-saffron hover:underline pt-2"
                  >
                    <span>Browse all campus events →</span>
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Other Societies Quick Directory */}
          <div className="space-y-6">
            <div className="rounded-[4px] bg-paper dark:bg-[#16212C] border border-line dark:border-[#223040] p-5 space-y-4">
              <h3 className="font-display font-bold text-sm text-ink dark:text-white tracking-wider uppercase border-b border-line dark:border-[#223040] pb-2">
                Explore All 19 Societies
              </h3>

              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {CLUBS_DIRECTORY.map((c) => {
                  const isCurrent = c.slug === club.slug;
                  return (
                    <Link
                      key={c.slug}
                      to={`/clubs/${c.slug}`}
                      className={`flex items-center justify-between p-2 rounded-[3px] text-xs transition-colors ${
                        isCurrent
                          ? 'bg-saffron text-white font-semibold'
                          : 'text-ink-600 dark:text-[#9ba6b5] hover:bg-cream dark:hover:bg-[#16212C] hover:text-ink dark:hover:text-white'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      <span className="font-mono text-[10px] opacity-75 shrink-0 ml-2">
                        {c.category}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Accreditation Badge */}
            <div className="rounded-[4px] bg-cream dark:bg-[#16212C] border border-line dark:border-[#223040] p-5 text-center space-y-2">
              <GraduationCap className="w-6 h-6 text-saffron mx-auto" />
              <div className="font-display font-bold text-xs text-ink dark:text-white">
                Official ABES Autonomous Society
              </div>
              <p className="text-[11px] text-ink-500 dark:text-[#9ba6b5] leading-relaxed">
                Participation in official club events qualifies for AKTU Activity Points & Certificates.
              </p>
            </div>
          </div>
        </div>
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

      {/* Ticket Pass Modal */}
      <TicketModal
        confirmation={confirmationTicket}
        onClose={() => setConfirmationTicket(null)}
      />
    </div>
  );
};
