import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';

// Pages
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { ClubDetail } from './pages/ClubDetail';
import { ClubsPage } from './pages/ClubsPage';
import { BuildAndWin } from './pages/BuildAndWin';
import { FaqPage } from './pages/FaqPage';
import { MyActivityPage } from './pages/MyActivityPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminEvents } from './pages/AdminEvents';
import { AdminRegistrations } from './pages/AdminRegistrations';

import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

// Global OAuth return listener for implicit & server redirect callbacks
const GlobalOAuthListener: React.FC = () => {
  const { studentLogin, login } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    // 1. Process URL Hash (#access_token=...)
    if (window.location.hash && window.location.hash.includes('access_token')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      if (accessToken) {
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then((profile) => {
            if (profile.email) {
              studentLogin({
                name: profile.name || 'ABES Student',
                email: profile.email,
                collegeName: 'ABES Engineering College, Ghaziabad',
                rollNumber: `23003201${Math.floor(1000 + Math.random() * 9000)}`,
                branch: 'Computer Science & Engineering',
                year: '3rd',
                phone: '9876543210',
              });
              success(`Welcome, ${profile.name || 'Student'}! Signed in with Google.`, 'Google Sign-In');
            }
          })
          .catch((err) => console.warn('Global OAuth hash parse error:', err))
          .finally(() => {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          });
      }
    }

    // 2. Process URL Search (?google_auth=success)
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('google_auth') === 'success') {
      const token = searchParams.get('token');
      const email = searchParams.get('email') || 'student@abes.ac.in';
      const name = searchParams.get('name') || 'ABES Student';
      const role = searchParams.get('role');

      if (role === 'coordinator' || role === 'superadmin') {
        login(token || 'google-jwt', {
          id: `admin-${Date.now()}`,
          email,
          name,
          role,
        });
        success(`Welcome, ${name}! Signed in with Google.`, 'Google Sign-In');
      } else {
        studentLogin({
          name,
          email,
          collegeName: 'ABES Engineering College, Ghaziabad',
          rollNumber: '2300320100045',
          branch: 'Computer Science & Engineering',
          year: '3rd',
          phone: '9876543210',
        });
        success(`Welcome, ${name}! Signed in with Google.`, 'Google Sign-In');
      }

      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [studentLogin, login, success]);

  return null;
};

// Layout for Public facing student pages
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fbf8f3] dark:bg-[#16212C] text-[#14100b] dark:text-[#f1ede6] transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ScrollToTop />
            <GlobalOAuthListener />
            <Routes>
              {/* Public Student Routes */}
              <Route
                path="/"
                element={
                  <PublicLayout>
                    <Home />
                  </PublicLayout>
                }
              />
              <Route
                path="/events"
                element={
                  <PublicLayout>
                    <Events />
                  </PublicLayout>
                }
              />
              <Route
                path="/events/:id"
                element={
                  <PublicLayout>
                    <EventDetail />
                  </PublicLayout>
                }
              />
              <Route
                path="/clubs"
                element={
                  <PublicLayout>
                    <ClubsPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/clubs/:slug"
                element={
                  <PublicLayout>
                    <ClubDetail />
                  </PublicLayout>
                }
              />
              <Route
                path="/build-win"
                element={
                  <PublicLayout>
                    <BuildAndWin />
                  </PublicLayout>
                }
              />
              <Route
                path="/build-and-win"
                element={<Navigate to="/build-win" replace />}
              />
              <Route
                path="/faq"
                element={
                  <PublicLayout>
                    <FaqPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/faqs"
                element={<Navigate to="/faq" replace />}
              />
              <Route
                path="/my-activity"
                element={
                  <PublicLayout>
                    <MyActivityPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/activity"
                element={<Navigate to="/my-activity" replace />}
              />

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="registrations" element={<AdminRegistrations />} />
              </Route>

              {/* 404 Catch All redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

