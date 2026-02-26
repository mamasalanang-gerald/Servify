import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import useAuth from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import { bookingService } from '../services/bookingService';
import ApplicationStatusCard from './ApplicationStatusCard';
import { normalizeBookingStatus } from '../utils/bookingStatus';
import { useSavedServices } from '../contexts/SavedServicesContext';

const UserOverview = ({ onQuickAction }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { savedServiceIds } = useSavedServices();
  const savedServicesCount = savedServiceIds?.size ?? 0;
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loadingApplication, setLoadingApplication] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Fetch application status on mount for clients
  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (!user || user.role !== 'client') {
        setLoadingApplication(false);
        return;
      }

      try {
        const data = await applicationService.getMyApplicationStatus();
        setApplicationStatus(data);
      } catch (err) {
        console.log('No application found or error:', err);
      } finally {
        setLoadingApplication(false);
      }
    };

    fetchApplicationStatus();
  }, [user]);

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        setLoadingBookings(false);
        return;
      }

      try {
        setLoadingBookings(true);
        const data = await bookingService.getClientBookings(user.id);
        const source = Array.isArray(data) ? data : [];
        setBookings(
          source.map((booking) => ({
            ...booking,
            status: normalizeBookingStatus(booking.status),
          })),
        );
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  const handleReapply = () => {
    navigate('/become-provider');
  };

  // Calculate stats from bookings
  const activeBookingsCount = bookings.filter(b => 
    ['pending', 'confirmed'].includes(normalizeBookingStatus(b.status))
  ).length;

  const totalSpent = bookings
    .filter(b => normalizeBookingStatus(b.status) === 'completed')
    .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

  const stats = [
    {
      title: 'Active Bookings',
      value: loadingBookings ? '...' : activeBookingsCount.toString(),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Saved Services',
      value: savedServicesCount.toString(),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total Spent',
      value: loadingBookings ? '...' : `₱${totalSpent.toFixed(2)}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const quickActions = [
    {
      id: 'browse-services',
      label: 'Browse Services',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
      onClick: () => onQuickAction?.('browse-services'),
    },
    {
      id: 'view-bookings',
      label: 'View Bookings',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      onClick: () => onQuickAction?.('view-bookings'),
    },
    {
      id: 'saved-services',
      label: 'Saved Services',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      onClick: () => onQuickAction?.('saved-services'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Application Status for Clients */}
      {user && user.role === 'client' && !loadingApplication && (
        <>
          {applicationStatus ? (
            <ApplicationStatusCard 
              application={applicationStatus} 
              onReapply={handleReapply}
            />
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <polyline points="17 11 19 13 23 9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Become a Service Provider</h3>
                      <p className="text-sm text-muted-foreground">
                        Start earning by offering your services on our platform
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => navigate('/become-provider')}>
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={action.onClick}
              >
                {action.icon}
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-50">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p>No recent activity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOverview;