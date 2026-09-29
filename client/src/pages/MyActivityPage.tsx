import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  MapPin,
  Tag,
  ShieldCheck,
  Search,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  Loader2,
  CheckCircle2,
  Users,
  Award,
  Filter,
  Layers,
  LogIn,
  BookOpen,
} from 'lucide-react';
import { IStudent, RegistrationConfirmation, IRegistration, IEvent } from '../types';
import { fetchAllRegistrations } from '../api/registrations';
import { TicketModal } from '../components/TicketModal';
import { StudentLoginModal } from '../components/StudentLoginModal';
import { useAuth } from '../context/AuthContext';

export const MyActivityPage: React.FC = () => {
  const { student, isStudentAuthenticated } = useAuth();
  const [activities, setActivities] = useState<IRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'Hackathon' | 'Workshop' | 'Technical' | 'Cultural'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<RegistrationConfirmation | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const getEventObj = (ev: IEvent | string | undefined): IEvent | null => {
    if (ev && typeof ev === 'object') {
      return ev as IEvent;
    }
    return null;
  };

  useEffect(() => {
    if (!isStudentAuthenticated || !student) {
      setLoading(false);
      return;
    }

    const loadStudentActivities = async () => {
      setLoading(true);
      try {
        // 1. Fetch from server by student email
        const res = await fetchAllRegistrations({ q: student.email, limit: 50 });
        let serverRegs: IRegistration[] = res.data || [];

        // 2. Fetch local storage registrations if any
        let localRegs: IRegistration[] = [];
        try {
          const localData = localStorage.getItem(`abes_activities_${student.email.toLowerCase()}`);
          if (localData) {
            localRegs = JSON.parse(localData);
          }
        } catch (e) {
          console.warn('Failed to parse local activities:', e);
        }

        // Combine and deduplicate by ticketId or _id
        const combined = [...serverRegs];
        localRegs.forEach((lr) => {
          if (!combined.some((c) => c.ticketId === lr.ticketId || c._id === lr._id)) {
            combined.unshift(lr);
          }
        });

        // 3. If default student or empty, provide realistic sample participations
        if (
          combined.length === 0 &&
          (student.email === 'student@abes.ac.in' ||
            student.name.includes('Aryan') ||
            student.name.includes('Akshat'))
        ) {
          const defaultSampleActivities: IRegistration[] = [
            {
              _id: 'sample-act-1',
              ticketId: 'ABES-2026-HCK01',
              name: student.name,
              email: student.email,
              collegeName: student.collegeName || 'ABES Engineering College, Ghaziabad',
              year: student.year || '2nd',
              phone: student.phone || '9876543210',
              event: {
                _id: 'ev-001',
                name: 'NexusHacks 2026: 36-Hour National Hackathon',
                club: 'TechFest',
                category: 'Hackathon',
                date: '2026-10-15T09:00:00.000Z',
                venue: 'Main Auditorium & CCF Labs, ABES Campus',
                description: '36-Hour National Flagship Hackathon with Rs 3,00,000 prize pool.',
                featured: true,
                posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
              } as any,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              _id: 'sample-act-2',
              ticketId: 'ABES-2026-WKP01',
              name: student.name,
              email: student.email,
              collegeName: student.collegeName || 'ABES Engineering College, Ghaziabad',
              year: student.year || '2nd',
              phone: student.phone || '9876543210',
              event: {
                _id: 'ev-002',
                name: 'Generative AI & LLM Systems Hands-on Bootcamp',
                club: 'GDG',
                category: 'Workshop',
                date: '2026-10-22T14:00:00.000Z',
                venue: 'Aryabhata Computing Center, Lab 4',
                description: 'Hands-on architectural deep dive on building autonomous agents and RAG pipelines.',
                featured: false,
                posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
              } as any,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              _id: 'sample-act-3',
              ticketId: 'ABES-2026-ROB01',
              name: student.name,
              email: student.email,
              collegeName: student.collegeName || 'ABES Engineering College, Ghaziabad',
              year: student.year || '2nd',
              phone: student.phone || '9876543210',
              event: {
                _id: 'ev-003',
                name: 'RoboWars 2026: Heavyweight Combat Arena',
                club: 'Drone and Robotics',
                category: 'Technical',
                date: '2026-11-05T10:00:00.000Z',
                venue: 'Outdoor Robotics Arena, Block D',
                description: '15kg and 30kg combat robot championship across Delhi NCR colleges.',
                featured: true,
                posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
              } as any,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
          setActivities(defaultSampleActivities);
        } else {
          setActivities(combined);
        }
      } catch (err) {
        console.error('Failed to load activities:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStudentActivities();
  }, [isStudentAuthenticated, student]);

  // Filtering
  const filteredActivities = activities.filter((act) => {
    const ev = getEventObj(act.event);
    if (!ev) return true;

    // Category filter
    if (activeCategory !== 'all') {
      if (ev.category !== activeCategory) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ev.name?.toLowerCase().includes(q);
      const matchClub = ev.club?.toLowerCase().includes(q);
      const matchVenue = ev.venue?.toLowerCase().includes(q);
      const matchTicket = act.ticketId?.toLowerCase().includes(q);
      return Boolean(matchName || matchClub || matchVenue || matchTicket);
    }

    return true;
  });

  const handleOpenTicketModal = (act: IRegistration) => {
    const ev = getEventObj(act.event);
    if (!ev) return;
    const conf: RegistrationConfirmation = {
      registrationId: act._id,
      ticketId: act.ticketId,
      name: act.name,
      email: act.email,
      collegeName: act.collegeName,
      year: act.year,
      phone: act.phone,
      eventName: ev.name,
      eventDate: ev.date,
      eventVenue: ev.venue,
      eventClub: ev.club,
      registeredAt: act.createdAt,
    };
    setSelectedTicket(conf);
  };

  const hackathonCount = activities.filter((a) => getEventObj(a.event)?.category === 'Hackathon').length;
  const workshopCount = activities.filter((a) => getEventObj(a.event)?.category === 'Workshop').length;
  const technicalCount = activities.filter((a) => getEventObj(a.event)?.category === 'Technical').length;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* 1. HERO HEADER */}
      <div className="relative overflow-hidden rounded-[8px] bg-navy border border-navy-800 p-6 sm:p-10 shadow-xl text-white">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-white/10 text-saffron border border-white/15 text-xs font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABES Autonomous · Student Passbook</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight">
              My Activity & Registered Events
            </h1>
            <p className="text-sm text-[#d7d0c5] max-w-2xl leading-relaxed">
              Track your upcoming campus hackathons, technical symposiums, workshops, and access verified digital QR boarding passes for seamless venue entry.
            </p>
          </div>

          {isStudentAuthenticated && student ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="px-4 py-2.5 rounded-[4px] bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold font-display flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-saffron" />
                <span>View Nexus Card</span>
              </button>
              <Link
                to="/events"
                className="px-5 py-2.5 rounded-[4px] bg-saffron hover:bg-saffron-hover text-white text-xs font-semibold font-display flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Browse More Events →</span>
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="px-5 py-3 rounded-[4px] bg-saffron hover:bg-saffron-hover text-white text-sm font-semibold font-display flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Access Activity</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. IF NOT AUTHENTICATED */}
      {!isStudentAuthenticated ? (
        <div className="text-center py-16 px-4 rounded-[8px] bg-white dark:bg-[#16212C] border border-line dark:border-[#223040] shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-saffron/15 text-saffron flex items-center justify-center mx-auto border border-saffron/30">
            <Ticket className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-display font-bold text-xl text-ink dark:text-white">
              Student Sign In Required
            </h3>
            <p className="text-xs text-muted dark:text-slate-400">
              Please sign in with your college credentials or Google account to access all your registered events, hackathons, and download QR entry tickets.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLoginModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] bg-saffron hover:bg-saffron-hover text-white text-xs font-semibold shadow-sm transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In Now</span>
          </button>
        </div>
      ) : (
        <>
          {/* 3. METRICS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-[6px] bg-white dark:bg-[#16212C] border border-line dark:border-[#223040] shadow-sm flex items-center gap-3.5">
              <div className="p-3 rounded-[4px] bg-saffron/15 text-saffron border border-saffron/30">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold text-ink dark:text-white">
                  {activities.length}
                </span>
                <p className="text-xs text-muted dark:text-slate-400 font-medium">Total Registered</p>
              </div>
            </div>

            <div className="p-4 rounded-[6px] bg-white dark:bg-[#16212C] border border-line dark:border-[#223040] shadow-sm flex items-center gap-3.5">
              <div className="p-3 rounded-[4px] bg-blue-500/15 text-blue-500 border border-blue-500/30">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold text-ink dark:text-white">
                  {hackathonCount}
                </span>
                <p className="text-xs text-muted dark:text-slate-400 font-medium">Hackathons</p>
              </div>
            </div>

            <div className="p-4 rounded-[6px] bg-white dark:bg-[#16212C] border border-line dark:border-[#223040] shadow-sm flex items-center gap-3.5">
              <div className="p-3 rounded-[4px] bg-purple-500/15 text-purple-500 border border-purple-500/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold text-ink dark:text-white">
                  {workshopCount}
                </span>
                <p className="text-xs text-muted dark:text-slate-400 font-medium">Workshops</p>
              </div>
            </div>

            <div className="p-4 rounded-[6px] bg-white dark:bg-[#16212C] border border-line dark:border-[#223040] shadow-sm flex items-center gap-3.5">
              <div className="p-3 rounded-[4px] bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold text-ink dark:text-white">
                  {activities.length}
                </span>
                <p className="text-xs text-muted dark:text-slate-400 font-medium">Verified QR Passes</p>
              </div>
            </div>
          </div>

          {/* 4. SEARCH & CATEGORY FILTER BAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#16212C] p-4 rounded-[6px] border border-line dark:border-[#223040] shadow-sm">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Activities' },
                { id: 'Hackathon', label: 'Hackathons' },
                { id: 'Workshop', label: 'Workshops' },
                { id: 'Technical', label: 'Technical' },
                { id: 'Cultural', label: 'Cultural' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-[3px] text-xs font-semibold font-display transition-all border ${
                    activeCategory === tab.id
                      ? 'bg-saffron text-white border-saffron shadow-sm'
                      : 'bg-transparent text-muted dark:text-slate-300 border-line dark:border-[#223040] hover:border-saffron'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event, club, ticket..."
                className="w-full pl-9 pr-3.5 py-2 rounded-[4px] bg-slate-50 dark:bg-[#0f1620] border border-line dark:border-[#223040] text-xs text-ink dark:text-white focus:outline-none focus:border-saffron"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-muted hover:text-ink dark:hover:text-white absolute right-2.5 top-1/2 transform -translate-y-1/2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 5. ACTIVITIES LIST / GRID */}
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-8 h-8 text-saffron animate-spin mx-auto mb-3" />
              <p className="text-xs text-muted dark:text-slate-400 font-mono">
                Loading your registered event passes...
              </p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-[8px] bg-white dark:bg-[#16212C] border border-line dark:border-[#223040] shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-muted flex items-center justify-center mx-auto">
                <Ticket className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="font-display font-bold text-base text-ink dark:text-white">
                  No Registered Activities Found
                </h4>
                <p className="text-xs text-muted dark:text-slate-400">
                  {searchQuery
                    ? `No events matching "${searchQuery}". Try clearing the search query.`
                    : 'You have not registered for any events in this category yet.'}
                </p>
              </div>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-[3px] bg-saffron hover:bg-saffron-hover text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Explore Upcoming Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((act) => {
                const ev = getEventObj(act.event);
                const eventDate = ev?.date ? new Date(ev.date) : new Date(act.createdAt);
                const isUpcoming = eventDate.getTime() > Date.now();

                return (
                  <div
                    key={act._id || act.ticketId}
                    className="rounded-[6px] bg-white dark:bg-[#16212C] border border-line dark:border-[#223040] shadow-sm overflow-hidden flex flex-col hover:border-saffron/50 transition-colors group"
                  >
                    {/* Event Banner / Header Thumbnail */}
                    <div className="relative h-36 bg-navy overflow-hidden">
                      {ev?.posterUrl ? (
                        <img
                          src={ev.posterUrl}
                          alt={ev?.name || 'Event Poster'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-navy to-secondary-900 flex items-center justify-center p-4">
                          <Ticket className="w-10 h-10 text-saffron/40" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-[2px] bg-black/60 backdrop-blur-md text-saffron border border-saffron/30 text-[10px] font-bold uppercase tracking-wider font-mono">
                          {ev?.category || 'Event'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold font-mono uppercase ${
                            isUpcoming
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                              : 'bg-slate-900/80 text-slate-300 border border-slate-700/50'
                          }`}
                        >
                          {isUpcoming ? 'Confirmed' : 'Completed'}
                        </span>
                      </div>

                      {/* Organizing Club badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-0.5 rounded-[2px] bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                          {ev?.club || 'ABES Society'}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <h3 className="font-display font-bold text-base text-ink dark:text-white line-clamp-2 leading-snug group-hover:text-saffron transition-colors">
                          {ev?.name || 'ABES Event'}
                        </h3>

                        {/* Date & Time */}
                        <div className="flex items-center gap-2 text-xs text-muted dark:text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-saffron shrink-0" />
                          <span>
                            {eventDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            {' · '}
                            {eventDate.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* Venue */}
                        <div className="flex items-center gap-2 text-xs text-muted dark:text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-saffron shrink-0" />
                          <span className="truncate">{ev?.venue || 'ABES Campus Auditorium'}</span>
                        </div>

                        {/* Ticket Code */}
                        <div className="pt-2 border-t border-line dark:border-[#223040] flex items-center justify-between">
                          <span className="text-[10px] font-mono text-muted dark:text-slate-400 uppercase">
                            Ticket Reference:
                          </span>
                          <span className="font-mono text-xs font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded-[2px] border border-saffron/20">
                            {act.ticketId}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenTicketModal(act)}
                          className="flex-1 py-2 rounded-[3px] bg-saffron hover:bg-saffron-hover text-white text-xs font-semibold font-display flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>View Pass / QR</span>
                        </button>

                        {ev?._id && (
                          <Link
                            to={`/events/${ev._id}`}
                            className="p-2 rounded-[3px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-muted dark:text-slate-300 transition-colors"
                            title="View Event Details"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          confirmation={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {/* Student Login Modal */}
      <StudentLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
};
