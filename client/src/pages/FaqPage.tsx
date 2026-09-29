import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Award,
  GraduationCap,
  Users,
  QrCode,
  Mail,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'General' | 'Eligibility' | 'Hackathons' | 'Certificates' | 'Coordinators';
  question: string;
  answer: string;
}

export const FaqPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ 'faq-1': true, 'faq-2': true });

  const categories = ['All', 'General', 'Eligibility', 'Hackathons', 'Certificates', 'Coordinators'];

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'General',
      question: 'What is ABES Event Nexus?',
      answer: 'ABES Event Nexus is the official unified event discovery, registration, and ticketing platform for ABES Engineering College (Autonomous), Ghaziabad. It serves as the single digital gateway for all 19 registered student societies (including GFG, Codechef, GDG, IEEE, Drone & Robotics, Arcade-AR/VR, ACM, and E-Cell) to publish hackathons, workshops, conferences, and cultural fests.',
    },
    {
      id: 'faq-2',
      category: 'General',
      question: 'Is there any registration fee for campus events and hackathons?',
      answer: 'No! 100% of the student club hackathons, technical workshops, robotics challenges, and cultural competitions published on ABES Event Nexus are completely free of charge for all eligible students.',
    },
    {
      id: 'faq-3',
      category: 'Eligibility',
      question: 'Who is eligible to participate in ABES Event Nexus competitions?',
      answer: 'All enrolled undergraduate and postgraduate students of ABES Engineering College across B.Tech (CSE, IT, ECE, ME, EN, CE), MCA, and MBA are eligible. For inter-college hackathons and open circuits, students from recognized engineering institutions across Delhi NCR and India are also warmly welcomed to register and compete.',
    },
    {
      id: 'faq-4',
      category: 'Eligibility',
      question: 'Can first-year / freshman students participate in hackathons?',
      answer: 'Absolutely! Most technical societies host exclusive Freshman Tracks and novice-friendly bootcamps specifically designed to mentor 1st-year students in coding fundamentals, Git/GitHub, electronics, and public speaking.',
    },
    {
      id: 'faq-5',
      category: 'Hackathons',
      question: 'How does team registration and ticketing work?',
      answer: 'You can register individually or enter your team details during registration. Once you submit your registration, ABES Event Nexus instantly generates an authentic digital boarding ticket pass featuring a scannable QR verification code. You can download or print your pass anytime.',
    },
    {
      id: 'faq-6',
      category: 'Hackathons',
      question: 'What facilities and hardware are provided during overnight 24-hour hackathons?',
      answer: 'During 24-hour and 36-hour hackathons, participants have 24/7 access to air-conditioned campus computer labs, high-speed gigabit Wi-Fi, hardware prototyping components from the robotics inventory, midnight refreshments/meals, rest lounges, and live on-site technical mentors.',
    },
    {
      id: 'faq-7',
      category: 'Certificates',
      question: 'Do participants receive verified E-Certificates and AKTU Activity Credits?',
      answer: 'Yes! All verified attendees who check in with their QR boarding pass and participate receive digitally stamped Certificates of Participation. Winning teams receive Certificates of Excellence. All certified events qualify toward AKTU 100 Activity Points required for degree honors.',
    },
    {
      id: 'faq-8',
      category: 'Certificates',
      question: 'How are digital boarding passes validated at the venue?',
      answer: 'Faculty coordinators and student volunteers use the Nexus QR scanner tool on the Admin Console at the auditorium or lab entrance to instantly validate attendee registrations and mark attendance in real time.',
    },
    {
      id: 'faq-9',
      category: 'Coordinators',
      question: 'How can faculty advisors and club leaders manage event listings?',
      answer: 'Authorized faculty coordinators and club leaders can access the dedicated Admin Portal via email/password or Google Workspace authentication. From the console, coordinators can publish new events, update schedules, monitor seat capacities, and export complete attendee CSV sheets with one click.',
    },
    {
      id: 'faq-10',
      category: 'Coordinators',
      question: 'Where can I reach out if I encounter technical issues during registration?',
      answer: 'If you face any issues with registration passes or logins, email our technical team at nexus@abes.ac.in or contact the Student Welfare & Technical Club Secretariat at ABES Engineering College (0120 713 5111 / +91 9910125804).',
    },
  ];

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-0 pb-16">
      {/* 1. HERO HEADER */}
      <section className="relative bg-navy text-white border-b border-navy-800 py-14 sm:py-20">
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-saffron">
                <HelpCircle className="w-4 h-4" />
                <span>Knowledgebase & Support</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Frequently Asked <span className="text-saffron">Questions</span>
              </h1>

              <p className="text-base sm:text-lg text-[#d7d0c5] leading-relaxed">
                Find instant answers to everything you need to know about registering for hackathons, ticket passes, AKTU activity credits, and club societies at ABES.
              </p>

              {/* Search Input */}
              <div className="pt-2 relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8c8377]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search questions (e.g. registration, certificate, team, QR code)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-[4px] bg-white/10 border border-white/20 text-white placeholder:text-[#a99f92] focus:outline-none focus:border-saffron text-sm backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[8px] overflow-hidden border border-white/15 bg-navy-950 shadow-[0_10px_35px_rgba(0,0,0,0.5)] group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="/assets/campus/coding-lab-mentorship.jpg"
                    alt="ABES Campus Lab & Mentorship"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="font-mono text-[10px] uppercase font-bold text-saffron tracking-wider block">
                      Campus Infrastructure
                    </span>
                    <span className="text-xs font-semibold">
                      24/7 Air-Conditioned Coding Labs & Gigabit Connectivity
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 text-xs text-[#d7d0c5] flex items-center justify-between">
                  <span>Questions? Our campus helpdesk is 24/7 active</span>
                  <span className="text-saffron font-bold">ABES EC ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TABS & FAQ LIST */}
      <section className="py-12 bg-cream dark:bg-[#16212C] transition-colors">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 border-b border-line dark:border-[#223040] pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-display px-4 py-2 rounded-[3px] text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-saffron text-white shadow-sm'
                    : 'bg-paper dark:bg-[#16212C] text-ink dark:text-[#f1ede6] hover:text-saffron border border-line dark:border-[#223040]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion Items */}
          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = !!openIds[faq.id];
                return (
                  <div
                    key={faq.id}
                    className="rounded-[4px] border border-line dark:border-[#223040] bg-paper dark:bg-[#16212C] overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-cream/40 dark:hover:bg-[#16212C] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-saffron/10 text-saffron border border-saffron/20 shrink-0">
                          {faq.category}
                        </span>
                        <span className="font-display font-bold text-base sm:text-lg text-ink dark:text-[#f1ede6]">
                          {faq.question}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-saffron shrink-0">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5 text-sm text-[#3c352d] dark:text-[#9ba6b5] leading-relaxed border-t border-line/60 dark:border-[#223040] pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-paper dark:bg-[#16212C] rounded-[6px] border border-line dark:border-[#223040] space-y-3">
              <HelpCircle className="w-10 h-10 text-saffron mx-auto" />
              <h3 className="font-display font-bold text-lg text-ink dark:text-white">
                No matching questions found
              </h3>
              <p className="text-xs sm:text-sm text-ink-600 dark:text-[#9ba6b5]">
                Try adjusting your search terms or select another category above.
              </p>
            </div>
          )}

          {/* Still Need Help Box */}
          <div className="mt-12 rounded-[6px] bg-navy text-white p-8 border border-navy-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <h3 className="font-display font-bold text-xl text-white">
                  Still have questions? We are here to help!
                </h3>
                <p className="text-sm text-[#d7d0c5]">
                  Get in touch with the ABES Event Nexus student helpline or contact the respective club leads directly.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:nexus@abes.ac.in"
                  className="font-display inline-flex items-center gap-2 rounded-[3px] bg-saffron hover:bg-saffron-hover px-5 py-2.5 text-xs font-semibold text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Support</span>
                </a>
                <Link
                  to="/events"
                  className="font-display inline-flex items-center gap-2 rounded-[3px] bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 text-xs font-semibold text-white transition-colors"
                >
                  <span>Explore Events →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
