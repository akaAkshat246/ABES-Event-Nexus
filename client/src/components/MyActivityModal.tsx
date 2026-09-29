import React, { useState, useEffect } from 'react';
import {
  X,
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
} from 'lucide-react';
import { IStudent, RegistrationConfirmation, IRegistration } from '../types';
import { fetchAllRegistrations } from '../api/registrations';
import { TicketModal } from './TicketModal';
import { Link } from 'react-router-dom';

interface MyActivityModalProps {
  isOpen: boolean;
  student: IStudent;
  onClose: () => void;
}

export const MyActivityModal: React.FC<MyActivityModalProps> = ({
  isOpen,
  student,
  onClose,
}) => {
  const [activities, setActivities] = useState<IRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'hackathons' | 'workshops'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<RegistrationConfirmation | null>(null);

  useEffect(() => {
    if (!isOpen) return;

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
        if (combined.length === 0 && (student.email === 'student@abes.ac.in' || student.name.includes('Aryan') || student.name.includes('Akshat'))) {
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
                _id: 'ev-sample-1',
                name: 'NexusHacks 2026: 36-Hour National Hackathon',
                club: 'TechFest',
                category: 'Hackathon',
                date: '2026-10-15T09:00:00.000Z',
                venue: 'Main Auditorium & CCF Labs, ABES Campus',
                description: '36-Hour National Flagship Hackathon with Rs 3,00,000 prize pool.',
                featured: true,
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
                _id: 'ev-sample-2',
                name: 'Generative AI & LLM Systems Hands-on Bootcamp',
                club: 'GDG',
                category: 'Workshop',
                date: '2026-10-22T14:00:00.000Z',
                venue: 'Aryabhata Computing Center, Lab 4',
                description: 'Hands-on architectural deep dive on building autonomous agents and RAG pipelines.',
                featured: false,
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
                _id: 'ev-sample-3',
                name: 'RoboWars 2026: Heavyweight Combat Arena',
                club: 'Drone and Robotics',
                category: 'Technical',
                date: '2026-11-05T10:00:00.000Z',
                venue: 'Outdoor Robotics Arena, Block D',
                description: '15kg and 30kg combat robot championship across Delhi NCR colleges.',
                featured: true,
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
  }, [isOpen, student]);

  if (!isOpen) return null;

  const filteredActivities = activities.filter((act) => {
    const ev: any = act.event || {};
    const matchesSearch =
      (ev.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.club || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.ticketId || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'hackathons') {
      return (ev.category || '').toLowerCase() === 'hackathon';
    }
    if (activeTab === 'workshops') {
      return (
        (ev.category || '').toLowerCase() === 'workshop' ||
        (ev.category || '').toLowerCase() === 'seminar'
      );
    }
    return true;
  });

  const handleOpenTicket = (act: IRegistration) => {
    const ev: any = act.event || {};
    const confirmation: RegistrationConfirmation = {
      registrationId: act._id,
      ticketId: act.ticketId,
      name: act.name,
      email: act.email,
      collegeName: act.collegeName,
      year: act.year,
      phone: act.phone,
      eventName: ev.name || 'Campus Event',
      eventDate: ev.date || new Date().toISOString(),
      eventVenue: ev.venue || 'ABES Campus',
      eventClub: ev.club || 'ABES Society',
      registeredAt: act.createdAt,
    };
    setSelectedTicket(confirmation);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-navy-950 dark:bg-[#16212C] rounded-[6px] shadow-2xl overflow-hidden border border-white/15 text-white my-6 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-5 bg-navy border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[4px] bg-saffron text-white shadow-sm">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg text-white leading-tight">
                    My Activity
                  </h3>
                  <span className="font-mono text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-saffron/20 text-saffron border border-saffron/30 font-semibold">
                    {activities.length} Participations
                  </span>
                </div>
                <p className="text-xs text-[#a99f92] mt-0.5">
                  Registered events, hackathons, and active E-Passes for{' '}
                  <span className="text-white font-medium">{student.name}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-[3px] border border-white/15 hover:bg-white/10 text-[#d7d0c5] hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search and Category Filter Ribbon */}
          <div className="p-4 bg-navy-950/60 border-b border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-[4px] border border-white/10 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 text-xs font-display font-bold uppercase tracking-wider rounded-[2px] transition-all ${
                  activeTab === 'all'
                    ? 'bg-saffron text-white shadow-sm'
                    : 'text-[#a99f92] hover:text-white'
                }`}
              >
                All ({activities.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hackathons')}
                className={`px-3 py-1 text-xs font-display font-bold uppercase tracking-wider rounded-[2px] transition-all ${
                  activeTab === 'hackathons'
                    ? 'bg-saffron text-white shadow-sm'
                    : 'text-[#a99f92] hover:text-white'
                }`}
              >
                Hackathons
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('workshops')}
                className={`px-3 py-1 text-xs font-display font-bold uppercase tracking-wider rounded-[2px] transition-all ${
                  activeTab === 'workshops'
                    ? 'bg-saffron text-white shadow-sm'
                    : 'text-[#a99f92] hover:text-white'
                }`}
              >
                Workshops
              </button>
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#a99f92] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search participations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-[3px] bg-black/40 border border-white/10 text-xs text-white placeholder:text-[#8c8277] focus:outline-none focus:border-saffron"
              />
            </div>
          </div>

          {/* Activities List Body */}
          <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-[#a99f92]">
                <Loader2 className="w-7 h-7 animate-spin text-saffron" />
                <span className="text-xs font-mono">Loading your event passes...</span>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-white/5 rounded-[6px] border border-white/10 p-6">
                <Ticket className="w-10 h-10 text-saffron/60 mx-auto" />
                <h4 className="font-display font-bold text-base text-white">
                  No participations found
                </h4>
                <p className="text-xs text-[#a99f92] max-w-sm mx-auto">
                  {searchQuery
                    ? 'No events match your current filter query.'
                    : "You haven't registered for any campus events or hackathons yet."}
                </p>
                <div className="pt-2">
                  <Link
                    to="/events"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-[3px] bg-saffron hover:bg-saffron-hover text-white font-display text-xs font-bold transition-all shadow-sm"
                  >
                    <span>Browse All Campus Events →</span>
                  </Link>
                </div>
              </div>
            ) : (
              filteredActivities.map((act) => {
                const ev: any = act.event || {};
                const eventDate = ev.date ? new Date(ev.date) : new Date();

                return (
                  <div
                    key={act._id}
                    className="p-4 rounded-[4px] bg-white/5 hover:bg-white/8 border border-white/10 transition-all space-y-3 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-saffron/20 text-saffron font-bold border border-saffron/30">
                            {ev.category || 'Event'}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#a99f92]">
                            By {ev.club || 'ABES Society'}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-base text-white group-hover:text-saffron transition-colors truncate">
                          {ev.name || 'Campus Event'}
                        </h4>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-white/10 text-white border border-white/20">
                          <CheckCircle2 className="w-3 h-3 text-saffron" />
                          <span>Active Pass</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#d7d0c5] font-mono pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-saffron shrink-0" />
                        <span>
                          {eventDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-saffron shrink-0" />
                        <span className="truncate">{ev.venue || 'ABES Campus'}</span>
                      </div>
                    </div>

                    {/* Footer Row with Ticket ID and Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono text-[#a99f92]">
                          Ticket ID:
                        </span>
                        <span className="font-mono text-xs font-bold text-saffron tracking-wide">
                          {act.ticketId}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenTicket(act)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-saffron hover:bg-saffron-hover text-white font-display text-xs font-bold transition-all shadow-xs"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>View Pass / QR →</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-navy border-t border-white/10 flex items-center justify-between shrink-0">
            <Link
              to="/events"
              onClick={onClose}
              className="text-xs text-saffron hover:underline font-semibold flex items-center gap-1"
            >
              <span>Explore more upcoming hackathons</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-[3px] bg-white/10 hover:bg-white/20 text-white font-display text-xs font-semibold transition-all border border-white/15"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Modal view for selected ticket */}
      {selectedTicket && (
        <TicketModal
          confirmation={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </>
  );
};
