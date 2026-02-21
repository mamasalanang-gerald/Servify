import React, { useState } from 'react';
import '../pages/styles/ViewService.css';

const ViewService = ({ service, onBack }) => {
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [selectedDate, setSelectedDate]       = useState('');
  const [selectedTime, setSelectedTime]       = useState('');
  const [activeTab, setActiveTab]             = useState('overview');
  const [isSaved, setIsSaved]                 = useState(true);
  const [bookingSuccess, setBookingSuccess]   = useState(false);

  const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  const selectedPkg    = service.packages.find((p) => p.id === selectedPackage);
  const platformFee    = Math.round(selectedPkg.price * 0.05);
  const total          = selectedPkg.price + platformFee;

  const handleBook = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`vs-star ${i < Math.floor(rating) ? 'vs-star--filled' : i < rating ? 'vs-star--half' : ''}`}>★</span>
    ));

  return (
    <div className="vs-wrapper">

      {/* Back */}
      <button className="vs-back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Saved Services
      </button>

      {/* Hero */}
      <div className="vs-hero">
        <div className="vs-hero__img-wrap">
          <img src={service.img} alt={service.title} className="vs-hero__img" />
          <div className="vs-hero__overlay" />
          <button className={`vs-hero__save ${isSaved ? 'saved' : ''}`} onClick={() => setIsSaved(!isSaved)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <span className="vs-hero__category">{service.category}</span>
        </div>

        <div className="vs-hero__info">
          <h1 className="vs-hero__title">{service.title}</h1>
          <div className="vs-hero__meta">
            <div className="vs-hero__rating">
              {renderStars(service.rating)}
              <span className="vs-hero__rating-score">{service.rating}</span>
              <span className="vs-hero__rating-count">({service.reviewCount} reviews)</span>
            </div>
            <div className="vs-hero__price">From <strong>₱{service.basePrice}</strong></div>
          </div>
          <div className="vs-provider-pill">
            <div className="vs-provider-pill__avatar">{service.providerAvatar}</div>
            <div className="vs-provider-pill__info">
              <span className="vs-provider-pill__name">{service.providerName}</span>
              <span className="vs-provider-pill__sub">{service.providerJobs} jobs · Member since {service.providerJoined}</span>
            </div>
            <span className="vs-provider-pill__badge">Verified</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="vs-body">

        {/* Left — tabs + content */}
        <div className="vs-content">
          <div className="vs-tabs">
            {['overview', 'reviews'].map((tab) => (
              <button key={tab} className={`vs-tabs__tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && <span className="vs-tabs__count">{service.reviewCount}</span>}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="vs-tab-panel">
              <p className="vs-description">{service.description}</p>

              <h3 className="vs-section-heading">What's Included</h3>
              <ul className="vs-includes">
                {service.includes.map((item, i) => (
                  <li key={i} className="vs-includes__item">
                    <span className="vs-includes__check">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="vs-section-heading">Choose a Package</h3>
              <div className="vs-packages">
                {service.packages.map((pkg) => (
                  <button key={pkg.id} className={`vs-pkg ${selectedPackage === pkg.id ? 'selected' : ''}`} onClick={() => setSelectedPackage(pkg.id)}>
                    {selectedPackage === pkg.id && (
                      <span className="vs-pkg__check">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                    )}
                    <span className="vs-pkg__label">{pkg.label}</span>
                    <span className="vs-pkg__price">₱{pkg.price}</span>
                    <span className="vs-pkg__duration">{pkg.duration}</span>
                    <span className="vs-pkg__desc">{pkg.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="vs-tab-panel">
              <div className="vs-rating-summary">
                <div className="vs-rating-summary__big">{service.rating}</div>
                <div className="vs-rating-summary__right">
                  <div className="vs-rating-summary__stars">{renderStars(service.rating)}</div>
                  <div className="vs-rating-summary__label">Based on {service.reviewCount} reviews</div>
                </div>
              </div>
              <div className="vs-reviews">
                {service.reviews.map((r, i) => (
                  <div key={i} className="vs-review">
                    <div className="vs-review__header">
                      <div className="vs-review__avatar">{r.avatar}</div>
                      <div className="vs-review__meta">
                        <span className="vs-review__name">{r.name}</span>
                        <span className="vs-review__date">{r.date}</span>
                      </div>
                      <div className="vs-review__stars">{renderStars(r.rating)}</div>
                    </div>
                    <p className="vs-review__text">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — booking card */}
        <div className="vs-booking-card">
          <div className="vs-booking-card__header">
            <span className="vs-booking-card__price">₱{selectedPkg.price}</span>
            <span className="vs-booking-card__pkg">{selectedPkg.label} · {selectedPkg.duration}</span>
          </div>

          {bookingSuccess && (
            <div className="vs-booking-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Booking confirmed! We'll send you a reminder.
            </div>
          )}

          <form className="vs-booking-form" onSubmit={handleBook}>
            <div className="vs-booking-form__group">
              <label className="vs-booking-form__label">Select Date</label>
              <input type="date" className="vs-booking-form__input" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setSelectedDate(e.target.value)} required />
            </div>

            <div className="vs-booking-form__group">
              <label className="vs-booking-form__label">Select Time</label>
              <div className="vs-time-grid">
                {availableTimes.map((t) => (
                  <button type="button" key={t} className={`vs-time-slot ${selectedTime === t ? 'selected' : ''}`} onClick={() => setSelectedTime(t)}>{t}</button>
                ))}
              </div>
            </div>

            <div className="vs-booking-summary">
              <div className="vs-booking-summary__row"><span>Service fee</span><span>₱{selectedPkg.price}</span></div>
              <div className="vs-booking-summary__row"><span>Platform fee (5%)</span><span>₱{platformFee}</span></div>
              <div className="vs-booking-summary__row vs-booking-summary__row--total"><span>Total</span><span>₱{total}</span></div>
            </div>

            <button type="submit" className="vs-booking-btn">Book Now</button>
            <p className="vs-booking-note">You won't be charged until the provider confirms.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewService;