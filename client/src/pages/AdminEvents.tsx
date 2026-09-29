import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Users,
  Eye,
  Sparkles,
  MapPin,
  Tag,
  Clock,
  Loader2,
  Calendar,
  Download,
} from 'lucide-react';
import { IEvent } from '../types';
import { fetchEvents, deleteEventApi } from '../api/events';
import { downloadRegistrationsCsv } from '../api/registrations';
import { EventFormModal } from '../components/EventFormModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useToast } from '../context/ToastContext';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState<IEvent | null>(null);

  const [eventToDelete, setEventToDelete] = useState<IEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetchEvents({
        q: search,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        limit: 100,
      });
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [search, categoryFilter]);

  const handleExportEventsCsv = () => {
    if (events.length === 0) return;
    try {
      const headers = ['Event Name', 'Club', 'Category', 'Date & Time', 'Venue', 'Capacity', 'Registered Attendees', 'Featured'];
      const rows = events.map((e) => [
        `"${e.name.replace(/"/g, '""')}"`,
        `"${e.club.replace(/"/g, '""')}"`,
        `"${e.category}"`,
        `"${new Date(e.date).toLocaleString('en-US')}"`,
        `"${e.venue.replace(/"/g, '""')}"`,
        e.capacity || 'Unlimited',
        e.registeredCount || 0,
        e.featured ? 'Yes' : 'No',
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `abes_events_catalog_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      success('Events directory exported to CSV!', 'Export Successful');
    } catch (err) {
      toastError('Failed to export events CSV', 'Export Error');
    }
  };

  const handleExportEventAttendees = async (eventId: string, eventName: string) => {
    try {
      await downloadRegistrationsCsv({ event: eventId });
      success(`Exported attendees CSV for "${eventName}"!`, 'CSV Exported');
    } catch (err) {
      toastError('Failed to export event attendees', 'Export Failed');
    }
  };

  const handleEditClick = (event: IEvent) => {
    setSelectedEventToEdit(event);
    setIsFormModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedEventToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteEventApi(eventToDelete._id);
      if (res.success) {
        success(`Event "${eventToDelete.name}" and related registrations deleted.`, 'Event Deleted');
        setEvents((prev) => prev.filter((e) => e._id !== eventToDelete._id));
        setEventToDelete(null);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete event';
      toastError(msg, 'Delete Failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Manage College Events
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, view registrations, and export event data across ABES campus.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportEventsCsv}
            disabled={events.length === 0}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-2 border border-emerald-600/40 transition-all shrink-0 disabled:opacity-50"
            title="Download CSV catalog of all events"
          >
            <Download className="w-4 h-4" />
            <span>Export Events (.CSV)</span>
          </button>

          <button
            onClick={handleAddClick}
            className="px-4 py-2.5 rounded-xl bg-primary-800 hover:bg-primary-700 text-white text-xs font-bold shadow-lg shadow-primary-950/50 flex items-center gap-2 border border-primary-600/40 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-secondary-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by name, club, or venue..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-2xl bg-secondary-950/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Event Name</th>
                <th className="px-4 py-3.5">Club / Society</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5">Venue</th>
                <th className="px-4 py-3.5">Registrations</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-accent-400" />
                    <span>Loading events catalog...</span>
                  </td>
                </tr>
              ) : events.length > 0 ? (
                events.map((event) => {
                  const evDate = new Date(event.date);
                  const isPast = evDate < new Date();
                  const registered = event.registeredCount || 0;

                  return (
                    <tr
                      key={event._id}
                      className="hover:bg-slate-900/60 transition-colors group"
                    >
                      {/* Name & Featured Tag */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-white group-hover:text-accent-300 transition-colors text-sm">
                          {event.name}
                        </div>
                        {event.featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-400 mt-0.5">
                            <Sparkles className="w-3 h-3 fill-current" />
                            Featured
                          </span>
                        )}
                      </td>

                      {/* Club */}
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-950 text-rose-300 border border-primary-800/80">
                          {event.club}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span className="text-slate-300 font-medium">{event.category}</span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-semibold text-white">
                          {evDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {evDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </div>
                      </td>

                      {/* Venue */}
                      <td className="px-4 py-4 max-w-[180px] truncate text-slate-300">
                        {event.venue}
                      </td>

                      {/* Registrations */}
                      <td className="px-4 py-4">
                        <Link
                          to={`/admin/registrations?event=${event._id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-bold text-xs border border-slate-700 transition-colors"
                          title="Click to view registrations for this event"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{registered}</span>
                          {event.capacity ? (
                            <span className="text-slate-500 font-normal">/ {event.capacity}</span>
                          ) : null}
                        </Link>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Export Attendee CSV */}
                          <button
                            onClick={() => handleExportEventAttendees(event._id, event.name)}
                            disabled={registered === 0}
                            className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-800/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={`Export ${registered} registered attendee(s) to CSV`}
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* Live preview */}
                          <Link
                            to={`/events/${event._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Preview on Student Portal"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Edit */}
                          <button
                            onClick={() => handleEditClick(event)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-primary-900 text-slate-300 hover:text-white transition-colors"
                            title="Edit Event"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setEventToDelete(event)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No events found matching current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <EventFormModal
        isOpen={isFormModalOpen}
        eventToEdit={selectedEventToEdit}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedEventToEdit(null);
        }}
        onSuccess={() => {
          loadEvents();
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!eventToDelete}
        title="Delete Event Confirmation"
        message={`Are you sure you want to permanently delete "${eventToDelete?.name}"?`}
        warningNote="This will also cascade-delete all attendee registrations registered for this event."
        isDeleting={isDeleting}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
