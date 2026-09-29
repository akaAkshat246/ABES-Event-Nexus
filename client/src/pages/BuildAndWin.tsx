import React from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Hammer,
  Flame,
  Award,
  Zap,
  CheckCircle2,
  Users,
  Code,
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Compass,
} from 'lucide-react';

export const BuildAndWin: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'Build',
      tagline: 'Ship Real-World Engineering',
      desc: 'Hackathons and competitions at ABES Event Nexus are designed for builders. Whether you are assembling autonomous combat robots in the mechatronics labs, training deep learning neural nets on high-performance GPUs, designing spatial XR apps for Meta Quest, or writing high-throughput distributed systems in Go & Rust — here you build products that solve actual industry and societal challenges.',
      highlights: [
        '24/7 dedicated campus labs & fast gigabit internet access',
        'Hardware prototyping inventory (ESP32, Arduino, LiDAR, Raspberry Pi)',
        'Cloud credits & API access from GDG, ACM & IEEE chapters',
        'Expert guidance from senior mentors and faculty advisors',
      ],
      icon: Hammer,
      badgeColor: 'bg-saffron text-white',
      img: '/assets/campus/coding-lab-mentorship.jpg',
    },
    {
      num: '02',
      title: 'Compete',
      tagline: 'Test Your Mettle on the National Circuit',
      desc: 'Pitch, defend, and present your innovations in front of esteemed faculty panels, venture capitalists, unicorn startup founders, and technical architects from leading tech giants. Experience intense 24-hour, 36-hour, and multi-round hackathon sprints with teams from top colleges across Delhi NCR and India.',
      highlights: [
        'Multi-track hackathon categories for beginners to elite coders',
        'Live stage demos in the 1,200-seater college auditorium',
        'Rigorous code reviews & algorithmic performance benchmarks',
        'Blind judging and verified scoring transparent metrics',
      ],
      icon: Flame,
      badgeColor: 'bg-navy text-white',
      img: '/assets/campus/cyberquest-auditorium.jpg',
    },
    {
      num: '03',
      title: 'Win',
      tagline: 'Claim Prizes, Grants & Career Trajectory',
      desc: 'Top podium finishers take home cash prize pools, incubation grants from the ABES E-Cell, angel investor intros, direct placement interview fast-tracks, trophies, and official AKTU Activity Point accreditation recognized across all state engineering colleges.',
      highlights: [
        '₹5,00,000+ in annual prize pools, stipends, and bounties',
        'Seed funding & incubation support from the ABES Startup Cell',
        'Direct interview referrals & internship opportunities',
        'Officially stamped Certificate of Excellence with QR verification',
      ],
      icon: Trophy,
      badgeColor: 'bg-[#0b6623] text-white',
      img: '/assets/campus/club-team-outdoors.jpg',
    },
  ];

  const hallOfFame = [
    {
      title: 'AgroSense Autonomous Rover',
      club: 'Drone and Robotics',
      year: '2026',
      award: '1st Prize · National Robowars & AgTech',
      description: 'Solar-powered autonomous rover using computer vision and soil spectral analysis to detect crop pests with 96% accuracy.',
      lead: 'Vikramaditya Roy & Team',
    },
    {
      title: 'NeuroShield CTF Cyberdefense',
      club: 'ACM & GDG',
      year: '2026',
      award: 'Winner · Delhi NCR Hackfest',
      description: 'Zero-trust API anomaly detection system leveraging WebAssembly and eBPF kernel instrumentation.',
      lead: 'Aarav Gupta, Pranav Joshi',
    },
    {
      title: 'HoloLearn Spatial Biology',
      club: 'Arcade-AR/VR',
      year: '2025',
      award: 'Best XR Hack · Meta Innovation Grant',
      description: 'Interactive spatial anatomy simulation for Meta Quest enabling surgical precision rehearsal for medical students.',
      lead: 'Siddharth Saxena & Team',
    },
    {
      title: 'KisanVyapar Decentralized Mandi',
      club: 'E-Cell & GFG',
      year: '2025',
      award: 'Best Social Impact · ₹1,00,000 Seed Grant',
      description: 'Peer-to-peer agricultural marketplace eliminating middleman commission for western UP farmers.',
      lead: 'Akshat Mittal & Team',
    },
  ];

  return (
    <div className="space-y-0 pb-16">
      {/* 1. HERO HEADER */}
      <section className="relative bg-navy text-white border-b border-navy-800 py-16 sm:py-24 overflow-hidden">
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-saffron">
              <Sparkles className="w-4 h-4" />
              <span>The Crucible of Student Innovation</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
              Build. Compete. <span className="text-saffron">Win.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#d7d0c5] leading-relaxed">
              At ABES Engineering College, we believe true engineering prowess is forged in the fire of competition. Explore how our 19 specialized societies provide the launchpad to turn student ambition into real-world technological triumphs.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/events"
                className="font-display inline-flex items-center gap-2 rounded-[3px] bg-saffron hover:bg-saffron-hover px-6 py-3.5 text-sm font-semibold text-white transition-colors shadow-sm"
              >
                <span>Explore Live Competitions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/faq"
                className="font-display inline-flex items-center gap-2 rounded-[3px] bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors"
              >
                <span>Read Hackathon FAQs</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE PILLARS */}
      <section className="py-16 bg-cream dark:bg-[#16212C] border-b border-line dark:border-[#223040] transition-colors">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="section-eyebrow">The Competitive Framework</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink dark:text-white">
              How ABES Event Nexus Empowers Builders
            </h2>
            <p className="text-base text-ink-600 dark:text-[#9ba6b5]">
              A structured lifecycle designed to transition classroom theory into industry-grade engineering and startup creation.
            </p>
          </div>

          <div className="space-y-16">
            {pillars.map((pillar, idx) => {
              const isEven = idx % 2 === 1;
              const IconComponent = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  className={`grid gap-8 lg:grid-cols-2 items-center ${
                    isEven ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Text Column */}
                  <div className={`space-y-6 ${isEven ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className={`font-display font-bold text-sm px-3 py-1 rounded-[3px] ${pillar.badgeColor}`}>
                        Phase {pillar.num}
                      </span>
                      <span className="font-mono text-xs text-saffron uppercase tracking-wider font-semibold">
                        {pillar.tagline}
                      </span>
                    </div>

                    <h3 className="font-display text-3xl sm:text-4xl font-bold text-ink dark:text-white">
                      {pillar.title}
                    </h3>

                    <p className="text-base sm:text-lg leading-relaxed text-[#3c352d] dark:text-[#9ba6b5]">
                      {pillar.desc}
                    </p>

                    <div className="space-y-2.5 pt-2">
                      {pillar.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-ink dark:text-[#f1ede6]">
                            {h}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image Column */}
                  <div className={`relative ${isEven ? 'lg:col-start-1' : ''}`}>
                    <div className="relative h-[320px] sm:h-[400px] overflow-hidden rounded-[6px] border border-line dark:border-[#223040] shadow-md bg-navy">
                      <img
                        src={pillar.img}
                        alt={pillar.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-saffron">
                          <IconComponent className="w-4 h-4" />
                          <span>{pillar.title} Stage</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2.5 AUTHENTIC CAMPUS ENVIRONMENTS GALLERY */}
      <section className="py-16 bg-[#16212C] text-white border-b border-[#223040]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="section-eyebrow text-saffron">Campus Arena & Creative Synergy</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Where Engineering Meets Creative Expression
            </h2>
            <p className="text-sm sm:text-base text-[#9ba6b5]">
              From packed auditorium keynotes and high-intensity hackathon sprint labs to cultural street plays across open campus courtyards.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: Multi-Round Hackfest */}
            <div className="group rounded-[8px] overflow-hidden bg-navy-900 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-saffron/50 transition-all">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="/assets/campus/campus-hack-collage.jpg"
                  alt="ABES Multi-Track Hackfest Collage"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-[3px] bg-saffron text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  Hackathon Arena
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-display font-bold text-lg text-white">
                  Multi-Track Hackfest Sprints
                </h3>
                <p className="text-xs text-[#9ba6b5] leading-relaxed">
                  24-hour sprint sessions with live jury pitching, software architecture reviews, and multi-tier algorithmic rounds.
                </p>
              </div>
            </div>

            {/* Card 2: Cultural Courtyard & Street Theatre */}
            <div className="group rounded-[8px] overflow-hidden bg-navy-900 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-saffron/50 transition-all">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="/assets/campus/nukkad-natak-courtyard.jpg"
                  alt="Nukkad Natak Street Play on ABES Campus"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-[3px] bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  Cultural Pulse
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-display font-bold text-lg text-white">
                  Outdoor Courtyard Street Theatre
                </h3>
                <p className="text-xs text-[#9ba6b5] leading-relaxed">
                  High-energy street plays, societal awareness campaigns, and musical showcases bringing campus open spaces to life.
                </p>
              </div>
            </div>

            {/* Card 3: Student Society Leadership */}
            <div className="group rounded-[8px] overflow-hidden bg-navy-900 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-saffron/50 transition-all md:col-span-2 lg:col-span-1">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="/assets/campus/club-team-outdoors.jpg"
                  alt="ABES Student Society Leads and Coordinators"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-[3px] bg-purple-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  Society Leaders
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-display font-bold text-lg text-white">
                  Student Leadership & Organizers
                </h3>
                <p className="text-xs text-[#9ba6b5] leading-relaxed">
                  Over 19 specialized societies managed by dedicated student convenors, technical leads, and creative designers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HALL OF FAME / WINNING PROJECTS */}
      <section className="py-16 bg-paper dark:bg-[#0e1620] border-b border-line dark:border-[#223040] transition-colors">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="section-eyebrow">Campus Hall of Fame</div>
              <h2 className="font-display mt-1 text-3xl sm:text-4xl font-bold text-ink dark:text-white">
                Recent Podium Finishes & Standout Hacks
              </h2>
              <p className="mt-2 text-base text-[#3c352d] dark:text-[#9ba6b5] max-w-2xl">
                Real student projects developed during Nexus competitions that won national accolades and institutional venture backing.
              </p>
            </div>

            <Link
              to="/events"
              className="font-display inline-flex items-center gap-1.5 text-sm font-semibold text-saffron hover:underline"
            >
              <span>View all competition schedules →</span>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {hallOfFame.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[6px] bg-cream dark:bg-[#16212C] border border-line dark:border-[#223040] space-y-4 shadow-sm hover:border-saffron/80 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 dark:border-[#223040] pb-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-[2px] bg-saffron text-white">
                    {item.award}
                  </span>
                  <span className="font-mono text-xs text-[#8c8377]">
                    {item.club} · {item.year}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-ink dark:text-white">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-[#645b50] dark:text-[#9ba6b5]">
                  {item.description}
                </p>

                <div className="pt-2 text-xs font-mono text-[#8c8377] flex items-center justify-between">
                  <span>Led by: <strong className="text-ink dark:text-white">{item.lead}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified Winner ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. READY TO COMPETE CTA */}
      <section className="py-16 bg-navy text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 text-saffron border border-white/20 mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Are You Ready to Claim the Next Championship?
          </h2>

          <p className="text-base sm:text-lg text-[#d7d0c5] max-w-2xl mx-auto leading-relaxed">
            Join thousands of student innovators across ABES Engineering College. Register for an upcoming hackathon, form your squad, and build the future.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/events"
              className="font-display inline-flex items-center gap-2 rounded-[3px] bg-saffron hover:bg-saffron-hover px-7 py-3.5 text-sm font-semibold text-white transition-colors shadow-lg"
            >
              <span>Browse Active Events →</span>
            </Link>
            <Link
              to="/"
              className="font-display inline-flex items-center gap-2 rounded-[3px] bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors"
            >
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
