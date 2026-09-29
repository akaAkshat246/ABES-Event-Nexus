import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, MapPin, Tag, Users, Image as ImageIcon, Sparkles, Loader2, Plus, Edit } from 'lucide-react';
import { IEvent, EventCategory } from '../types';
import { createEventApi, updateEventApi } from '../api/events';
import { useToast } from '../context/ToastContext';

const eventFormSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters').max(150),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date and time is required'),
  venue: z.string().min(2, 'Venue is required').max(120),
  category: z.enum(['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Other']),
  club: z.string().min(2, 'Club name is required').max(100),
  posterUrl: z.string().optional().or(z.literal('')),
  capacity: z.coerce.number().positive().nullable().optional(),
  featured: z.boolean().default(false),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormModalProps {
  isOpen: boolean;
  eventToEdit: IEvent | null;
  onClose: () => void;
  onSuccess: (savedEvent: IEvent) => void;
}

const CLUBS = [
  'GFG',
  'Codechef',
  'GDG',
  'IEEE',
  'Drone and Robotics',
  'Arcade-AR/VR',
  'Agora',
  'ACM',
  'ACES',
  'En Passant',
  'Salah',
  'Creative and Tourism',
  'Kalakriti',
  'NSS',
  'Picturesque',
  'Minerva',
  'SYC & Yoga Club',
  'Samvad',
  'E-Cell',
  'Other',
];

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  eventToEdit,
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterPreview, setPosterPreview] = useState('');
  const { success, error: toastError } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      description: '',
      date: '',
      venue: '',
      category: 'Technical',
      club: 'TechFest',
      posterUrl: '',
      capacity: null,
      featured: false,
    },
  });

  const watchedPoster = watch('posterUrl');

  useEffect(() => {
    if (watchedPoster) {
      setPosterPreview(watchedPoster);
    } else {
      setPosterPreview('');
    }
  }, [watchedPoster]);

  useEffect(() => {
    if (eventToEdit) {
      // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
      const d = new Date(eventToEdit.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

      reset({
        name: eventToEdit.name,
        description: eventToEdit.description,
        date: formattedDate,
        venue: eventToEdit.venue,
        category: eventToEdit.category,
        club: eventToEdit.club,
        posterUrl: eventToEdit.posterUrl || '',
        capacity: eventToEdit.capacity || null,
        featured: eventToEdit.featured || false,
      });
      setPosterPreview(eventToEdit.posterUrl || '');
    } else {
      reset({
        name: '',
        description: '',
        date: '',
        venue: '',
        category: 'Technical',
        club: 'TechFest',
        posterUrl: '',
        capacity: null,
        featured: false,
      });
      setPosterPreview('');
    }
  }, [eventToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      if (eventToEdit) {
        const response = await updateEventApi(eventToEdit._id, data);
        if (response.success) {
          success(`Event "${data.name}" updated successfully!`, 'Event Updated');
          onSuccess(response.data);
          onClose();
        }
      } else {
        const response = await createEventApi(data);
        if (response.success) {
          success(`Event "${data.name}" created successfully!`, 'Event Created');
          onSuccess(response.data);
          onClose();
        }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to save event. Please check all fields.';
      toastError(message, 'Save Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 my-8 transition-colors">
        {/* Modal Header */}
        <div className="p-6 bg-slate-100 dark:bg-secondary-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-saffron text-white shadow-sm">
              {eventToEdit ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {eventToEdit ? 'Edit Event' : 'Create New Event'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {eventToEdit ? 'Update event details and capacity' : 'Publish an upcoming college club event'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Event Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. TEDxABESEC: Catalyst of Tomorrow"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
            />
            {errors.name && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Event Description & Agenda <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Detailed description of the event, eligibility, agenda, and guest speakers..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
            />
            {errors.description && (
              <p className="text-xs text-rose-500 dark:text-rose-400">{errors.description.message}</p>
            )}
          </div>

          {/* Category & Organizing Club Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('category')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
              >
                <option value="Technical" className="dark:bg-slate-900 dark:text-white">Technical</option>
                <option value="Cultural" className="dark:bg-slate-900 dark:text-white">Cultural</option>
                <option value="Sports" className="dark:bg-slate-900 dark:text-white">Sports</option>
                <option value="Workshop" className="dark:bg-slate-900 dark:text-white">Workshop</option>
                <option value="Seminar" className="dark:bg-slate-900 dark:text-white">Seminar</option>
                <option value="Hackathon" className="dark:bg-slate-900 dark:text-white">Hackathon</option>
                <option value="Other" className="dark:bg-slate-900 dark:text-white">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Organizing Club <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                list="clubs-list"
                {...register('club')}
                placeholder="e.g. TEDx ABES, Genero, TechFest"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
              />
              <datalist id="clubs-list">
                {CLUBS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Campus Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Date & Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                {...register('date')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
              />
              {errors.date && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.date.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Campus Venue <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register('venue')}
                placeholder="e.g. Main Auditorium, CCF Lab 3"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
              />
              {errors.venue && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.venue.message}</p>}
            </div>
          </div>

          {/* Capacity & Featured Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Max Capacity (Optional)
              </label>
              <input
                type="number"
                {...register('capacity')}
                placeholder="Leave blank for unlimited"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Total available seats/tickets</p>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="w-4 h-4 rounded text-saffron bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-saffron"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-saffron" />
                  Spotlight as Featured Event
                </span>
              </label>
            </div>
          </div>

          {/* Event Banner Upload & URL Selection */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Event Banner / Poster
              </label>
              {posterPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setValue('posterUrl', '');
                    setPosterPreview('');
                  }}
                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
                >
                  Remove Banner
                </button>
              )}
            </div>

            {/* File Upload Dropzone */}
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-saffron dark:hover:border-saffron rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white dark:bg-slate-900/50 group">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        toastError('Image file must be under 5MB', 'File Too Large');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => {
                        const result = reader.result as string;
                        setValue('posterUrl', result);
                        setPosterPreview(result);
                        success('Banner uploaded successfully!', 'Image Ready');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <ImageIcon className="w-7 h-7 text-saffron mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 dark:text-white">
                  Click to Upload Banner
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  PNG, JPG, WEBP up to 5MB
                </span>
              </label>

              {/* Direct URL Input */}
              <div className="flex-1 space-y-2">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                  Or paste direct image URL
                </span>
                <input
                  type="url"
                  {...register('posterUrl')}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-saffron"
                />

                {/* Campus Presets */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                    Campus Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Auditorium', url: '/assets/campus/cyberquest-auditorium.jpg' },
                      { name: 'Presentation', url: '/assets/campus/audi-presentation.jpg' },
                      { name: 'Hack Lab', url: '/assets/campus/hackathon-team-working.jpg' },
                      { name: 'Tech Session', url: '/assets/campus/club-lab-session.jpg' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setValue('posterUrl', preset.url);
                          setPosterPreview(preset.url);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 hover:bg-saffron hover:text-white text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Banner Preview */}
            {posterPreview && (
              <div className="relative h-40 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 mt-2 shadow-sm">
                <img
                  src={posterPreview}
                  alt="Poster preview"
                  className="w-full h-full object-cover"
                  onError={() => setPosterPreview('')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-white border border-white/20">
                  Banner Preview
                </span>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-saffron hover:bg-saffron-hover text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Saving Event...</span>
                </>
              ) : (
                <span>{eventToEdit ? 'Save Changes' : 'Create Event'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

