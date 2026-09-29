import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  LogIn,
  Ticket,
  LogOut,
  Calendar,
  Compass,
  Award,
  HelpCircle,
  User,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StudentLoginModal } from './StudentLoginModal';
import { MyActivityModal } from './MyActivityModal';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { isAuthenticated, admin, logout, student, isStudentAuthenticated, studentLogout } =
    useAuth();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'All Events', path: '/events' },
    { name: 'Build & Win', path: '/build-win' },
    { name: 'FAQs', path: '/faq' },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleOpenNexusCard = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    setStudentModalOpen(true);
  };

  const handleOpenActivity = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    setActivityModalOpen(true);
  };

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    if (isStudentAuthenticated) {
      studentLogout();
    }
    if (isAuthenticated) {
      logout();
    }
  };

  const isUserLoggedIn = isStudentAuthenticated || isAuthenticated;

  return (
    <header className="sticky top-0 z-50 border-b border-navy-800 bg-navy text-[#d7d0c5] shadow-sm transition-colors duration-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Official ABES Event Nexus Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src="/assets/abes-logo.png"
              alt="ABES Event Nexus Logo"
              className="h-11 sm:h-13 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-[17px] sm:text-[19px] tracking-tight leading-none text-white flex items-center gap-1.5">
                <span>ABES</span>
                <span className="text-saffron">Event Nexus</span>
              </span>
              <span className="font-mono text-[9.5px] sm:text-[10px] uppercase tracking-[0.1em] text-[#a99f92] leading-tight mt-0.5">
                Engineering College · Autonomous
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (only shown when NOT logged in) */}
          {!isUserLoggedIn && (
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="font-display text-[14px] font-medium text-[#d7d0c5] hover:text-saffron transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* RIGHT SIDE HEADER ACTIONS */}
          <div className="flex items-center gap-3">
            {/* IF USER IS LOGGED IN: SHOW ONLY A CLEAN HAMBURGER / PROFILE MENU */}
            {isUserLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`font-display inline-flex items-center gap-2.5 px-3.5 py-2 rounded-[4px] text-xs font-semibold transition-all border shadow-sm ${
                    userDropdownOpen
                      ? 'bg-saffron text-white border-saffron'
                      : 'bg-white/10 hover:bg-white/20 text-white hover:text-saffron border-white/15'
                  }`}
                  aria-expanded={userDropdownOpen}
                  aria-label="Toggle user menu"
                >
                  <Menu className="w-4 h-4" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-saffron/20 border border-saffron/40 flex items-center justify-center text-[10px] font-bold text-saffron">
                      {isStudentAuthenticated
                        ? getInitials(student?.name)
                        : getInitials(admin?.name)}
                    </div>
                    <span className="max-w-[110px] sm:max-w-[140px] truncate">
                      {isStudentAuthenticated ? student?.name : admin?.name}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180 text-white' : 'text-[#a99f92]'
                    }`}
                  />
                </button>

                {/* DROPDOWN / FLYOUT HAMBURGER MENU */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-[6px] bg-navy-950 border border-white/15 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Logged in User Profile Banner */}
                    <div className="p-4 bg-navy border-b border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-saffron/20 border border-saffron/40 flex items-center justify-center text-sm font-bold text-saffron shrink-0 shadow-inner">
                          {isStudentAuthenticated
                            ? getInitials(student?.name)
                            : getInitials(admin?.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white truncate font-display">
                            {isStudentAuthenticated ? student?.name : admin?.name}
                          </h4>
                          <p className="text-[11px] text-[#a99f92] truncate font-mono mt-0.5">
                            {isStudentAuthenticated ? student?.email : admin?.email}
                          </p>
                          {isAuthenticated && (
                            <span className="inline-block mt-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-[2px] bg-saffron/20 border border-saffron/30 text-saffron">
                              Coordinator · {admin?.role || 'Admin'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="p-2 space-y-1">
                      {isStudentAuthenticated && (
                        <>
                          {/* 1. My Activity */}
                          <Link
                            to="/my-activity"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full flex items-center px-3 py-2.5 rounded-[4px] text-xs font-semibold text-white hover:text-saffron hover:bg-white/10 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-[3px] bg-saffron/15 text-saffron group-hover:bg-saffron group-hover:text-white transition-colors">
                                <Ticket className="w-4 h-4" />
                              </div>
                              <span className="font-display">My Activity</span>
                            </div>
                          </Link>

                          {/* 2. Nexus Card */}
                          <button
                            type="button"
                            onClick={handleOpenNexusCard}
                            className="w-full flex items-center px-3 py-2.5 rounded-[4px] text-xs font-semibold text-white hover:text-saffron hover:bg-white/10 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-[3px] bg-saffron/15 text-saffron group-hover:bg-saffron group-hover:text-white transition-colors">
                                <Sparkles className="w-4 h-4" />
                              </div>
                              <span className="font-display">Nexus Card</span>
                            </div>
                          </button>
                        </>
                      )}

                      {isAuthenticated && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] text-xs font-semibold text-white hover:text-saffron hover:bg-white/10 transition-colors group"
                        >
                          <span className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-[3px] bg-saffron/15 text-saffron group-hover:bg-saffron group-hover:text-white transition-colors">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <span className="font-display">Coordinator Console</span>
                          </span>
                          <span className="text-[10px] font-mono text-saffron">Open →</span>
                        </Link>
                      )}

                      <div className="my-1 border-t border-white/10" />

                      {/* Navigation links inside dropdown */}
                      <Link
                        to="/events"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-medium text-[#d7d0c5] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-[#a99f92]" />
                        <span>Browse All Events & Hackathons</span>
                      </Link>

                      <Link
                        to="/build-win"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-medium text-[#d7d0c5] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Award className="w-4 h-4 text-[#a99f92]" />
                        <span>Build & Win Circuits</span>
                      </Link>

                      <Link
                        to="/faq"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-medium text-[#d7d0c5] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-[#a99f92]" />
                        <span>Guidelines & FAQs</span>
                      </Link>

                      <div className="my-1 border-t border-white/10" />

                      {/* Sign Out Button */}
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[4px] text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* WHEN NOT LOGGED IN: SHOW STANDARD LOGIN & EXPLORE BUTTONS */
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => setStudentModalOpen(true)}
                  className="font-display inline-flex items-center gap-2 px-3.5 py-2 rounded-[3px] text-xs font-semibold transition-all border bg-white/10 hover:bg-white/20 text-white hover:text-saffron border-white/15 shadow-sm"
                  title="Login to ABES Event Nexus"
                >
                  <LogIn className="w-4 h-4 text-saffron" />
                  <span className="text-white">Login</span>
                </button>

                <Link
                  to="/events"
                  className="font-display inline-flex items-center justify-center rounded-[3px] bg-saffron hover:bg-saffron-hover px-5 py-2.5 text-[14px] font-semibold text-white transition-colors shadow-sm"
                >
                  <span>Browse Events →</span>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger (Only shown when NOT logged in, since logged in uses hamburger menu) */}
            {!isUserLoggedIn && (
              <div className="flex lg:hidden items-center gap-2">
                <button
                  onClick={() => setStudentModalOpen(true)}
                  className="p-1.5 rounded-[3px] bg-white/10 border border-white/15 text-white text-xs font-semibold flex items-center gap-1"
                  title="Login"
                >
                  <LogIn className="w-4 h-4 text-saffron" />
                </button>
                <Link
                  to="/events"
                  className="rounded-[3px] bg-saffron px-3 py-1.5 text-white text-xs font-semibold sm:hidden"
                >
                  Events
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-[3px] border border-white/15 text-white hover:text-saffron"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Only for guest users) */}
      {!isUserLoggedIn && mobileMenuOpen && (
        <div className="lg:hidden bg-navy border-b border-navy-800 px-4 pt-3 pb-6 space-y-3 transition-colors text-[#d7d0c5]">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setStudentModalOpen(true);
              }}
              className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-[3px] bg-white/10 text-white border border-white/15 hover:bg-white/20"
            >
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-saffron" />
                <span>Student Login</span>
              </span>
              <span className="text-xs text-saffron font-mono">Sign In →</span>
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display px-3 py-2 text-sm font-semibold text-[#d7d0c5] hover:text-saffron hover:bg-white/5 rounded-[3px]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center rounded-[3px] bg-saffron px-4 py-3 text-white text-sm font-semibold"
            >
              <span>Explore All Events & Hackathons →</span>
            </Link>

            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs text-[#a99f92] hover:text-saffron py-1"
            >
              Faculty & Coordinator Portal Login
            </Link>
          </div>
        </div>
      )}

      {/* Login & Nexus Card Modal */}
      <StudentLoginModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        onOpenActivity={() => setActivityModalOpen(true)}
      />

      {/* My Activity Modal (Participated Events & Hackathons) */}
      {student && (
        <MyActivityModal
          isOpen={activityModalOpen}
          student={student}
          onClose={() => setActivityModalOpen(false)}
        />
      )}
    </header>
  );
};
