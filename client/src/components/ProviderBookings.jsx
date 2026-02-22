import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

const allBookings = [
  { id: 1, client: 'Maria Santos',   avatar: 'MS', service: 'Deep House Cleaning', date: 'Feb 22, 2026', time: '9:00 AM',  amount: '₱149', status: 'pending' },
  { id: 2, client: 'Rico Buendia',   avatar: 'RB', service: 'Deep House Cleaning', date: 'Feb 20, 2026', time: '2:00 PM',  amount: '₱149', status: 'pending' },
  { id: 3, client: 'Trisha Cunanan', avatar: 'TC', service: 'Standard Clean',      date: 'Feb 23, 2026', time: '10:00 AM', amount: '₱89',  status: 'pending' },
  { id: 4, client: 'Lena Macaraeg',  avatar: 'LM', service: 'Standard Clean',      date: 'Feb 18, 2026', time: '11:00 AM', amount: '₱89',  status: 'confirmed' },
  { id: 5, client: 'James Torres',   avatar: 'JT', service: 'Deep House Cleaning', date: 'Feb 25, 2026', time: '1:00 PM',  amount: '₱229', status: 'confirmed' },
  { id: 6, client: 'Ana Reyes',      avatar: 'AR', service: 'Standard Clean',      date: 'Feb 10, 2026', time: '9:00 AM',  amount: '₱89',  status: 'completed' },
  { id: 7, client: 'Paul Katigbak',  avatar: 'PK', service: 'Deep House Cleaning', date: 'Feb 5, 2026',  time: '3:00 PM',  amount: '₱149', status: 'completed' },
  { id: 8, client: 'Sofia Araneta',  avatar: 'SA', service: 'Move-In/Out Clean',   date: 'Jan 28, 2026', time: '9:00 AM',  amount: '₱229', status: 'completed' },
  { id: 9, client: 'Marco Dizon',    avatar: 'MD', service: 'Standard Clean',      date: 'Jan 20, 2026', time: '2:00 PM',  amount: '₱89',  status: 'cancelled' },
];

const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const statusMap = {
  pending:   { label: 'Pending',   variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

const ProviderBookings = () => {
  const [activeTab, setActiveTab]     = useState('All');
  const [bookings, setBookings]       = useState(allBookings);
  const [detailModal, setDetailModal] = useState(null);

  const filtered = activeTab === 'All'
    ? bookings
    : bookings.filter((b) => b.status === activeTab.toLowerCase());

  const updateStatus = (id, newStatus) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    setDetailModal(null);
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
            onClick={() => setActiveTab(tab)}
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
              <div className="text-4xl mb-3">📭</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">No bookings in this category</div>
            </CardContent>
          </Card>
        )}
        {filtered.map((b) => {
          const s = statusMap[b.status];
          return (
            <Card key={b.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">
                    {b.avatar}
                  </div>

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
                  ['Client',  detailModal.client],
                  ['Service', detailModal.service],
                  ['Date',    detailModal.date],
                  ['Time',    detailModal.time],
                  ['Amount',  detailModal.amount],
                  ['Status',  detailModal.status.charAt(0).toUpperCase() + detailModal.status.slice(1)],
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
