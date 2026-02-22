import { useState, useEffect } from 'react';
import BookingCard from './BookingCard';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { bookingService } from '../services/bookingService';
import { authService } from '../services/authService';

const BookingList = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const user = authService.getUser();
        
        if (user && user.id) {
          const data = await bookingService.getClientBookings(user.id);
          setBookings(Array.isArray(data) ? data : []);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError(err.message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const upcomingBookings = bookings.filter(
    b => b.status === 'pending' || b.status === 'confirmed'
  );
  const historyBookings = bookings.filter(
    b => b.status === 'completed' || b.status === 'cancelled'
  );

  const displayBookings = activeTab === 'Upcoming' ? upcomingBookings : historyBookings;

  return (
    <Card className="p-6">
      <div className="mb-6 flex gap-2 border-b border-border">
        {['Upcoming', 'History'].map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            className={cn(
              "relative rounded-none border-b-2 px-4 py-2",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          Failed to load bookings: {error}
        </div>
      )}

      {!loading && !error && displayBookings.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No {activeTab.toLowerCase()} bookings found.
        </div>
      )}

      {!loading && !error && displayBookings.length > 0 && (
        <div className="space-y-4">
          {displayBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default BookingList;
