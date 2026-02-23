import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';

const BookingMonitoring = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getBookings({ 
        page, 
        limit: 8, 
        status: statusFilter === 'all' ? null : statusFilter 
      });
      setBookings(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, toast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="default">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan="7" className="text-center py-8 text-slate-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan="7" className="text-center py-8 text-slate-500">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-semibold text-slate-900">#{booking.id}</TableCell>
                  <TableCell className="text-slate-600">{booking.clientName}</TableCell>
                  <TableCell className="text-slate-600">{booking.providerName}</TableCell>
                  <TableCell className="text-slate-600">{booking.service}</TableCell>
                  <TableCell className="text-slate-600">{booking.date}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-700">Booking ID</div>
                <p className="text-slate-900">#{selectedBooking.id}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">Client</div>
                <p className="text-slate-900">{selectedBooking.clientName}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">Provider</div>
                <p className="text-slate-900">{selectedBooking.providerName}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">Service</div>
                <p className="text-slate-900">{selectedBooking.service}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">Date</div>
                <p className="text-slate-900">{selectedBooking.date}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">Amount</div>
                <p className="text-slate-900">${selectedBooking.amount}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">Status</div>
                <p className="text-slate-900">{selectedBooking.status}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingMonitoring;
