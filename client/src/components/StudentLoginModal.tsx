import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  User,
  Hash,
  BookOpen,
  Phone,
  Lock,
  ArrowRight,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { IStudent } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NexusCard } from './NexusCard';

// Schema for Sign Up
const signupSchema = z.object({
  name: z.string().min(2, 'Full Name is required').max(100),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  rollNumber: z.string().min(4, 'Roll / Admission number is required').max(30),
  collegeName: z.string().min(2, 'College name is required').max(150),
  branch: z.string().min(2, 'Branch / Department is required'),
  year: z.enum(['1st', '2nd', '3rd', '4th'] as const),
  phone: z.string().min(10, 'Please enter a valid 10-digit mobile number').max(15),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

// Schema for Login (Only Email & Password)
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenActivity?: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({ isOpen, onClose, onOpenActivity }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginError, setLoginError] = useState<string | null>(null);

  const { student, isStudentAuthenticated, studentLogin, studentLogout } = useAuth();
  const { success, info } = useToast();

  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Sign Up Form
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    reset: resetSignup,
    formState: { errors: signupErrors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      rollNumber: '',
      collegeName: 'ABES Engineering College, Ghaziabad',
      branch: 'Computer Science & Engineering',
      year: '2nd',
      phone: '',
      password: '',
    },
  });

  if (!isOpen) return null;

  // Helper to get registered students database from localStorage
  const getRegisteredStudents = (): Array<IStudent & { password?: string }> => {
    try {
      const data = localStorage.getItem('abes_registered_students');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  // Helper to save student to database
  const saveStudentToDb = (newStudent: IStudent & { password?: string }) => {
    const existing = getRegisteredStudents();
    const updated = [newStudent, ...existing.filter((s) => s.email !== newStudent.email)];
    localStorage.setItem('abes_registered_students', JSON.stringify(updated));
  };

  // Handle Login Submit (Only Email and Password)
  const onLoginSubmit = (data: LoginFormData) => {
    setLoginError(null);
    const registered = getRegisteredStudents();
    const found = registered.find((s) => s.email.toLowerCase() === data.email.toLowerCase());

    if (found) {
      if (found.password && found.password !== data.password) {
        setLoginError('Invalid password. Please try again.');
        return;
      }
      const studentProfile: IStudent = {
        name: found.name,
        email: found.email,
        collegeName: found.collegeName,
        rollNumber: found.rollNumber,
        branch: found.branch,
        year: found.year,
        phone: found.phone,
      };
      studentLogin(studentProfile);
      success(`Welcome back, ${found.name}!`, 'Login Successful');
      onClose();
      return;
    }

    // Default sample student match
    if (data.email.toLowerCase() === 'student@abes.ac.in') {
      const defaultStudent: IStudent = {
        name: 'Aryan Sharma',
        email: 'student@abes.ac.in',
        collegeName: 'ABES Engineering College, Ghaziabad',
        rollNumber: '2300320100045',
        branch: 'Computer Science & Engineering',
        year: '3rd',
        phone: '9876543210',
      };
      saveStudentToDb({ ...defaultStudent, password: data.password });
      studentLogin(defaultStudent);
      success('Welcome back, Aryan Sharma!', 'Login Successful');
      onClose();
      return;
    }

    // New student first-time login fallback with provided email
    const newStudentProfile: IStudent = {
      name: data.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: data.email,
      collegeName: 'ABES Engineering College, Ghaziabad',
      rollNumber: `23003201${Math.floor(1000 + Math.random() * 9000)}`,
      branch: 'Computer Science & Engineering',
      year: '3rd',
      phone: '9876543210',
    };
    saveStudentToDb({ ...newStudentProfile, password: data.password });
    studentLogin(newStudentProfile);
    success(`Welcome, ${newStudentProfile.name}!`, 'Login Successful');
    onClose();
  };

  // Handle Sign Up Submit
  const onSignupSubmit = (data: SignupFormData) => {
    const studentProfile: IStudent = {
      name: data.name,
      email: data.email,
      collegeName: data.collegeName,
      rollNumber: data.rollNumber,
      branch: data.branch,
      year: data.year,
      phone: data.phone,
    };

    saveStudentToDb({ ...studentProfile, password: data.password });
    studentLogin(studentProfile);
    success(`Welcome, ${data.name}! Account created and signed in.`, 'Registration Successful');
    onClose();
  };

  const handleLogout = () => {
    studentLogout();
    resetLogin();
    resetSignup();
    info('You have logged out of your account.', 'Signed Out');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`relative w-full ${isStudentAuthenticated ? 'max-w-lg' : 'max-w-md'} bg-navy-950 dark:bg-[#16212C] rounded-[6px] shadow-2xl overflow-hidden border border-white/15 text-white my-6`}>
        {/* Header */}
        <div className="p-5 bg-navy border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[4px] bg-saffron text-white shadow-sm">
              {isStudentAuthenticated ? (
                <Sparkles className="w-5 h-5" />
              ) : authMode === 'signup' ? (
                <UserPlus className="w-5 h-5" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white leading-tight">
                {isStudentAuthenticated
                  ? 'Your Official Nexus Card'
                  : authMode === 'signup'
                  ? 'Create Student Account'
                  : 'Student Login'}
              </h3>
              <p className="text-xs text-[#a99f92] mt-0.5 font-mono">
                {isStudentAuthenticated
                  ? 'ABES Autonomous · Verified Student Pass'
                  : 'Access 1-Click Event Registrations'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[3px] border border-white/15 hover:bg-white/10 text-[#d7d0c5] hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If Student is Already Logged In: SHOW NEXUS CARD */}
        {isStudentAuthenticated && student ? (
          <div className="p-5 sm:p-6 space-y-5">
            <NexusCard student={student} />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-[3px] bg-white/5 hover:bg-rose-950/50 text-[#d7d0c5] hover:text-rose-300 font-display text-xs font-semibold border border-white/15 hover:border-rose-800 flex items-center justify-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenActivity) onOpenActivity();
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-[3px] bg-saffron/15 hover:bg-saffron/25 text-saffron border border-saffron/40 font-display text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>My Activity</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-[3px] bg-saffron hover:bg-saffron-hover text-white font-display text-xs font-semibold shadow-sm transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Tabs for Login / Sign Up */}
            <div className="grid grid-cols-2 border-b border-white/10 bg-navy/50">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setLoginError(null);
                }}
                className={`py-3 text-xs font-display font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  authMode === 'login'
                    ? 'border-saffron text-saffron bg-white/5'
                    : 'border-transparent text-[#a99f92] hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setLoginError(null);
                }}
                className={`py-3 text-xs font-display font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  authMode === 'signup'
                    ? 'border-saffron text-saffron bg-white/5'
                    : 'border-transparent text-[#a99f92] hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* 1. LOGIN FORM: ONLY EMAIL AND PASSWORD */}
            {authMode === 'login' ? (
              <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="p-6 space-y-4">
                {loginError && (
                  <div className="p-3 rounded-[3px] bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#d7d0c5]">
                    Email <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a99f92]" />
                    <input
                      type="email"
                      {...registerLogin('email')}
                      placeholder="student@abes.ac.in"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-[3px] border border-white/15 bg-black/30 text-sm text-white placeholder:text-[#a99f92] focus:outline-none focus:border-saffron"
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-xs text-rose-400">{loginErrors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#d7d0c5]">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a99f92]" />
                    <input
                      type="password"
                      {...registerLogin('password')}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-[3px] border border-white/15 bg-black/30 text-sm text-white placeholder:text-[#a99f92] focus:outline-none focus:border-saffron"
                    />
                  </div>
                  {loginErrors.password && (
                    <p className="text-xs text-rose-400">{loginErrors.password.message}</p>
                  )}
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-[3px] bg-saffron hover:bg-saffron-hover text-white font-display font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>Login →</span>
                  </button>

                  <div className="text-center pt-1">
                    <span className="text-xs text-[#a99f92]">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className="text-saffron hover:underline font-semibold"
                      >
                        Sign Up here
                      </button>
                    </span>
                  </div>
                </div>
              </form>
            ) : (
              /* 2. SIGN UP FORM: ALL REQUESTED FIELDS + PASSWORD */
              <form onSubmit={handleSubmitSignup(onSignupSubmit)} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#d7d0c5]">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a99f92]" />
                    <input
                      type="text"
                      {...registerSignup('name')}
                      placeholder="e.g. Akshat Vats"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-[3px] border border-white/15 bg-black/30 text-sm text-white placeholder:text-[#a99f92] focus:outline-none focus:border-saffron"
                    />
                  </div>
                  {signupErrors.name && (
                    <p className="text-xs text-rose-400">{signupErrors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#d7d0c5]">
                      Email <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a99f92]" />
                      <input
                        type="email"
                        {...registerSignup('email')}
                        placeholder="student@abes.ac.in"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-[3px] border border-white/15 bg-black/30 text-sm text-white placeholder:text-[#a99f92] focus:outline-none focus:border-saffron"
                      />
                    </div>
                    {signupErrors.email && (
                      <p className="text-xs text-rose-400">{signupErrors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#d7d0c5]">
                      Roll / Admission No. <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a99f92]" />
                      <input
                        type="text"
                        {...registerSignup('rollNumber')}
                        placeholder="2503201000145"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-[3px] border border-white/15 bg-black/30 text-sm text-white placeholder:text-[#a99f92] focus:outline-none focus:border-saffron"
                      />
                    </div>
                    {signupErrors.rollNumber && (
                      <p className="text-xs text-rose-400">{signupErrors.rollNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#d7d0c5]">
                    College / University <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...registerSignup('collegeName')}
                    placeholder="ABES Engineering College, Ghaziabad"
                    className="w-full px-3.5 py-2.5 rounded-[3px] border border-white/15 bg-black/30 text-sm text-white placeholder:text-[#a99f92] focus:outline-none focus:border-saffron"
                  />
                  {signupErrors.collegeName && (
                    <p className="text-xs text-rose-400">{signupErrors.collegeName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#d7d0c5]">
                      Branch / Department <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      {...registerSignup('branch')}
                      placeholder="Computer Science & Engineering"
                      className="w-full px-3.5 py-2.5 rounded-[3px] border border-white/15 bg-black/30 text-sm text-white placeholder:text-[#a99f92] focus:outline-none focus:border-saffron"
                    />
                    {signupErrors.branch && (
                      <p className="text-xs text-rose-400">{signupErrors.branch.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#d7d0c5]">
                      Year <span className="text-rose-400">*</span>
                    </label>
                    <select
                      {...registerSignup('year')}
                      className="w-full px-3 py-2.5 rounded-[3px] border border-white/15 bg-navy text-sm text-white focus:outline-none focus:border-saffron"
                    >
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                    </select>
                    {signupErrors.year && (
                      <p className="text-xs text-rose-400">{signupErrors.year.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#d7d0c5]">
                      Mobile WhatsApp Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a99f92]" />
                      <input
                        type="tel"
                        {...registerSignup('phone')}
                        placeholder="7505475455"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-[3px] border border-white/15 bg-black/30 text-sm text-white placeholder:text-[#a99f92] focus:outline-none focus:border-saffron"
                      />
                    </div>
                    {signupErrors.phone && (
                      <p className="text-xs text-rose-400">{signupErrors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#d7d0c5]">
                      Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a99f92]" />
                      <input
                        type="password"
                        {...registerSignup('password')}
                        placeholder="Min 6 characters"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-[3px] border border-white/15 bg-black/30 text-sm text-white placeholder:text-[#a99f92] focus:outline-none focus:border-saffron"
                      />
                    </div>
                    {signupErrors.password && (
                      <p className="text-xs text-rose-400">{signupErrors.password.message}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-[3px] bg-saffron hover:bg-saffron-hover text-white font-display font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>Create Account & Sign In →</span>
                  </button>

                  <div className="text-center pt-1">
                    <span className="text-xs text-[#a99f92]">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-saffron hover:underline font-semibold"
                      >
                        Sign In here
                      </button>
                    </span>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
