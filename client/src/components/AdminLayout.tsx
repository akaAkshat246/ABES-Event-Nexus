import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NexusCard } from './NexusCard';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const navItems = [
    {
      name: 'Dashboard Overview',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Manage Events',
      path: '/admin/events',
      icon: CalendarDays,
    },
    {
      name: 'View Registrations',
      path: '/admin/registrations',
      icon: Users,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#0d141c] text-[#d7d0c5] flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-navy border-r border-white/10 shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between gap-2">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/abes-logo.png"
                alt="ABES Event Nexus"
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-white leading-tight">
                  ABES <span className="text-saffron">Nexus</span>
                </span>
                <span className="font-mono text-[9px] text-[#a99f92] uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </Link>
            <span className="font-mono text-[10px] text-saffron font-bold uppercase tracking-wider block mt-2">
              ABES Autonomous Campus
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8c8377] px-3 py-2">
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[3px] font-display text-xs font-semibold transition-all ${
                  active
                    ? 'bg-saffron text-white shadow-sm'
                    : 'text-[#d7d0c5] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-saffron'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-6">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8c8377] px-3 py-2">
              Live Platform
            </div>
            <Link
              to="/"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-[3px] font-display text-xs font-semibold text-[#d7d0c5] hover:text-white hover:bg-white/5 transition-all"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-saffron" />
                <span>Student Portal</span>
              </span>
              <span className="font-mono text-[10px] bg-[#0b6623] text-white px-1.5 py-0.5 rounded-[2px]">
                Live
              </span>
            </Link>
          </div>
        </nav>

        {/* Current Admin Card & Logout */}
        <div className="p-4 border-t border-white/10 bg-navy-950/60 space-y-2.5">
          <div className="p-2.5 rounded-[3px] bg-white/5 border border-white/10">
            <span className="font-display text-xs font-bold text-white block truncate">{admin?.name}</span>
            <span className="font-mono text-[10px] text-saffron block truncate">{admin?.email}</span>
          </div>

          <button
            onClick={() => setCardModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[3px] bg-saffron/15 hover:bg-saffron/25 text-saffron font-display text-xs font-semibold transition-all border border-saffron/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>My Nexus Card</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[3px] bg-white/5 hover:bg-rose-950/50 text-[#d7d0c5] hover:text-rose-300 font-display text-xs font-semibold transition-all border border-white/10 hover:border-rose-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Coordinator Nexus Card Modal */}
      {cardModalOpen && admin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-navy-950 rounded-[6px] shadow-2xl overflow-hidden border border-white/15 text-white my-6 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-saffron" />
                <h3 className="font-display font-bold text-base text-white">
                  Coordinator Nexus Identity Pass
                </h3>
              </div>
              <button
                onClick={() => setCardModalOpen(false)}
                className="p-1 rounded-[3px] border border-white/15 hover:bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <NexusCard
              student={{
                name: admin.name || 'Faculty Coordinator',
                email: admin.email || 'coordinator@abes.ac.in',
                collegeName: 'ABES Engineering College, Ghaziabad',
                rollNumber: 'FACULTY-COORD',
                branch: 'Faculty & Society Operations',
                year: '2nd' as any,
                phone: '',
              }}
              role="coordinator"
              onClose={() => setCardModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden bg-navy border-b border-white/10 p-4 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <img
            src="/assets/abes-logo.png"
            alt="ABES Event Nexus"
            className="h-8 w-auto object-contain"
          />
          <span className="font-display font-bold text-sm text-white">
            ABES <span className="text-saffron">Nexus</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-[3px] bg-white/10 text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="md:hidden bg-navy border-b border-white/10 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[3px] font-display text-xs font-semibold ${
                  active ? 'bg-saffron text-white' : 'text-[#d7d0c5] hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 text-saffron" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Admin Body */}
      <main className="flex-1 min-w-0 bg-[#0d141c] overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

