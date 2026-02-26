import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';
import UserOverview from '../components/UserOverview';
import UserBookings from '../components/UserBookings';
import SavedServices from '../components/SavedServices';
import ProfileSettings from '../components/ProfileSettings';
import AccountSettings from '../components/AccountSettings';
import ServicesPanel from '../components/ServicesPanel';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import { userService } from '../services/userService';

const DashboardPage = () => {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(() => {
    const nav = location.state?.initialNav;
    return typeof nav === 'string' && nav.length > 0 ? nav : 'Dashboard';
  });
  const [_quickActionContext, setQuickActionContext] = useState(null);
  const [servicesInitialCategory] = useState(() =>
    typeof location.state?.initialCategory === 'string'
      ? location.state.initialCategory
      : null,
  );
  const [servicesInitialSearchQuery] = useState(() =>
    typeof location.state?.initialSearchQuery === 'string'
      ? location.state.initialSearchQuery
      : '',
  );
  const { user, updateUserRole } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Refresh user data on mount and when window gains focus
  useEffect(() => {
    const refreshUserData = async () => {
      if (!user) return;
      try {
        const userData = await userService.getCurrentUser();
        if (userData.role !== user.role) {
          updateUserRole(userData.role);
          window.location.reload();
        }
      } catch (err) {
        console.error('Failed to refresh user data:', err);
      }
    };

    refreshUserData();

    const handleFocus = () => refreshUserData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, updateUserRole]);

  const pageMeta = {
    Dashboard:        { title: 'Dashboard',        sub: `Welcome back, ${firstName}! Here's your overview.` },
    Services:         { title: 'Services',          sub: 'Browse and book services.' },
    Bookings:         { title: 'My Bookings',       sub: 'View and manage your service bookings.' },
    'Saved Services': { title: 'Saved Services',    sub: 'Your favorite services for quick access.' },
    Profile:          { title: 'Profile Settings',  sub: 'Update your personal information.' },
    Settings:         { title: 'Account Settings',  sub: 'Manage your account preferences.' },
  };

  const meta = pageMeta[activeNav] || pageMeta.Dashboard;

  const handleSidebarNavChange = (nextNav) => {
    setQuickActionContext(null);
    setActiveNav(nextNav);
  };

  const handleQuickAction = (actionId) => {
    if (actionId === 'browse-services') {
      setActiveNav('Services');
      setQuickActionContext(null);
      return;
    }
    if (actionId === 'view-bookings') {
      setActiveNav('Bookings');
      setQuickActionContext('view-bookings');
      return;
    }
    if (actionId === 'saved-services') {
      setActiveNav('Saved Services');
      setQuickActionContext(null);
    }
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <UserOverview onQuickAction={handleQuickAction} />;
      case 'Services':
        return (
          <ServicesPanel
            initialCategory={servicesInitialCategory}
            initialSearchQuery={servicesInitialSearchQuery}
            onNavigate={handleSidebarNavChange}
          />
        );
      case 'Bookings':
        return <UserBookings />;
      case 'Saved Services':
        return <SavedServices onNavigate={handleSidebarNavChange} />;
      case 'Profile':
        return <ProfileSettings />;
      case 'Settings':
        return <AccountSettings />;
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <UserSidebar activeNav={activeNav} setActiveNav={handleSidebarNavChange} />
        <div className="ml-64 flex-1 flex flex-col min-h-screen">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-700 px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{meta.title}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{meta.sub}</div>
            </div>
          </div>
          <div className="px-8 py-7 flex-1 text-slate-900 dark:text-slate-100">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;