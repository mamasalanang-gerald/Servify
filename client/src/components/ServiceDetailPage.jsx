import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import './ServiceDetailPage.css';

export default function ServiceDetailPage({ service, onBack }) {
  const today = new Date();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("description");
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [note, setNote] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const packages = service?.packages || [
    { name: "Basic Clean", price: "4,999", description: "Essential cleaning for small apartments", features: ["Living room & bedroom", "Kitchen surfaces", "Bathroom", "2-3 hours"] },
    { name: "Standard Clean", price: "8,499", description: "Complete cleaning for medium homes", features: ["All rooms", "Kitchen & appliances", "Bathrooms", "Dusting & vacuuming", "4-5 hours"] },
    { name: "Premium Clean", price: "13,999", description: "Intensive deep cleaning", features: ["Deep scrubbing", "Carpet cleaning", "Window cleaning", "Organizing", "6-8 hours"] },
  ];

  const reviews = [
    { name: "Anna L.", rating: 5, date: "Jan 2026", comment: "Absolutely fantastic service! My home has never been cleaner. Will definitely book again." },
    { name: "Mark R.", rating: 5, date: "Dec 2025", comment: "Very professional and thorough. Arrived on time and did an amazing job." },
    { name: "Sofia T.", rating: 4, date: "Nov 2025", comment: "Great service overall. A few minor spots were missed but they came back to fix it." },
  ];

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const isCurrentMonth =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const selectedDateStr = `${currentMonth.getMonth() + 1}/${selectedDate}/${currentMonth.getFullYear()}`;
  const pkg = packages[selectedPackage];

  const handleBooking = () => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      // proceed with booking logic here
    }
  };

  return (
    <div className="sdp">

      {/* ── Login prompt modal — rendered at body level via portal ── */}
      {showLoginPrompt && createPortal(
        <div className="sdp__modal-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="sdp__modal" onClick={(e) => e.stopPropagation()}>
            <button className="sdp__modal-close" onClick={() => setShowLoginPrompt(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="sdp__modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2b52cc" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="sdp__modal-title">Login Required</h3>
            <p className="sdp__modal-text">
              You need to be logged in to book a service. Please log in or create an account to continue.
            </p>
            <div className="sdp__modal-actions">
              <button className="sdp__modal-btn sdp__modal-btn--primary" onClick={() => navigate("/login")}>
                Log In
              </button>
              <button className="sdp__modal-btn sdp__modal-btn--secondary" onClick={() => navigate("/signup")}>
                Create Account
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Back */}
      <div className="sdp__back-bar">
        <button className="sdp__back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Services
        </button>
      </div>

      <div className="sdp__layout">
        {/* ── Left column ── */}
        <div className="sdp__left">
          <div className="sdp__hero">
            <img src={service?.img} alt={service?.title} className="sdp__hero-img" />
          </div>

          <div className="sdp__meta">
            <span className="sdp__meta-category">{service?.category}</span>
            <span className="sdp__meta-rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {service?.rating ?? 4.9} ({service?.reviewCount ?? 156} reviews)
            </span>
          </div>

          <h1 className="sdp__title">{service?.title ?? "Deep House Cleaning"}</h1>

          <div className="sdp__provider">
            <div className="sdp__provider-avatar">{service?.providerInitial ?? service?.initials ?? "SJ"}</div>
            <div className="sdp__provider-info">
              <div className="sdp__provider-name">
                {service?.providerName ?? service?.provider ?? "Sarah Johnson"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#2b52cc" opacity="0.15" />
                  <polyline points="9 12 11 14 15 10" stroke="#2b52cc" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <div className="sdp__provider-sub">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {service?.rating ?? 4.9} rating &bull; {service?.jobs ?? 342} jobs completed
              </div>
            </div>
            <button className="sdp__contact-btn">Contact</button>
          </div>

          <div className="sdp__tabs">
            <button className={`sdp__tab ${activeTab === "description" ? "sdp__tab--active" : ""}`} onClick={() => setActiveTab("description")}>Description</button>
            <button className={`sdp__tab ${activeTab === "reviews" ? "sdp__tab--active" : ""}`} onClick={() => setActiveTab("reviews")}>Reviews</button>
          </div>

          {activeTab === "description" ? (
            <div className="sdp__tab-panel">
              <h3 className="sdp__section-title">About this service</h3>
              <p className="sdp__description">
                {service?.description ?? "Professional deep cleaning service for your entire home. Our team uses eco-friendly products and advanced cleaning techniques to ensure every corner sparkles. Perfect for move-ins, move-outs, or seasonal deep cleans."}
              </p>
            </div>
          ) : (
            <div className="sdp__tab-panel">
              {reviews.map((r, i) => (
                <div key={i} className="sdp__review">
                  <div className="sdp__review-header">
                    <div className="sdp__review-avatar">{r.name[0]}</div>
                    <div>
                      <div className="sdp__review-name">{r.name}</div>
                      <div className="sdp__review-date">{r.date}</div>
                    </div>
                    <div className="sdp__review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  </div>
                  <p className="sdp__review-text">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="sdp__right">
          <div className="sdp__panel">
            <h3 className="sdp__panel-title">Select Package</h3>
            <div className="sdp__packages">
              {packages.map((p, i) => (
                <button key={i} className={`sdp__package ${selectedPackage === i ? "sdp__package--active" : ""}`} onClick={() => setSelectedPackage(i)}>
                  <div className="sdp__package-top">
                    <span className="sdp__package-name">{p.name}</span>
                    <span className="sdp__package-price">₱{p.price}</span>
                  </div>
                  <p className="sdp__package-desc">{p.description}</p>
                  <ul className="sdp__package-features">
                    {p.features.map((f, j) => (
                      <li key={j}>
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

            <h3 className="sdp__panel-title sdp__panel-title--spaced">Select Date</h3>
            <div className="sdp__calendar">
              <div className="sdp__cal-header">
                <button className="sdp__cal-nav" onClick={prevMonth}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <span className="sdp__cal-month">{monthName}</span>
                <button className="sdp__cal-nav" onClick={nextMonth}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
              <div className="sdp__cal-grid">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <span key={d} className="sdp__cal-dow">{d}</span>)}
                {Array.from({ length: firstDay }).map((_, i) => <span key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isPast = isCurrentMonth && day < today.getDate();
                  const isSelected = selectedDate === day;
                  return (
                    <button key={day} className={`sdp__cal-day ${isPast ? "sdp__cal-day--past" : ""} ${isSelected ? "sdp__cal-day--selected" : ""}`} onClick={() => !isPast && setSelectedDate(day)} disabled={isPast}>
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <h3 className="sdp__panel-title sdp__panel-title--spaced">Add a Note</h3>
            <textarea
              className="sdp__note"
              placeholder="Any special instructions or requests for the provider..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={300}
            />
            <p className="sdp__note-count">{note.length}/300</p>

            <div className="sdp__summary">
              <div className="sdp__summary-row"><span>Package</span><span className="sdp__summary-val">{pkg.name}</span></div>
              <div className="sdp__summary-row"><span>Date</span><span className="sdp__summary-val">{selectedDateStr}</span></div>
              <div className="sdp__summary-total"><span>Total</span><span className="sdp__summary-price">₱{pkg.price}</span></div>
            </div>

            <button className="sdp__book-btn" onClick={handleBooking}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Book Service
            </button>
            <p className="sdp__no-charge">You won't be charged yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}