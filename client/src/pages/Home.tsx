import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Search,
  Users,
  Award,
  Flame,
  Code,
  Music,
  Trophy,
  ChevronDown,
  Plus,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Bot,
  Glasses,
  MessageSquare,
  Palette,
  Camera,
  Drama,
  BookOpen,
  Compass,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Zap,
  Clock,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';
import { IEvent, RegistrationConfirmation } from '../types';
import { fetchEvents } from '../api/events';
import { EventCard } from '../components/EventCard';
import { RegistrationModal } from '../components/RegistrationModal';
import { TicketModal } from '../components/TicketModal';

const heroSlides = [
  {
    id: 'auditorium',
    src: '/assets/campus/cyberquest-auditorium.jpg',
    alt: 'ABES CyberQuest 2025 Main Auditorium Stage',
    caption: 'Auditorium · CyberQuest 2025 Stage',
    subcaption: 'Bhabha Hall, Block C',
  },
  {
    id: 'appreciation-certificates',
    src: '/assets/campus/appreciation-certificates.jpg',
    alt: 'ABES Department of CSE - Appreciation Day 5.0 Coordination Certificates',
    caption: 'Dept. of CSE · Appreciation Day 5.0 Coordination',
    subcaption: 'Student Coordinator Honors & Recognition',
  },
  {
    id: 'hackathon-arena',
    src: '/assets/campus/campus-hack-collage.jpg',
    alt: 'ABES Hackathon Coding Arena & Collaborative Labs',
    caption: 'Aryabhata Block · Campus Hackathon Hub',
    subcaption: '36-Hour Hackathon Arena',
  },
  {
    id: 'club-council',
    src: '/assets/campus/club-team-outdoors.jpg',
    alt: 'ABES Student Societies Leadership & Outreach Meet',
    caption: 'Amphitheatre · Student Society Leadership',
    subcaption: 'Inter-Club Council Meet',
  },
  {
    id: 'innovation-lab',
    src: '/assets/campus/coding-lab-mentorship.jpg',
    alt: 'ABES Innovation Lab & Software Development Mentorship',
    caption: 'Kalpana Chawla Block · Innovation Lab',
    subcaption: 'Algorithmic Mentorship Hub',
  },
  {
    id: 'street-theatre',
    src: '/assets/campus/nukkad-natak-courtyard.jpg',
    alt: 'ABES Annual Street Theatre & Cultural Performance',
    caption: 'Main Courtyard · Annual Cultural & Street Theatre',
    subcaption: 'Youth Festival Arena',
  },
];

