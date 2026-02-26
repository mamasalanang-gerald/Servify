import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { serviceService } from '../services/serviceService';
import { bookingService } from "../services/bookingService";
import SaveButton from './SaveButton';
import BookingConfirmation from './BookingConfirmation.jsx';
import BookingConfirmationDialog from './BookingConfirmationDialog';
import { BOOKING_TIME_OPTIONS } from '../utils/bookingTime';

export default function ServiceDetailPage({ service, onBack, backButtonText = "Back to Services", onNavigate }) {
  const today = new Date();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("description");
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [bookingTime, setBookingTime] = useState("09:00");
  const [userLocation, setUserLocation] = useState(service?.location || "");
  const [note, setNote] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSummaryError, setBookingSummaryError] = useState("");
  const [showBookingConfirmationDialog, setShowBookingConfirmationDialog] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [pendingBookingData, setPendingBookingData] = useState(null);

  const [reviews, setReviews] = useState([]);
  const displayedReviewCount =
    Number.isFinite(Number(service?.reviewCount))
      ? Number(service?.reviewCount)
      : Number.isFinite(Number(service?.review_count))
        ? Number(service?.review_count)
        : reviews.length;

  const toNumber = (value) => {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }
    if (typeof value === "string") {
      const cleaned = value.replace(/[^0-9.-]/g, "");
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const parsePackages = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const formatPeso = (value) => {
    const amount = toNumber(value);
    return `₱${amount.toLocaleString()}`;
  };

  const packages = useMemo(() => {
    const normalizedPackages = parsePackages(service?.packages)
      .map((pkg) => ({
        ...pkg,
        price: toNumber(pkg?.price),
      }))
      .filter((pkg) => pkg.name || pkg.description || pkg.price > 0);

    if (normalizedPackages.length > 0) {
      return normalizedPackages;
    }

    return [
      {
        name: service?.title || "Standard",
        price: toNumber(service?.priceNum ?? service?.price ?? 0),
        description: service?.description || "",
        features: [],
      },
    ];
  }, [service]);

  useEffect(() => {
    if (!service?.id) return;
    serviceService
      .getServiceReviews(service.id)
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }, [service?.id]);

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const isCurrentMonth =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const selectedDateStr = `${currentMonth.getMonth() + 1}/${selectedDate}/${currentMonth.getFullYear()}`;
  const selectedDateISO = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1,
  ).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
  const pkg = packages[selectedPackage] || packages[0] || { name: '', price: 0, description: '', features: [] };
  const rawServiceRating = toNumber(service?.rating ?? service?.average_rating ?? 0);
  const displayServiceRating = rawServiceRating > 0 ? rawServiceRating.toFixed(1) : '—';

  const handleBooking = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    const providerId = service?.provider_id || service?.providerId;
    if (!service?.id || !providerId) {
      setBookingError("Missing service/provider data. Please refresh and try again.");
      return;
    }

    if (!bookingTime || !userLocation.trim()) {
      setBookingError("Please set your preferred time and location.");
      return;
    }

    setBookingError("");
    setBookingSummaryError("");

    setPendingBookingData({
      service_id: service.id,
      client_id: user.id,
      provider_id: providerId,
      booking_date: selectedDateISO,
      booking_time: bookingTime,
      user_location: userLocation.trim(),
      total_price: toNumber(pkg.price),
      notes: [note?.trim(), `Package: ${pkg?.name || "Standard"}`]
        .filter(Boolean)
        .join(" | "),
    });

    const dialogData = {
      serviceName: service.title,
      providerName: service?.providerName || service?.provider || 'Service Provider',
      date: selectedDateISO,
      time: bookingTime,
      location: userLocation.trim(),
      totalAmount: toNumber(pkg.price),
    };

    setBookingDetails(dialogData);
    setShowBookingConfirmationDialog(true);
  };

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    setBookingError("");
    setBookingSummaryError("");

    try {
      await bookingService.createBooking(pendingBookingData);
      setShowBookingConfirmationDialog(false);
      setShowBookingConfirmation(true);
    } catch (err) {
      const message = err.message || "Failed to create booking";
      setBookingError(message);
      setBookingSummaryError(message);

      const normalizedMessage = message.toLowerCase();
      const isInactiveServiceError =
        normalizedMessage.includes("no longer active") ||
        normalizedMessage.includes("inactive") ||
        normalizedMessage.includes("no longer available");

      if (isInactiveServiceError) {
        setBookingSummaryError(
          `${message} Redirecting you to Services...`,
        );

        setTimeout(() => {
          setShowBookingConfirmationDialog(false);
          setPendingBookingData(null);
          setBookingDetails(null);
          let redirected = false;

          if (typeof onBack === "function") {
            onBack();
            redirected = true;
          }

          if (typeof onNavigate === "function") {
            onNavigate("Services");
            redirected = true;
          }

          if (redirected) {
            return;
          }

          navigate("/dashboard");
        }, 1400);
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = () => {
    setShowBookingConfirmationDialog(false);
    setPendingBookingData(null);
    setBookingDetails(null);
    setBookingSummaryError("");
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#0b1220] transition-colors">

      {/* Login prompt modal */}
      {showLoginPrompt && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[9999] p-5 animate-in fade-in duration-200" onClick={() => setShowLoginPrompt(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 pt-9 w-full max-w-[340px] text-center shadow-2xl animate-in slide-in-from-bottom-4 duration-200 relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors" onClick={() => setShowLoginPrompt(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Login Required</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              You need to be logged in to book a service. Please log in or create an account to continue.
            </p>
            <div className="flex gap-2.5">
              <Button className="flex-1 bg-gradient-to-br from-blue-900 to-blue-600 text-white" onClick={() => navigate("/login")}>
                Log In
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => navigate("/signup")}>
                Create Account
              </Button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Booking Confirmation Dialog - Ask for confirmation */}
      <BookingConfirmationDialog 
        isOpen={showBookingConfirmationDialog}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
        bookingData={bookingDetails}
        errorMessage={bookingSummaryError}
        isSubmitting={isBooking}
      />

      {/* Booking Success Confirmation Modal */}
      <BookingConfirmation 
        isOpen={showBookingConfirmation}
        onClose={() => setShowBookingConfirmation(false)}
        bookingData={bookingDetails}
        onNavigate={(tab) => {
          setShowBookingConfirmation(false);
          if (tab === 'Services') {
            onBack();
          } else {
            onNavigate(tab);
          }
        }}
      />

      {/* Back */}
      <div className="bg-white dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700 px-6 py-4 transition-colors">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {backButtonText}
        </Button>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Left column */}
        <div className="space-y-6">
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <img src={service?.img} alt={service?.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary">{service?.category}</Badge>
            <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {displayServiceRating} ({displayedReviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex-1">{service?.title ?? "Deep House Cleaning"}</h1>
            <SaveButton serviceId={service?.id} variant="button" size="md" />
          </div>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              {service?.providerImage || service?.provider_image ? (
                <img src={service.providerImage || service.provider_image} alt={service?.providerName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {service?.providerInitial ?? service?.initials ?? "SJ"}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {service?.providerName ?? service?.provider ?? "Sarah Johnson"}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#2b52cc" opacity="0.15" />
                    <polyline points="9 12 11 14 15 10" stroke="#2b52cc" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {displayServiceRating} rating · {service?.jobs ?? 342} jobs completed
                </div>
              </div>
              <Button variant="outline" size="sm">Contact</Button>
            </div>
          </Card>

          <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
            <button className={`px-5 py-3 text-sm font-semibold transition-colors ${activeTab === "description" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"}`} onClick={() => setActiveTab("description")}>Description</button>
            <button className={`px-5 py-3 text-sm font-semibold transition-colors ${activeTab === "reviews" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"}`} onClick={() => setActiveTab("reviews")}>Reviews</button>
          </div>

          {activeTab === "description" ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">About this service</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {service?.description ?? "Professional deep cleaning service for your entire home."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <Card key={r.id || i} className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    {r.reviewer_profile_image ? (
                      <img
                        src={r.reviewer_profile_image}
                        alt={r.reviewer_name || r.name || 'Reviewer'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center text-sm font-bold">
                        {(r.reviewer_name || r.name || "?")[0]}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {r.reviewer_name || r.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(r.review_date || r.date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="text-amber-500">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{r.comment || r.text}</p>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:sticky lg:top-8 h-fit">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Select Package</h3>
              <div className="space-y-3">
                {packages.map((p, i) => (
                  <button key={i} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedPackage === i ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/30" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`} onClick={() => setSelectedPackage(i)}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</span>
                      <span className="font-bold text-blue-600">{formatPeso(p.price)}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{p.description}</p>
                    <ul className="space-y-1.5">
                      {(p.features || []).map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#2b52cc" opacity="0.12" />
                            <polyline points="9 12 11 14 15 10" stroke="#2b52cc" strokeWidth="2" fill="none" strokeLinecap="round" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Select Date</h3>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <button className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors" onClick={prevMonth}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{monthName}</span>
                  <button className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors" onClick={nextMonth}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <span key={d} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-2">{d}</span>)}
                  {Array.from({ length: firstDay }).map((_, i) => <span key={`e${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isPast = isCurrentMonth && day < today.getDate();
                    const isSelected = selectedDate === day;
                    return (
                      <button key={day} className={`aspect-square rounded-lg text-sm font-medium transition-colors ${isPast ? "text-slate-300 dark:text-slate-600 cursor-not-allowed" : isSelected ? "bg-blue-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100"}`} onClick={() => !isPast && setSelectedDate(day)} disabled={isPast}>
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Preferred Time</h3>
              <select
                className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              >
                {BOOKING_TIME_OPTIONS.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Service Location</h3>
              <input
                type="text"
                className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter your address/location"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Add a Note</h3>
              <textarea
                className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Any special instructions or requests for the provider..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                maxLength={300}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{note.length}/300</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-300">Package</span><span className="font-semibold text-slate-900 dark:text-slate-100">{pkg.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-300">Date</span><span className="font-semibold text-slate-900 dark:text-slate-100">{selectedDateStr}</span></div>
              <div className="flex justify-between text-lg font-bold pt-2 text-slate-900 dark:text-slate-100"><span>Total</span><span className="text-blue-600">{formatPeso(pkg.price)}</span></div>
            </div>

            {bookingError ? (
              <p className="text-sm text-red-600">{bookingError}</p>
            ) : null}

            <Button
              className="w-full bg-gradient-to-br from-blue-900 to-blue-600 text-white gap-2"
              onClick={handleBooking}
              disabled={isBooking}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {isBooking ? "Booking..." : "Book Service"}
            </Button>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">You won't be charged yet</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
