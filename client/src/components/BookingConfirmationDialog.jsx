import { createPortal } from 'react-dom';
import { Button } from './ui/button';

const BookingConfirmationDialog = ({ isOpen, onConfirm, onCancel, bookingData }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-[420px] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-slate-900 dark:text-slate-100 mb-1">
          Confirm Your Booking
        </h2>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-5">
          Please review your details before proceeding.
        </p>

        {/* Booking Details - Compact */}
        <div className="space-y-3 mb-5 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Service</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {bookingData?.serviceName}
            </span>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Provider</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {bookingData?.providerName}
            </span>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Date</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-right">
              {bookingData?.date && formatDate(bookingData.date)}
            </span>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Time</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {bookingData?.time}
            </span>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Location</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-right text-xs max-w-xs">
              {bookingData?.location}
            </span>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Total</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
              ₱{bookingData?.totalAmount}
            </span>
          </div>
        </div>

        {/* Info Message - Compact */}
        <div className="mb-5 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex gap-2">
            <div className="flex-shrink-0 mt-0.5">
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#d97706" 
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300">
              You won't be charged until the provider confirms the booking.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <Button 
            onClick={onCancel}
            variant="outline"
            className="flex-1 text-sm"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-br from-blue-900 to-blue-600 text-white hover:opacity-90 text-sm"
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BookingConfirmationDialog;
