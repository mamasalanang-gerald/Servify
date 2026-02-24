import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { bookingService } from '../services/bookingService';
import { authService } from '../services/authService';
import { normalizeBookingStatus } from '../utils/bookingStatus';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const user = authService.getUser();
        
        if (user && user.id) {
          const bookings = await bookingService.getClientBookings(user.id);
          
          // Calculate stats from bookings
          const bookingsArray = (Array.isArray(bookings) ? bookings : []).map((booking) => ({
            ...booking,
            status: normalizeBookingStatus(booking.status),
          }));
          const upcoming = bookingsArray.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
          const completed = bookingsArray.filter(b => b.status === 'completed').length;
          const totalSpent = bookingsArray
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);
          
          setStats({ upcoming, completed, totalSpent });
        } else {
          setStats({ upcoming: 0, completed: 0, totalSpent: 0 });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError(err.message);
        setStats({ upcoming: 0, completed: 0, totalSpent: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      label: 'Upcoming',
      value: loading ? '...' : stats.upcoming.toString(),
      color: '#2b52cc',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2b52cc" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: 'Completed',
      value: loading ? '...' : stats.completed.toString(),
      color: '#16a34a',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: 'Total Spent',
      value: loading ? '...' : `₱${stats.totalSpent.toFixed(2)}`,
      color: '#d97706',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        Failed to load stats: {error}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {statsData.map((stat, i) => (
        <Card key={i} className="p-6 transition-shadow hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <span className="block text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
            </div>
            <div className="flex-shrink-0">{stat.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
