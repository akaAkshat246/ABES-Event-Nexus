import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Mail,
  Building2,
  GraduationCap,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Ticket,
  UserCheck,
} from 'lucide-react';
import { IEvent, RegistrationConfirmation } from '../types';
import { registerEventApi } from '../api/registrations';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const registrationFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  collegeName: z
    .string()
    .min(2, 'College name must be at least 2 characters')
    .max(150, 'College name cannot exceed 150 characters'),
  year: z.enum(['1st', '2nd', '3rd', '4th'], {
    errorMap: () => ({ message: 'Please select your academic year' }),
  }),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number (e.g. 9810123456)'),
});

type RegistrationFormData = z.infer<typeof registrationFormSchema>;

interface RegistrationFormProps {
  event: IEvent;
  onSuccess?: (confirmation: RegistrationConfirmation) => void;
  onCancel?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  event,
  onSuccess,
  onCancel,
}) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: toastError } = useToast();
  const { student, isStudentAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      name: student?.name || '',
      email: student?.email || '',
      collegeName: student?.collegeName || 'ABES Engineering College, Ghaziabad',
      year: student?.year || '1st',
      phone: student?.phone || '',
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        name: student.name || '',
        email: student.email || '',
        collegeName: student.collegeName || 'ABES Engineering College, Ghaziabad',
        year: student.year || '1st',
        phone: student.phone || '',
      });
    }
  }, [student, reset]);

  const onSubmit = async (data: RegistrationFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await registerEventApi(event._id, data);
      if (response.success && response.data) {
        // Save to student's local activities storage for instant My Activity synchronization
        try {
          const emailKey = `abes_activities_${data.email.toLowerCase()}`;
          const existing = JSON.parse(localStorage.getItem(emailKey) || '[]');
          const newActivity = {
            _id: response.data.registrationId,
            ticketId: response.data.ticketId,
            name: response.data.name,
            email: response.data.email,
            collegeName: response.data.collegeName,
            year: response.data.year,
            phone: response.data.phone,
            event: event,
            createdAt: response.data.registeredAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const updated = [newActivity, ...existing.filter((a: any) => a.ticketId !== response.data.ticketId)];
          localStorage.setItem(emailKey, JSON.stringify(updated));
        } catch (storageErr) {
          console.warn('Could not save to local activities:', storageErr);
        }

        success(`Registration confirmed! Ticket: ${response.data.ticketId}`, 'Registered Successfully');
        reset();
        if (onSuccess) {
          onSuccess(response.data);
        }
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'An error occurred while registering for this event. Please try again.';
      setServerError(errorMessage);
      toastError(errorMessage, 'Registration Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Event Header Summary */}
      <div className="p-3.5 rounded-2xl bg-secondary-900 dark:bg-[#0f1620] text-white flex items-center justify-between border border-secondary-800 dark:border-[#223040]">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-saffron uppercase tracking-wider">
            Registering For
          </span>
          <h4 className="font-display font-bold text-sm line-clamp-1 text-white">
            {event.name}
          </h4>
          <p className="text-[11px] text-slate-300 dark:text-slate-400">
            {new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}{' '}
            • {event.venue}
          </p>
        </div>
        <div className="shrink-0 pl-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary-800 text-white border border-primary-600/40">
            {event.club}
          </span>
        </div>
      </div>

      {/* Student Profile Quick Auto-Fill Indicator */}
      {isStudentAuthenticated && student && (
        <div className="p-2.5 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold truncate">
              Auto-filled as {student.name} ({student.rollNumber})
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
            Fast Pass
          </span>
        </div>
      )}

      {/* Server Error Alert */}
      {serverError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{serverError}</div>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-700 dark:text-[#cbd5e1]">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            {...register('name')}
            placeholder="e.g. Aarav Sharma"
            className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.name
                ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950/40 bg-rose-50/20 dark:bg-rose-950/20'
                : 'border-slate-200 dark:border-[#2b3b4f] focus:border-saffron focus:ring-saffron/20 bg-slate-50/50 dark:bg-[#16212C] hover:bg-white dark:hover:bg-[#0f1620] focus:bg-white dark:focus:bg-[#0f1620]'
            }`}
          />
        </div>
        {errors.name && (
          <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{errors.name.message}</p>
        )}
      </div>

      {/* Email Address */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-700 dark:text-[#cbd5e1]">
          Email Address <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            {...register('email')}
            placeholder="e.g. yourname@abes.ac.in"
            className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950/40 bg-rose-50/20 dark:bg-rose-950/20'
                : 'border-slate-200 dark:border-[#2b3b4f] focus:border-saffron focus:ring-saffron/20 bg-slate-50/50 dark:bg-[#16212C] hover:bg-white dark:hover:bg-[#0f1620] focus:bg-white dark:focus:bg-[#0f1620]'
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{errors.email.message}</p>
        )}
        <p className="text-[10px] text-slate-400 dark:text-slate-500">Only 1 registration permitted per email address for this event.</p>
      </div>

      {/* College Name & Academic Year Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* College Name */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 dark:text-[#cbd5e1]">
            College Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              {...register('collegeName')}
              placeholder="ABES Engineering College"
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.collegeName
                  ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950/40 bg-rose-50/20 dark:bg-rose-950/20'
                  : 'border-slate-200 dark:border-[#2b3b4f] focus:border-saffron focus:ring-saffron/20 bg-slate-50/50 dark:bg-[#16212C] hover:bg-white dark:hover:bg-[#0f1620] focus:bg-white dark:focus:bg-[#0f1620]'
              }`}
            />
          </div>
          {errors.collegeName && (
            <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
              {errors.collegeName.message}
            </p>
          )}
        </div>

        {/* Academic Year */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 dark:text-[#cbd5e1]">
            Academic Year <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <GraduationCap className="w-4 h-4" />
            </div>
            <select
              {...register('year')}
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all appearance-none bg-slate-50/50 dark:bg-[#16212C] hover:bg-white dark:hover:bg-[#0f1620] focus:bg-white dark:focus:bg-[#0f1620] ${
                errors.year
                  ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950/40'
                  : 'border-slate-200 dark:border-[#2b3b4f] focus:border-saffron focus:ring-saffron/20'
              }`}
            >
              <option value="1st" className="dark:bg-[#16212C] dark:text-white">1st Year (Freshman)</option>
              <option value="2nd" className="dark:bg-[#16212C] dark:text-white">2nd Year (Sophomore)</option>
              <option value="3rd" className="dark:bg-[#16212C] dark:text-white">3rd Year (Pre-Final)</option>
              <option value="4th" className="dark:bg-[#16212C] dark:text-white">4th Year (Final)</option>
            </select>
          </div>
          {errors.year && (
            <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{errors.year.message}</p>
          )}
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-700 dark:text-[#cbd5e1]">
          Phone Number <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Phone className="w-4 h-4" />
          </div>
          <span className="absolute inset-y-0 left-9 flex items-center text-xs font-semibold text-slate-400 dark:text-slate-500">
            +91
          </span>
          <input
            type="tel"
            maxLength={10}
            {...register('phone')}
            placeholder="9876543210"
            className={`w-full pl-16 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.phone
                ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950/40 bg-rose-50/20 dark:bg-rose-950/20'
                : 'border-slate-200 dark:border-[#2b3b4f] focus:border-saffron focus:ring-saffron/20 bg-slate-50/50 dark:bg-[#16212C] hover:bg-white dark:hover:bg-[#0f1620] focus:bg-white dark:focus:bg-[#0f1620]'
            }`}
          />
        </div>
        {errors.phone && (
          <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{errors.phone.message}</p>
        )}
      </div>

      {/* Submit Button & Cancel */}
      <div className="pt-2 flex items-center gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-[#2b3b4f] hover:bg-slate-50 dark:hover:bg-[#16212C] text-slate-700 dark:text-[#cbd5e1] text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 px-5 rounded-xl bg-saffron hover:bg-saffron-hover text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Processing Registration...</span>
            </>
          ) : (
            <>
              <Ticket className="w-4 h-4 text-white" />
              <span>Confirm Registration</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

