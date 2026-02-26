import { useState, useEffect } from 'react';
import BookingCard from './BookingCard';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { cn } from '../lib/utils';
import { bookingService } from '../services/bookingService';
import { authService } from '../services/authService';
import { formatBookingTime } from '../utils/bookingTime';

const normalizeStatus = (status) => {
  const current = String(status || 'pending').toLowerCase();
  if (current === 'accepted') return 'confirmed';
  if (current === 'rejected') return 'cancelled';
  return current;
};

const mapClientBooking = (booking) => {
  const normalizedStatus = normalizeStatus(booking.status);
  const dateLabel = booking.booking_date
    ? new Date(booking.booking_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  return {
    ...booking,
    status: normalizedStatus,
    title: booking.service_name || 'Service',
    subtitle: booking.user_location || booking.service_description || 'No location provided',
    date: dateLabel,
    time: formatBookingTime(booking.booking_time),
    total: `₱${Number(booking.total_price || 0).toLocaleString()}`,
    img: '/placeholder-service.jpg',
  };
};

const BookingList = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const user = authService.getUser();
        
        if (user && user.id) {
          const data = await bookingService.getClientBookings(user.id);
          const source = Array.isArray(data) ? data : [];
          setBookings(source.map(mapClientBooking));
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

  const updateStatus = async (id, nextStatus) => {
    try {
      setUpdatingId(id);
      await bookingService.updateBookingStatus(id, nextStatus);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status: nextStatus } : booking,
        ),
      );
      setDetailModal((prev) => (prev?.id === id ? { ...prev, status: nextStatus } : prev));
    } catch (err) {
      console.error('Failed to update booking status:', err);
      setError(err.message || 'Failed to update booking status');
    } finally {
      setUpdatingId(null);
    }
  };

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
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetails={() => setDetailModal(booking)}
              onMarkCompleted={() => updateStatus(booking.id, 'completed')}
              isUpdating={updatingId === booking.id}
            />
          ))}
        </div>
      )}

      <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {detailModal && (
            <>
              <div className="space-y-3 py-2">
                {[
                  ['Service', detailModal.title],
                  ['Date', detailModal.date],
                  ['Time', detailModal.time],
                  ['Location', detailModal.user_location || '—'],
                  ['Total', detailModal.total],
                  ['Status', detailModal.status.charAt(0).toUpperCase() + detailModal.status.slice(1)],
                  ['Notes', detailModal.notes || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground text-right">{value}</span>
                  </div>
                ))}
              </div>

              {detailModal.status === 'confirmed' && (
                <DialogFooter>
                  <Button
                    onClick={() => updateStatus(detailModal.id, 'completed')}
                    disabled={updatingId === detailModal.id}
                  >
                    {updatingId === detailModal.id ? 'Updating...' : 'Mark as Completed'}
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BookingList;
