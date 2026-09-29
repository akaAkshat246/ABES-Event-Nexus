import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Plus,
  Tag,
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight,
  Download,
} from 'lucide-react';
import { DashboardStats, IEvent } from '../types';
import { fetchDashboardStats, downloadRegistrationsCsv } from '../api/registrations';
import { EventFormModal } from '../components/EventFormModal';
import { useToast } from '../context/ToastContext';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { success, error: toastError } = useToast();

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetchDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleExportAllRegistrations = async () => {
    try {
      setIsExporting(true);
      await downloadRegistrationsCsv();
      success('Master registrations CSV downloaded successfully!', 'Export Completed');
    } catch (err) {
      toastError('Failed to download registrations CSV', 'Export Failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-accent-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ABES Engineering College Executive View</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Club Events & Registrations Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live analytics, attendee records, and coordinator data exports across all collegiate clubs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportAllRegistrations}
            disabled={isExporting}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-2 border border-emerald-600/40 transition-all shrink-0"
            title="Download Master Attendee Registrations CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export Master CSV</span>
          </button>

          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-primary-800 hover:bg-primary-700 text-white text-xs font-bold shadow-lg shadow-primary-950/50 flex items-center gap-2 border border-primary-600/40 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Events */}
        <div className="p-5 rounded-2xl bg-secondary-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Events</span>
            <div className="p-2 rounded-xl bg-primary-950 text-rose-300 border border-primary-800">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl text-white">
              {loading ? '...' : stats?.totalEvents ?? 0}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">All Time</span>
          </div>
          <Link
            to="/admin/events"
            className="text-[11px] font-semibold text-accent-400 hover:text-accent-300 inline-flex items-center gap-1"
          >
            <span>Manage Events Table</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Upcoming Events */}
        <div className="p-5 rounded-2xl bg-secondary-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Upcoming Events</span>
            <div className="p-2 rounded-xl bg-sky-950 text-sky-300 border border-sky-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl text-sky-400">
              {loading ? '...' : stats?.upcomingEvents ?? 0}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Scheduled</span>
          </div>
          <span className="text-[11px] text-slate-400 block">Open for student registration</span>
        </div>

        {/* Total Registrations */}
        <div className="p-5 rounded-2xl bg-secondary-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Registrations</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl text-emerald-400">
              {loading ? '...' : stats?.totalRegistrations ?? 0}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Issued Passes</span>
          </div>
          <Link
            to="/admin/registrations"
            className="text-[11px] font-semibold text-accent-400 hover:text-accent-300 inline-flex items-center gap-1"
          >
            <span>View Registrations</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Registrations This Week */}
        <div className="p-5 rounded-2xl bg-secondary-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">New This Week</span>
            <div className="p-2 rounded-xl bg-amber-950 text-amber-300 border border-amber-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl text-accent-400">
              {loading ? '...' : stats?.registrationsThisWeek ?? 0}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> Active
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block">Past 7 days velocity</span>
        </div>
      </div>

      {/* Two Column Grid: Top Popular Events & Category/Year Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Popular Events */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-secondary-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span>Top Events by Student Interest</span>
              </h3>
              <Link
                to="/admin/events"
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {stats?.topEvents && stats.topEvents.length > 0 ? (
                stats.topEvents.map((ev) => (
                  <div
                    key={ev._id}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-950 text-rose-300 border border-primary-800">
                          {ev.club}
                        </span>
                        <span className="text-xs font-bold text-white truncate block">
                          {ev.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {new Date(ev.date).toLocaleDateString()} • {ev.category}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-sm text-emerald-400 block">
                        {ev.registeredCount} Reg.
                      </span>
                      {ev.capacity ? (
                        <span className="text-[10px] text-slate-500 block">
                          of {ev.capacity} cap
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 block">Open</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">No event metrics yet.</p>
              )}
            </div>
          </div>

          {/* Recent Registrations Feed */}
          <div className="p-6 rounded-3xl bg-secondary-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-accent-400" />
                <span>Recent Registrations Stream</span>
              </h3>
              <Link
                to="/admin/registrations"
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Full list &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {stats?.recentRegistrations && stats.recentRegistrations.length > 0 ? (
                stats.recentRegistrations.map((reg) => (
                  <div
                    key={reg._id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white truncate">{reg.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {reg.year} Year
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate">
                        For: <strong className="text-slate-300">{reg.event?.name || 'Event'}</strong>
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-[11px] text-accent-400 font-bold block">
                        {reg.ticketId}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">No registrations yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown Charts / Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category Distribution */}
          <div className="p-6 rounded-3xl bg-secondary-950/80 border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-accent-400" />
              <span>Registrations by Category</span>
            </h3>

            <div className="space-y-3">
              {stats?.categoryStats && stats.categoryStats.length > 0 ? (
                stats.categoryStats.map((cat) => {
                  const total = stats.totalRegistrations || 1;
                  const pct = Math.round((cat.count / total) * 100);
                  return (
                    <div key={cat._id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{cat._id}</span>
                        <span className="text-slate-400">
                          {cat.count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-700 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 py-2">No category data available.</p>
              )}
            </div>
          </div>

          {/* Academic Year Distribution */}
          <div className="p-6 rounded-3xl bg-secondary-950/80 border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-accent-400" />
              <span>Registrations by Academic Year</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {stats?.yearStats && stats.yearStats.length > 0 ? (
                stats.yearStats.map((ys) => (
                  <div
                    key={ys._id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1"
                  >
                    <span className="text-xs font-bold text-accent-400">{ys._id} Year</span>
                    <span className="font-display font-extrabold text-xl text-white block">
                      {ys.count}
                    </span>
                    <span className="text-[10px] text-slate-500">Students</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 col-span-2 text-center py-2">
                  No year data available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <EventFormModal
        isOpen={isAddEventModalOpen}
        eventToEdit={null}
        onClose={() => setIsAddEventModalOpen(false)}
        onSuccess={() => {
          loadStats();
        }}
      />
    </div>
  );
};
