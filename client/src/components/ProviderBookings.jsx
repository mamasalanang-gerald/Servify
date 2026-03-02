import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Inbox } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { authService } from '../services/authService';
import { formatBookingTime } from '../utils/bookingTime';

const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
const PAGE_SIZE = 10;

const statusMap = {
  pending:   { label: 'Pending',   variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  accepted:  { label: 'Confirmed', variant: 'default' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

const normalizeStatus = (status) => {
  const current = String(status || 'pending').toLowerCase();
  return current === 'accepted' ? 'confirmed' : current;
};

const toApiStatus = (uiStatus) => (
  uiStatus === 'confirmed' ? 'accepted' : uiStatus
);

const STATUS_ORDER = { pending: 0, confirmed: 1, completed: 2, cancelled: 3 };

const sortBookings = (bookings) => {
  return [...bookings].sort((a, b) => {
    const aOrder = STATUS_ORDER[a.status] ?? 99;
    const bOrder = STATUS_ORDER[b.status] ?? 99;

    if (aOrder !== bOrder) return aOrder - bOrder;

    // Pending: oldest booking_date first (longest waiting)
    if (a.status === 'pending') {
      return new Date(a.booking_date) - new Date(b.booking_date);
    }

    // Everything else (including cancelled): newest first
    return new Date(b.booking_date) - new Date(a.booking_date);
  });
};

const mapProviderBooking = (booking) => {
  const clientName = booking.client_name || 'Unknown Client';
  return {
    ...booking,
    client: clientName,
    service: booking.service_name || 'Service',
    date: booking.booking_date
      ? new Date(booking.booking_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—',
    time: formatBookingTime(booking.booking_time),
    amount: `₱${Number(booking.total_price || 0).toLocaleString()}`,
    location: booking.user_location || '—',
    avatar: clientName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    clientProfileImage: booking.client_profile_image || '',
    status: normalizeStatus(booking.status),
  };
};

const ProviderBookings = ({ defaultTab = 'All' }) => {
  const [activeTab, setActiveTab]     = useState(defaultTab);
  const [bookings, setBookings]       = useState([]);
  const [detailModal, setDetailModal] = useState(null);
  const [page, setPage]               = useState(1);

  useEffect(() => {
    const user = authService.getUser();
    if (user?.id) {
      bookingService
        .getProviderBookings(user.id)
        .then((data) => {
          const source = Array.isArray(data) ? data : [];
          setBookings(sortBookings(source.map(mapProviderBooking)));
        })
        .catch(console.error);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const filtered = activeTab === 'All'
    ? bookings
    : bookings.filter((b) => b.status === activeTab.toLowerCase());

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = async (id, newStatus) => {
    try {
      await bookingService.updateBookingStatus(id, toApiStatus(newStatus));
      setBookings((prev) =>
        sortBookings(prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)))
      );
      setDetailModal(null);
    } catch (err) { console.error(err); }
  };

  const counts = tabs.reduce((acc, tab) => {
    acc[tab] = tab === 'All' ? bookings.length : bookings.filter((b) => b.status === tab.toLowerCase()).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
              activeTab === tab
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              {counts[tab]}
            </span>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        ))}
      </div>

      {/* Booking rows */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-3 opacity-50"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {/* <Inbox className="mb-3 h-10 w-10 text-gray-400 dark:text-gray-500" />   */}
              <div className="text-sm text-gray-600 dark:text-gray-400">No bookings in this category</div>
            </CardContent>
          </Card>
        )}
        {paginated.map((b) => {
          const s = statusMap[b.status] || statusMap.pending;
          return (
            <Card key={b.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {b.clientProfileImage ? (
                    <img
                      src={b.clientProfileImage}
                      alt={b.client}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">
                      {b.avatar}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{b.client}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{b.service}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{b.date}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{b.time}</div>
                  </div>

                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100 min-w-[80px] text-right">
                    {b.amount}
                  </div>

                  <Badge variant={s.variant} className="flex items-center gap-1.5 min-w-[100px] justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {s.label}
                  </Badge>

                  <div className="flex gap-2">
                    {b.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" onClick={() => updateStatus(b.id, 'confirmed')}>
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => updateStatus(b.id, 'cancelled')}>
                          Decline
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setDetailModal(b)}>Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages} &mdash; {filtered.length} total
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {detailModal && (
            <>
              <div className="space-y-3 py-4">
                {[
                  ['Client',   detailModal.client],
                  ['Service',  detailModal.service],
                  ['Location', detailModal.location],
                  ['Date',     detailModal.date],
                  ['Time',     detailModal.time],
                  ['Amount',   detailModal.amount],
                  ['Status',   detailModal.status.charAt(0).toUpperCase() + detailModal.status.slice(1)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{k}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{v}</span>
                  </div>
                ))}
              </div>
              {detailModal.status === 'pending' && (
                <DialogFooter>
                  <Button variant="destructive" onClick={() => updateStatus(detailModal.id, 'cancelled')}>
                    Decline
                  </Button>
                  <Button onClick={() => updateStatus(detailModal.id, 'confirmed')}>
                    Accept Booking
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderBookings;
