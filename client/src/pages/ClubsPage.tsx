import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Layers,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  ExternalLink,
  Code,
  Cpu,
  Tv,
  Palette,
  Compass,
  Trophy,
  Filter,
} from 'lucide-react';
import { CLUBS_DIRECTORY, IClubDetails } from '../data/clubsData';

const CATEGORIES = [
  'All',
  'Technical',
  'Hardware & XR',
  'Literary & Discourse',
  'Arts & Culture',
  'Social & Impact',
];

export const ClubsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClubs = useMemo(() => {
    return CLUBS_DIRECTORY.filter((club) => {
      const matchesCategory =
        selectedCategory === 'All' || club.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        club.name.toLowerCase().includes(q) ||
        club.fullName.toLowerCase().includes(q) ||
        club.tag.toLowerCase().includes(q) ||
        club.description.toLowerCase().includes(q) ||
        club.studentLead.toLowerCase().includes(q) ||
        club.facultyAdvisor.toLowerCase().includes(q) ||
        club.activities.some((act) => act.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: CLUBS_DIRECTORY.length };
    CLUBS_DIRECTORY.forEach((club) => {
      counts[club.category] = (counts[club.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-0 pb-16">
      {/* 1. HERO HEADER */}
      <section className="relative bg-navy text-white border-b border-navy-800 py-14 sm:py-20 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-800/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-saffron">
              <Sparkles className="w-4 h-4" />
              <span>Autonomous Student Ecosystem · 19 Official Societies</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              ABES Student <span className="text-saffron">Societies & Chapters</span>
            </h1>

            <p className="text-base sm:text-lg text-[#d7d0c5] leading-relaxed">
              Explore all 19 registered departmental chapters, developer circles, robotics research labs, fine arts guilds, and dramatics clubs at ABES Engineering College. Connect with leads, participate in workshops, and build the future.
            </p>

            {/* Live Search Bar */}
            <div className="pt-2 relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8c8377]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by club name, tech domain (e.g. DSA, AR/VR, Robotics, Drama, E-Cell)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-[4px] bg-white/10 border border-white/20 text-white placeholder:text-[#a99f92] focus:outline-none focus:border-saffron text-sm backdrop-blur-sm shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#a99f92] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="bg-paper dark:bg-[#111a24] border-b border-line dark:border-[#223040] py-6 transition-colors">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1 p-3">
              <div className="font-display text-3xl sm:text-4xl font-bold text-saffron">19</div>
              <div className="text-xs font-mono text-[#645b50] dark:text-[#9ba6b5] uppercase tracking-wider">
                Official Societies
              </div>
            </div>
            <div className="space-y-1 p-3">
              <div className="font-display text-3xl sm:text-4xl font-bold text-ink dark:text-white">4,800+</div>
              <div className="text-xs font-mono text-[#645b50] dark:text-[#9ba6b5] uppercase tracking-wider">
                Active Student Members
              </div>
            </div>
            <div className="space-y-1 p-3">
              <div className="font-display text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">75+</div>
              <div className="text-xs font-mono text-[#645b50] dark:text-[#9ba6b5] uppercase tracking-wider">
                Annual Competitions
              </div>
            </div>
            <div className="space-y-1 p-3">
              <div className="font-display text-3xl sm:text-4xl font-bold text-ink dark:text-white">100%</div>
              <div className="text-xs font-mono text-[#645b50] dark:text-[#9ba6b5] uppercase tracking-wider">
                Free Campus Access
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLUBS FILTER & DIRECTORY GRID */}
      <section className="py-12 bg-cream dark:bg-[#16212C] transition-colors">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line dark:border-[#223040] pb-4">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`font-display inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-saffron text-white shadow-md'
                        : 'bg-paper dark:bg-[#111a24] text-ink dark:text-[#f1ede6] hover:text-saffron border border-line dark:border-[#223040]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-line/40 dark:bg-white/10 text-[#8c8377]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-mono text-[#8c8377]">
              Showing <strong className="text-ink dark:text-white">{filteredClubs.length}</strong> of 19 societies
            </div>
          </div>

          {/* Clubs Cards Grid */}
          {filteredClubs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClubs.map((club) => (
                <div
                  key={club.id}
                  className="rounded-[8px] bg-paper dark:bg-[#111a24] border border-line dark:border-[#223040] overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:border-saffron/80 hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Top Image Banner */}
                  <div className="relative h-48 overflow-hidden bg-navy">
                    <img
                      src={club.bannerImage}
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Badges on Top */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[3px] bg-saffron text-white shadow">
                        {club.category}
                      </span>
                      <span className="font-mono text-[10px] text-white/90 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-[2px] border border-white/15">
                        Est. {club.established}
                      </span>
                    </div>

                    {/* Title & Tag on Image Bottom */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-display font-bold text-2xl leading-tight group-hover:text-saffron transition-colors">
                        {club.name}
                      </h3>
                      <p className="font-mono text-[11px] text-saffron uppercase tracking-wider mt-0.5 font-medium truncate">
                        {club.fullName}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Focus Tag & Member Count */}
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#3c352d] dark:text-[#9ba6b5] flex items-center gap-1.5 font-semibold">
                          <Layers className="w-3.5 h-3.5 text-saffron" />
                          <span>{club.tag}</span>
                        </span>
                        <span className="text-ink dark:text-white flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{club.memberCount} members</span>
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#554d42] dark:text-[#9ba6b5] leading-relaxed line-clamp-3">
                        {club.description}
                      </p>

                      {/* Activities Highlight */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono text-[#8c8377] uppercase tracking-wider block">
                          Key Initiatives:
                        </span>
                        <div className="space-y-1">
                          {club.activities.slice(0, 2).map((act, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-ink dark:text-[#f1ede6]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span className="truncate">{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Leadership & Footer CTA */}
                    <div className="pt-4 border-t border-line/60 dark:border-[#223040] space-y-3">
                      <div className="text-[11px] text-[#645b50] dark:text-[#8c97a5] flex items-center justify-between">
                        <span className="truncate">Lead: <strong className="text-ink dark:text-white">{club.studentLead.split('(')[0]}</strong></span>
                        <span className="text-saffron font-mono text-[10px]">Verified ✓</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to={`/clubs/${club.slug}`}
                          className="font-display inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-[3px] bg-saffron hover:bg-saffron-hover text-white text-xs font-semibold transition-colors shadow-sm"
                        >
                          <span>Society Profile</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/events?club=${encodeURIComponent(club.name)}`}
                          className="font-display inline-flex items-center justify-center py-2 px-3 rounded-[3px] bg-cream dark:bg-white/5 hover:bg-line/40 dark:hover:bg-white/10 text-ink dark:text-[#f1ede6] text-xs font-semibold border border-line dark:border-white/10 transition-colors"
                        >
                          <span>View Events</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-paper dark:bg-[#111a24] rounded-[6px] border border-line dark:border-[#223040] space-y-3">
              <Search className="w-10 h-10 text-saffron mx-auto" />
              <h3 className="font-display font-bold text-lg text-ink dark:text-white">
                No societies found matching "{searchQuery}"
              </h3>
              <p className="text-xs sm:text-sm text-ink-600 dark:text-[#9ba6b5]">
                Try adjusting your search keywords or switch category filter to 'All'.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="font-display inline-flex items-center gap-1.5 px-4 py-2 rounded-[3px] bg-saffron text-white text-xs font-semibold mt-2"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. SOCIETY ACCREDITATION & MEMBERSHIP INFO */}
      <section className="py-14 bg-paper dark:bg-[#0e1620] border-t border-line dark:border-[#223040] transition-colors">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="section-eyebrow">Student Participation & Credits</div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink dark:text-white">
              Why Join an Official ABES Student Society?
            </h2>
            <p className="text-sm text-[#3c352d] dark:text-[#9ba6b5]">
              Society memberships and event organizing provide hands-on experience and institutional accreditation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-[6px] bg-cream dark:bg-[#16212C] border border-line dark:border-[#223040] space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-[4px] bg-saffron/10 text-saffron flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-ink dark:text-white">
                AKTU 100 Activity Points
              </h3>
              <p className="text-xs text-[#554d42] dark:text-[#9ba6b5] leading-relaxed">
                Participation in approved society hackathons, coding contests, and symposiums qualifies for mandatory AKTU Activity Points needed for degree honors.
              </p>
            </div>

            <div className="p-6 rounded-[6px] bg-cream dark:bg-[#16212C] border border-line dark:border-[#223040] space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-[4px] bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-ink dark:text-white">
                National Circuit & Hackfests
              </h3>
              <p className="text-xs text-[#554d42] dark:text-[#9ba6b5] leading-relaxed">
                Clubs provide direct sponsorship, lab infrastructure, travel support, and mentorship for national competitions (Smart India Hackathon, ICPC, Robowars).
              </p>
            </div>

            <div className="p-6 rounded-[6px] bg-cream dark:bg-[#16212C] border border-line dark:border-[#223040] space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-[4px] bg-purple-600/10 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-ink dark:text-white">
                Leadership & Placement Fast-Track
              </h3>
              <p className="text-xs text-[#554d42] dark:text-[#9ba6b5] leading-relaxed">
                Active society coordinators gain real leadership experience, alumni network referrals, and direct placement interview prep advantages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-14 bg-navy text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Want to Launch an Initiative or Collaborate?
          </h2>
          <p className="text-sm text-[#d7d0c5] max-w-xl mx-auto leading-relaxed">
            Reach out to the Dean Student Welfare Secretariat or connect with student society leads to host your next tech workshop or hackathon.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/events"
              className="font-display inline-flex items-center gap-2 rounded-[3px] bg-saffron hover:bg-saffron-hover px-6 py-3 text-xs font-semibold text-white transition-colors shadow-lg"
            >
              <span>Explore Society Events →</span>
            </Link>
            <Link
              to="/faq"
              className="font-display inline-flex items-center gap-2 rounded-[3px] bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 text-xs font-semibold text-white transition-colors"
            >
              <span>Read Society FAQs</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
