import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShieldCheck,
  User,
  Building,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { loginAdminApi, registerAdminApi, loginWithGoogleApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Login Schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Sign Up Schema
const signupSchema = z.object({
  name: z.string().min(2, 'Full Name is required').max(100),
  email: z.string().email('Please enter a valid official email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export const AdminLogin: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // Login Form Hook
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Sign Up Form Hook
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // Handle OAuth redirect return in URL hash (#access_token=...) or query string (?google_auth=success)
  useEffect(() => {
    // 1. Query parameters from Server OAuth Callback
    const searchParams = new URLSearchParams(window.location.search);
    const googleAuthStatus = searchParams.get('google_auth');
    const queryToken = searchParams.get('token');
    const queryEmail = searchParams.get('email');
    const queryName = searchParams.get('name');
    const queryRole = searchParams.get('role');
    const queryError = searchParams.get('error');

    if (queryError) {
      setServerError('Google authorization was cancelled or encountered an issue. Please try again.');
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }

    if (queryToken || googleAuthStatus === 'success') {
      login(queryToken || 'google-jwt-token', {
        id: `admin-${Date.now()}`,
        email: queryEmail || 'coordinator@abes.ac.in',
        name: queryName || 'ABES Faculty Coordinator',
        role: (queryRole as any) || 'coordinator',
      });
      success(`Welcome, ${queryName || 'Coordinator'}! Signed in with Google.`, 'Google Sign-In');
      window.history.replaceState(null, '', window.location.pathname);
      navigate(from, { replace: true });
      return;
    }

    // 2. Hash parameters from Client Implicit Flow (#access_token=...)
    if (window.location.hash && window.location.hash.includes('access_token')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      if (accessToken) {
        setIsLoading(true);
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then(async (profile) => {
            const response = await loginWithGoogleApi({
              email: profile.email || 'coordinator@abes.ac.in',
              name: profile.name || 'ABES Faculty Coordinator',
              access_token: accessToken,
            });
            if (response.success && response.token) {
              login(response.token, response.admin);
              success(`Welcome, ${response.admin.name}! Signed in with Google.`, 'Google Sign-In');
              navigate(from, { replace: true });
            }
          })
          .catch((err) => {
            console.error('Failed to parse Google OAuth return token', err);
            setServerError('Google authentication error. Please try again.');
          })
          .finally(() => {
            setIsLoading(false);
            window.history.replaceState(null, '', window.location.pathname);
          });
      }
    }

    // 3. Initialize Google One Tap / ID Token credential if available
    const googleObj = (window as any).google;
    if (googleObj?.accounts?.id) {
      try {
        googleObj.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (credentialResponse: any) => {
            if (credentialResponse?.credential) {
              setIsLoading(true);
              try {
                const response = await loginWithGoogleApi({
                  credential: credentialResponse.credential,
                });
                if (response.success && response.token) {
                  login(response.token, response.admin);
                  success(`Welcome, ${response.admin.name}! Signed in with Google.`, 'Google Sign-In');
                  navigate(from, { replace: true });
                }
              } catch (err: any) {
                const msg = err.response?.data?.message || 'Google authentication failed';
                setServerError(msg);
              } finally {
                setIsLoading(false);
              }
            }
          },
        });
      } catch (e) {
        console.warn('GIS id init note:', e);
      }
    }
  }, [from, login, navigate, success]);

  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  // Launch Google OAuth 2.0 Authentication
  const handleGoogleLogin = () => {
    setServerError(null);
    setIsLoading(true);

    const googleObj = (window as any).google;

    // Method 1: Google Identity Services Token Client (Popup)
    if (googleObj?.accounts?.oauth2) {
      try {
        const tokenClient = googleObj.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              setIsLoading(false);
              if (tokenResponse.error === 'popup_closed_by_user') {
                return;
              }
              console.warn('GIS token error, falling back to server redirect:', tokenResponse);
              window.location.href = 'http://localhost:5000/api/auth/google';
              return;
            }

            try {
              let email = 'coordinator@abes.ac.in';
              let name = 'ABES Faculty Coordinator';

              if (tokenResponse.access_token) {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await userInfoRes.json();
                if (profile.email) email = profile.email;
                if (profile.name) name = profile.name;
              }

              const response = await loginWithGoogleApi({
                email,
                name,
                access_token: tokenResponse.access_token,
              });
              if (response.success && response.token) {
                login(response.token, response.admin);
                success(`Welcome, ${response.admin.name}! Signed in with Google.`, 'Google Authentication');
                navigate(from, { replace: true });
              }
            } catch (err: any) {
              const msg = err.response?.data?.message || 'Google authentication failed';
              setServerError(msg);
              toastError(msg, 'Login Error');
            } finally {
              setIsLoading(false);
            }
          },
          error_callback: (err: any) => {
            console.warn('GIS error callback, redirecting to server endpoint:', err);
            setIsLoading(false);
            window.location.href = 'http://localhost:5000/api/auth/google';
          },
        });
        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (e) {
        console.warn('GIS client failed, falling back to server redirect:', e);
      }
    }

    // Method 2: Standard Google OAuth 2.0 Backend Redirect
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  // Login Submit
  const onLoginSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await loginAdminApi(data);
      if (response.success && response.token) {
        login(response.token, response.admin);
        success(`Welcome back, ${response.admin.name}!`, 'Authentication Successful');
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setServerError(msg);
      toastError(msg, 'Login Failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up Submit
  const onSignupSubmit = async (data: SignupFormData) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await registerAdminApi(data);
      if (response.success && response.token) {
        login(response.token, response.admin);
        success(`Welcome, ${response.admin.name}! Coordinator account registered.`, 'Registration Successful');
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Email may already be in use.';
      setServerError(msg);
      toastError(msg, 'Sign Up Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#16212C] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Campus Photo Backdrop */}
      <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
        <img
          src="/assets/campus/cyberquest-auditorium.jpg"
          alt="ABES Campus Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16212C] via-[#16212C]/80 to-[#16212C]" />
      </div>

      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-saffron/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-primary-800/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md my-8">
        {/* Login / Sign Up Card */}
        <div className="bg-navy-950/95 backdrop-blur-md border border-white/15 rounded-[8px] p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 relative">
          
          {/* Back Arrow Button Inside Box */}
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="p-2 rounded-[4px] bg-white/10 hover:bg-white/20 border border-white/15 text-[#d7d0c5] hover:text-white transition-all inline-flex items-center gap-1.5 text-xs font-semibold"
              title="Return to ABES Event Nexus"
            >
              <ArrowLeft className="w-4 h-4 text-saffron" />
              <span>Back</span>
            </Link>

            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-saffron/20 text-saffron border border-saffron/30 font-semibold">
              Coordinator Portal
            </span>
          </div>

          <div className="text-center space-y-3 pt-1">
            <Link to="/" className="inline-block group">
              <img
                src="/assets/abes-logo.png"
                alt="ABES Event Nexus"
                className="h-14 w-auto mx-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
            </Link>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight">
                ABES <span className="text-saffron">Event Nexus</span>
              </h1>
              <p className="font-mono text-xs text-saffron uppercase tracking-widest font-semibold mt-0.5">
                Faculty & Society Management
              </p>
            </div>
          </div>

          {/* Toggle Tabs: Sign In / Sign Up */}
          <div className="grid grid-cols-2 border-b border-white/15 bg-black/30 rounded-[4px] p-1 gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setServerError(null);
              }}
              className={`py-2 text-xs font-display font-bold uppercase tracking-wider rounded-[3px] transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-saffron text-white shadow-sm'
                  : 'text-[#a99f92] hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setServerError(null);
              }}
              className={`py-2 text-xs font-display font-bold uppercase tracking-wider rounded-[3px] transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'signup'
                  ? 'bg-saffron text-white shadow-sm'
                  : 'text-[#a99f92] hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          {serverError && (
            <div className="p-3.5 rounded-[4px] bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="font-medium">{serverError}</div>
            </div>
          )}

          {/* 1. SIGN IN MODE */}
          {authMode === 'login' ? (
            <div className="space-y-4">
              {/* Google OAuth Button for Coordinators */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-[4px] bg-white hover:bg-slate-100 text-slate-800 font-display font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-3 border border-slate-200 hover:border-slate-300 disabled:opacity-50 active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Workspace</span>
              </button>

              <div className="flex items-center my-3 gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] font-mono text-[#a99f92] uppercase tracking-wider">or sign in with email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block font-display text-xs font-semibold text-[#d7d0c5]">
                    Coordinator Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a99f92]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      {...registerLogin('email')}
                      placeholder="admin@abes.ac.in"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-[4px] bg-black/40 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-saffron transition-colors"
                    />
                  </div>
                  {loginErrors.email && <p className="text-xs text-rose-400">{loginErrors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block font-display text-xs font-semibold text-[#d7d0c5]">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a99f92]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      {...registerLogin('password')}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-[4px] bg-black/40 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-saffron transition-colors"
                    />
                  </div>
                  {loginErrors.password && <p className="text-xs text-rose-400">{loginErrors.password.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-[4px] bg-saffron hover:bg-saffron-hover text-white font-display font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <span className="text-xs text-[#a99f92]">
                  New club coordinator?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setServerError(null);
                    }}
                    className="text-saffron hover:underline font-semibold"
                  >
                    Register here
                  </button>
                </span>
              </div>
            </div>
          ) : (
            /* 2. SIGN UP MODE FOR COORDINATORS */
            <form onSubmit={handleSubmitSignup(onSignupSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-display text-xs font-semibold text-[#d7d0c5]">
                  Coordinator Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a99f92]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    {...registerSignup('name')}
                    placeholder="e.g. Dr. Pankaj Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-[4px] bg-black/40 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-saffron transition-colors"
                  />
                </div>
                {signupErrors.name && <p className="text-xs text-rose-400">{signupErrors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block font-display text-xs font-semibold text-[#d7d0c5]">
                  Email <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a99f92]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    {...registerSignup('email')}
                    placeholder="coordinator@abes.ac.in"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-[4px] bg-black/40 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-saffron transition-colors"
                  />
                </div>
                {signupErrors.email && <p className="text-xs text-rose-400">{signupErrors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block font-display text-xs font-semibold text-[#d7d0c5]">
                  Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a99f92]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    {...registerSignup('password')}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-[4px] bg-black/40 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-saffron transition-colors"
                  />
                </div>
                {signupErrors.password && (
                  <p className="text-xs text-rose-400">{signupErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-[4px] bg-saffron hover:bg-saffron-hover text-white font-display font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Registering Coordinator...</span>
                  </>
                ) : (
                  <>
                    <span>Create Coordinator Account →</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-[#a99f92]">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setServerError(null);
                    }}
                    className="text-saffron hover:underline font-semibold"
                  >
                    Sign In here
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
