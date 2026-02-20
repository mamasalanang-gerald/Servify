import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <div className="service-card__img-wrapper">
        <img src={service.img} alt={service.title} className="service-card__img" />
        <div className="service-card__rating">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {service.rating}
        </div>
        <span className="service-card__category">{service.category}</span>
      </div>

      <div className="service-card__body">
        <h3 className="service-card__title">{service.title}</h3>

        <div className="service-card__provider">
          <div className="service-card__provider-avatar">{service.providerInitial}</div>
          <div>
            <div className="service-card__provider-name">
              {service.providerName}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#2b52cc" stroke="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <circle cx="12" cy="12" r="10" fill="#2b52cc" opacity="0.15" />
                <polyline points="9 12 11 14 15 10" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="service-card__jobs">{service.jobs} jobs completed</div>
          </div>
        </div>

        <div className="service-card__footer">
          <div>
            <div className="service-card__starting">Starting at</div>
            <div className="service-card__price">{service.price}</div>
          </div>
          <button className="service-card__btn">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;