import React from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Shield,
  Phone,
  Mail,
  MapPin,
  Flame,
  Code,
  Music,
  Trophy,
} from 'lucide-react';
import { CLUBS_DIRECTORY } from '../data/clubsData';

export const Footer: React.FC = () => {

  return (
    <footer className="bg-navy text-[#d7d0c5] border-t border-navy-800">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pb-6 pt-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 pb-10 border-b border-white/10">
          {/* Col 1: Brand, Logo & Phone */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/assets/abes-logo.png"
                alt="ABES Event Nexus"
                className="h-14 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-white tracking-tight">
                  ABES <span className="text-saffron">Event Nexus</span>
                </span>
                <span className="font-mono text-[10px] text-[#a99f92] uppercase tracking-wider">
                  Autonomous · Ghaziabad
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#a99f92] leading-relaxed">
              "Recognized among the premier engineering institutions in Delhi NCR" — The centralized event discovery, hackathon, and club management ecosystem for ABES Engineering College (Autonomous), Ghaziabad.
            </p>

            <span className="mt-3 block font-display text-sm font-semibold text-white">
              Contact:{' '}
              <a href="tel:+919910125804" className="text-saffron hover:underline">
                +91 9910125804 / 0120 713 5111
              </a>
            </span>

            <div className="text-xs text-[#a99f92] space-y-1 pt-1">
              <p>Email: <a href="mailto:nexus@abes.ac.in" className="hover:text-white">nexus@abes.ac.in</a></p>
              <p>Campus: 19th KM Stone, NH-09, Ghaziabad, UP 201009</p>
            </div>
          </div>

          {/* Col 2: General & Ecosystem */}
          <div>
            <h3 className="section-eyebrow mb-4">Ecosystem</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/events" className="font-display font-medium text-[#d7d0c5] transition-colors hover:text-saffron">
                  Upcoming Hackathons & Events
                </Link>
              </li>
              <li>
                <Link to="/clubs" className="font-display font-medium text-[#d7d0c5] transition-colors hover:text-saffron">
                  19 Official Student Societies (Directory)
                </Link>
              </li>
              <li>
                <a href="/#why-us" className="font-display font-medium text-[#d7d0c5] transition-colors hover:text-saffron">
                  Why Compete at ABES
                </a>
              </li>
              <li>
                <Link to="/build-win" className="font-display font-medium text-[#d7d0c5] transition-colors hover:text-saffron">
                  Build. Compete. Win.
                </Link>
              </li>
              <li>
                <Link to="/faq" className="font-display font-medium text-[#d7d0c5] transition-colors hover:text-saffron">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <a
                  href="https://www.abes.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display font-medium text-[#d7d0c5] transition-colors hover:text-saffron flex items-center gap-1"
                >
                  <span>Official College Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: 19 Official ABES Clubs Directory */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-eyebrow">Student Clubs (19)</h3>
              <Link to="/clubs" className="text-xs text-saffron hover:underline font-mono">
                View All →
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
              {CLUBS_DIRECTORY.map((club) => (
                <Link
                  key={club.slug}
                  to={`/clubs/${club.slug}`}
                  className="font-mono text-[11px] px-2 py-1 rounded-[2px] bg-white/5 hover:bg-saffron text-[#d7d0c5] hover:text-white border border-white/10 transition-colors"
                  title={club.fullName}
                >
                  {club.name}
                </Link>
              ))}
            </div>
            <Link
              to="/clubs"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-saffron hover:underline font-display"
            >
              <span>Explore Dedicated 19 Clubs Page →</span>
            </Link>
          </div>

          {/* Col 4: Faculty & Admin Portal */}
          <div>
            <h3 className="section-eyebrow mb-4">Administration</h3>
            <p className="text-xs text-[#a99f92] leading-relaxed mb-4">
              Authorized faculty coordinators and club leaders can manage event schedules, check capacity, and download verified attendee lists on the Nexus console.
            </p>

            <Link
              to="/admin/login"
              className="font-display inline-flex items-center gap-2 rounded-[3px] bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 text-xs font-semibold text-white transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-saffron" />
              <span>Admin & Faculty Console →</span>
            </Link>

            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-[#a99f92]">
              <span>Affiliated to AKTU Lucknow · Approved by AICTE · NAAC 'A' Accredited</span>
            </div>
          </div>
        </div>

        {/* Bottom HackIndia-style Footer Line */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13px] text-[#a99f92]">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© {new Date().getFullYear()} ABES Event Nexus · ABES Engineering College. All rights reserved.</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span className="font-mono text-[11.5px] tabular-nums text-[#8c8377]">
              abes event nexus · autonomous edition
            </span>
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-display">
            <Link to="/events" className="hover:text-saffron transition-colors">Events & Hackathons</Link>
            <Link to="/clubs" className="hover:text-saffron transition-colors">Societies Directory (19)</Link>
            <Link to="/admin/login" className="hover:text-saffron transition-colors">Coordinator Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