export const Home: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventForModal, setSelectedEventForModal] = useState<IEvent | null>(null);
  const [confirmationTicket, setConfirmationTicket] = useState<RegistrationConfirmation | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const navigate = useNavigate();

  // Auto-scroll hero carousel every 4.5 seconds
  useEffect(() => {
    if (isSlidePaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isSlidePaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  // Real-time dynamic clock timer (updates every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetchEvents({ timeframe: 'upcoming', limit: 6 });
        if (res.success && res.data) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Format: "Monday, 28 September 2026"
  const formattedDayOfWeek = currentDateTime.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDayNum = currentDateTime.getDate();
  const formattedMonth = currentDateTime.toLocaleDateString('en-US', { month: 'long' });
  const formattedYear = currentDateTime.getFullYear();
  const formattedFullDate = `${formattedDayOfWeek}, ${formattedDayNum} ${formattedMonth} ${formattedYear}`;

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const faqs = [
    {
      q: 'Who is eligible to participate in ABES Event Nexus hackathons & events?',
      a: 'All registered students of ABES Engineering College (B.Tech, MCA, MBA) as well as external participants from engineering institutions across Delhi NCR and India can discover, register, and compete in events on ABES Event Nexus.',
    },
    {
      q: 'Is there any registration fee for campus events and hackathons?',
      a: 'No! 100% of the student club hackathons, technical workshops, robotics challenges, and cultural competitions on ABES Event Nexus are free of charge for students.',
    },
    {
      q: 'How does team registration and ticketing work?',
      a: 'You can register individually or in teams. Upon successful registration, ABES Event Nexus instantly generates an authentic digital boarding ticket pass complete with QR validation code for venue entry.',
    },
    {
      q: 'Do participants receive verified E-Certificates and AKTU activity credits?',
      a: 'Yes, all registered attendees who participate or submit projects receive verified digital E-Certificates of Participation recognized for AKTU Activity Points and academic portfolios.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* 1. HERO PHOTO BANNER CAROUSEL (Auto-scrolling with ABES Campus & Event Showcase) */}
      <section
        className="relative bg-[#14100b] select-none group"
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="ABES Campus Showcase Carousel"
      >
        <div className="relative h-[clamp(300px,40vw,560px)] w-full overflow-hidden">
          {heroSlides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  isActive
                    ? 'opacity-100 scale-100 z-10'
                    : 'opacity-0 scale-105 pointer-events-none z-0'
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover object-center brightness-95 transition-transform duration-[6000ms] ease-out"
                  style={{
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                {/* Vignette gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14100b] via-black/25 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
              </div>
            );
          })}

          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95 shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95 shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Bottom Overlay: Location Badge & Slide Indicator Dots */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 pointer-events-none">
            {/* Active Slide Info / Location Badge */}
            <div className="pointer-events-auto flex items-center gap-2">
              <span className="clay-pill px-3.5 py-1.5 bg-black/70 backdrop-blur-md text-white font-mono text-[11px] font-semibold border border-white/25 shadow-xl inline-flex items-center gap-2 animate-in fade-in duration-500">
                <MapPin className="w-3.5 h-3.5 text-saffron shrink-0" />
                <span>{heroSlides[currentSlide].caption}</span>
                <span className="hidden md:inline text-white/50">·</span>
                <span className="hidden md:inline text-white/80 text-[10px] font-normal">
                  {heroSlides[currentSlide].subcaption}
                </span>
              </span>

              {/* Pause/Play toggle indicator */}
              <button
                onClick={() => setIsSlidePaused(!isSlidePaused)}
                className="pointer-events-auto p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white border border-white/20 backdrop-blur-md transition-all text-xs"
                title={isSlidePaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
                aria-label={isSlidePaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
              >
                {isSlidePaused ? (
                  <Play className="w-3 h-3 text-saffron fill-saffron" />
                ) : (
                  <Pause className="w-3 h-3 text-white" />
                )}
              </button>
            </div>

            {/* Slide Dots / Progress Indicators */}
            <div className="pointer-events-auto flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-xl">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentSlide
                      ? 'w-6 h-2 bg-saffron shadow-sm'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${slide.caption}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME DYNAMIC CLOCK & DATE RIBBON (Clean, normal font, no boxing or neon coloring) */}
      <div className="bg-navy dark:bg-[#16212C] border-y border-navy-800 dark:border-white/10 py-2.5 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-y-1 gap-x-4 text-xs sm:text-sm text-[#d7d0c5]">
          <span>{formattedFullDate}</span>
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* 3. MAIN HEADLINE SECTION */}
      <section className="bg-cream dark:bg-[#16212C] pb-[clamp(44px,6vw,72px)] pt-[clamp(28px,4vw,52px)] border-b border-line dark:border-[#223040] transition-colors">
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-4xl space-y-6">
            <div className="text-[clamp(13px,1.5vw,15px)] font-mono font-semibold tracking-[0.06em] text-ink dark:text-white flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-saffron" />
              <span>ABES Engineering College  ·  Autonomous</span>
            </div>

            <h1 className="font-display text-[clamp(36px,5.8vw,72px)] font-bold leading-[1.03] tracking-[-0.025em] text-ink dark:text-white">
              ABES <span className="text-saffron">Event Nexus</span>
            </h1>

            <p className="max-w-3xl text-[clamp(15px,1.8vw,18px)] leading-[1.55] text-[#3c352d] dark:text-[#9ba6b5]">
              The centralized campus platform to discover, register, and compete in hackathons, workshops, and symposiums across all <strong className="text-ink dark:text-white">19 official student societies</strong> (<strong className="text-ink dark:text-white">GFG, Codechef, GDG, IEEE, Drone & Robotics, Arcade-AR/VR, E-Cell, ACM</strong> and more).
            </p>

            <div className="pt-2 flex flex-wrap gap-3.5">
              <Link
                to="/events"
                className="clay-btn-primary gap-2"
              >
                <span>Browse All Events →</span>
              </Link>
              <Link
                to="/build-win"
                className="clay-btn-secondary"
              >
                <span>Build & Win Guide →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UPCOMING HACKATHONS & CAMPUS EVENTS */}
      <section id="hackathons" className="py-[clamp(48px,6vw,72px)] bg-paper dark:bg-[#0e1620] border-b border-line dark:border-[#223040] transition-colors">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-7">
          <div className="flex flex-wrap items-end gap-4 justify-between">
            <div>
              <div className="clay-pill px-3 py-1 bg-saffron/10 text-saffron border border-saffron/20 font-mono text-[10px] font-bold uppercase tracking-wider">
                Upcoming Events
              </div>
              <h2 className="font-display mt-2 text-[clamp(26px,3.8vw,38px)] font-bold leading-[1.05] tracking-[-0.015em] text-ink dark:text-[#f1ede6]">
                Live & Upcoming Campus Events
              </h2>
              <p className="mt-2.5 max-w-[7in] text-[15px] leading-[1.6] text-[#3c352d] dark:text-[#9ba6b5]">
                Compete, learn, build, and earn recognized AKTU activity points across colleges.
              </p>
            </div>

            <Link
              to="/events"
              className="clay-btn-secondary text-xs"
            >
              View all events & hackathons →
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-[18px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-cream dark:bg-[#16212C] animate-pulse border border-line dark:border-[#223040]" />
              ))}
            </div>
          ) : (
            <div className="grid gap-[18px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onRegisterClick={(e) => setSelectedEventForModal(e)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. CAMPUS LIFE & STUDENT SOCIETY SPOTLIGHT (Featuring all 5 uploaded images) */}
      <section className="py-[clamp(48px,6vw,72px)] bg-paper dark:bg-[#16212C] border-b border-line dark:border-[#223040] transition-colors">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="clay-pill px-3 py-1 bg-saffron/10 text-saffron border border-saffron/20 font-mono text-[10px] font-bold uppercase tracking-wider">
                Campus Atmosphere
              </div>
              <h2 className="font-display mt-2 text-[clamp(26px,3.8vw,38px)] font-bold text-ink dark:text-white">
                Life & Innovation at ABES Engineering College
              </h2>
              <p className="mt-2 text-base text-[#3c352d] dark:text-[#9ba6b5] max-w-2xl">
                Real moments from our high-tech coding laboratories, 1,200-seat auditorium hackathons, and dynamic student society activities.
              </p>
            </div>

            <Link
              to="/build-win"
              className="clay-btn-secondary text-xs"
            >
              <span>Explore Student Stories →</span>
            </Link>
          </div>

          {/* 5-Photo Interactive Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            {/* Main Stage & Auditorium (Col 7) */}
            <div className="md:col-span-7 group rounded-3xl clay-card overflow-hidden relative min-h-[300px] sm:min-h-[360px] bg-[#121b24]">
              <img
                src="/assets/campus/cyberquest-auditorium.jpg"
                alt="CyberQuest 2025 National Stage Demo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                <span className="clay-pill px-2.5 py-0.5 text-[10px] font-mono font-bold bg-saffron text-white shadow-sm">
                  Stage Demonstrations
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                  CyberQuest 2025 & National Hackfest Stage
                </h3>
                <p className="text-xs text-[#d7d0c5] line-clamp-2">
                  Students presenting live technical pitches and defending algorithms before industry jury panels in the main college auditorium.
                </p>
              </div>
            </div>

            {/* Coding Lab Mentorship (Col 5) */}
            <div className="md:col-span-5 group rounded-3xl clay-card overflow-hidden relative min-h-[300px] sm:min-h-[360px] bg-[#121b24]">
              <img
                src="/assets/campus/coding-lab-mentorship.jpg"
                alt="CCF Coding Labs & Hands-on Mentorship"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                <span className="clay-pill px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#0b6623] text-white shadow-sm">
                  CCF Laboratories
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                  Intensive Lab Coding & Mentorship
                </h3>
                <p className="text-xs text-[#d7d0c5] line-clamp-2">
                  24/7 high-speed labs where faculty advisors and senior club mentors guide students through real code sprints.
                </p>
              </div>
            </div>

            {/* Bottom 3-Card Row: Hackathon Collage, Society Leadership, Outdoor Nukkad Natak */}
            <div className="md:col-span-4 group rounded-3xl clay-card overflow-hidden relative min-h-[260px] bg-[#121b24]">
              <img
                src="/assets/campus/campus-hack-collage.jpg"
                alt="Auditorium Audience & Hackathon Highlights"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-0.5">
                <span className="clay-pill px-2.5 py-0.5 text-[9.5px] font-mono font-bold bg-[#16212C] text-saffron border border-saffron/30">
                  National Circuit
                </span>
                <h4 className="font-display font-bold text-sm sm:text-base text-white">
                  Multi-Round Hackathon Sprints
                </h4>
                <p className="text-[11px] text-[#d7d0c5] line-clamp-1">
                  1,200+ attendees engaged across technical tracks.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 group rounded-3xl clay-card overflow-hidden relative min-h-[260px] bg-[#121b24]">
              <img
                src="/assets/campus/club-team-outdoors.jpg"
                alt="ABES Student Society Leads & Organizers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-0.5">
                <span className="clay-pill px-2.5 py-0.5 text-[9.5px] font-mono font-bold bg-saffron text-white">
                  19 Societies
                </span>
                <h4 className="font-display font-bold text-sm sm:text-base text-white">
                  Student Leadership & Organizers
                </h4>
                <p className="text-[11px] text-[#d7d0c5] line-clamp-1">
                  Passionate club coordinators driving campus excellence.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 group rounded-3xl clay-card overflow-hidden relative min-h-[260px] bg-[#121b24]">
              <img
                src="/assets/campus/nukkad-natak-courtyard.jpg"
                alt="Outdoor Nukkad Natak & Street Drama"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-0.5">
                <span className="clay-pill px-2.5 py-0.5 text-[9.5px] font-mono font-bold bg-[#0b6623] text-white">
                  Cultural & Arts
                </span>
                <h4 className="font-display font-bold text-sm sm:text-base text-white">
                  Courtyard Plays & Cultural Fests
                </h4>
                <p className="text-[11px] text-[#d7d0c5] line-clamp-1">
                  Vibrant outdoor performances across campus courtyards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY ABES EVENT NEXUS */}
      <section id="why-us" className="py-[clamp(48px,6vw,72px)] bg-cream dark:bg-[#16212C] border-b border-line dark:border-[#223040] transition-colors">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-7">
          <div>
            <div className="clay-pill px-3 py-1 bg-saffron/10 text-saffron border border-saffron/20 font-mono text-[10px] font-bold uppercase tracking-wider">
              Ecosystem Advantages
            </div>
            <h2 className="font-display mt-2 text-[clamp(26px,3.8vw,38px)] font-bold leading-[1.05] tracking-[-0.015em] text-ink dark:text-[#f1ede6]">
              Why ABES Event Nexus
            </h2>
            <p className="mt-2.5 max-w-[7in] text-[15px] leading-[1.6] text-[#3c352d] dark:text-[#9ba6b5]">
              A unified powerhouse accelerating student innovation, tech careers, and multidisciplinary excellence.
            </p>
          </div>

          <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
            {/* 01 */}
            <div className="rounded-2xl clay-card clay-card-hover p-6 space-y-3">
              <div className="font-display inline-flex h-12 w-12 items-center justify-center text-[18px] font-bold text-white bg-saffron rounded-xl shadow-md">
                01
              </div>
              <h3 className="font-display text-[18px] font-bold text-ink dark:text-[#f1ede6]">19 Official Specialized Societies</h3>
              <p className="text-[14px] leading-[1.6] text-[#645b50] dark:text-[#9ba6b5]">
                From AI and Competitive Coding (GFG, Codechef, GDG, ACM) to Robotics, AR/VR, Dramatics, and Entrepreneurship.
              </p>
            </div>

            {/* 02 */}
            <div className="rounded-2xl clay-card clay-card-hover p-6 space-y-3">
              <div className="font-display inline-flex h-12 w-12 items-center justify-center text-[18px] font-bold text-white bg-[#0b6623] rounded-xl shadow-md">
                02
              </div>
              <h3 className="font-display text-[18px] font-bold text-ink dark:text-[#f1ede6]">Instant Digital Passes</h3>
              <p className="text-[14px] leading-[1.6] text-[#645b50] dark:text-[#9ba6b5]">
                Instant ticket generation with unique QR passes for seamless on-ground check-in and stage access.
              </p>
            </div>

            {/* 03 */}
            <div className="rounded-2xl clay-card clay-card-hover p-6 space-y-3">
              <div className="font-display inline-flex h-12 w-12 items-center justify-center text-[18px] font-bold text-white bg-[#16212C] rounded-xl border border-white/20 shadow-md">
                03
              </div>
              <h3 className="font-display text-[18px] font-bold text-ink dark:text-[#f1ede6]">Large-Scale Reach</h3>
              <p className="text-[14px] leading-[1.6] text-[#645b50] dark:text-[#9ba6b5]">
                Connect with 5,000+ enthusiastic engineering students, faculty coordinators, and national industry judges.
              </p>
            </div>

            {/* 04 */}
            <div className="rounded-2xl clay-card clay-card-hover p-6 space-y-3">
              <div className="font-display inline-flex h-12 w-12 items-center justify-center text-[18px] font-bold text-white bg-saffron rounded-xl shadow-md">
                04
              </div>
              <h3 className="font-display text-[18px] font-bold text-ink dark:text-[#f1ede6]">End-to-End Execution</h3>
              <p className="text-[14px] leading-[1.6] text-[#645b50] dark:text-[#9ba6b5]">
                Faculty-supervised administration console to publish, modify, and monitor capacity and registrations in real time.
              </p>
            </div>

            {/* 05 */}
            <div className="rounded-2xl clay-card clay-card-hover p-6 space-y-3">
              <div className="font-display inline-flex h-12 w-12 items-center justify-center text-[18px] font-bold text-white bg-[#16212C] rounded-xl border border-white/20 shadow-md">
                05
              </div>
              <h3 className="font-display text-[18px] font-bold text-ink dark:text-[#f1ede6]">AKTU Activity Accreditation</h3>
              <p className="text-[14px] leading-[1.6] text-[#645b50] dark:text-[#9ba6b5]">
                Verifiable event participation credentials eligible for university activity credit points and professional portfolios.
              </p>
            </div>

            {/* 06 */}
            <div className="rounded-2xl clay-card clay-card-hover p-6 space-y-3">
              <div className="font-display inline-flex h-12 w-12 items-center justify-center text-[18px] font-bold text-white bg-saffron rounded-xl shadow-md">
                06
              </div>
              <h3 className="font-display text-[18px] font-bold text-ink dark:text-[#f1ede6]">Vibrant Campus Life</h3>
              <p className="text-[14px] leading-[1.6] text-[#645b50] dark:text-[#9ba6b5]">
                From Nukkad Natak and Chess championships to Robowars and Startup Pitch days — experience an electric campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BUILD. COMPETE. WIN. (Using authentic campus photos) */}
      <section id="build-win" className="py-[clamp(48px,6vw,72px)] bg-paper dark:bg-[#0e1620] border-b border-line dark:border-[#223040] transition-colors">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="m-0 font-serif text-[clamp(28px,4vw,44px)] italic leading-[1.15] text-ink dark:text-[#f1ede6]">
              Build. Compete. <span className="text-saffron">Win.</span>
            </p>
            <Link
              to="/build-win"
              className="clay-btn-secondary text-xs"
            >
              <span>Explore Full Framework & Hall of Fame →</span>
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* BUILD - Using real CCF Coding lab photo */}
            <Link to="/build-win" className="group">
              <figure className="m-0 clay-card clay-card-hover p-3.5 space-y-3">
                <div className="relative h-[clamp(200px,24vw,300px)] overflow-hidden rounded-2xl bg-[#14100b]">
                  <img
                    src="/assets/campus/coding-lab-mentorship.jpg"
                    alt="Students coding in ABES lab"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <figcaption className="text-center pb-2">
                  <div className="clay-pill px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-saffron bg-saffron/10 border-saffron/20 mx-auto">
                    Phase 01 · Build
                  </div>
                  <div className="mt-2 text-[14px] text-[#645b50] dark:text-[#9ba6b5]">
                    Ship real software, autonomous robots, and deep tech in dedicated campus labs
                  </div>
                </figcaption>
              </figure>
            </Link>

            {/* COMPETE - Using real CyberQuest Auditorium stage photo */}
            <Link to="/build-win" className="group">
              <figure className="m-0 clay-card clay-card-hover p-3.5 space-y-3">
                <div className="relative h-[clamp(200px,24vw,300px)] overflow-hidden rounded-2xl bg-[#14100b]">
                  <img
                    src="/assets/campus/cyberquest-auditorium.jpg"
                    alt="CyberQuest stage competition at ABES"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <figcaption className="text-center pb-2">
                  <div className="clay-pill px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-saffron bg-saffron/10 border-saffron/20 mx-auto">
                    Phase 02 · Compete
                  </div>
                  <div className="mt-2 text-[14px] text-[#645b50] dark:text-[#9ba6b5]">
                    Pitch on the 1,200-seat auditorium stage before faculty, founders & industry judges
                  </div>
                </figcaption>
              </figure>
            </Link>

            {/* WIN - Using real student organizers & team photo */}
            <Link to="/build-win" className="group">
              <figure className="m-0 clay-card clay-card-hover p-3.5 space-y-3">
                <div className="relative h-[clamp(200px,24vw,300px)] overflow-hidden rounded-2xl bg-[#14100b]">
                  <img
                    src="/assets/campus/club-team-outdoors.jpg"
                    alt="ABES student society team celebrating"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <figcaption className="text-center pb-2">
                  <div className="clay-pill px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-saffron bg-saffron/10 border-saffron/20 mx-auto">
                    Phase 03 · Win
                  </div>
                  <div className="mt-2 text-[14px] text-[#645b50] dark:text-[#9ba6b5]">
                    Claim ₹5,00,000+ prize pools, incubation seed grants, trophies, and AKTU credits
                  </div>
                </figcaption>
              </figure>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-[clamp(48px,6vw,72px)] bg-cream dark:bg-[#16212C] border-b border-line dark:border-[#223040] transition-colors">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 space-y-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="section-eyebrow">FAQ</div>
              <h2 className="font-display text-[clamp(26px,3.8vw,38px)] font-bold text-ink dark:text-[#f1ede6]">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-[#645b50] dark:text-[#9ba6b5]">
                Everything you need to know about ABES Event Nexus, registrations, and participation.
              </p>
            </div>

            <Link
              to="/faq"
              className="font-display text-xs font-semibold text-saffron hover:underline font-mono"
            >
              View Full Knowledgebase & Search →
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-[4px] border border-line dark:border-[#223040] bg-paper dark:bg-[#16212C] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-cream/40 dark:hover:bg-[#16212C] transition-colors"
                  >
                    <span className="font-display font-bold text-[15px] sm:text-[16px] text-ink dark:text-[#f1ede6]">
                      {faq.q}
                    </span>
                    <span className="font-mono text-xs font-bold text-saffron shrink-0">
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-[#645b50] dark:text-[#9ba6b5] leading-relaxed border-t border-line/60 dark:border-[#223040] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/faq"
              className="font-display inline-flex items-center gap-2 rounded-[3px] bg-paper dark:bg-[#16212C] border border-line dark:border-[#223040] hover:border-saffron px-5 py-2.5 text-xs font-semibold text-ink dark:text-white transition-colors"
            >
              <span>Have more questions? Read our full FAQ Guide →</span>
            </Link>
          </div>
        </div>
      </section>

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
