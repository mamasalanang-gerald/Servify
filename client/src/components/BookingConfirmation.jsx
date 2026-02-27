import { createPortal } from 'react-dom';
import { Button } from './ui/button';

const BookingConfirmation = ({ isOpen, onClose, bookingData, onNavigate }) => {

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  const handleViewBookings = () => {
    onClose();
    onNavigate('Bookings');
  };

  const handleContinueShopping = () => {
    onClose();
    onNavigate('Services');
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-[420px] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-slate-900 dark:text-slate-100 mb-1">
          Booking Confirmed!
        </h2>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-5">
          Your service booking has been submitted successfully.
        </p>

        {/* Booking Details */}
        <div className="space-y-3 mb-5 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Service</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{bookingData?.serviceName}</span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Provider</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{bookingData?.providerName}</span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex justify-between items-start">
            <span className="text-slate-600 dark:text-slate-400">Date & Time</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-right text-xs">
              {bookingData?.date && formatDate(bookingData.date)}<br />{bookingData?.time}
            </span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Location</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-right text-xs max-w-xs">{bookingData?.location}</span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Total Amount</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">₱{bookingData?.totalAmount}</span>
          </div>
        </div>

        {/* Info Message */}
        <div className="mb-5 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex gap-2">
            <div className="flex-shrink-0 mt-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <p className="text-xs text-blue-800 dark:text-blue-300">
              The provider will contact you within 24 hours to confirm the booking details.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <Button 
            onClick={handleContinueShopping}
            className="flex-1 bg-gradient-to-br from-blue-900 to-blue-600 text-white hover:opacity-90 text-sm"
          >
            Continue Browsing
          </Button>
          <Button 
            onClick={handleViewBookings}
            variant="outline"
            className="flex-1 text-sm"
          >
            View Bookings
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BookingConfirmation;