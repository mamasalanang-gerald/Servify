import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import useAuth from '../hooks/useAuth';
import { bookingService } from '../services/bookingService';
import {
  normalizeBookingStatus,
  toApiBookingStatus,
  formatBookingStatus,
} from '../utils/bookingStatus';

const UserBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [detailModal, setDetailModal] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError('');
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
        setError(err.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  const filteredBookings = activeTab === 'All'
    ? bookings 
    : bookings.filter(b => b.status.toLowerCase() === activeTab.toLowerCase());

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const updateStatus = async (id, nextStatus) => {
    try {
      setUpdatingId(id);
      setError('');
      const updated = await bookingService.updateBookingStatus(
        id,
        toApiBookingStatus(nextStatus),
      );
      const resolvedStatus = normalizeBookingStatus(updated?.status || nextStatus);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status: resolvedStatus } : booking,
        ),
      );
      setDetailModal((prev) =>
        prev?.id === id ? { ...prev, status: resolvedStatus } : prev,
      );
    } catch (err) {
      console.error('Failed to update booking status:', err);
      setError(err.message || 'Failed to update booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">Loading bookings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="whitespace-nowrap"
              >
                {tab}
                {tab !== 'All' && (
                  <Badge variant="secondary" className="ml-2">
                    {bookings.filter(b => b.status.toLowerCase() === tab.toLowerCase()).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-muted-foreground">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-50">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p>No {activeTab.toLowerCase()} bookings found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{booking.service_name || 'Service'}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{booking.booking_time || 'Time not set'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>Provider: {booking.provider_name || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ₱{parseFloat(booking.total_price || 0).toFixed(2)}
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      {booking.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          disabled={updatingId === booking.id}
                        >
                          {updatingId === booking.id ? 'Updating...' : 'Cancel'}
                        </Button>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatus(booking.id, 'completed')}
                          disabled={updatingId === booking.id}
                        >
                          {updatingId === booking.id ? 'Updating...' : 'Mark Completed'}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDetailModal(booking)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  ['Service', detailModal.service_name || 'Service'],
                  ['Date', detailModal.booking_date ? new Date(detailModal.booking_date).toLocaleDateString() : '—'],
                  ['Time', detailModal.booking_time ? String(detailModal.booking_time).slice(0, 5) : '—'],
                  ['Provider', detailModal.provider_name || 'Unknown'],
                  ['Location', detailModal.user_location || '—'],
                  ['Total', `₱${parseFloat(detailModal.total_price || 0).toFixed(2)}`],
                  ['Status', formatBookingStatus(detailModal.status)],
                  ['Notes', detailModal.notes || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-border py-2">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground text-right">{value}</span>
                  </div>
                ))}
              </div>

              <DialogFooter>
                {detailModal.status === 'pending' && (
                  <Button
                    variant="outline"
                    onClick={() => updateStatus(detailModal.id, 'cancelled')}
                    disabled={updatingId === detailModal.id}
                  >
                    {updatingId === detailModal.id ? 'Updating...' : 'Cancel Booking'}
                  </Button>
                )}
                {detailModal.status === 'confirmed' && (
                  <Button
                    onClick={() => updateStatus(detailModal.id, 'completed')}
                    disabled={updatingId === detailModal.id}
                  >
                    {updatingId === detailModal.id ? 'Updating...' : 'Mark as Completed'}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserBookings;
