import React from 'react';

const BookingCard = ({ booking }) => {
  return (
    <div className="booking-card">
      <div className="booking-card__img">
        <img src={booking.img} alt={booking.title} />
      </div>
      <div className="booking-card__info">
        <h4 className="booking-card__title">{booking.title}</h4>
        <p className="booking-card__sub">{booking.subtitle}</p>
        <div className="booking-card__meta">
          <span className="booking-card__date">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {booking.date}
          </span>
          <span className={`booking-card__status booking-card__status--${booking.status}`}>
            {booking.status}
          </span>
        </div>
      </div>
      <div className="booking-card__right">
        <div className="booking-card__total-label">Total</div>
        <div className="booking-card__total">{booking.total}</div>
        <button className="booking-card__btn">View Details</button>
      </div>
    </div>
  );
};

export default BookingCard;