import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Download,
  Trash2,
  Calendar,
  GraduationCap,
  Building2,
  Phone,
  Mail,
  Ticket,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { IRegistration, IEvent } from '../types';
import { fetchAllRegistrations, deleteRegistrationApi, downloadRegistrationsCsv } from '../api/registrations';
import { fetchEvents } from '../api/events';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useToast } from '../context/ToastContext';

export const AdminRegistrations: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlEvent = searchParams.get('event') || 'all';
  const urlYear = searchParams.get('year') || 'all';
  const urlQ = searchParams.get('q') || '';

  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [eventsList, setEventsList] = useState<IEvent[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(urlQ);
  const [selectedEvent, setSelectedEvent] = useState(urlEvent);
  const [selectedYear, setSelectedYear] = useState(urlYear);

  // Deletion modal state
  const [regToDelete, setRegToDelete] = useState<IRegistration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { success, error: toastError } = useToast();

  // Load events list for dropdown
  useEffect(() => {
    fetchEvents({ limit: 100 }).then((res) => {
      if (res.success && res.data) {
        setEventsList(res.data);
      }
    });
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const res = await fetchAllRegistrations({
        q: search || undefined,
        event: selectedEvent !== 'all' ? selectedEvent : undefined,
        year: selectedYear !== 'all' ? selectedYear : undefined,
        limit: 100,
      });

      if (res.success && res.data) {
        setRegistrations(res.data);
        setTotalCount(res.pagination.total);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [search, selectedEvent, selectedYear]);

  // Sync state changes with URL query parameters
  const updateFilters = (newQ: string, newEvent: string, newYear: string) => {
    const params: Record<string, string> = {};
    if (newQ) params.q = newQ;
    if (newEvent !== 'all') params.event = newEvent;
    if (newYear !== 'all') params.year = newYear;
    setSearchParams(params);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    updateFilters(val, selectedEvent, selectedYear);
  };

  const handleEventChange = (val: string) => {
    setSelectedEvent(val);
    updateFilters(search, val, selectedYear);
  };

  const handleYearChange = (val: string) => {
    setSelectedYear(val);
    updateFilters(search, selectedEvent, val);
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      await downloadRegistrationsCsv({
        q: search || undefined,
        event: selectedEvent !== 'all' ? selectedEvent : undefined,
        year: selectedYear !== 'all' ? selectedYear : undefined,
      });
      success('Registrations CSV exported successfully!', 'Export Completed');
    } catch (err) {
      toastError('Failed to export CSV file', 'Export Failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!regToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteRegistrationApi(regToDelete._id);
      if (res.success) {
        success(`Registration for ${regToDelete.name} deleted.`, 'Registration Removed');
        setRegistrations((prev) => prev.filter((r) => r._id !== regToDelete._id));
        setTotalCount((c) => c - 1);
        setRegToDelete(null);
      }
    } catch (err: any) {
      toastError('Failed to delete registration', 'Delete Error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Attendee Registrations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Total {totalCount} registered student{totalCount === 1 ? '' : 's'} across ABES club events.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={isExporting || registrations.length === 0}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/40"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Export to CSV ({totalCount})</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-secondary-950 p-4 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative md:col-span-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by attendee name, email, phone, or Ticket ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Filter by Event */}
        <div className="md:col-span-3">
          <select
            value={selectedEvent}
            onChange={(e) => handleEventChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Events ({eventsList.length})</option>
            {eventsList.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.name} ({ev.club})
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Year */}
        <div className="md:col-span-3">
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Academic Years</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="rounded-2xl bg-secondary-950/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Ticket ID</th>
                <th className="px-4 py-3.5">Attendee Info</th>
                <th className="px-4 py-3.5">College & Year</th>
                <th className="px-4 py-3.5">Registered Event</th>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-accent-400" />
                    <span>Loading registered attendees...</span>
                  </td>
                </tr>
              ) : registrations.length > 0 ? (
                registrations.map((reg) => {
                  const ev: any = reg.event || {};
                  return (
                    <tr
                      key={reg._id}
                      className="hover:bg-slate-900/60 transition-colors"
                    >
                      {/* Ticket ID */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-xs text-accent-400 bg-secondary-900 px-2 py-1 rounded border border-accent-500/30">
                          {reg.ticketId}
                        </span>
                      </td>

                      {/* Attendee Info */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-white text-sm">{reg.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{reg.email}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>+91 {reg.phone}</span>
                        </div>
                      </td>

                      {/* College & Year */}
                      <td className="px-4 py-4 max-w-[200px]">
                        <div className="font-semibold text-slate-200 truncate">{reg.collegeName}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-primary-950 text-rose-300 border border-primary-800">
                          {reg.year} Year
                        </span>
                      </td>

                      {/* Registered Event */}
                      <td className="px-4 py-4 max-w-[220px]">
                        <div className="font-bold text-white truncate">{ev.name || 'Event'}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300">
                            {ev.club || 'Club'}
                          </span>
                          <span>• {ev.category || 'General'}</span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-4 whitespace-nowrap text-slate-400 text-[11px]">
                        {new Date(reg.createdAt).toLocaleDateString()}{' '}
                        <span className="text-slate-500">
                          {new Date(reg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setRegToDelete(reg)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Remove registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No registrations found matching the specified filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!regToDelete}
        title="Remove Registration Pass"
        message={`Are you sure you want to cancel the registration ticket "${regToDelete?.ticketId}" for ${regToDelete?.name}?`}
        warningNote="This registration will be permanently removed."
        isDeleting={isDeleting}
        onClose={() => setRegToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
